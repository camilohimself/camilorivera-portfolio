import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = file => readFileSync(resolve(root, file), 'utf8');
const works = JSON.parse(read('works.json'));
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
  assert.ok(dims && dims.every(value => Number.isInteger(value) && value > 0), 'Dimensions manquantes : ' + file);
  assert.ok(existsSync(resolve(root, 'images', file)), 'Image manquante : ' + file);
  for (const width of [480, 800].filter(width => width < dims[0])) {
    const variant = 'images/' + file.replace(/\.webp$/, '-' + width + '.webp');
    assert.ok(existsSync(resolve(root, variant)), 'Variante manquante : ' + variant);
    assert.ok(statSync(resolve(root, variant)).size > 0, 'Variante vide : ' + variant);
    variants++;
  }
  // Unknown metadata must remain absent rather than become fabricated defaults.
  for (const key of ['year', 'dimensions', 'available']) assert.ok(Object.hasOwn(work, key));
}

const html = read('index.html');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(ids.length, new Set(ids).size, 'Identifiants HTML dupliqués');
for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
  const url = match[1];
  if (/^(https?:|mailto:|data:)/.test(url)) continue;
  if (url.startsWith('#')) {
    assert.ok(ids.includes(url.slice(1)), 'Ancre introuvable : ' + url);
  } else {
    const target = new URL(url, 'https://local.test/');
    assert.ok(existsSync(resolve(root, decodeURI(target.pathname.slice(1)))), 'Ressource introuvable : ' + url);
  }
}
for (const match of html.matchAll(/data-work="([^"]+)"/g)) {
  assert.ok(slugs.has(match[1]), 'Œuvre de couverture introuvable : ' + match[1]);
}
for (const match of read('css/style.css').matchAll(/url\("([^"]+)"\)/g)) {
  assert.ok(existsSync(resolve(root, 'css', match[1])), 'Police introuvable : ' + match[1]);
}
assert.equal((html.match(/<h1\b/g) || []).length, 1, 'Un seul titre principal est attendu');
assert.ok(html.includes('viewport-fit=cover'), 'Gestion des marges de sécurité mobile absente');
assert.ok(html.includes('<dialog'), 'Visionneuse native attendue');
assert.ok(html.includes('<noscript>'), 'Repli sans script absent');

console.log('OK — ' + works.length + ' entrées, ' + variants + ' variantes, aucun lien local manquant.');
console.log('OK — ' + counts.paintings + ' peintures, ' + counts.encres + ' encres, ' + counts.shooting + ' photographies.');
console.log('OK — ancres, identifiants, polices, dimensions et références des œuvres.');
