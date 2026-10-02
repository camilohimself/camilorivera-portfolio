// Cartes de partage (WhatsApp, iMessage, Signal, réseaux) : une image JPEG de 1200 × 630
// par page, dans images/partage/. L’image de la page est posée au centre et le titre la
// traverse en noir et blanc inversé, comme le nom traverse le film à l’accueil. Le centre
// reste lisible quand une application recadre l’aperçu en carré.
//
// Outil du poste, absent du site publié : Chromium piloté par Playwright, dont le module est
// indiqué par PLAYWRIGHT_MODULE (aucune dépendance installée dans le dépôt).
// Usage : PLAYWRIGHT_MODULE=/chemin/vers/playwright-core node tools/generate-share-cards.mjs
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const modulePath = process.env.PLAYWRIGHT_MODULE;
if (!modulePath) throw new Error('PLAYWRIGHT_MODULE doit indiquer le module playwright ou playwright-core.');
const {chromium} = createRequire(import.meta.url)(modulePath);

export const cards = [
  {slug: 'accueil', title: 'Camilo <em>Rivera</em>', eyebrow: 'Peinture · Encre · Fragments de vie', image: 'images/journal/espace-interieur-poster.webp'},
  {slug: 'oeuvres', title: 'Le geste.<br><em>La trace.</em>', eyebrow: 'Collection', image: 'images/paintings/IMG_0586.webp'},
  {slug: 'journal', title: 'Un journal<br><em>en morceaux.</em>', eyebrow: 'Le journal', image: 'images/journal/a-l-atelier.webp'},
  {slug: 'carnets', title: 'Un trait.<br>Un autre.<br><em>Une présence.</em>', eyebrow: '01 / Les carnets', image: 'images/journal/pages-ouvertes.webp'},
  {slug: 'matieres', title: 'La peinture<br><em>ne ment jamais.</em>', eyebrow: '02 / La matière', image: 'images/journal/un-horizon.webp'},
  {slug: 'caves', title: 'Les murs<br><em>se souviennent.</em>', eyebrow: '03 / Les caves', image: 'images/journal/caves-lumiere.webp', credit: 'Photographie : David Zuber'},
  {slug: 'traces', title: 'Ce qu’on<br><em>garde.</em>', eyebrow: '04 / Les traces', image: 'images/journal/a-l-atelier.webp'},
  {slug: 'reserves', title: 'Tout ce qui<br><em>déborde.</em>', eyebrow: '05 / La réserve', image: 'images/reserve/r73-img_7505.webp'},
  {slug: 'hors-cadre', title: 'Hors <em>cadre.</em>', eyebrow: '06 / Hors cadre', image: 'images/hors-cadre/hc-08.webp'},
  {slug: 'confidentialite', title: 'Seules les œuvres<br><em>gardent des traces.</em>', eyebrow: 'Confidentialité', image: 'images/encres/1025E971-FC37-4284-B104-508562EF2D17.webp'}
];

const dataURL = (file, type) => `data:${type};base64,${fs.readFileSync(path.join(repo, file)).toString('base64')}`;

function template(card) {
  const sans = dataURL('fonts/dm-sans-400.woff2', 'font/woff2');
  const italic = dataURL('fonts/cormorant-garamond-300-italic.woff2', 'font/woff2');
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>
@font-face{font-family:DM;src:url(${sans}) format('woff2')}
@font-face{font-family:Cormorant;src:url(${italic}) format('woff2');font-style:italic;font-weight:300}
*{margin:0;box-sizing:border-box}
html,body{width:1200px;height:630px;overflow:hidden}
body{position:relative;background:#f7f7f2;color:#111210;font-family:DM,Arial,sans-serif;-webkit-font-smoothing:antialiased}
.mark{position:absolute;left:58px;top:46px;font-size:46px;line-height:1;letter-spacing:-.12em}
.mark span{margin-left:3.7px}
.meta{position:absolute;font-size:17px;letter-spacing:.035em;color:#61625c}
.eyebrow{right:58px;top:60px}
.site{right:58px;bottom:50px}
.credit{left:58px;bottom:50px}
figure{position:absolute;left:50%;top:50%;width:286px;height:410px;translate:-50% -50%}
figure img{display:block;width:100%;height:100%;object-fit:cover}
h1{position:absolute;left:30px;right:30px;top:50%;translate:0 -50%;text-align:center;font-weight:400;
  line-height:.86;letter-spacing:-.065em;white-space:nowrap;color:#f7f7f2;mix-blend-mode:difference}
h1 em{font-family:Cormorant,Georgia,serif;font-style:italic;font-weight:300;font-size:1.12em;letter-spacing:-.035em}
</style></head><body>
<div class="mark">cr<span>.</span></div>
<p class="meta eyebrow">${card.eyebrow}</p>
<figure><img src="${dataURL(card.image, 'image/webp')}" alt=""></figure>
<h1>${card.title}</h1>
${card.credit ? `<p class="meta credit">${card.credit}</p>` : ''}
<p class="meta site">camilorivera.ch</p>
</body></html>`;
}

const out = path.join(repo, 'images/partage');
fs.mkdirSync(out, {recursive: true});
const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: 1200, height: 630}, deviceScaleFactor: 1});
const only = process.env.CARDS ? process.env.CARDS.split(',') : null;
for (const card of cards.filter(card => !only || only.includes(card.slug))) {
  await page.setContent(template(card), {waitUntil: 'load'});
  await page.evaluate(() => document.fonts.ready);
  // Le titre prend la plus grande taille qui tienne dans la largeur et dans la hauteur.
  await page.evaluate(() => {
    const title = document.querySelector('h1');
    for (let size = 210; size >= 60; size -= 2) {
      title.style.fontSize = size + 'px';
      if (title.scrollWidth <= title.clientWidth && title.getBoundingClientRect().height <= 480) break;
    }
  });
  const file = path.join(out, `${card.slug}.jpg`);
  await page.screenshot({path: file, type: 'jpeg', quality: 84});
  console.log(`${path.relative(repo, file)} — ${Math.round(fs.statSync(file).size / 1024)} Ko`);
}
await browser.close();
