import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

export const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const routes = ['index.html', 'oeuvres/index.html', 'journal/index.html', ...['carnets', 'matieres', 'les-caves', 'traces', 'reserves', 'hors-cadre'].map(chapter => `journal/${chapter}/index.html`), 'confidentialite/index.html'];
export const read = file => fs.readFileSync(path.join(repo, file), 'utf8');

const decode = value => value.replace(/&(?:amp|quot|apos|lt|gt|nbsp|#\d+|#x[\da-f]+);/gi, entity => {
  const named = {'&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>', '&nbsp;': '\u00a0'};
  if (entity.startsWith('&#')) return String.fromCodePoint(parseInt(entity.slice(entity[2].toLowerCase() === 'x' ? 3 : 2, -1), entity[2].toLowerCase() === 'x' ? 16 : 10));
  return named[entity.toLowerCase()];
});

// Quoted translations can contain HTML. They must not become page elements.
export function elements(html) {
  const markup = html.replace(/<!--[\s\S]*?-->/g, '').replace(/(<script\b(?:(?:"[^"]*"|'[^']*'|[^'">])*)>)[\s\S]*?<\/script>/gi, '$1</script>');
  return [...markup.matchAll(/<([a-z][\w:-]*)\b((?:"[^"]*"|'[^']*'|[^'">])*)>/gi)].map(match => {
    const attrs = {};
    for (const attribute of match[2].matchAll(/([^\s=<>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)) {
      const name = attribute[1].toLowerCase();
      assert.ok(!Object.hasOwn(attrs, name), `Attribut HTML dupliqué : ${name}`);
      attrs[name] = decode(attribute[2] ?? attribute[3] ?? attribute[4] ?? '');
    }
    return {tag: match[1].toLowerCase(), attrs};
  });
}

// Dimensions d’un JPEG, lues dans son marqueur SOF : aucune dépendance d’image.
const jpegSize = file => {
  const data = fs.readFileSync(path.join(repo, file));
  assert.ok(data[0] === 0xff && data[1] === 0xd8, file + ' : JPEG attendu');
  for (let i = 2; i < data.length;) {
    const marker = data[i + 1], length = data.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return {width: data.readUInt16BE(i + 7), height: data.readUInt16BE(i + 5), bytes: data.length};
    i += 2 + length;
  }
  throw new Error(file + ' : dimensions introuvables');
};
const meta = (tags, name) => tags.find(tag => tag.tag === 'meta' && (tag.attrs.property === name || tag.attrs.name === name))?.attrs.content;

const hasClass = (element, name) => (element.attrs.class || '').split(/\s+/).includes(name);
const localURL = (raw, route) => {
  if (/^(?:[a-z][\w+.-]*:|\/\/)/i.test(raw)) return null;
  const url = new URL(raw, `https://local.test/${route}`);
  let target = decodeURIComponent(url.pathname).replace(/^\//, '');
  if (!target || target.endsWith('/')) target += 'index.html';
  return {url, target};
};
const requireFile = (target, message) => {
  const file = path.resolve(repo, target);
  assert.ok(file.startsWith(repo + path.sep), message + ' : ressource hors du site');
  assert.ok(fs.existsSync(file) && fs.statSync(file).isFile(), message + ' : fichier absent');
  assert.ok(fs.statSync(file).size > 0, message + ' : fichier vide');
};

export function auditSite() {
  const sources = new Map(routes.map(route => [route, read(route)]));
  const pages = new Map([...sources].map(([route, html]) => [route, elements(html)]));
  const ids = new Map([...pages].map(([route, tags]) => [route, tags.filter(tag => 'id' in tag.attrs).map(tag => tag.attrs.id)]));
  const archives = JSON.parse(read('journal/archives.json'));
  // Hors cadre (12.09) garde son propre inventaire de photographies personnelles.
  const personal = JSON.parse(read('journal/hors-cadre/media.json'));
  const works = JSON.parse(read('works.json'));
  const archiveById = new Map([...archives, ...personal].map(archive => [archive.id, archive]));
  const workById = new Map(works.map(work => [work.slug, work]));
  const usedArchives = new Set();
  const graph = new Map(routes.map(route => [route, new Set()]));
  const resources = new Set();
  let localLinks = 0;
  let sourceVariants = 0;
  const sharedCards = new Set();

  function reference(raw, route, navigation = false) {
    const local = localURL(raw, route);
    if (!local) return null;
    const {url, target} = local;
    requireFile(target, `${route} → ${raw}`);
    if (target.endsWith('.html')) {
      const targetTags = pages.get(target) || elements(read(target));
      const targetIds = ids.get(target) || targetTags.filter(tag => 'id' in tag.attrs).map(tag => tag.attrs.id);
      if (url.hash) {
        const anchor = decodeURIComponent(url.hash.slice(1));
        const detail = /^(oeuvre|fragment)\/(.+)$/.exec(anchor);
        if (detail) {
          assert.ok((detail[1] === 'oeuvre' ? workById : archiveById).has(detail[2]), `${route} → ${raw} : référence d’image inconnue`);
          if (detail[1] === 'oeuvre') assert.ok(['index.html', 'oeuvres/index.html'].includes(target), `${route} → ${raw} : page sans catalogue d’œuvres`);
          else if (target.startsWith('journal/')) assert.ok(targetTags.some(tag => tag.attrs['data-photo'] === detail[2]), `${route} → ${raw} : fragment absent de cette page`);
        } else assert.ok(targetIds.includes(anchor), `${route} → ${raw} : ancre absente`);
      }
      if (url.searchParams.has('collection')) {
        assert.ok(['index.html', 'oeuvres/index.html'].includes(target), `${route} → ${raw} : collection sur une mauvaise page`);
        assert.ok(['all', 'paintings', 'encres', 'shooting', 'memories'].includes(url.searchParams.get('collection')), `${route} → ${raw} : filtre de collection inconnu`);
      }
      if (url.searchParams.has('regard')) {
        assert.equal(target, 'journal/reserves/index.html', `${route} → ${raw} : regard hors de la réserve`);
        assert.ok(targetTags.some(tag => tag.attrs['data-regard'] === url.searchParams.get('regard')), `${route} → ${raw} : regard inconnu`);
      }
      if (navigation && graph.has(target)) graph.get(route).add(target);
    } else resources.add(target);
    localLinks++;
    return target;
  }

  for (const [route, tags] of pages) {
    assert.equal(tags.filter(tag => tag.tag === 'h1').length, 1, route + ' : un titre principal');
    const canonical = tags.find(tag => tag.tag === 'link' && tag.attrs.rel === 'canonical');
    assert.equal(canonical?.attrs.href, 'https://www.camilorivera.ch/' + route.replace(/index\.html$/, ''), route + ' : adresse canonique');
    assert.ok(tags.some(tag => tag.tag === 'meta' && tag.attrs.name === 'description' && tag.attrs.content), route + ' : description');
    assert.ok(tags.some(tag => tag.tag === 'meta' && tag.attrs.name === 'viewport' && tag.attrs.content.includes('viewport-fit=cover')), route + ' : marges de sécurité mobile');
    assert.equal(new Set(ids.get(route)).size, ids.get(route).length, route + ' : identifiants uniques');
    const documentRoot = tags.find(tag => tag.tag === 'html')?.attrs['data-site-root'];
    assert.ok(documentRoot !== undefined, route + ' : racine du site déclarée');
    assert.equal(localURL(documentRoot + '/', route).target, 'index.html', route + ' : racine du site correcte');
    assert.ok(tags.some(tag => tag.tag === 'header' && hasClass(tag, 'topbar')), route + ' : navigation commune');
    // Carte de partage : JPEG 1200 × 630, léger, décrit, sous l’adresse publique du site.
    const shareImage = meta(tags, 'og:image') || '';
    assert.ok(shareImage.startsWith('https://www.camilorivera.ch/images/partage/') && shareImage.endsWith('.jpg'), route + ' : carte de partage JPEG');
    const card = shareImage.replace('https://www.camilorivera.ch/', '');
    requireFile(card, route + ' : carte de partage');
    const size = jpegSize(card);
    assert.ok(size.width === 1200 && size.height === 630, `${route} : carte de 1200 × 630 (${size.width} × ${size.height})`);
    assert.ok(size.bytes < 300 * 1024, `${route} : carte de partage sous 300 Ko (${Math.round(size.bytes / 1024)} Ko)`);
    assert.equal(meta(tags, 'og:image:width'), '1200', route + ' : largeur de la carte déclarée');
    assert.equal(meta(tags, 'og:image:height'), '630', route + ' : hauteur de la carte déclarée');
    assert.equal(meta(tags, 'og:image:type'), 'image/jpeg', route + ' : type de la carte déclaré');
    assert.ok(meta(tags, 'og:image:alt'), route + ' : description de la carte');
    assert.equal(meta(tags, 'og:site_name'), 'Camilo Rivera', route + ' : nom du site');
    assert.equal(meta(tags, 'og:url'), canonical?.attrs.href, route + ' : adresse partagée identique à l’adresse canonique');
    assert.ok(meta(tags, 'og:title') && meta(tags, 'og:description'), route + ' : titre et description de partage');
    sharedCards.add(card);
    const icons = tags.filter(tag => tag.tag === 'link' && ['icon', 'apple-touch-icon'].includes(tag.attrs.rel)).map(tag => localURL(tag.attrs.href, route)?.target);
    for (const icon of ['favicon.ico', 'favicon.svg', 'apple-touch-icon.png']) assert.ok(icons.includes(icon), `${route} : icône ${icon} déclarée`);
    assert.ok(tags.some(tag => tag.tag === 'button' && 'data-open-map' in tag.attrs), route + ' : accès à l’index');
    const styles = tags.filter(tag => tag.tag === 'link' && tag.attrs.rel === 'stylesheet').map(tag => localURL(tag.attrs.href, route)?.target);
    const scripts = tags.filter(tag => tag.tag === 'script' && tag.attrs.src).map(tag => localURL(tag.attrs.src, route)?.target);
    for (const sheet of ['journey', 'journey-space', 'journey-site']) assert.ok(styles.includes(`css/${sheet}.css`), `${route} : feuille ${sheet} présente`);
    for (const retired of ['journal', 'intensity', 'accrochages']) assert.ok(!styles.includes(`css/${retired}.css`), `${route} : ancienne feuille ${retired} encore chargée`);
    for (const script of ['chromatic', 'journey-nav']) assert.ok(scripts.includes(`js/${script}.js`), `${route} : script ${script} présent`);
    if (route.startsWith('journal/')) {
      assert.ok(styles.includes('css/journey-journal.css'), route + ' : mise en page des chapitres');
      for (const script of ['journal', 'journey-scroll']) assert.ok(scripts.includes(`js/${script}.js`), `${route} : script ${script} présent`);
    } else if (['index.html', 'oeuvres/index.html'].includes(route)) {
      assert.ok(styles.includes('css/journey-catalogue.css'), route + ' : mise en page de la collection');
      assert.ok(scripts.includes('js/collection.js'), route + ' : catalogue partagé');
    }
    // Panneau de confidentialité, lien vers la déclaration et crédit de scénographie, sur chaque page.
    assert.ok(styles.includes('css/privacy-drop.css') && scripts.includes('js/privacy-drop.js'), route + ' : panneau de confidentialité');
    assert.ok(tags.some(tag => tag.tag === 'a' && localURL(tag.attrs.href || '', route)?.target === 'confidentialite/index.html'), route + ' : lien vers la confidentialité');
    assert.ok(tags.some(tag => tag.tag === 'a' && tag.attrs.href === 'https://www.osom.ch' && /(?:^|\s)osom-credit(?:\s|$)/.test(tag.attrs.class || '')), route + ' : crédit de scénographie');
    for (const {tag, attrs} of tags) {
      for (const attribute of ['aria-labelledby', 'aria-describedby', 'aria-controls']) {
        if (attrs[attribute]) for (const id of attrs[attribute].split(/\s+/)) assert.ok(ids.get(route).includes(id), `${route} : référence accessible absente : ${id}`);
      }
      if (tag === 'label' && attrs.for) assert.ok(ids.get(route).includes(attrs.for), route + ' : champ de formulaire absent : ' + attrs.for);
      for (const attribute of ['href', 'src', 'poster', 'data-mobile-src', 'data-desktop-src']) {
        if (attrs[attribute]) reference(attrs[attribute], route, tag === 'a' && attribute === 'href');
      }
      if (attrs.srcset) for (const candidate of attrs.srcset.split(',')) {
        reference(candidate.trim().split(/\s+/)[0], route); sourceVariants++;
      }
      if (tag === 'img') assert.ok('alt' in attrs, route + ' : alternative d’image absente');
      for (const attribute of ['data-photo', 'data-memory', 'data-piece', 'data-work']) {
        if (!(attribute in attrs)) continue;
        const isArchive = ['data-photo', 'data-memory'].includes(attribute);
        const item = (isArchive ? archiveById : workById).get(attrs[attribute]);
        assert.ok(item, `${route} : ${attribute} inconnu : ${attrs[attribute]}`);
        assert.equal(tag, 'a', `${route} : l’image ${attrs[attribute]} doit être un lien sans script`);
        assert.ok(attrs.href, `${route} : lien d’image absent : ${attrs[attribute]}`);
        const file = isArchive ? item.file : `images/${item.category}/${item.file}`;
        assert.equal(localURL(attrs.href, route)?.target, file, `${route} : source incohérente pour ${attrs[attribute]}`);
        if (isArchive) usedArchives.add(item.id);
      }
      if (tag === 'video') {
        assert.ok('muted' in attrs && 'playsinline' in attrs && attrs.preload === 'none', route + ' : vidéo silencieuse à la demande');
        assert.ok(!('src' in attrs), route + ' : pas de source vidéo directe initiale');
      }
    }
  }

  // Follow ordinary links, independently of the index created by JavaScript.
  for (const start of routes) {
    const reached = new Set(); const pending = [start];
    while (pending.length) {
      const route = pending.pop();
      if (reached.has(route)) continue;
      reached.add(route); pending.push(...graph.get(route));
    }
    for (const route of routes) assert.ok(reached.has(route), `${start} : page inaccessible sans script : ${route}`);
  }
  for (const stylesheet of [...resources].filter(file => file.endsWith('.css'))) {
    for (const match of read(stylesheet).matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^\s)]+))\s*\)/g)) reference(match[1] ?? match[2] ?? match[3], stylesheet);
  }
  assert.equal(sharedCards.size, routes.length, 'Une carte de partage par page');
  return {sources, pages, ids, archives, personal, works, usedArchives, sharedCards, localLinks, sourceVariants, resources};
}

// Fichiers présents dans le dépôt mais chargés par aucune page : ils ne sont pas contrôlés,
// et le contrôle échoue si l’un d’eux redevient chargé sans avoir été nettoyé.
export const unloaded = ['js/app.js', 'css/reverie.css', 'css/intensity.css', 'css/accrochages.css', 'css/journal.css'];
// Flèches, signes techniques, formes géométriques, symboles divers, dingbats, emoji, chiffres romains,
// signe de multiplication et sélecteur de présentation emoji. Les signes typographiques restent permis.
const forbiddenSymbol = /[\u2190-\u21FF\u2300-\u23FF\u25A0-\u25FF\u2600-\u27BF\u2B00-\u2BFF\u2160-\u217F\u00D7\uFE0F\u{1F000}-\u{1FAFF}]/u;

export function checkSymbols(site) {
  const loaded = new Set([...site.resources].filter(file => /\.(css|js)$/.test(file)));
  for (const file of unloaded) assert.ok(!loaded.has(file), `${file} est de nouveau chargé : le relire avant de le retirer de la liste`);
  const served = [...routes];
  for (const folder of ['css', 'js']) {
    for (const name of fs.readdirSync(path.join(repo, folder)).sort()) {
      const file = `${folder}/${name}`;
      if (/\.(css|js)$/.test(name) && !unloaded.includes(file)) served.push(file);
    }
  }
  for (const file of served) {
    read(file).split('\n').forEach((line, index) => {
      const found = forbiddenSymbol.exec(line);
      assert.ok(!found, `${file}:${index + 1} : symbole U+${found?.[0].codePointAt(0).toString(16).toUpperCase().padStart(4, '0')} ; utiliser une icône SVG`);
    });
  }
  // Une seule définition des icônes, identique sur chaque page ; chaque appel la retrouve.
  const definitions = routes.map(route => [route, /<svg class="svg-defs"[\s\S]*?<\/svg>/.exec(site.sources.get(route))?.[0]]);
  for (const [route, block] of definitions) {
    assert.ok(block, route + ' : définitions des icônes absentes');
    assert.equal(block, definitions[0][1], route + ' : définitions des icônes différentes de ' + definitions[0][0]);
  }
  const symbols = new Set([...definitions[0][1].matchAll(/<symbol id="([^"]+)"/g)].map(match => match[1]));
  for (const route of routes) {
    for (const match of site.sources.get(route).matchAll(/<use href="#([^"]+)"/g)) assert.ok(symbols.has(match[1]), `${route} : icône inconnue #${match[1]}`);
  }
  for (const file of served.filter(name => name.endsWith('.js'))) {
    for (const match of read(file).matchAll(/icon\('([a-z-]+)'\)/g)) assert.ok(symbols.has('icon-' + match[1]), `${file} : icône inconnue ${match[1]}`);
  }
  return {files: served.length, symbols: symbols.size};
}

export function validateJournal() {
  const site = auditSite();
  const {sources, pages, archives, personal, usedArchives} = site;
  let imageVariants = 0;
  assert.equal(archives.length, 129, 'Nombre d’archives conservé : 114, plus les quinze feuilles des cahiers');
  assert.equal(archives.filter(archive => archive.group === 'reserves').length, 73, 'Nombre de fragments de réserve conservé');
  assert.equal(new Set(archives.map(archive => archive.id)).size, 129, 'Identifiants d’archives uniques');
  assert.equal(personal.length, 84, 'Photographies personnelles de Hors cadre');
  assert.equal(new Set([...archives, ...personal].map(archive => archive.id)).size, 213, 'Identifiants uniques entre journal et Hors cadre');
  assert.ok(!personal.some(archive => archive.id === 'hc-75'), 'La photographie écartée ne doit pas être réexportée');
  for (const file of ['hc-75.webp', 'hc-75-480.webp', 'hc-75-900.webp']) assert.ok(!fs.existsSync(path.join(repo, 'images/hors-cadre', file)), 'Export écarté absent : ' + file);
  for (const archive of [...archives, ...personal]) {
    assert.ok(usedArchives.has(archive.id), 'Archive non utilisée : ' + archive.id);
    assert.ok(archive.width > 0 && archive.height > 0 && archive.alt.fr && archive.alt.en, 'Métadonnées manquantes : ' + archive.id);
    for (const file of [archive.file, ...archive.variants.map(variant => variant.file)]) {
      requireFile(file, 'Image d’archive : ' + file); imageVariants++;
    }
    if (archive.group === 'les-caves') assert.ok(archive.credit?.includes('David Zuber'), 'Crédit des caves : ' + archive.id);
  }
  const caves = sources.get('journal/les-caves/index.html');
  for (const fact of ['Provins', 'St-Léonard', 'David Zuber', 'Alban Reynard', 'détruit']) assert.ok(caves.includes(fact), 'Contexte des caves manquant : ' + fact);
  const poster = sources.get('journal/traces/index.html');
  for (const fact of ['Sabine Leyat Filliez', 'La Tour Lombarde', '2 juin au 2 juillet 2017']) assert.ok(poster.includes(fact), 'Affiche : ' + fact);
  const reserve = pages.get('journal/reserves/index.html');
  const fragments = reserve.filter(tag => 'data-reserve-item' in tag.attrs);
  assert.equal(fragments.length, 73, 'Accrochage des archives sans script');
  assert.ok(fragments.every(tag => /^[1-8]$/.test(tag.attrs['data-hang'])), 'Placement des 73 archives conservé');
  for (const [kind, expected] of Object.entries({figures: 37, atelier: 15, expositions: 14, 'a-cote': 7})) {
    assert.equal(fragments.filter(tag => tag.attrs['data-kind'] === kind).length, expected, 'Fragments de réserve : ' + kind);
    assert.ok(reserve.some(tag => tag.attrs['data-regard'] === kind), 'Filtre de réserve absent : ' + kind);
  }
  assert.equal(pages.get('journal/carnets/index.html').filter(tag => tag.tag === 'video').length, 2, 'Deux films des carnets conservés');
  const personalPage = sources.get('journal/hors-cadre/index.html');
  assert.equal((personalPage.match(/data-photo="hc-/g) || []).length, 84, 'Chaque archive personnelle présente une fois');
  assert.ok(!personalPage.includes('hc-75'), 'Photographie écartée absente de la page');
  assert.equal((personalPage.match(/class="paint-sequence"/g) || []).length, 5, 'Cinq suites de peinture');
  assert.ok(personalPage.includes('luigigrieco.photogr'), 'Attribution de l’image de référence');
  const sheets = pages.get('journal/carnets/index.html').filter(tag => tag.tag === 'div' && /(?:^|\s)p\d+(?:\s|$)/.test(tag.attrs.class || ''));
  assert.equal(sheets.length, 20, 'Vingt pièces des cahiers posées');
  const firstWorks = pages.get('index.html').filter(tag => 'data-piece' in tag.attrs);
  assert.ok(new Set(firstWorks.map(tag => tag.attrs['data-piece'])).size >= 3, 'Premières œuvres accessibles sans script');
  console.log(`OK — ${routes.length} pages reliées sans script, ${site.localLinks} références locales, aucune ancre manquante.`);
  console.log(`OK — ${archives.length + personal.length} archives utilisées (${archives.length} du journal, ${personal.length} de Hors cadre), ${imageVariants} images et variantes, descriptions FR et EN, 73 fragments et filtres déclarés.`);
  console.log('OK — crédits des caves, hommage, affiche de 2017, deux films des carnets et vidéos configurées à la demande.');
  console.log('OK — ressources du voyage, références photo/souvenir/œuvre et absence des anciennes feuilles de présentation.');
  const symbols = checkSymbols(site);
  console.log(`OK — aucun symbole ni emoji dans ${symbols.files} fichiers servis ; ${symbols.symbols} icônes SVG définies à l’identique sur les ${routes.length} pages.`);
  console.log(`OK — ${site.sharedCards.size} cartes de partage JPEG 1200 × 630 sous 300 Ko, décrites ; icônes .ico, .svg et iOS sur chaque page.`);
  console.log(`OK — panneau de confidentialité, lien vers la déclaration et crédit de scénographie sur les ${routes.length} pages.`);
  return site;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) validateJournal();
