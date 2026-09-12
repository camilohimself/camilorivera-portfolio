/* Small enhancements over ordinary links, details and scrollable image strips. */
(() => {
  'use strict';
  const root = document.documentElement;
  const system = matchMedia('(prefers-reduced-motion: reduce)');
  const calm = () => system.matches || root.classList.contains('motion-reduced');
  const english = () => root.lang === 'en';
  const scenes = [...document.querySelectorAll('.ink-scene')];
  const visible = new Set();
  let animationFrame = 0;

  function paint() {
    animationFrame = 0;
    if (calm() || document.hidden || document.querySelector('dialog[open]')) return;
    for (const scene of visible) {
      const rect = scene.getBoundingClientRect();
      const progress = (innerHeight - rect.top) / (innerHeight + rect.height) - .5;
      scene.style.setProperty('--ink-drift', `${Math.round(progress * 38)}px`);
    }
  }
  function requestPaint() {
    if (!animationFrame && visible.size && !calm()) animationFrame = requestAnimationFrame(paint);
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      requestPaint();
    });
    scenes.forEach(scene => observer.observe(scene));
    window.addEventListener('scroll', requestPaint, {passive:true});
    window.addEventListener('resize', requestPaint, {passive:true});
  }
  const depths = [];
  function showDepth(scene, button, deep) {
    scene.classList.toggle('is-deep', deep);
    button.setAttribute('aria-pressed', String(deep));
    const sign = button.querySelector('[aria-hidden]');
    if (sign) sign.textContent = deep ? '−' : '+';
  }
  for (const scene of scenes) {
    const button = scene.querySelector('.ink-depth');
    if (!button) continue;
    // La feuille de style masque ce bouton en mouvement réduit ; ne pas le dévoiler dans ce cas.
    button.hidden = calm();
    depths.push({scene, button});
    button.addEventListener('click', () => showDepth(scene, button, !scene.classList.contains('is-deep')));
  }

  const sequences = [];
  for (const details of document.querySelectorAll('.paint-sequence')) {
    const rail = details.querySelector('.process-rail');
    const controls = details.querySelector('.sequence-tools');
    if (!rail || !controls || !rail.children.length) continue;
    const slides = [...rail.children];
    const range = controls.querySelector('input');
    const previous = controls.querySelector('[data-sequence-prev]');
    const next = controls.querySelector('[data-sequence-next]');
    const status = controls.querySelector('.sequence-status');
    if (!range || !previous || !next || !status) continue;
    let current = 0;
    let raf = 0;
    controls.hidden = false;

    function update() {
      raf = 0;
      if (!details.open || !rail.clientWidth) return;
      const width = slides[0].getBoundingClientRect().width + (parseFloat(getComputedStyle(rail).columnGap) || 0);
      current = Math.max(0, Math.min(slides.length - 1, Math.round(rail.scrollLeft / width)));
      range.value = current;
      range.setAttribute('aria-valuetext', `${english() ? 'State' : 'État'} ${current + 1} / ${slides.length}`);
      status.textContent = `${String(current + 1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
      previous.disabled = current === 0;
      next.disabled = current === slides.length - 1;
    }
    function go(index, smooth = true) {
      const selected = Math.max(0, Math.min(slides.length - 1, index));
      // Relative rectangles are independent of the nearest CSS offset parent.
      const left = rail.scrollLeft + slides[selected].getBoundingClientRect().left - rail.getBoundingClientRect().left;
      rail.scrollTo({left, behavior:smooth && !calm() ? 'smooth' : 'instant'});
      if (!smooth) update();
    }
    previous.addEventListener('click', () => go(current - 1));
    next.addEventListener('click', () => go(current + 1));
    range.addEventListener('input', () => go(Number(range.value), false));
    rail.addEventListener('scroll', () => {if (!raf) raf = requestAnimationFrame(update);}, {passive:true});
    details.addEventListener('toggle', update);
    // Closing an inactive sequence keeps it cheap; reopening retains its place.
    if ('ResizeObserver' in window) new ResizeObserver(update).observe(rail);
    sequences.push(update);
    update();
  }

  function preferenceChanged() {
    const quiet = calm();
    if (quiet) {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      scenes.forEach(scene => scene.style.removeProperty('--ink-drift'));
    } else requestPaint();
    for (const {scene, button} of depths) {
      button.hidden = quiet;
      if (quiet && scene.classList.contains('is-deep')) showDepth(scene, button, false);
    }
    sequences.forEach(update => update());
  }
  system.addEventListener('change', preferenceChanged);
  new MutationObserver(preferenceChanged).observe(root, {attributes:true, attributeFilter:['class','lang']});
  window.addEventListener('pagehide', () => {
    // Remettre le compteur à zéro : sans cela requestPaint() ne replanifie plus après un retour depuis le cache.
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  });
})();
