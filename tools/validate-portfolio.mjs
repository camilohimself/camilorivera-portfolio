import assert from 'node:assert/strict';
import { existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { runInNewContext } from 'node:vm';
import { auditSite, read, repo, routes } from './validate-journal.mjs';

const site = auditSite();
const works = site.works;
const dimensions = {};
runInNewContext(read('js/dims.generated.js') + '; this.values = DIMS;', dimensions);
const slugs = new Set();
const counts = { paintings: 0, encres: 0, shooting: 0 };
let variants = 0;

for (const work of works) {
  assert.ok(/^[a-z0-9-]+$/.test(work.slug), 'Identifiant invalide : ' + work.slug);
  assert.ok(!slugs.has(work.slug), 'Identifiant dupliqué : ' + work.slug);
  slugs.add(work.slug);
  assert.ok(work.category in counts, 'Catégorie inconnue : ' + work.category);
  counts[work.category]++;
  const file = work.category + '/' + work.file;
  const dims = dimensions.values[file];
  assert.ok(dims && dims.length === 2 && dims.every(value => Number.isInteger(value) && value > 0), 'Dimensions manquantes : ' + file);
  const original = resolve(repo, 'images', file);
  assert.ok(existsSync(original) && statSync(original).size > 0, 'Image manquante ou vide : ' + file);
  for (const width of [480, 800].filter(width => width < dims[0])) {
    const variant = 'images/' + file.replace(/\.webp$/, '-' + width + '.webp');
    assert.ok(existsSync(resolve(repo, variant)), 'Variante manquante : ' + variant);
    assert.ok(statSync(resolve(repo, variant)).size > 0, 'Variante vide : ' + variant);
    variants++;
  }
  // Unknown metadata must remain absent rather than become fabricated defaults.
  for (const key of ['year', 'dimensions', 'available']) assert.ok(Object.hasOwn(work, key), 'Métadonnée omise : ' + work.slug + ' / ' + key);
}

for (const anchor of ['gallery', 'about', 'geste', 'contact', 'hors-cadre', 'seuil']) assert.ok(site.ids.get('index.html').includes(anchor), 'Ancienne ancre d’accueil conservée : ' + anchor);
assert.ok(site.ids.get('oeuvres/index.html').includes('gallery'), 'Ancre du catalogue conservée');
for (const route of ['index.html', 'oeuvres/index.html']) {
  const tags = site.pages.get(route);
  assert.ok(tags.some(tag => tag.tag === 'dialog'), route + ' : visionneuse native attendue');
  assert.ok(tags.some(tag => tag.tag === 'noscript'), route + ' : repli sans script absent');
  const covers = tags.filter(tag => 'data-piece' in tag.attrs);
  assert.ok(new Set(covers.map(tag => tag.attrs['data-piece'])).size >= 3, route + ' : premières œuvres sans script');
}
const catalogue = site.pages.get('oeuvres/index.html');
for (const filter of ['all', 'paintings', 'encres', 'shooting', 'memories']) assert.ok(catalogue.some(tag => tag.attrs['data-filter'] === filter), 'Filtre de collection absent : ' + filter);

console.log('OK — ' + works.length + ' entrées, ' + variants + ' variantes, aucun lien local manquant sur ' + routes.length + ' pages.');
console.log('OK — ' + counts.paintings + ' peintures, ' + counts.encres + ' encres, ' + counts.shooting + ' photographies.');
console.log('OK — navigation complète, ancres historiques, identifiants, polices, dimensions et références des œuvres.');
console.log('OK — ' + site.sourceVariants + ' sources responsive, couverture et catalogue accessibles sans script.');
