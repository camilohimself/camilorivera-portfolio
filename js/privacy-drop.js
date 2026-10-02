/* La goutte : une goutte tombe, s'étale et dit ce que le site garde ; elle s'écoule quand on continue. */
(() => {
  'use strict';
  const root = document.documentElement;
  const DROP_KEY = 'cr-drop';
  if (document.body.classList.contains('privacy-page') || document.querySelector('.privacy-drop')) return;

  /* Stockage : en mode « ne rien garder », les réglages ne vivent que dans l'onglet. */
  const store = kind => (kind === 'session' ? window.sessionStorage : window.localStorage);
  const read = (kind, key) => { try { return store(kind).getItem(key); } catch { return null; } };
  const write = (kind, key, value) => { try { store(kind).setItem(key, value); } catch {} };
  const remove = (kind, key) => { try { store(kind).removeItem(key); } catch {} };
  const pref = key => read('session', key) || read('local', key) || read('local', key.replace('cr-', 'v01-'));
  if (read('local', 'cr-notice')) return;

  const copy = {
    fr: {
      region: 'Confidentialité', title: 'Ici, seules les œuvres gardent des traces.',
      lead: 'Aucun cookie, aucune mesure d’audience. Seuls vos réglages restent sur votre appareil, si vous en choisissez.',
      cont: 'Continuer la visite', none: 'Ne rien garder', more: 'Voir ce qui est gardé', less: 'Refermer le détail',
      nothing: 'Rien n’est gardé. Vos réglages ne dureront que le temps de cet onglet.',
      host: 'Le site est hébergé par Netlify : comme tout serveur web, il reçoit l’adresse IP et la page demandée.',
      policy: 'Déclaration de confidentialité', erase: 'Effacer', empty: 'rien pour l’instant',
      device: 'Sur cet appareil, jusqu’à effacement', tab: 'Le temps d’ouvrir la page suivante, puis effacé'
    },
    en: {
      region: 'Privacy', title: 'Here, only the works keep traces.',
      lead: 'No cookies, no audience tracking. Only your settings stay on your device, if you choose any.',
      cont: 'Continue the visit', none: 'Keep nothing', more: 'See what is kept', less: 'Close the details',
      nothing: 'Nothing is kept. Your settings will last only as long as this tab.',
      host: 'The site is hosted by Netlify: like any web server, it receives the IP address and the requested page.',
      policy: 'Privacy statement', erase: 'Erase', empty: 'nothing yet',
      device: 'On this device, until erased', tab: 'Only while the next page opens, then erased'
    }
  };
  const lang = () => (root.lang === 'en' ? 'en' : 'fr');
  const t = () => copy[lang()];
  function items() {
    const en = lang() === 'en';
    const language = pref('cr-language'), motion = pref('cr-motion'), notice = read('local', 'cr-notice'), drop = read('session', DROP_KEY);
    return [
      { keys: ['cr-language', 'v01-language'], session: false, name: en ? 'Language' : 'Langue',
        why: en ? 'Your choice between French and English.' : 'Votre choix entre français et anglais.',
        value: language ? (language === 'en' ? (en ? 'English' : 'anglais') : (en ? 'French' : 'français')) : null },
      { keys: ['cr-motion', 'v01-motion'], session: false, name: en ? 'Motion' : 'Mouvement',
        why: en ? 'Whether you reduce the animations.' : 'Si vous réduisez les animations.',
        value: motion ? (motion === 'reduced' ? (en ? 'reduced' : 'réduit') : (en ? 'full' : 'complet')) : null },
      { keys: ['cr-notice'], session: false, name: en ? 'This message' : 'Ce message',
        why: en ? 'So it is not shown again on every visit.' : 'Pour ne pas vous le reposer à chaque visite.',
        value: notice ? (en ? 'read' : 'lu') : null },
      { keys: [DROP_KEY], session: true, name: en ? 'Your last click' : 'Votre dernier clic',
        why: en ? 'So the next page opens where you touched.' : 'Pour ouvrir la page suivante là où vous avez touché.',
        value: drop ? (en ? 'this tab' : 'cet onglet') : null }
    ];
  }
  const erase = item => item.keys.forEach(key => { remove('local', key); remove('session', key); });
  function keepNothing() {
    // Les réglages déjà choisis passent dans l'onglet : la visite en cours ne change pas d'apparence.
    ['cr-language', 'cr-motion'].forEach(key => { const value = pref(key); if (value) write('session', key, value); });
    ['cr-language', 'cr-motion', 'v01-language', 'v01-motion'].forEach(key => remove('local', key));
    write('local', 'cr-notice', 'rien');
  }
  const icons = {
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    minus: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12h14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
  };
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches || root.classList.contains('motion-reduced');
  let seed = 11;
  const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  // Arrivée depuis une autre page du site : la tache est déjà là, elle ne retombe pas.
  let internal = false;
  try { internal = Boolean(document.referrer) && new URL(document.referrer).origin === location.origin; } catch {}
  const PAD = 80;

  /* Ressort amorti : la seule mécanique de toute la tache. */
  class Spring {
    constructor(x, k = 160, z = .5) { this.x = x; this.v = 0; this.to = x; this.k = k; this.z = z; }
    step(dt) { const c = 2 * Math.sqrt(this.k) * this.z; this.v += (-this.k * (this.x - this.to) - c * this.v) * dt; this.x += this.v * dt; }
    rest(eps) { return Math.abs(this.v) < eps && Math.abs(this.x - this.to) < eps; }
    set(to, k, z) { this.to = to; if (k) this.k = k; if (z) this.z = z; }
  }

  function start() {
    const siteRoot = new URL((root.dataset.siteRoot || '.') + '/', document.baseURI);
    const box = document.createElement('section');
    box.className = 'privacy-drop' + (calm ? ' is-calm' : '');
    box.setAttribute('aria-labelledby', 'privacy-drop-title');
    box.innerHTML = `
      <svg class="privacy-drop-defs" aria-hidden="true" focusable="false"><filter id="privacy-drop-goo" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation="9"/><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -8"/></filter></svg>
      <div class="privacy-drop-ink" aria-hidden="true"></div>
      <div class="privacy-drop-body">
        <h2 class="privacy-drop-title" id="privacy-drop-title"></h2>
        <p class="privacy-drop-text" aria-live="polite"></p>
        <div class="privacy-drop-detail" id="privacy-drop-detail"><div class="privacy-drop-detail-inner" inert><ul class="privacy-drop-list"></ul><p class="privacy-drop-host"></p><a class="privacy-drop-policy"></a></div></div>
        <button type="button" class="privacy-drop-more" aria-expanded="false" aria-controls="privacy-drop-detail"><span></span><i></i></button>
      </div>
      <div class="privacy-drop-actions">
        <button type="button" class="privacy-drop-pill" data-act="cont"></button>
        <button type="button" class="privacy-drop-pill" data-act="none"></button>
      </div>`;
    document.body.append(box);
    const $ = s => box.querySelector(s);
    const ink = $('.privacy-drop-ink'), body = $('.privacy-drop-body'), inner = $('.privacy-drop-detail-inner'), more = $('.privacy-drop-more');
    const pills = [...box.querySelectorAll('.privacy-drop-pill')];
    $('.privacy-drop-policy').href = new URL('confidentialite/', siteRoot).href;

    function list() {
      const words = t(), ul = $('.privacy-drop-list');
      ul.innerHTML = '';
      items().forEach(item => {
        const li = document.createElement('li');
        const name = document.createElement('span'), value = document.createElement('span'), why = document.createElement('p');
        name.className = 'privacy-drop-name'; value.className = 'privacy-drop-value'; why.className = 'privacy-drop-why';
        name.textContent = item.name; value.textContent = item.value || words.empty;
        why.textContent = `${item.why} ${item.session ? words.tab : words.device}.`;
        li.append(name, value, why);
        if (item.value) {
          const button = document.createElement('button');
          button.type = 'button'; button.className = 'privacy-drop-erase'; button.textContent = words.erase;
          button.setAttribute('aria-label', `${words.erase} : ${item.name}`);
          button.addEventListener('click', () => { erase(item); list(); more.focus(); });
          li.append(button);
        }
        ul.append(li);
      });
    }
    function text() {
      const words = t(), open = box.classList.contains('is-open');
      box.setAttribute('aria-label', words.region);
      $('.privacy-drop-title').textContent = words.title;
      $('.privacy-drop-text').textContent = box.classList.contains('is-void') ? words.nothing : words.lead;
      more.querySelector('span').textContent = open ? words.less : words.more;
      more.querySelector('i').innerHTML = open ? icons.minus : icons.plus;
      pills[0].textContent = words.cont; pills[1].textContent = words.none;
      $('.privacy-drop-host').textContent = words.host; $('.privacy-drop-policy').textContent = words.policy;
      list();
    }
    text();
    new MutationObserver(text).observe(root, { attributes: true, attributeFilter: ['lang'] });

    // Au-dessus du dock mobile quand il est affiché.
    function seat() {
      const dock = document.querySelector('.mobile-dock');
      const r = dock && getComputedStyle(dock).display !== 'none' ? dock.getBoundingClientRect() : null;
      if (r && r.height > 0 && r.top < innerHeight) box.style.setProperty('--drop-bottom', Math.round(innerHeight - r.top + 14) + 'px');
      else box.style.removeProperty('--drop-bottom');
    }
    seat();

    function geometry() {
      const b = box.getBoundingClientRect();
      const rel = r => ({ x: r.left - b.left + PAD, y: r.top - b.top + PAD, w: r.width, h: r.height });
      return { core: rel(body.getBoundingClientRect()), pills: pills.map(p => rel(p.getBoundingClientRect())), box: b };
    }
    const make = cls => { const d = document.createElement('div'); d.className = cls; ink.append(d); return d; };
    const still = calm || internal;
    const core = make('privacy-drop-core');
    const coreS = new Spring(still ? 1 : .04, 140, .52);
    let origin = { x: 0, y: 0 }, mode = 'rest', gatherAt = null;
    // Bosses du bord : des gouttes posées en retrait sur le périmètre, que le filtre fond en un seul liseré.
    const bumps = Array.from({ length: 15 }, (_, i) => ({
      el: make('privacy-drop-blob'), u: (i + rand() * .7) / 15, r: 15 + rand() * 19, inset: .42 + rand() * .32,
      x: new Spring(0, 85 + rand() * 120, .42 + rand() * .16), y: new Spring(0, 85 + rand() * 120, .42 + rand() * .16), s: new Spring(still ? 1 : 0, 120, .55), delay: rand() * 120
    }));
    // Éclaboussures : projetées à l'impact, elles restent en satellites autour de la tache.
    const splashes = Array.from({ length: 7 }, () => ({
      el: make('privacy-drop-blob'), a: rand() * Math.PI * 2, r: 3 + rand() * 6, extra: 14 + rand() * 34,
      x: new Spring(0, 55, .62), y: new Spring(0, 55, .62), s: new Spring(still ? 1 : 0, 90, .6)
    }));
    const shapes = pills.map(() => ({ el: make('privacy-drop-pillshape'), dy: new Spring(still ? 0 : -30, 170, .48), sy: new Spring(still ? 1 : 0, 170, .48), sx: new Spring(still ? 1 : 0, 170, .5) }));

    function perimeter(c, u, inset, r) {
      const P = 2 * (c.w + c.h); let d = u * P;
      if (d < c.w) return { x: c.x + d, y: c.y + r * inset };
      d -= c.w; if (d < c.h) return { x: c.x + c.w - r * inset, y: c.y + d };
      d -= c.h; if (d < c.w) return { x: c.x + c.w - d, y: c.y + c.h - r * inset * .9 };
      d -= c.w; return { x: c.x + r * inset, y: c.y + c.h - d };
    }
    function exitDistance(c, from, a) {
      const dx = Math.cos(a), dy = Math.sin(a);
      const tx = dx > 0 ? (c.x + c.w - from.x) / dx : dx < 0 ? (c.x - from.x) / dx : Infinity;
      const ty = dy > 0 ? (c.y + c.h - from.y) / dy : dy < 0 ? (c.y - from.y) / dy : Infinity;
      return Math.min(tx, ty);
    }
    function targets(g) {
      if (mode === 'gather') {
        bumps.forEach(b => { b.x.set(gatherAt.x, 130, .7); b.y.set(gatherAt.y, 130, .7); b.s.set(.35, 110, .7); });
        splashes.forEach(s => { s.x.set(gatherAt.x, 120, .7); s.y.set(gatherAt.y, 120, .7); s.s.set(0, 110, .8); });
        return;
      }
      if (mode === 'evaporate') return;
      bumps.forEach(b => { const p = perimeter(g.core, b.u, b.inset, b.r); b.x.to = p.x; b.y.to = p.y; });
      splashes.forEach(s => { const d = exitDistance(g.core, origin, s.a) + s.extra; s.x.to = origin.x + Math.cos(s.a) * d; s.y.to = origin.y + Math.sin(s.a) * d; });
    }
    function render(g) {
      core.style.width = g.core.w + 'px'; core.style.height = g.core.h + 'px';
      core.style.transformOrigin = `${origin.x - g.core.x}px ${origin.y - g.core.y}px`;
      core.style.transform = `translate(${g.core.x}px, ${g.core.y}px) scale(${Math.max(coreS.x, 0)})`;
      const blob = (el, x, y, r) => { el.style.transform = `translate(${x - 50}px, ${y - 50}px) scale(${Math.max(r, 0) / 50})`; };
      bumps.forEach(b => blob(b.el, b.x.x, b.y.x, b.r * b.s.x));
      splashes.forEach(s => blob(s.el, s.x.x, s.y.x, s.r * s.s.x));
      shapes.forEach((s, i) => {
        const r = g.pills[i];
        s.el.style.width = r.w + 'px'; s.el.style.height = r.h + 'px';
        s.el.style.transform = `translate(${r.x}px, ${r.y + s.dy.x}px) scale(${Math.max(s.sx.x, 0)}, ${Math.max(s.sy.x, 0)})`;
      });
    }
    let running = false, last = 0, aliveUntil = 0;
    function kick(ms = 0) { aliveUntil = Math.max(aliveUntil, performance.now() + ms); if (!running) { running = true; last = performance.now(); requestAnimationFrame(frame); } }
    function frame(now) {
      const dt = Math.min((now - last) / 1000, 1 / 30); last = now;
      const g = geometry(); targets(g);
      const springs = [coreS, ...bumps.flatMap(b => [b.x, b.y, b.s]), ...splashes.flatMap(s => [s.x, s.y, s.s]), ...shapes.flatMap(s => [s.dy, s.sy, s.sx])];
      springs.forEach(s => s.step(dt));
      render(g);
      if (springs.every(s => s.rest(.01)) && now > aliveUntil) { running = false; return; }
      requestAnimationFrame(frame);
    }
    addEventListener('resize', () => { seat(); kick(); });

    // La goutte du bouton s'étire comme une coulure sur le point de tomber.
    shapes.forEach((s, i) => {
      const on = () => { if (mode === 'rest' && !calm) { s.sy.set(1.12); s.dy.set(3); kick(); } };
      const off = () => { if (mode === 'rest' && !calm) { s.sy.set(1); s.dy.set(0); kick(); } };
      pills[i].addEventListener('pointerenter', on); pills[i].addEventListener('pointerleave', off);
      pills[i].addEventListener('focus', on); pills[i].addEventListener('blur', off);
    });
    more.addEventListener('click', () => {
      const open = box.classList.toggle('is-open');
      more.setAttribute('aria-expanded', String(open)); inner.inert = !open;
      text(); kick(700);
    });

    function vanish() {
      if (box.contains(document.activeElement)) document.activeElement.blur();
      box.remove(); document.querySelector('.privacy-drop-fall')?.remove();
    }
    function fall(x, fromY, toY, done) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'privacy-drop-fall'); svg.setAttribute('aria-hidden', 'true');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      svg.append(path); document.body.append(svg);
      const r = 13, g = 4300; let y = fromY, v = 0, prev = performance.now();
      const shape = tail => `M0 ${-tail} C ${r * .55} ${-tail * .55} ${r} ${-r * .35} ${r} 0 A ${r} ${r} 0 0 1 ${-r} 0 C ${-r} ${-r * .35} ${-r * .55} ${-tail * .55} 0 ${-tail} Z`;
      (function step(now) {
        const dt = Math.min((now - prev) / 1000, 1 / 30); prev = now;
        v += g * dt; y += v * dt;
        path.setAttribute('d', shape(r * (1.25 + Math.min(v / 900, 2.6))));
        path.setAttribute('transform', `translate(${x} ${Math.min(y, toY)})`);
        if (y >= toY) { svg.remove(); done(); return; }
        requestAnimationFrame(step);
      })(prev);
    }
    function land() {
      ink.style.opacity = '';
      const g = geometry();
      origin = { x: g.core.x + g.core.w * .56, y: g.core.y + g.core.h * .34 };
      bumps.forEach(b => { b.x.x = origin.x; b.y.x = origin.y; });
      splashes.forEach(s => {
        s.x.x = origin.x; s.y.x = origin.y;
        s.x.v = Math.cos(s.a) * (420 + rand() * 380); s.y.v = Math.sin(s.a) * (420 + rand() * 380);
        s.s.set(1);
      });
      coreS.set(1);
      bumps.forEach(b => setTimeout(() => { b.s.set(1); kick(); }, b.delay));
      shapes.forEach((s, i) => setTimeout(() => { s.dy.set(0); s.sy.set(1); s.sx.set(1); kick(); }, 200 + i * 90));
      setTimeout(() => box.classList.add('is-inked'), 340);
      setTimeout(() => box.classList.add('is-ready'), 560);
      kick(1600);
    }
    function leave(act) {
      if (mode !== 'rest') return;
      if (act === 'cont') write('local', 'cr-notice', 'vu'); else keepNothing();
      if (calm) {
        if (act === 'none') { box.classList.add('is-void'); text(); setTimeout(() => { box.classList.add('is-gone'); setTimeout(vanish, 260); }, 1600); }
        else { box.classList.add('is-gone'); setTimeout(vanish, 260); }
        return;
      }
      box.classList.remove('is-placed');
      if (act === 'cont') {
        // La tache se rassemble dans la goutte du bouton, puis s'écoule hors de l'écran.
        box.classList.add('is-leaving');
        const g = geometry(), p = g.pills[0];
        gatherAt = { x: p.x + p.w / 2, y: p.y + p.h / 2 };
        origin = gatherAt; mode = 'gather';
        coreS.set(0, 120, .75);
        shapes.forEach((s, i) => { s.sx.set(i === 0 ? .16 : 0, 130, .7); s.sy.set(i === 0 ? .55 : 0, 130, .7); });
        kick(520);
        setTimeout(() => { ink.style.opacity = '0'; fall(g.box.left - PAD + gatherAt.x, g.box.top - PAD + gatherAt.y, innerHeight + 120, vanish); }, 470);
      } else {
        // Rien n'est gardé : la tache le dit, puis s'évapore goutte à goutte.
        box.classList.add('is-void'); text();
        pills.forEach(p => { p.setAttribute('aria-disabled', 'true'); p.style.pointerEvents = 'none'; p.style.opacity = '0'; });
        more.style.visibility = 'hidden';
        shapes.forEach(s => { s.dy.set(-34, 120, .7); s.sy.set(.2, 120, .7); s.sx.set(.4, 120, .7); });
        kick(400);
        setTimeout(() => {
          mode = 'evaporate'; box.classList.add('is-leaving');
          [...splashes, ...bumps].forEach(b => setTimeout(() => { b.s.set(0, 60, .9); kick(); }, rand() * 520));
          const g = geometry(); origin = { x: g.core.x + g.core.w / 2, y: g.core.y + g.core.h / 2 };
          setTimeout(() => { coreS.set(0, 48, 1); kick(1200); }, 260);
          setTimeout(vanish, 1500);
        }, 1700);
      }
    }
    pills.forEach(p => p.addEventListener('click', () => leave(p.dataset.act)));

    const g0 = geometry();
    origin = { x: g0.core.x + g0.core.w * .56, y: g0.core.y + g0.core.h * .34 };
    if (still) {
      targets(g0);
      [...bumps, ...splashes].forEach(b => { b.x.x = b.x.to; b.y.x = b.y.to; });
      render(g0);
      if (internal && !calm) box.classList.add('is-placed', 'is-inked', 'is-ready');
      else requestAnimationFrame(() => box.classList.add('is-inked', 'is-ready'));
      return;
    }
    ink.style.opacity = '0';
    render(g0);
    const x = g0.box.left - PAD + g0.core.x + g0.core.w * .56;
    const y = g0.box.top - PAD + g0.core.y + g0.core.h * .34;
    fall(x, -40, y, land);
  }

  // Première page de la visite : laisser l'arrivée se faire avant la goutte.
  if (internal) start();
  else setTimeout(start, 1500);
})();
