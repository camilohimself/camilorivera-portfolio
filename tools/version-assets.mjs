// Versions tirées du contenu des feuilles et scripts locaux des dix pages.
//
// Règle : après toute modification d’un fichier CSS ou JS, lancer
//   node tools/version-assets.mjs --write
// _headers sert /css/* et /js/* un an en cache (immutable) : seule une nouvelle empreinte dans
// l’adresse fait relire le fichier aux visiteurs. tools/validate-journal.mjs échoue sur toute
// référence sans version ou dont l’empreinte ne correspond plus au contenu du fichier.
//
// Sans --write : simulation, rien n’est écrit ; la sortie liste ce qui changerait.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {repo, routes} from './validate-journal.mjs';

// Empreinte courte : les 10 premiers caractères hexadécimaux du SHA-256 du fichier.
export const fingerprint = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(repo, file))).digest('hex').slice(0, 10);
export const versionPattern = /^\?v=[0-9a-f]{10}$/;

// Commentaires et corps des scripts en ligne masqués (même longueur) : seules les vraies balises comptent,
// comme dans elements() de validate-journal.mjs.
const mask = html => html
  .replace(/<!--[\s\S]*?-->/g, match => ' '.repeat(match.length))
  .replace(/(<script\b(?:(?:"[^"]*"|'[^']*'|[^'">])*)>)([\s\S]*?)(<\/script>)/gi, (match, open, body, close) => open + ' '.repeat(body.length) + close);

// Références locales à un .css ou un .js dans un attribut href ou src.
export function assetReferences(route, html) {
  const masked = mask(html);
  const found = [];
  for (const match of masked.matchAll(/\b(href|src)="([^"]*)"/gi)) {
    const raw = match[2];
    if (/^(?:[a-z][\w+.-]*:|\/\/)/i.test(raw)) continue;
    const url = new URL(raw, `https://local.test/${route}`);
    const target = decodeURIComponent(url.pathname).replace(/^\//, '');
    if (!/\.(?:css|js)$/.test(target)) continue;
    const start = match.index + match[0].indexOf('"') + 1;
    const pathPart = raw.replace(/[?#].*$/, '');
    found.push({route, raw, start, end: start + raw.length, target, pathPart, query: url.search, hash: url.hash, line: html.slice(0, start).split('\n').length});
  }
  return found;
}

export function plan() {
  const changes = [];
  const problems = [];
  const prints = new Map();
  for (const route of routes) {
    const html = fs.readFileSync(path.join(repo, route), 'utf8');
    for (const ref of assetReferences(route, html)) {
      const file = path.join(repo, ref.target);
      if (!fs.existsSync(file)) { problems.push(`${route}:${ref.line} : ${ref.raw} : fichier absent`); continue; }
      if (ref.query && !/^\?v=[^&]*$/.test(ref.query)) { problems.push(`${route}:${ref.line} : ${ref.raw} : paramètre autre que v= (à traiter à la main)`); continue; }
      if (!prints.has(ref.target)) prints.set(ref.target, fingerprint(ref.target));
      const next = `${ref.pathPart}?v=${prints.get(ref.target)}${ref.hash}`;
      changes.push({...ref, next, changed: next !== ref.raw});
    }
  }
  return {changes, problems, prints};
}

function run(write) {
  const {changes, problems, prints} = plan();
  if (problems.length) {
    for (const problem of problems) console.error('ERREUR — ' + problem);
    process.exitCode = 1;
    return;
  }
  const pending = changes.filter(change => change.changed);
  for (const change of pending) console.log(`${change.route}:${change.line}  ${change.raw}  ->  ${change.next}`);
  if (write) {
    for (const route of new Set(pending.map(change => change.route))) {
      const file = path.join(repo, route);
      let html = fs.readFileSync(file, 'utf8');
      // De la fin vers le début : les positions relevées restent justes.
      for (const change of pending.filter(item => item.route === route).sort((a, b) => b.start - a.start)) {
        html = html.slice(0, change.start) + change.next + html.slice(change.end);
      }
      fs.writeFileSync(file, html);
    }
  }
  const pages = new Set(pending.map(change => change.route)).size;
  console.log(`${write ? 'Écrit' : 'Simulation (rien n’est écrit ; --write pour écrire)'} — ${pending.length} références à changer sur ${pages} pages, ${changes.length - pending.length} déjà à jour ; ${prints.size} fichiers CSS et JS référencés.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) run(process.argv.includes('--write'));
