/* Silent films: attach one source on demand and respect viewing preferences. */
(() => {
  'use strict';
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const root = document.documentElement;
  const systemMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const reducedMotion = () => systemMotion.matches || root.classList.contains('motion-reduced');
  const copy = {
    fr: {filmPlay: 'Lire le film', filmPause: 'Pause', filmPlayLabel: 'Lire la vidéo sans son', filmPauseLabel: 'Mettre la vidéo en pause', filmError: 'Le film n’a pas pu être chargé. Vous pouvez réessayer.'},
    en: {filmPlay: 'Play the film', filmPause: 'Pause', filmPlayLabel: 'Play the silent video', filmPauseLabel: 'Pause the video', filmError: 'The film could not be loaded. You can try again.'}
  };
  const t = key => copy[root.lang === 'en' ? 'en' : 'fr'][key];
  function initFilm(scope) {
    const film = $('video', scope);
    const frame = $('.film-frame', scope);
    const button = $('.film-toggle', scope);
    const message = $('.film-message', scope);
    const connection = navigator.connection;
    let inView = false;
    let visibleOnDemand = false;
    let userPaused = false;
    let userStarted = false;
    let blocked = false;
    let failed = false;
    let pendingPlay = null;
    let lastReduced = reducedMotion();
    let lastEconomy = saveBandwidth();
    let openingReady = !scope.hasAttribute('data-film-defer');

    function saveBandwidth() {
      return Boolean(connection?.saveData || /^(slow-)?2g$/.test(connection?.effectiveType || ''));
    }
    function shouldPlay() {
      return (userStarted ? visibleOnDemand : inView) && !document.hidden && !document.querySelector('dialog[open]') && !userPaused && !blocked &&
        (userStarted || (openingReady && !reducedMotion() && !saveBandwidth()));
    }
    function updateButton() {
      const playing = !film.paused || Boolean(pendingPlay && shouldPlay());
      button.classList.toggle('is-playing', playing);
      button.setAttribute('aria-label', t(playing ? 'filmPauseLabel' : 'filmPlayLabel'));
      $('span', button).textContent = t(playing ? 'filmPause' : 'filmPlay');
      message.textContent = failed ? t('filmError') : '';
    }
    function sync() {
      if (!shouldPlay()) {
        film.pause();
        updateButton();
        return;
      }
      // No source is attached until the film is visible and playback is allowed.
      // The chosen file remains in use after a resize to avoid a second download.
      if (!film.getAttribute('src')) {
        film.muted = true;
        film.defaultMuted = true;
        film.volume = 0;
        const compact = innerWidth <= 700 || saveBandwidth() || connection?.effectiveType === '3g';
        film.src = compact ? film.dataset.mobileSrc : film.dataset.desktopSrc;
      }
      if (!film.paused || pendingPlay) {
        updateButton();
        return;
      }
      const attempt = Promise.resolve(film.play());
      pendingPlay = attempt;
      updateButton();
      attempt.catch(error => {
        if (pendingPlay !== attempt) return;
        // A viewport exit can abort a pending play. Browser autoplay refusals
        // wait for a deliberate tap instead of retrying in a loop.
        if (error.name !== 'AbortError') blocked = true;
      }).finally(() => {
        if (pendingPlay !== attempt) return;
        pendingPlay = null;
        if (!shouldPlay()) film.pause();
        else if (film.paused) sync();
        updateButton();
      });
    }
    function preferencesChanged() {
      const calm = reducedMotion();
      const economy = saveBandwidth();
      if ((calm && !lastReduced) || (economy && !lastEconomy)) userStarted = false;
      lastReduced = calm;
      lastEconomy = economy;
      sync();
    }
    // The opening poster and text get the connection first. A deliberate play
    // still starts immediately, including in data-saving and reduced motion.
    if (!openingReady) {
      const afterLoad = () => setTimeout(() => { openingReady = true; sync(); }, 900);
      if (document.readyState === 'complete') afterLoad();
      else window.addEventListener('load', afterLoad, {once:true});
    }
    button.hidden = false;
    button.addEventListener('click', () => {
      if (!failed && (!film.paused || (pendingPlay && shouldPlay()))) {
        userPaused = true;
      } else {
        userPaused = false;
        userStarted = true;
        blocked = false;
        if (failed) {
          pendingPlay = null;
          film.pause();
          failed = false;
          film.removeAttribute('src');
          film.load();
        }
      }
      sync();
    });
    film.addEventListener('playing', () => {
      if (!shouldPlay()) film.pause();
      else frame.classList.add('has-film');
      updateButton();
    });
    film.addEventListener('pause', updateButton);
    film.addEventListener('error', () => {
      failed = true;
      blocked = true;
      film.pause();
      frame.classList.remove('has-film');
      updateButton();
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        inView = entries[0].isIntersecting && entries[0].intersectionRatio >= .25;
        // A tap on the controls can leave just the bottom of a tall background
        // visible. Honour that request while any of the image remains on screen.
        visibleOnDemand = entries[0].isIntersecting && entries[0].intersectionRatio > 0;
        sync();
      }, {threshold: [0, .01, .25]}).observe(frame);
    } else {
      const checkVisibility = () => {
        const rect = frame.getBoundingClientRect();
        inView = rect.top < innerHeight * .75 && rect.bottom > innerHeight * .25;
        visibleOnDemand = rect.top < innerHeight && rect.bottom > 0;
        sync();
      };
      window.addEventListener('scroll', checkVisibility, {passive: true});
      window.addEventListener('resize', checkVisibility, {passive: true});
      checkVisibility();
    }
    document.addEventListener('visibilitychange', sync);
    window.addEventListener('pagehide', () => film.pause());
    window.addEventListener('pageshow', sync);
    connection?.addEventListener?.('change', preferencesChanged);
    new MutationObserver(preferencesChanged).observe(root, {attributes: true, attributeFilter: ['lang', 'class']});
    document.querySelectorAll('dialog').forEach(dialog => new MutationObserver(sync).observe(dialog, {attributes: true, attributeFilter: ['open']}));
    updateButton();
  }

  document.querySelectorAll('[data-film]').forEach(initFilm);
})();
