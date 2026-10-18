/* Liquid transitions. Pages open in a drop born where the visitor clicked and close back into it.
   Loaded without defer in <head>: pagereveal fires before the first frame, before deferred scripts. */
(() => {
  'use strict';
  const root = document.documentElement;
  const KEY = 'cr-drop';            // sessionStorage, written at pageswap, read and removed at pagereveal
  const MAX_AGE = 3000;             // a point older than this no longer describes the gesture
  const system = matchMedia('(prefers-reduced-motion: reduce)');
  const storedCalm = () => { try { return (sessionStorage.getItem('cr-motion') || localStorage.getItem('cr-motion')) === 'reduced'; } catch { return false; } };
  const calm = () => system.matches || root.classList.contains('motion-reduced') || storedCalm();
  const site = new URL((root.dataset.siteRoot || '.') + '/', document.baseURI);
  // Reading order of the index (00 to 08): going to an earlier page closes the current one.
  const chapters = ['', 'oeuvres/', 'journal/', 'journal/carnets/', 'journal/matieres/', 'journal/les-caves/', 'journal/traces/', 'journal/reserves/', 'journal/hors-cadre/'];
  const chapter = url => {
    try {
      const target = new URL(url, location.href);
      if (target.origin !== site.origin || !target.pathname.startsWith(site.pathname)) return -1;
      return chapters.indexOf(target.pathname.slice(site.pathname.length).replace(/index\.html$/, ''));
    } catch { return -1; }
  };
  const nav = window.navigation;

  // The last gesture, relative to the viewport so it survives a change of window size.
  let gesture = null;
  function remember(x, y, element) {
    gesture = {x: Math.min(1, Math.max(0, x / innerWidth)), y: Math.min(1, Math.max(0, y / innerHeight)), t: Date.now(), href: element?.closest?.('a[href]')?.href || null};
  }
  function centerOf(element) {
    const rect = element?.getBoundingClientRect?.();
    if (!rect || !rect.width || rect.bottom < 0 || rect.top > innerHeight || rect.right < 0 || rect.left > innerWidth) return null;
    return [rect.left + rect.width / 2, rect.top + rect.height / 2];
  }
  addEventListener('pointerdown', event => { if (event.isPrimary) remember(event.clientX, event.clientY, event.target); }, {capture: true, passive: true});
  addEventListener('click', event => {
    // A keyboard activation has no pointer position: the drop starts from the activated element.
    const point = event.detail === 0 ? centerOf(event.target.closest?.('a, button') || event.target) : [event.clientX, event.clientY];
    if (point) remember(point[0], point[1], event.target);
  }, {capture: true, passive: true});
  const fresh = (point, age = MAX_AGE) => point && Date.now() - point.t <= age ? point : null;

  function place(x, y) {
    // The drop must reach the farthest corner, beyond its soft edge.
    const far = Math.max(Math.hypot(x, y), Math.hypot(innerWidth - x, y), Math.hypot(x, innerHeight - y), Math.hypot(innerWidth - x, innerHeight - y));
    root.style.setProperty('--drop-x', Math.round(x) + 'px');
    root.style.setProperty('--drop-y', Math.round(y) + 'px');
    root.style.setProperty('--drop-end', Math.round(far * 1.12 + 48) + 'px');
  }
  function clear() {
    delete root.dataset.drop;
    delete root.dataset.dropPanel;
    delete root.dataset.dropHeader;
    ['--drop-x', '--drop-y', '--drop-end'].forEach(name => root.style.removeProperty(name));
  }
  // A header scrolled out of view would glide in from far away: it then joins the page image instead.
  function settleHeader() {
    const header = document.querySelector('.topbar, .site-header');
    const rect = header?.getBoundingClientRect();
    if (!rect || rect.bottom <= 0 || rect.top >= innerHeight) root.dataset.dropHeader = 'away';
  }
  let active = null;
  function play(transition, way, point) {
    root.dataset.drop = way;
    place(point ? point.x * innerWidth : innerWidth / 2, point ? point.y * innerHeight : innerHeight / 2);
    transition.ready.catch(() => {});
    const done = () => { if (active === transition) { active = null; clear(); } };
    active = transition;
    transition.finished.then(done, done);
  }

  // Where the current page opened, kept with its history entry (Navigation API), not in storage.
  // Without the API (Safari 18.2 to 26.1): one session key, the point of each page by address, the last PAGES_MAX only.
  const PAGES = 'cr-drop-pages', PAGES_MAX = 12;
  const address = () => location.pathname + location.search;
  const pages = () => { try { const value = JSON.parse(sessionStorage.getItem(PAGES)); return value && typeof value === 'object' && !Array.isArray(value) ? value : {}; } catch { return {}; } };
  const openedAt = () => {
    if (!nav) { const point = pages()[address()]; return typeof point?.x === 'number' && typeof point?.y === 'number' ? point : null; }
    try { return nav.currentEntry?.getState()?.crDrop || null; } catch { return null; }
  };
  function keepOpening(point) {
    if (!nav && point) {
      const kept = pages();
      delete kept[address()];
      kept[address()] = {x: point.x, y: point.y};
      const names = Object.keys(kept);
      names.slice(0, Math.max(0, names.length - PAGES_MAX)).forEach(name => delete kept[name]);
      try { sessionStorage.setItem(PAGES, JSON.stringify(kept)); } catch {}
      return;
    }
    if (!nav?.currentEntry || !point) return;
    try { nav.updateCurrentEntry({state: {...(nav.currentEntry.getState() || {}), crDrop: {x: point.x, y: point.y}}}); } catch {}
  }

  addEventListener('pageswap', event => {
    if (!event.viewTransition) return;
    // An open dialog covers the header: keep them in one image so the header cannot jump above it.
    if (document.querySelector('dialog[open]')) root.dataset.dropPanel = '';
    settleHeader();
    const activation = event.activation;
    const destination = activation?.entry?.url || fresh(gesture)?.href || null;
    let back = false;
    if (activation?.navigationType === 'traverse') back = activation.entry.index < (nav?.currentEntry?.index ?? Infinity);
    else if (destination) {
      const from = chapter(location.href), to = chapter(destination);
      back = from >= 0 && to >= 0 && to < from;
    }
    else if (!nav) {
      // Without the Navigation API, a traversal has no activation and no link: the next page compares the chapters.
      // The point where this page opened goes along, should it close.
      const record = {t: Date.now(), from: chapter(location.href)};
      if (calm()) record.way = 'fade';
      const opened = openedAt();
      if (opened) Object.assign(record, {x: opened.x, y: opened.y});
      try { sessionStorage.setItem(KEY, JSON.stringify(record)); } catch {}
      return;
    }
    const point = back ? openedAt() : fresh(gesture);
    const record = {way: calm() ? 'fade' : back ? 'close' : 'open', t: Date.now()};
    if (point) Object.assign(record, {x: point.x, y: point.y});
    try { sessionStorage.setItem(KEY, JSON.stringify(record)); } catch {}
  });

  addEventListener('pagereveal', event => {
    reachAnchor();
    let record = null;
    try { record = JSON.parse(sessionStorage.getItem(KEY)); sessionStorage.removeItem(KEY); } catch {}
    if (record && !(Date.now() - record.t <= MAX_AGE)) record = null;
    const transition = event.viewTransition;
    if (!transition) return;
    let way = record?.way;
    if (!way) {
      // No record (older engine or storage refused): infer the direction on this side.
      const activation = nav?.activation;
      const type = activation?.navigationType || performance.getEntriesByType?.('navigation')?.[0]?.type;
      if (typeof record?.from === 'number') {
        // Left without the Navigation API towards an unknown page (a traversal, mostly): the order of the chapters
        // decides, as for a link; when it cannot (privacy page, same chapter), the page closes, as going back is usual.
        const to = chapter(location.href);
        way = record.from >= 0 && to >= 0 && to > record.from ? 'open' : 'close';
      }
      else if (type === 'traverse' && activation?.from) way = activation.entry.index < activation.from.index ? 'close' : 'open';
      else if (type === 'back_forward') way = 'close';
      else {
        const from = chapter(activation?.from?.url || document.referrer), to = chapter(location.href);
        way = from >= 0 && to >= 0 && to < from ? 'close' : 'open';
      }
    }
    if (calm()) way = 'fade';
    // A record from the branch above carries where the page left had opened: only a closing uses it.
    const point = record && 'x' in record && !('from' in record && way !== 'close') ? record : null;
    settleHeader();
    if (way === 'open') keepOpening(point || {x: .5, y: .5});
    play(transition, way, point);
  });
  // A page shown again from the back/forward cache must not keep a finished transition’s state.
  addEventListener('pageshow', event => { if (event.persisted && !active) clear(); });

  /* Panels of the same page (index, viewers, collection). update() opens or closes dialogs;
     the drop direction follows what actually changed. update() may return a promise: the drop
     then waits for it before capturing the new state (the previous image stays on screen meanwhile). */
  const anchors = new WeakMap();
  const openDialogs = () => new Set(document.querySelectorAll('dialog[open]'));
  let queued = null, queuedDone = null;
  function swap(update, options = {}) {
    const before = openDialogs();
    const opener = options.origin || null;
    const pointFor = (dialog, closing) => {
      const element = closing ? options.returnTo || anchors.get(dialog)?.element : null;
      const fromElement = centerOf(element);
      if (fromElement) return {x: fromElement[0] / innerWidth, y: fromElement[1] / innerHeight};
      if (closing) return anchors.get(dialog)?.point || null;
      const recent = fresh(gesture, 1200);
      if (recent) return recent;
      const fromOpener = centerOf(opener);
      return fromOpener ? {x: fromOpener[0] / innerWidth, y: fromOpener[1] / innerHeight} : null;
    };
    const decide = () => {
      const after = openDialogs();
      const opened = [...after].find(dialog => !before.has(dialog));
      const closed = [...before].find(dialog => !after.has(dialog));
      if (opened) {
        const point = pointFor(opened, false);
        anchors.set(opened, {point, element: opener});
        return {way: 'open', point, dialog: opened};
      }
      if (closed) return {way: 'close', point: pointFor(closed, true), dialog: closed};
      return null;
    };
    if (typeof document.startViewTransition === 'function') {
      // popstate and hashchange often arrive together: one drop carries both updates.
      if (queued) { queued.push(update); return queuedDone; }
      const updates = queued = [update];
      let change = null;
      root.dataset.dropPanel = '';
      const transition = document.startViewTransition(() => {
        queued = null;
        const waits = updates.map(run => run()).filter(result => typeof result?.then === 'function');
        change = decide();
        if (!change) return;
        // Set inside the callback: the pseudo-elements read these styles right after it.
        root.dataset.drop = calm() ? 'fade' : change.way;
        const p = change.point;
        place(p ? p.x * innerWidth : innerWidth / 2, p ? p.y * innerHeight : innerHeight / 2);
        if (waits.length) return Promise.all(waits).then(() => {}, () => {});
      });
      transition.updateCallbackDone.then(() => { if (!change) transition.skipTransition(); }, () => { transition.skipTransition(); });
      transition.ready.catch(() => {});
      active = transition;
      const done = () => { if (active === transition) { active = null; clear(); } };
      transition.finished.then(done, done);
      queuedDone = transition.updateCallbackDone.catch(() => {});
      return queuedDone;
    }
    // Without view transitions: the dialog itself opens in a drop, and closes in one when the caller names it.
    const closing = options.closing;
    if (closing?.open && !calm() && closing.animate) {
      return animateDialog(closing, pointFor(closing, true), 'close').then(update);
    }
    update();
    const change = decide();
    if (change?.way === 'open' && !calm() && change.dialog.animate) animateDialog(change.dialog, change.point, 'open');
    return Promise.resolve();
  }
  function animateDialog(dialog, point, way) {
    const rect = dialog.getBoundingClientRect();
    const x = (point ? point.x * innerWidth : innerWidth / 2) - rect.left;
    const y = (point ? point.y * innerHeight : innerHeight / 2) - rect.top;
    const far = Math.max(Math.hypot(x, y), Math.hypot(rect.width - x, y), Math.hypot(x, rect.height - y), Math.hypot(rect.width - x, rect.height - y));
    dialog.style.setProperty('--drop-x', x + 'px');
    dialog.style.setProperty('--drop-y', y + 'px');
    dialog.style.setProperty('--drop-end', Math.round(far * 1.12 + 48) + 'px');
    dialog.classList.add('drop-panel');
    // Same profiles as @keyframes drop-open and drop-close in css/motion.css.
    const profile = way === 'open'
      ? [[0, 0], [.03, .13], [.1, .265], [.2, .399], [.3, .507], [.4, .601], [.5, .686], [.6, .764], [.7, .837], [.8, .905], [.9, .959], [1, 1]]
      : [[0, 1], [.1, .929], [.2, .878], [.3, .823], [.4, .764], [.5, .699], [.6, .625], [.7, .539], [.8, .432], [.9, .277], [.93, .202], [.96, 0], [1, 0]];
    const frames = profile.map(([offset, p]) => ({offset, '--drop-p': p}));
    const timing = {duration: way === 'open' ? 780 : 700, easing: 'linear', fill: 'both'};
    const body = dialog.animate(frames, timing);
    const veil = dialog.animate(way === 'open' ? [{opacity: 0}, {opacity: 1}] : [{opacity: 1}, {opacity: 0}], {...timing, pseudoElement: '::backdrop'});
    return body.finished.catch(() => {}).then(() => {
      body.cancel(); veil.cancel();
      dialog.classList.remove('drop-panel');
      ['--drop-x', '--drop-y', '--drop-end'].forEach(name => dialog.style.removeProperty(name));
    });
  }
  /* Smooth scrolling (html.scroll-glide in css/journey.css and css/style.css) is for links within the page.
     The browser scrolls to an anchor reached from another page once the deferred scripts have run, then again
     until load; it restores a position from the history until load. Arrival must jump: the class waits until
     the frame after load. */
  const glide = () => root.classList.add('scroll-glide');
  const arrival = performance.getEntriesByType?.('navigation')?.[0]?.type;
  if (!location.hash && arrival !== 'reload' && arrival !== 'back_forward') glide();
  else addEventListener('load', () => requestAnimationFrame(() => requestAnimationFrame(glide)), {once: true});
  // The anchor is reached before the first frame, so the drop opens on it and settleHeader() sees the header
  // where it will be. Called first thing at pagereveal; only the first one (a page from the cache keeps its place).
  let reached = false;
  function reachAnchor() {
    if (reached) return;
    reached = true;
    if (arrival !== 'navigate' || !location.hash) return;
    let target = null;
    try { const id = location.hash.slice(1); target = document.getElementById(id) || document.getElementById(decodeURIComponent(id)); } catch {}
    target?.scrollIntoView({block: 'start', behavior: 'instant'});
  }
  addEventListener('pageshow', event => { if (event.persisted) glide(); });
  window.CamiloDrop = {swap};
})();
