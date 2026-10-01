(() => {
  'use strict';
  const html = document.documentElement;
  const motion = document.querySelector('#motion-toggle');
  const language = document.querySelector('#language-toggle');
  const systemMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const video = document.querySelector('#inner-film');
  const filmToggle = document.querySelector('#film-toggle');
  const filmSurfaceToggle = document.querySelector('#film-surface-toggle');
  const soundToggle = document.querySelector('#sound-toggle');
  const filmError = document.querySelector('#film-error');
  const wayfinder = document.querySelector('.wayfinder');
  const memorySection = document.querySelector('.memory');
  const memoryCards = [...document.querySelectorAll('.memory-card')];
  const filmSection = document.querySelector('.moving-image');
  const filmViewport = filmSection?.querySelector('.hero-scene') || filmSection;
  const texts = [...document.querySelectorAll('[data-en]')].map(el => [el, el.innerHTML]);
  const labels = [...document.querySelectorAll('[data-label-en]')].map(el => [el, el.getAttribute('aria-label')]);
  const alts = [...document.querySelectorAll('[data-alt-en]')].map(el => [el, el.alt]);
  let reduced = false, chosenReduced = false, lang = 'fr', pending = false;
  let filmVisible = false, filmUserPaused = false, filmUserStarted = false, filmPending = false, filmBlocked = false;
  const read = key => { try { return localStorage.getItem(key) || localStorage.getItem(key.replace('cr-', 'v01-')); } catch { return null; } };
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  const choose = (fr, en) => lang === 'fr' ? fr : en;
  const hasOpenDialog = () => Boolean(document.querySelector('dialog[open]'));
  chosenReduced = read('cr-motion') === 'reduced';
  lang = read('cr-language') === 'en' ? 'en' : 'fr';
  if (video) video.muted = true;

  function applyLanguage() {
    html.lang = lang;
    save('cr-language', lang);
    texts.forEach(([el, fr]) => { el.innerHTML = lang === 'en' ? el.dataset.en : fr; });
    labels.forEach(([el, fr]) => el.setAttribute('aria-label', lang === 'en' ? el.dataset.labelEn : fr));
    alts.forEach(([el, fr]) => { el.alt = lang === 'en' ? el.dataset.altEn : fr; });
    if (language) {
      language.textContent = lang === 'fr' ? 'EN' : 'FR';
      language.setAttribute('aria-label', choose('Switch to English', 'Passer en français'));
    }
    document.title = choose('Camilo Rivera — Espace intérieur', 'Camilo Rivera — Inner space');
    syncMotionLabel(); syncFilm();
    document.dispatchEvent(new CustomEvent('crlanguage'));
    schedule();
  }
  function syncMotionLabel() {
    if (!motion) return;
    const label = reduced ? choose('Mouvements réduits', 'Reduced motion') : choose('Réduire les mouvements', 'Reduce motion');
    motion.setAttribute('aria-label', label); motion.title = label;
    motion.setAttribute('aria-pressed', String(reduced));
    motion.disabled = systemMotion.matches;
    const icon = motion.querySelector('span');
    if (icon) icon.textContent = reduced ? '▷' : 'Ⅱ';
  }
  function applyMotion() {
    const wasReduced = reduced;
    reduced = chosenReduced || systemMotion.matches;
    save('cr-motion', chosenReduced ? 'reduced' : 'full');
    html.classList.toggle('motion-reduced', reduced);
    if (reduced && !wasReduced) filmUserStarted = false;
    updatePlayback();
    syncMotionLabel(); schedule();
  }
  motion?.addEventListener('click', () => { chosenReduced = !chosenReduced; save('cr-motion', chosenReduced ? 'reduced' : 'full'); applyMotion(); });
  systemMotion.addEventListener('change', applyMotion);
  language?.addEventListener('click', () => { lang = lang === 'fr' ? 'en' : 'fr'; save('cr-language', lang); applyLanguage(); });

  const clamp = x => Math.max(0, Math.min(1, x));
  function paint() {
    pending = false;
    if (document.hidden || hasOpenDialog()) return;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    html.style.setProperty('--depth', `${clamp(scrollY / Math.max(1, total)) * 82}%`);
    if (wayfinder) wayfinder.hidden = filmSection ? filmSection.getBoundingClientRect().bottom > innerHeight * .45 : scrollY < innerHeight * .6;
    if (!memorySection) return;
    if (reduced) {
      memorySection.style.setProperty('--well-y', '0px');
      memorySection.style.setProperty('--well-turn', '0deg');
      memoryCards.forEach(card => card.style.setProperty('--drift-y', '0px'));
    } else {
      const m = memorySection.getBoundingClientRect();
      if (m.bottom > 0 && m.top < innerHeight) {
        const t = clamp((innerHeight - m.top) / (m.height + innerHeight));
        const mobile = innerWidth <= 700;
        memorySection.style.setProperty('--well-y', `${(t - .5) * (mobile ? 24 : 48)}px`);
        memorySection.style.setProperty('--well-turn', `${-6 + t * 12}deg`);
        memoryCards.forEach((card, index) => {
          const amplitude = mobile ? 28 : 70;
          card.style.setProperty('--drift-y', `${(t - .5) * amplitude * (index % 2 ? -1 : 1)}px`);
        });
      }
    }
  }
  function schedule() {
    if (!pending && !document.hidden && !hasOpenDialog()) {
      pending = true;
      requestAnimationFrame(paint);
    }
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('load', schedule);
  document.fonts.ready.then(schedule);

  function syncFilm() {
    if (!video) return;
    const label = video.paused ? choose('Lire le film', 'Play the film') : choose('Mettre en pause', 'Pause the film');
    const toggleLabel = filmToggle?.querySelector('span');
    if (toggleLabel) toggleLabel.textContent = label;
    const toggleIcon = filmToggle?.querySelector('[aria-hidden]');
    if (toggleIcon) toggleIcon.textContent = video.paused ? '▷' : 'Ⅱ';
    if (filmError) filmError.textContent = filmBlocked ? choose('Appuyez pour lancer le film.', 'Press to play the film.') : '';
    filmSurfaceToggle?.setAttribute('aria-label', label);
    filmSection?.classList.toggle('film-is-playing', !video.paused);
    if (soundToggle) {
      soundToggle.textContent = video.muted ? choose('Son coupé', 'Sound off') : choose('Son activé', 'Sound on');
      soundToggle.setAttribute('aria-pressed', String(!video.muted));
    }
  }
  function shouldPlayFilm() {
    const economy = navigator.connection?.saveData || /^(slow-)?2g$/.test(navigator.connection?.effectiveType || '');
    return filmVisible && !document.hidden && !hasOpenDialog() &&
      !filmUserPaused && !filmBlocked && (filmUserStarted || (!reduced && !economy));
  }
  function updatePlayback() {
    if (!video) return;
    if (!shouldPlayFilm()) { video.pause(); syncFilm(); return; }
    // Pick one file when playback first becomes possible; resizing keeps it.
    if (!video.getAttribute('src')) {
      const compact = innerWidth <= 700 || navigator.connection?.saveData ||
        /^(slow-)?2g$/.test(navigator.connection?.effectiveType || '') || navigator.connection?.effectiveType === '3g';
      const source = compact ? video.dataset.mobileSrc : video.dataset.desktopSrc;
      if (source) video.src = source;
    }
    if (filmPending || !video.paused) return;
    filmPending = true;
    Promise.resolve(video.play()).then(() => { if (filmError) filmError.textContent = ''; }).catch(error => {
      if (error.name !== 'AbortError') {
        filmBlocked = true;
        if (filmError) filmError.textContent = choose('Appuyez pour lancer le film.', 'Press to play the film.');
      }
    }).finally(() => {
      filmPending = false;
      if (!shouldPlayFilm()) video.pause();
      else if (video.paused) updatePlayback();
      syncFilm();
    });
  }
  function toggleFilm() {
    if (!video) return;
    if (!video.paused || filmPending) {
      filmUserPaused = true;
      video.pause();
    } else {
      filmUserPaused = false;
      filmUserStarted = true;
      filmBlocked = false;
      if (filmError) filmError.textContent = '';
      if (video.error) video.load();
      updatePlayback();
    }
    syncFilm();
  }
  filmToggle?.addEventListener('click', toggleFilm);
  filmSurfaceToggle?.addEventListener('click', toggleFilm);
  soundToggle?.addEventListener('click', () => { if (video) video.muted = !video.muted; syncFilm(); });
  video?.addEventListener('play', syncFilm); video?.addEventListener('pause', syncFilm);
  if (video && filmSection) {
    new IntersectionObserver(entries => {
      filmVisible = entries[0].isIntersecting && entries[0].intersectionRatio >= .2;
      updatePlayback();
    }, { threshold: [0, .2] }).observe(filmViewport);
  }
  function syncActivity() { updatePlayback(); schedule(); }
  new MutationObserver(syncActivity).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });
  document.addEventListener('visibilitychange', syncActivity);
  navigator.connection?.addEventListener?.('change', updatePlayback);
  window.addEventListener('pagehide', () => video?.pause());
  window.addEventListener('pageshow', syncActivity);
  applyMotion(); applyLanguage();
})();
