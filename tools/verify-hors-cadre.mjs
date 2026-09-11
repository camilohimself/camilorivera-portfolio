/** Browser checks; no production dependency. Supply PLAYWRIGHT_MODULE and,
 * optionally, AXE_PATH. Start the static server before running this script.
 * ART_BASE_URL defaults to http://127.0.0.1:8000.
 */
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const {chromium} = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.ART_BASE_URL || 'http://127.0.0.1:8000';
const browser = await chromium.launch({channel:'chrome',headless:true});
const results = [];
const errors = [];
const requests = [];
async function check(name, run) {
  try { const detail = await run(); results.push({name,ok:true,detail}); console.log('OK — '+name+(detail ? ' '+JSON.stringify(detail) : '')); }
  catch (error) { results.push({name,ok:false,error:error.message}); console.error('FAIL — '+name+'\n'+error.message); }
}
function watch(page) {
  page.on('pageerror',error=>errors.push(error.message));
  page.on('request',request=>requests.push(request.url()));
}
async function ready(page,path='/journal/hors-cadre/') {
  await page.goto(base+path,{waitUntil:'load'});
  await page.evaluate(()=>document.fonts.ready);
}
async function tick(page) {
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
}
const context = await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2});
const page = await context.newPage();watch(page);

await check('85 archives, 5 suites et 19 feuilles libres',async()=>{
  await ready(page);
  assert.equal(await page.locator('a[data-photo]').count(),85);
  assert.equal(await page.locator('.paint-sequence').count(),5);
  assert.equal(await page.locator('.hc-sheets .hc-photo').count(),19);
  assert.equal(await page.locator('#encre video').getAttribute('src'),null);
});
await check('Ouverture, zoom, clavier et retour à la photographie',async()=>{
  await page.locator('#hc-08 .photo-link').click();
  await page.waitForFunction(()=>document.querySelector('#archive-viewer').open);
  await page.waitForFunction(()=>document.querySelector('#archive-image').naturalWidth>0);
  assert.match(await page.locator('#archive-title').textContent(),/Reflets/);
  await page.locator('.archive-zoom').click();
  assert.equal(await page.locator('.archive-zoom').getAttribute('aria-pressed'),'true');
  await page.locator('.archive-zoom').click();
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(()=>location.hash==='#fragment/hc-25');
  await page.keyboard.press('Escape');
  await page.waitForFunction(()=>!document.querySelector('#archive-viewer').open);
  assert.equal(await page.evaluate(()=>document.activeElement.dataset.photo),'hc-08');
});
await check('Liens profonds vers les archives, y compris dans un ensemble fermé',async()=>{
  for (const n of ['14','75','83','30']) {
    await ready(page,`/journal/hors-cadre/#fragment/hc-${n}`);
    await page.waitForFunction(()=>document.querySelector('#archive-viewer').open);
    await page.waitForFunction(()=>document.querySelector('#archive-image').naturalWidth>0);
    assert.match(await page.locator('#archive-image').getAttribute('src'),new RegExp(`hc-${n}\\.webp`));
    await page.keyboard.press('Escape');
    await page.waitForFunction(()=>!document.querySelector('#archive-viewer').open);
  }
});
await check('Suite de peinture : flèches, curseur au clavier et bornes',async()=>{
  await ready(page);
  await page.locator('#suite-noirs .sequence-tools').scrollIntoViewIfNeeded();
  await page.locator('#suite-noirs [data-sequence-next]').click();
  await page.waitForFunction(()=>document.querySelector('#range-noirs').value==='1');
  await page.locator('#range-noirs').focus();
  await page.keyboard.press('End');
  await page.waitForFunction(()=>document.querySelector('#range-noirs').value==='7');
  await tick(page);
  assert.equal(await page.locator('#suite-noirs [data-sequence-next]').isDisabled(),true);
  await page.keyboard.press('Home');
  await page.waitForFunction(()=>document.querySelector('#range-noirs').value==='0');
  assert.equal(await page.locator('#suite-noirs [data-sequence-prev]').isDisabled(),true);
});
await check('Défilement tactile réel dans les états de peinture',async()=>{
  const rail=page.locator('#rail-noirs');
  await rail.scrollIntoViewIfNeeded();
  const rect=await rail.boundingBox();
  const x=Math.min(340,rect.x+rect.width-30), y=Math.min(600,Math.max(200,rect.y+150));
  const cdp=await context.newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  for(let i=1;i<=8;i++) {
    await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-i*28,y}]});
    await page.waitForTimeout(20);
  }
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await page.waitForFunction(()=>Number(document.querySelector('#range-noirs').value)>0);
  await cdp.detach();
});
await check('Les cinq suites s’ouvrent et gardent des images entières',async()=>{
  for(const id of ['bleus','ciel','sablier','eclats','noirs']) {
    const details=page.locator('#suite-'+id);
    if(!(await details.getAttribute('open')!==null))await details.locator('summary').click();
    assert.equal(await details.evaluate(e=>e.open),true);
    assert.equal(await details.locator('.process-rail img').first().evaluate(e=>getComputedStyle(e).objectFit),'contain');
  }
});
await check('Film noir : décodage réel, silence, pause et agrandissement',async()=>{
  await page.locator('#encre').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.querySelector('#encre video').currentTime>1,{},{timeout:15000});
  const video=page.locator('#encre video');
  assert.equal(await video.evaluate(v=>v.muted&&v.volume===0&&!v.paused&&v.readyState>=2),true);
  assert.match(await video.getAttribute('src'),/encre-noire-mobile/);
  await page.locator('#encre .ink-depth').click();
  assert.equal(await page.locator('#encre .ink-depth').getAttribute('aria-pressed'),'true');
  await page.locator('#encre .film-toggle').click();
  assert.equal(await video.evaluate(v=>v.paused),true);
  await page.locator('#top').scrollIntoViewIfNeeded();
  await page.locator('#encre').scrollIntoViewIfNeeded();
  assert.equal(await video.evaluate(v=>v.paused),true);
  await page.locator('#encre .film-toggle').click();
  await page.waitForFunction(()=>!document.querySelector('#encre video').paused);
});
await check('Pause derrière la visionneuse et hors écran',async()=>{
  // Open a real archive through its link while keeping the film in the viewport.
  await page.locator('#hc-75 .photo-link').evaluate(a=>a.click());
  await page.waitForFunction(()=>document.querySelector('#archive-viewer').open);
  await page.waitForFunction(()=>document.querySelector('#encre video').paused);
  await page.keyboard.press('Escape');
  await page.waitForFunction(()=>!document.querySelector('#archive-viewer').open);
  await page.locator('#top').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.querySelector('#encre video').paused);
});
await check('Langue anglaise, légendes, contrôles et préférence persistante',async()=>{
  await page.locator('.language-toggle').click();
  assert.equal(await page.locator('html').getAttribute('lang'),'en');
  assert.match(await page.locator('h1').textContent(),/Outside/);
  await ready(page);
  assert.equal(await page.locator('html').getAttribute('lang'),'en');
  await page.locator('#hc-14 .photo-link').click();
  assert.match(await page.locator('#archive-title').textContent(),/Close together/);
  await page.keyboard.press('Escape');
  await page.waitForFunction(()=>!document.querySelector('#archive-viewer').open);
  await page.locator('.language-toggle').click();
});
await check('85 images utilisables et sans erreur média après ouverture des ensembles',async()=>{
  await page.evaluate(()=>document.querySelectorAll('details').forEach(d=>{d.removeAttribute('name');d.open=true;}));
  const failures=await page.locator('a[data-photo] img').evaluateAll(async images=>{
    // Decode one at a time: the test does not create a burst of 85 requests.
    const bad=[];
    for(const img of images) {
      img.loading='eager';
      try {await img.decode();}catch {bad.push(img.getAttribute('src'));}
    }
    return bad;
  });
  assert.deepEqual(failures,[]);
});

const calmContext=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
const calmPage=await calmContext.newPage();watch(calmPage);
await check('Mouvement réduit : aucune vidéo automatique, lecture volontaire possible',async()=>{
  await ready(calmPage,'/');
  await calmPage.waitForTimeout(1100);
  assert.equal(await calmPage.locator('.ink-overture video').getAttribute('src'),null);
  assert.equal(await calmPage.locator('.ink-overture .ink-depth').isVisible(),false);
  await calmPage.locator('.ink-overture .film-toggle').click();
  await calmPage.waitForFunction(()=>document.querySelector('.ink-overture video').currentTime>.4,{},{timeout:15000});
  await ready(calmPage);
  await calmPage.locator('#encre').scrollIntoViewIfNeeded();
  await tick(calmPage);
  assert.equal(await calmPage.locator('#encre video').getAttribute('src'),null);
});
await check('32 compositions FR/EN, de 320 à 1920 pixels, sans débordement',async()=>{
  const problems=[];
  for(const route of ['/','/journal/hors-cadre/']) {
    await ready(calmPage,route);
    for(const language of ['fr','en']) {
      if(await calmPage.locator('html').getAttribute('lang')!==language)await calmPage.locator('.language-toggle').click();
      for(const width of [320,360,390,430,768,1024,1440,1920]) {
        await calmPage.setViewportSize({width,height:width<768?844:1000});await tick(calmPage);
        const failure=await calmPage.evaluate(()=>{
          const list=[];
          if(document.documentElement.scrollWidth>innerWidth+1)list.push(`page ${document.documentElement.scrollWidth}/${innerWidth}`);
          for(const title of document.querySelectorAll('h1,h2')) {
            if(!title.getClientRects().length)continue;
            const range=document.createRange();range.selectNodeContents(title);
            for(const r of range.getClientRects())if(r.width>0&&(r.left< -2||r.right>innerWidth+2)){list.push(title.textContent.trim());break;}
          }
          return list;
        });
        if(failure.length)problems.push({route,language,width,failure});
      }
    }
  }
  assert.deepEqual(problems,[]);
});
await check('Six chapitres existants : liens vers Hors cadre et rendu mobile/ordinateur',async()=>{
  for(const route of ['','carnets/','matieres/','les-caves/','traces/','reserves/']) {
    for(const width of [390,1440]) {
      await calmPage.setViewportSize({width,height:900});
      await ready(calmPage,'/journal/'+route);
      assert.ok(await calmPage.locator('a[href*="hors-cadre"]').count(),route+' : lien vers Hors cadre');
      assert.equal(await calmPage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
    }
  }
});
await check('Collection existante : filtres, visionneuse et chargement de la suite',async()=>{
  await ready(page,'/');
  await page.locator('[data-filter="encres"]').click();
  await page.waitForFunction(()=>document.querySelectorAll('#gallery-grid .work-card').length===12);
  await page.locator('#gallery-grid .work-card').first().click();
  await page.waitForFunction(()=>document.querySelector('#viewer').open);
  await page.waitForFunction(()=>document.querySelector('#viewer-image').naturalWidth>0);
  await page.keyboard.press('Escape');
  await page.waitForFunction(()=>!document.querySelector('#viewer').open);
  await page.locator('#load-more').click();
  assert.equal(await page.locator('#gallery-grid .work-card').count(),24);
});
await check('Accueil : source mobile, lecture réelle, pause après changement de langue',async()=>{
  const toggle=page.locator('.ink-overture .film-toggle');
  // Bring the controls into view before deciding whether the click should play
  // or pause: scrolling itself can pause a background that leaves the viewport.
  await toggle.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  if(await page.locator('.ink-overture video').evaluate(v=>v.paused))await toggle.click();
  await page.waitForFunction(()=>{const v=document.querySelector('.ink-overture video');return !v.paused && v.currentTime>1;},{},{timeout:15000});
  assert.match(await page.locator('.ink-overture video').getAttribute('src'),/encre-bleue-mobile/);
  await toggle.click();
  assert.equal(await page.locator('.ink-overture video').evaluate(v=>v.paused),true,'pause après le clic');
  await page.locator('.language-toggle').click();
  assert.equal(await page.locator('.ink-overture video').evaluate(v=>v.paused),true,'pause conservée après traduction');
});

const economyContext=await browser.newContext({viewport:{width:390,height:844}});
await economyContext.addInitScript(()=>Object.defineProperty(navigator,'connection',{value:{saveData:true,effectiveType:'4g',addEventListener(){}}}));
const economy=await economyContext.newPage();watch(economy);
await check('Économie de données : image fixe jusqu’à un geste volontaire',async()=>{
  await ready(economy,'/');await economy.waitForTimeout(1100);
  assert.equal(await economy.locator('.ink-overture video').getAttribute('src'),null);
  await economy.locator('.ink-overture .film-toggle').click();
  await economy.waitForFunction(()=>document.querySelector('.ink-overture video').currentTime>.4,{},{timeout:15000});
});
await check('Erreur vidéo : image de repli, message et bouton de reprise',async()=>{
  const failureContext=await browser.newContext({viewport:{width:390,height:844}});
  const failure=await failureContext.newPage();
  await failure.route('**/videos/encre-bleue-mobile.mp4',route=>route.abort());
  await ready(failure,'/');
  await failure.locator('.ink-overture .film-toggle').click();
  await failure.waitForFunction(()=>document.querySelector('.ink-overture .film-message').textContent.length>0);
  assert.equal(await failure.locator('.ink-overture .film-frame').evaluate(e=>e.classList.contains('has-film')),false);
  assert.equal(await failure.locator('.ink-overture .film-poster').evaluate(e=>getComputedStyle(e).visibility),'visible');
  await failure.unroute('**/videos/encre-bleue-mobile.mp4');
  await failure.locator('.ink-overture .film-toggle').click();
  await failure.waitForFunction(()=>document.querySelector('.ink-overture video').currentTime>.4,{},{timeout:15000});
  await failureContext.close();
});
await check('Sans JavaScript : images, détails natifs et navigation',async()=>{
  const noJS=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const staticPage=await noJS.newPage();
  await staticPage.goto(base+'/journal/hors-cadre/');
  assert.equal(await staticPage.locator('a[data-photo]').count(),85);
  await staticPage.locator('#suite-bleus summary').click();
  assert.equal(await staticPage.locator('#suite-bleus').getAttribute('open'),'');
  await staticPage.locator('#hc-27 a').click();
  assert.match(staticPage.url(),/hc-27\.webp$/);
  await noJS.close();
});
if(process.env.AXE_PATH)await check('Accessibilité : accueil, chapitre et visionneuse',async()=>{
  const issues=[];
  await calmPage.setViewportSize({width:390,height:844});
  for(const route of ['/','/journal/hors-cadre/']) {
    await ready(calmPage,route);
    await calmPage.addScriptTag({path:process.env.AXE_PATH});
    const result=await calmPage.evaluate(async()=>window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
    issues.push(...result.violations.map(v=>({route,id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})));
  }
  await calmPage.locator('#hc-14 a').click();
  await calmPage.waitForFunction(()=>document.querySelector('#archive-image').naturalWidth>0);
  const result=await calmPage.evaluate(async()=>window.axe.run(document.querySelector('#archive-viewer'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
  issues.push(...result.violations.map(v=>({route:'viewer',id:v.id,nodes:v.nodes.map(n=>n.target)})));
  assert.deepEqual(issues,[]);
});
await check('Aucune erreur JavaScript ni chargement externe ou original HEIC/JPEG',async()=>{
  assert.deepEqual([...new Set(errors)],[]);
  assert.deepEqual([...new Set(requests.filter(u=>!u.startsWith(base)&&!u.startsWith('data:')))],[]);
  assert.deepEqual([...new Set(requests.filter(u=>/\.(heic|jpe?g)(?:\?|$)/i.test(u)))],[]);
});
await browser.close();
const report=join(tmpdir(),'camilo-hors-cadre-browser-report.json');
writeFileSync(report,JSON.stringify({results},null,2)+'\n');
console.log(`RESULT: ${results.filter(r=>r.ok).length}/${results.length}; ${report}`);
if(results.some(r=>!r.ok))process.exitCode=1;
