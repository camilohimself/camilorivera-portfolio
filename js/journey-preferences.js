/* Shared preferences on pages without the home or journal controller. */
(() => {
  'use strict';
  const root = document.documentElement;
  const language = document.querySelector('.language-toggle');
  const motion = document.querySelector('.motion-toggle');
  const system = matchMedia('(prefers-reduced-motion: reduce)');
  const texts = [...document.querySelectorAll('[data-en]')].map(el => [el, el.innerHTML]);
  const attrs = ['alt', 'label', 'aria', 'content'].flatMap(kind => {
    const name = kind === 'label' || kind === 'aria' ? 'aria-label' : kind;
    return [...document.querySelectorAll(`[data-${kind}-en]`)].map(el => [el, name, el.getAttribute(name), el.getAttribute(`data-${kind}-en`)]);
  });
  const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  let reduced = read('cr-motion') === 'reduced';
  root.lang = read('cr-language') === 'en' ? 'en' : 'fr';
  function applyMotion() {
    const calm = reduced || system.matches;
    root.classList.toggle('motion-reduced', calm);
    if (!motion) return;
    motion.disabled = system.matches;
    motion.setAttribute('aria-pressed', String(calm));
    const label = root.lang === 'en' ? (calm ? 'Enable motion' : 'Reduce motion') : (calm ? 'Activer les mouvements' : 'Réduire les mouvements');
    motion.setAttribute('aria-label', label); motion.title = label;
    motion.querySelector('span').textContent = calm ? '▷' : 'Ⅱ';
  }
  function translate() {
    const en = root.lang === 'en';
    texts.forEach(([el, fr]) => { el.innerHTML = en ? el.dataset.en : fr; });
    attrs.forEach(([el, attr, fr, english]) => el.setAttribute(attr, en ? english : fr));
    if (language) { language.textContent = en ? 'FR' : 'EN'; language.setAttribute('aria-label', en ? 'Passer en français' : 'Switch to English'); }
    applyMotion(); document.dispatchEvent(new CustomEvent('crlanguage'));
  }
  language?.addEventListener('click', () => { root.lang = root.lang === 'en' ? 'fr' : 'en'; save('cr-language', root.lang); translate(); });
  motion?.addEventListener('click', () => { reduced = !reduced; save('cr-motion', reduced ? 'reduced' : 'full'); applyMotion(); });
  system.addEventListener('change', applyMotion);
  translate();
})();
