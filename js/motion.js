/* Progressive motion: native navigation, direct touch feedback and finite entrances. */
(() => {
  'use strict';
  const root = document.documentElement;
  const system = matchMedia('(prefers-reduced-motion: reduce)');
  const calm = () => system.matches || root.classList.contains('motion-reduced');
  try { if ((sessionStorage.getItem('cr-motion') || localStorage.getItem('cr-motion')) === 'reduced') root.classList.add('motion-reduced'); } catch {}
  // Page transitions live in js/drop.js, loaded in <head> so it hears pagereveal.

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
  // A filter keeps the current arrangement on screen until the first images of the next one are decoded,
  // 400 ms at most (measured on simulated 4G: 340 to 770 ms for four to six images, under 340 ms on a desktop
  // connection). Past it, the next arrangement comes in with its images still loading; the pressed button and
  // the count have already answered the touch.
  function imagesReady(images, limit = 400) {
    const waits = images.filter(Boolean).map(image => {
      image.loading = 'eager';
      return typeof image.decode === 'function' ? image.decode().catch(() => {}) : Promise.resolve();
    });
    if (!waits.length) return Promise.resolve();
    return new Promise(resolve => {
      const timer = setTimeout(resolve, limit);
      Promise.all(waits).then(() => { clearTimeout(timer); resolve(); });
    });
  }
  // Leading positions of a grid that are on screen once the page is scrolled to `top`.
  function onScreen(container, top = scrollY) {
    const shift = top - scrollY;
    let index = 0, count = 0;
    for (const item of container.children) {
      if (item.hidden) continue;
      index++;
      const rect = item.getBoundingClientRect();
      if (rect.height && rect.top - shift < innerHeight && rect.bottom - shift > 0) count = index;
    }
    return count;
  }
  let composeToken = 0;
  // nextImages(count), optional, returns the images of the first `count` positions of the next arrangement.
  function recompose(container, update, toolbar, button, nextImages) {
    stopEntrances();
    const token = ++composeToken;
    let top = scrollY;
    if (toolbar) {
      const header = document.querySelector('.site-header')?.offsetHeight || 72;
      const toolbarTop = toolbar.getBoundingClientRect().top;
      if (toolbarTop <= header + 4) {
        top = Math.max(0, container.getBoundingClientRect().top + scrollY - header - toolbar.offsetHeight - 20);
        window.scrollTo({top, behavior:calm() || Math.abs(scrollY - top) > innerHeight * .75 ? 'instant' : 'smooth'});
      }
    }
    if (button) {
      const row = button.parentElement;
      if (row.scrollWidth > row.clientWidth) {
        row.scrollTo({left:Math.max(0, button.offsetLeft - row.clientWidth / 2 + button.offsetWidth / 2), behavior:calm() ? 'instant' : 'smooth'});
      }
    }
    const count = nextImages ? onScreen(container, top) : 0;
    if (!count) { compose(container, update); return; }
    container.setAttribute('aria-busy', 'true');
    imagesReady(nextImages(count)).then(() => { if (token === composeToken) compose(container, update); });
  }
  function compose(container, update) {
    stopEntrances();
    container.removeAttribute('aria-busy');
    update(); // The new results and their count.
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
    document.querySelectorAll('.touch-release').forEach(element => element.classList.remove('touch-release'));
    fragments.forEach(element => { element.classList.add('is-visible'); observer?.unobserve(element); });
  }
  new MutationObserver(preferenceChanged).observe(root, {attributes:true, attributeFilter:['class']});
  system.addEventListener('change', preferenceChanged);
  window.CamiloMotion = {recompose, imagesReady, onScreen};
})();
