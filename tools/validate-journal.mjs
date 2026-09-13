import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const routes=['index.html','journal/index.html',...['carnets','matieres','les-caves','traces','reserves','hors-cadre'].map(s=>'journal/'+s+'/index.html')];
const sources=new Map(routes.map(p=>[p,fs.readFileSync(path.join(repo,p),'utf8')]));
const archives=JSON.parse(fs.readFileSync(path.join(repo,'journal/archives.json'),'utf8'));
const personal=JSON.parse(fs.readFileSync(path.join(repo,'journal/hors-cadre/media.json'),'utf8'));
let localLinks=0;
let imageVariants=0;
const used=new Set();
for(const[route,html]of sources){
 assert.equal((html.match(/<h1\b/g)||[]).length,1,route+' : un titre principal');
 assert.ok(html.includes('rel="canonical"'),route+' : adresse canonique');
 assert.ok(html.includes('name="description"'),route+' : description');
 assert.ok(html.includes('css/accrochages.css'),route+' : feuille d’accrochage présente');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(new Set(ids).size,ids.length,route+' : identifiants uniques');
 for(const match of html.matchAll(/\baria-(?:labelledby|describedby|controls)="([^"]+)"/g)){
  for(const id of match[1].split(/\s+/))assert.ok(ids.includes(id),route+' : référence accessible absente : '+id);
 }
 for(const match of html.matchAll(/\b(?:href|src|data-mobile-src|data-desktop-src)="([^"]+)"/g)){
  const raw=match[1].replaceAll('&amp;','&');
  if(/^(?:[a-z]+:|\/\/)/i.test(raw))continue;
  const url=new URL(raw,'https://local.test/'+route);
  let target=decodeURIComponent(url.pathname).replace(/^\//,'');
  if(!target||target.endsWith('/'))target+='index.html';
  assert.ok(fs.existsSync(path.join(repo,target)),route+' → '+raw+' : fichier absent');
  if(url.hash&&target.endsWith('.html')){
   const content=sources.get(target)||fs.readFileSync(path.join(repo,target),'utf8');
   const hash=decodeURIComponent(url.hash.slice(1));
   const reference=hash.startsWith('fragment/')?'data-photo="'+hash.slice(9)+'"':'id="'+hash+'"';
   assert.ok(content.includes(reference),route+' → '+raw+' : ancre absente');
  }
  localLinks++;
 }
 for(const match of html.matchAll(/\bdata-photo="([^"]+)"/g))used.add(match[1]);
 for(const tag of html.matchAll(/<video\b[^>]+>/g)){
  assert.ok(/\bmuted\b/.test(tag[0])&&/\bplaysinline\b/.test(tag[0])&&/preload="none"/.test(tag[0]),route+' : vidéo silencieuse à la demande');
  assert.ok(!/\ssrc=/.test(tag[0]),route+' : pas de chargement vidéo initial');
 }
}
for(const a of [...archives,...personal]){
 assert.ok(used.has(a.id),'Archive non utilisée : '+a.id);
 assert.ok(a.width>0&&a.height>0&&a.alt.fr&&a.alt.en,'Métadonnées manquantes : '+a.id);
 for(const file of [a.file,...a.variants.map(v=>v.file)]){
  assert.ok(fs.statSync(path.join(repo,file)).size>0,'Image absente : '+file);imageVariants++;
 }
 if(a.group==='les-caves')assert.ok(a.credit.includes('David Zuber'));
}
const caves=sources.get('journal/les-caves/index.html');
for(const fact of ['Provins','St-Léonard','David Zuber','Alban Reynard','détruit'])assert.ok(caves.includes(fact),'Contexte des caves manquant : '+fact);
const poster=sources.get('journal/traces/index.html');
for(const fact of ['Sabine Leyat Filliez','La Tour Lombarde','2 juin au 2 juillet 2017'])assert.ok(poster.includes(fact),'Affiche : '+fact);
assert.equal(archives.length,129);
assert.equal(archives.filter(a=>a.group==='reserves').length,73);
assert.equal(new Set(archives.map(a=>a.id)).size,129);
assert.equal(personal.length,84);
assert.equal(new Set([...archives,...personal].map(a=>a.id)).size,213);
assert.ok(!personal.some(a=>a.id==='hc-75'),'La photographie écartée ne doit pas être réexportée');
for(const file of ['hc-75.webp','hc-75-480.webp','hc-75-900.webp'])assert.ok(!fs.existsSync(path.join(repo,'images/hors-cadre',file)),'Export écarté absent : '+file);
const personalPage=sources.get('journal/hors-cadre/index.html');
assert.equal((personalPage.match(/data-photo="hc-/g)||[]).length,84,'Chaque archive personnelle présente une fois');
assert.ok(!personalPage.includes('hc-75'),'Photographie écartée absente de la page');
assert.equal((personalPage.match(/class="paint-sequence"/g)||[]).length,5,'Cinq suites de peinture');
assert.ok(personalPage.includes('luigigrieco.photogr'),'Attribution de l’image de référence');
const reserve=sources.get('journal/reserves/index.html');
assert.equal((reserve.match(/data-reserve-item data-hang="[1-8]"/g)||[]).length,73,'Accrochage des archives sans script');
assert.equal((sources.get('index.html').match(/class="work-card" data-hang="[1-3]"/g)||[]).length,3,'Premières œuvres composées sans script');
console.log(`OK — ${routes.length} pages, ${localLinks} références locales, aucune ancre manquante.`);
console.log(`OK — ${archives.length + personal.length} archives utilisées, ${imageVariants} images et variantes, descriptions FR et EN.`);
console.log('OK — crédits des caves, affiche de 2017, vidéos silencieuses sans source initiale.');
