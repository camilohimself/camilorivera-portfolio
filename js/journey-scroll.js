/* Each chapter keeps a different pace; all scrolling remains native. */
(() => {
  'use strict';
  const root = document.documentElement;
  const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
  // Les rapprochements ajoutés le 13.09 restent immobiles : compter leurs photos
  // inverserait l'alternance haut/bas de toutes les images suivantes.
  const photos = [...document.querySelectorAll('.archive-photo:not(.association-photo)')];
  const openings = [...document.querySelectorAll('.chapter-opening,.journal-cover-opening')];
  const ornaments = [...document.querySelectorAll('[data-journey-motion]')];
  let pending = 0;
  const calm = () => reducedQuery.matches || root.classList.contains('motion-reduced');
  const clamp = value => Math.max(-1, Math.min(1, value));
  function paint() {
    pending = 0;
    if (document.hidden || document.querySelector('dialog[open]')) return;
    const reduced = calm();
    const amplitude = innerWidth <= 700 ? 16 : 36;
    photos.forEach((photo, index) => {
      if (photo.closest('[hidden]')) return;
      const box = photo.getBoundingClientRect();
      if (box.bottom < -100 || box.top > innerHeight + 100) return;
      // offset from the section avoids reading back the translated photo position.
      const parent = photo.parentElement.getBoundingClientRect();
      const progress = clamp((innerHeight / 2 - parent.top - parent.height / 2) / innerHeight);
      photo.style.setProperty('--drift-y', reduced ? '0px' : `${progress * amplitude * (index % 2 ? -1 : 1)}px`);
    });
    openings.forEach(opening => {
      const box = opening.getBoundingClientRect();
      if (box.bottom < 0 || box.top > innerHeight) return;
      const progress = Math.max(0, Math.min(1, -box.top / Math.max(1, box.height)));
      opening.style.setProperty('--flow-progress', reduced ? 0 : progress);
      opening.style.setProperty('--opening-drift', reduced ? '0px' : `${progress * 70}px`);
      opening.style.setProperty('--opening-turn', reduced ? '0deg' : `${progress * 13}deg`);
    });
    ornaments.forEach((el, index) => {
      const parent = el.parentElement.getBoundingClientRect();
      if (parent.bottom < 0 || parent.top > innerHeight) return;
      const progress = clamp((innerHeight / 2 - parent.top - parent.height / 2) / innerHeight);
      const ornamentAmplitude = innerWidth <= 700 ? 24 : 72;
      el.style.setProperty('--drift-y', reduced ? '0px' : `${progress * ornamentAmplitude * (index % 2 ? -1 : 1)}px`);
    });
  }
  function request() { if (!pending) pending = requestAnimationFrame(paint); }
  window.addEventListener('scroll', request, {passive: true});
  window.addEventListener('resize', request, {passive: true});
  reducedQuery.addEventListener('change', request);
  new MutationObserver(request).observe(root, {attributes: true, attributeFilter: ['class', 'lang']});
  document.addEventListener('visibilitychange', request);
  window.addEventListener('pageshow', request);
  request();
})();
