/** Static journal redesign: optional local Chrome/Playwright + axe checks.
 * PLAYWRIGHT_MODULE, AXE_PATH and ART_BASE_URL use the Hors cadre conventions.
 * No production dependency, no writes to the website.
 */
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({channel:'chrome',headless:true});
const base=process.env.ART_BASE_URL||'http://127.0.0.1:8000';
const routes=['','carnets/','matieres/','les-caves/','traces/','reserves/'];
const results=[],errors=[],requests=[];
let activeCheck='';
async function check(name,run){activeCheck=name;try{await run();results.push({name,ok:true});console.log('OK — '+name);}catch(error){results.push({name,ok:false,error:error.message});console.error('FAIL — '+name+'\n'+error.message);}}
function watch(p){p.on('pageerror',e=>{const error={message:e.message,url:p.url(),check:activeCheck,stack:e.stack};errors.push(error);console.error('PAGE ERROR '+JSON.stringify(error));});p.on('request',r=>requests.push(r.url()));}
const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce',isMobile:true,hasTouch:true,deviceScaleFactor:2});
const page=await context.newPage();watch(page);
async function ready(route,p=page){await p.goto(base+'/journal/'+route,{waitUntil:'load'});await p.evaluate(()=>document.fonts.ready);}
async function language(lang,p=page){if(await p.locator('html').getAttribute('lang')!==lang)await p.locator('.language-toggle').click();}
async function close(p=page){await p.keyboard.press('Escape');await p.waitForFunction(()=>!document.querySelector('#archive-viewer').open);}

await check('Six chapitres accessibles depuis le sommaire et fragment éditorial stable',async()=>{
  await ready('');
  assert.equal(await page.locator('.journal-quick-index a').count(),6);
  assert.equal(await page.locator('.index-entry').count(),6);
  assert.equal(await page.locator('.current-image img').count(),1);
  const src=await page.locator('.current-image img').getAttribute('src');
  assert.match(await page.locator('.current-words').textContent(),/uniquement par le geste de la peinture/);
  await ready('');assert.equal(await page.locator('.current-image img').getAttribute('src'),src);
  await page.locator('.current-context').tap();
  await page.waitForURL('**/journal/carnets/#geste');
});
await check('96 formats FR/EN, 320 à 1920 px : page, titres, textes de lecture et légendes',async()=>{
  const failures=[];
  for(const route of routes){
    await ready(route);
    for(const lang of ['fr','en']){
      await language(lang);
      for(const width of [320,360,390,430,700,768,1440,1920]){
        await page.setViewportSize({width,height:width<768?844:1000});
        const bad=await page.evaluate(()=>{
          const bad=[];
          if(document.documentElement.scrollWidth>innerWidth+1)bad.push('horizontal page overflow');
          const selectors='h1,h2,.journal-lead,.current-words p,.association-photo figcaption,.association summary,.echo-title,.journal-quick-index a';
          for(const el of document.querySelectorAll(selectors)){
            if(!el.getClientRects().length||el.closest('.visually-hidden,dialog,details:not([open]) .association-images'))continue;
            const range=document.createRange();range.selectNodeContents(el);
            if([...range.getClientRects()].some(r=>r.width>0&&(r.left< -2||r.right>innerWidth+2)))bad.push(el.textContent.trim().slice(0,100));
          }
          return bad;
        });
        if(bad.length)failures.push({route,lang,width,bad});
      }
    }
  }
  assert.deepEqual(failures,[]);
});
await check('Carnets : parole originale, manuscrit ouvrable et verso décoratif',async()=>{
  await page.setViewportSize({width:390,height:844});await ready('carnets/');await language('fr');
  assert.match(await page.locator('#geste .journal-lead').textContent(),/ni avec les mots, ni avec les phrases, ni avec la gestuelle, mais uniquement par le geste de la peinture/);
  assert.match(await page.locator('#film-01 .journal-prose').textContent(),/avec le poignet, avec l’avant-bras ou avec tout le corps/);
  assert.equal(await page.locator('.notebook-verso').getAttribute('aria-hidden'),'true');
  await page.locator('.word-fragment').focus();await page.keyboard.press('Enter');
  await page.waitForFunction(()=>document.querySelector('#archive-viewer').open);
  assert.match(await page.locator('#archive-image').getAttribute('src'),/quelques-mots.webp/);
  await close();
});
await check('Caves : quatre photographies, crédits, disparition après le passage puis hommage',async()=>{
  await ready('les-caves/');
  const ids=await page.locator('a[data-photo]').evaluateAll(a=>a.map(a=>a.dataset.photo));
  assert.deepEqual(ids,['caves-lumiere','caves-mur','caves-silence','caves-passage']);
  assert.equal(await page.locator('a[data-photo][data-caption-fr*="David Zuber"]').count(),4);
  assert.equal(await page.evaluate(()=>{const passage=document.querySelector('.caves-passage'),absence=document.querySelector('.caves-absence'),homage=document.querySelector('.homage');return !!(passage.compareDocumentPosition(absence)&Node.DOCUMENT_POSITION_FOLLOWING)&&!!(absence.compareDocumentPosition(homage)&Node.DOCUMENT_POSITION_FOLLOWING);}),true);
  assert.match(await page.locator('.homage').textContent(),/Alban Reynard/);
  assert.match(await page.locator('.caves-absence').textContent(),/détruit/);
  await page.locator('.caves-passage a').tap();await page.waitForFunction(()=>document.querySelector('#archive-viewer').open);await close();
});
await check('Matière : même image pour le détail et la vue entière, lien direct sans animation',async()=>{
  await ready('matieres/');
  assert.equal(await page.locator('.matter-macro img').getAttribute('srcset'),await page.locator('.matter-return img').getAttribute('srcset'));
  assert.match(await page.locator('.paint-opening .journal-lead').textContent(),/peint avec les tripes/);
  await page.locator('.matter-macro-image').tap();
  await page.waitForURL('**/#rouge-entier');
  await page.locator('.matter-return .photo-link').tap();await page.waitForFunction(()=>document.querySelector('#archive-viewer').open);
  assert.match(await page.locator('#archive-image').getAttribute('src'),/le-rouge-revient.webp/);await close();
});
await check('Traces : affiche et faits conservés, miroir non surdimensionné',async()=>{
  await ready('traces/');
  const text=await page.locator('#affiche').textContent();
  for(const fact of ['2017','Sabine Leyat Filliez','La Tour Lombarde','Du 2 juin au 2 juillet'])assert.ok(text.includes(fact));
  assert.ok((await page.locator('.mirror-memory img').boundingBox()).width<=150);
  await page.locator('#affiche .photo-link').tap();await page.waitForFunction(()=>document.querySelector('#archive-viewer').open);await close();
});
await check('Trois associations natives, neuf images ouvrables, retour au lien d’origine',async()=>{
  await ready('reserves/');
  assert.equal(await page.locator('.association').count(),3);
  assert.equal(await page.locator('.association-images a[data-photo]').count(),9);
  for(const association of await page.locator('.association').all()){
    if(!await association.evaluate(d=>d.open))await association.locator('summary').tap();
    for(const link of await association.locator('a[data-photo]').all()){
      await link.tap();await page.waitForFunction(()=>document.querySelector('#archive-viewer').open);
      await page.waitForFunction(()=>document.querySelector('#archive-image').naturalWidth>0);
      await close();assert.equal(await link.evaluate(a=>document.activeElement===a),true);
    }
  }
  await page.locator('#association-geste summary').focus();await page.keyboard.press('Enter');
  assert.equal(await page.locator('#association-geste').evaluate(d=>d.open),false);
});
await check('La réserve garde ses 73 fragments, ses filtres et son chargement progressif',async()=>{
  assert.equal(await page.locator('[data-reserve-item]').count(),73);
  assert.equal(await page.locator('[data-reserve-item]:visible').count(),16);
  await page.locator('[data-regard="expositions"]').tap();
  assert.equal(await page.locator('[data-reserve-item]:visible:not([data-kind="expositions"])').count(),0);
  assert.ok(await page.locator('[data-reserve-item]:visible').count()>0);
  await page.locator('[data-regard="all"]').tap();
  await page.locator('[data-reserve-more]').tap();
  assert.equal(await page.locator('[data-reserve-item]:visible').count(),32);
});
await check('Trois échos entre pages : destinations réelles et lien profond vers le reflet',async()=>{
  for(const [route,destination] of [['carnets/','reserves/#rapprochements'],['matieres/','hors-cadre/#atelier'],['traces/','hors-cadre/#fragment/hc-08']]){
    await ready(route);await page.locator('.journal-echo>a').tap();
    await page.waitForURL(base+'/journal/'+destination);
    if(destination.includes('fragment/')){await page.waitForFunction(()=>document.querySelector('#archive-viewer').open);await close();}
  }
});
await check('Sans JavaScript : sommaire, trois associations et toutes les archives accessibles',async()=>{
  const ctx=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const p=await ctx.newPage();watch(p);
  await p.goto(base+'/journal/');assert.equal(await p.locator('.journal-quick-index a').count(),6);
  await p.goto(base+'/journal/reserves/');assert.equal(await p.locator('[data-reserve-item]:visible').count(),73);
  await p.locator('#association-geste summary').click();assert.equal(await p.locator('#association-geste').evaluate(d=>d.open),true);
  await p.locator('#association-geste a').first().click();await p.waitForURL('**/hc-42.webp');
  await ctx.close();
});
await check('Les six pages passent les audits axe WCAG A/AA en français et anglais',async()=>{
  assert.ok(process.env.AXE_PATH,'AXE_PATH est requis pour cet audit');const issues=[];
  for(const route of routes){await ready(route);await page.addScriptTag({path:process.env.AXE_PATH});
    for(const lang of ['fr','en']){await language(lang);const found=await page.evaluate(async()=>{document.querySelectorAll('.association').forEach(d=>d.open=true);return (await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));});if(found.length)issues.push({route,lang,found});}
  }
  assert.deepEqual(issues,[]);
});
await check('Une transition native annulée ne produit pas de rejet non géré',async()=>{
  await ready('carnets/');
  const skipped=await page.evaluate(async()=>{
    let skipped=0;
    const event=new Event('pagereveal');
    Object.defineProperty(event,'viewTransition',{value:{ready:Promise.reject(new DOMException('Transition intentionally skipped','AbortError')),finished:Promise.resolve(),skipTransition(){skipped++;}}});
    window.dispatchEvent(event);
    await new Promise(resolve=>setTimeout(resolve,0));
    return skipped;
  });
  assert.equal(skipped,1);
});
await check('Pas d’erreur JavaScript, de service extérieur ni de téléchargement des originaux',async()=>{
  assert.deepEqual(errors,[]);
  assert.deepEqual(requests.filter(url=>!url.startsWith(base)&&!url.startsWith('data:')),[]);
  assert.deepEqual(requests.filter(url=>/\.(heic|jpe?g|tiff?)(?:[?#]|$)/i.test(url)),[]);
});
await browser.close();
const report=join(tmpdir(),'camilo-reverie-browser-report.json');writeFileSync(report,JSON.stringify(results,null,2)+'\n');
console.log(`RESULT: ${results.filter(r=>r.ok).length}/${results.length}; ${report}`);
if(results.some(r=>!r.ok))process.exitCode=1;
