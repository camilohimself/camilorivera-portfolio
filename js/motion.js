/* Progressive motion: native navigation, direct touch feedback and finite entrances. */
(() => {
  'use strict';
  const root = document.documentElement;
  const system = matchMedia('(prefers-reduced-motion: reduce)');
  const calm = () => system.matches || root.classList.contains('motion-reduced');
  try { if (localStorage.getItem('cr-motion') === 'reduced') root.classList.add('motion-reduced'); } catch {}
  const chapters = ['/', '/journal/', '/journal/carnets/', '/journal/matieres/', '/journal/les-caves/', '/journal/traces/', '/journal/reserves/', '/journal/hors-cadre/'];
  let pageTransition = null;
  function retainTransition(transition) {
    pageTransition = transition;
    // Native navigation still succeeds when a decorative transition is skipped
    // (reduced motion, rapid navigation, or an opt-out on the arriving page).
    transition.ready.catch(() => {});
    const release = () => { if (pageTransition === transition) pageTransition = null; };
    transition.finished.then(release, release);
  }
  function setDirection(from, to) {
    if (!from || !to) return;
    const previous = chapters.indexOf(new URL(from, location.href).pathname);
    const next = chapters.indexOf(new URL(to, location.href).pathname);
    const back = previous >= 0 && next >= 0 && next < previous;
    root.dataset.pageWay = back ? 'back' : 'forward';
    root.style.setProperty('--page-way', back ? '-1' : '1');
  }
  window.addEventListener('pageswap', event => {
    if (!event.viewTransition) return;
    retainTransition(event.viewTransition);
    if (calm()) event.viewTransition.skipTransition();
    else setDirection(location.href, event.activation?.entry?.url);
  });
  window.addEventListener('pagereveal', event => {
    if (!event.viewTransition) return;
    retainTransition(event.viewTransition);
    if (calm()) event.viewTransition.skipTransition();
    else setDirection(window.navigation?.activation?.from?.url, location.href);
  });

  const selector = 'button, a[href]';
  let press = null;
  function clearPress(release = false) {
    if (!press) return;
    const element = press.element;
    element.classList.remove('touch-held');
    if (release && !calm() && element.isConnected && !element.closest('[hidden]')) {
      element.classList.add('touch-release');
    }
    press = null;
  }
  document.addEventListener('pointerdown', event => {
    clearPress();
    if (!event.isPrimary || event.button !== 0 || calm()) return;
    const element = event.target.closest(selector);
    if (!element || element.disabled || element.closest('.viewer-stage')) return;
    element.classList.remove('touch-release');
    press = {element, x:event.clientX, y:event.clientY, id:event.pointerId};
    element.classList.add('touch-held');
  }, {passive:true});
  document.addEventListener('pointermove', event => {
    if (press && event.pointerId === press.id && Math.hypot(event.clientX - press.x, event.clientY - press.y) > 8) clearPress();
  }, {passive:true});
  document.addEventListener('pointerup', event => {
    if (press && event.pointerId === press.id) clearPress(press.element.contains(event.target));
  }, {passive:true});
  document.addEventListener('pointercancel', () => clearPress(), {passive:true});
  document.addEventListener('animationend', event => {
    if (event.animationName === 'touch-return') event.target.classList.remove('touch-release');
  });
  window.addEventListener('blur', () => clearPress());
  window.addEventListener('pagehide', () => {
    clearPress();
    document.querySelectorAll('.touch-release').forEach(element => element.classList.remove('touch-release'));
  });

  const dock = document.querySelector('.mobile-dock');
  if (dock) {
    const cursor = document.createElement('span');
    cursor.className = 'dock-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    dock.append(cursor);
    dock.classList.add('has-touch-cursor');
    const position = () => {
      const current = dock.querySelector('a[aria-current]');
      cursor.hidden = !current;
      if (current) cursor.style.translate = `${current.offsetLeft + current.offsetWidth / 2 - 14}px 0`;
    };
    new MutationObserver(position).observe(dock, {subtree:true, attributes:true, attributeFilter:['aria-current']});
    if ('ResizeObserver' in window) new ResizeObserver(position).observe(dock);
    else window.addEventListener('resize', position, {passive:true});
    position();
  }

  const fragments = document.querySelectorAll('[data-reserve-item]');
  let observer = null;
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }), {threshold:.025, rootMargin:'0px 0px -18px 0px'});
    fragments.forEach(element => {
      element.classList.add('fragment-reveal');
      if (calm()) element.classList.add('is-visible');
      else observer.observe(element);
    });
    root.classList.add('touch-ready');
  }
  const entrances = new Set();
  let compositionFrame = 0;
  function stopEntrances() {
    cancelAnimationFrame(compositionFrame);
    entrances.forEach(animation => animation.cancel());
    entrances.clear();
  }
  function recompose(container, update, toolbar, button) {
    stopEntrances();
    update(); // The new results and their count are available immediately.
    if (toolbar) {
      const header = document.querySelector('.site-header')?.offsetHeight || 72;
      const top = toolbar.getBoundingClientRect().top;
      if (top <= header + 4) {
        const target = Math.max(0, container.getBoundingClientRect().top + scrollY - header - toolbar.offsetHeight - 20);
        window.scrollTo({top:target, behavior:calm() || Math.abs(scrollY - target) > innerHeight * .75 ? 'instant' : 'smooth'});
      }
    }
    if (button) {
      const row = button.parentElement;
      if (row.scrollWidth > row.clientWidth) {
        row.scrollTo({left:Math.max(0, button.offsetLeft - row.clientWidth / 2 + button.offsetWidth / 2), behavior:calm() ? 'instant' : 'smooth'});
      }
    }
    if (calm() || !Element.prototype.animate) return;
    compositionFrame = requestAnimationFrame(() => {
      let visibleIndex = 0;
      for (const item of container.children) {
        if (item.hidden) continue;
        const rect = item.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > innerHeight) continue;
        item.classList.add('is-visible');
        const image = item.querySelector('.work-image, .photo-link');
        if (!image) continue;
        const side = visibleIndex % 2 ? 1 : -1;
        const animation = image.animate([
          {translate:`${side * 18}px 24px`,scale:'.96',opacity:.2},
          {translate:'0 0',scale:'1',opacity:1}
        ], {duration:620,delay:visibleIndex++ * 45,easing:'cubic-bezier(.2,.85,.25,1)',fill:'backwards'});
        entrances.add(animation);
        animation.finished.then(() => entrances.delete(animation), () => entrances.delete(animation));
      }
    });
  }
  function preferenceChanged() {
    if (!calm()) return;
    clearPress();
    stopEntrances();
    pageTransition?.skipTransition();
    document.querySelectorAll('.touch-release').forEach(element => element.classList.remove('touch-release'));
    fragments.forEach(element => { element.classList.add('is-visible'); observer?.unobserve(element); });
  }
  new MutationObserver(preferenceChanged).observe(root, {attributes:true, attributeFilter:['class']});
  system.addEventListener('change', preferenceChanged);
  window.CamiloMotion = {recompose};
})();
