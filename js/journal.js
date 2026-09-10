/* A journal that can be read as ordinary pages, with optional motion and image viewing. */
(() => {
  'use strict';
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const root = document.documentElement;
  const isJournal = document.body.classList.contains('journal-page');
  const systemMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const copy = new Map($$('[data-en]').map(el => [el, el.innerHTML]));
  const attributes = new Map();
  const attributeKeys = [['data-alt-en', 'alt'], ['data-aria-en', 'aria-label'], ['data-content-en', 'content']];
  attributeKeys.forEach(([data, attribute]) => $$('[' + data + ']').forEach(el => {
    if (!attributes.has(el)) attributes.set(el, {});
    attributes.get(el)[attribute] = {fr: el.getAttribute(attribute), en: el.getAttribute(data)};
  }));
  const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Optional preferences. */ } };
  let userReduced = read('cr-motion') === 'reduced';
  const en = () => root.lang === 'en';
  const calm = () => root.classList.contains('motion-reduced') || systemMotion.matches;
  const text = (fr, english) => en() ? english : fr;
  let framePending = false;
  let observer;

  function translate() {
    copy.forEach((fr, el) => { el.innerHTML = en() ? el.dataset.en : fr; });
    attributes.forEach((values, el) => Object.entries(values).forEach(([attribute, value]) => el.setAttribute(attribute, en() ? value.en : value.fr)));
    if (isJournal) {
      const button = $('.language-toggle');
      button.textContent = text('EN', 'FR');
      button.setAttribute('aria-label', text('Switch to English', 'Passer en français'));
      updateMotion();
    }
    if (dialog?.open) renderPhoto();
  }

  function updateMotion() {
    if (!isJournal) return;
    const reduced = userReduced || systemMotion.matches;
    root.classList.toggle('motion-reduced', reduced);
    const button = $('.motion-toggle');
    const label = systemMotion.matches ? text('Animations réduites selon votre réglage système', 'Animations reduced by your system preference') : reduced ? text('Activer les animations', 'Enable animations') : text('Réduire les animations', 'Reduce animations');
    button.setAttribute('aria-label', label);
    button.setAttribute('aria-pressed', String(reduced));
    button.title = label;
    button.disabled = systemMotion.matches;
    $('.motion-symbol', button).textContent = reduced ? '▷' : 'Ⅱ';
    if (reduced) $$('.paper-reveal').forEach(el => el.classList.add('is-visible'));
  }

  function scrollFrame() {
    framePending = false;
    if (!isJournal || document.querySelector('dialog[open]')) return;
    const total = root.scrollHeight - innerHeight;
    $('.scroll-progress').style.transform = 'scaleX(' + (total > 0 ? scrollY / total : 0) + ')';
  }
  function requestFrame() {
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(scrollFrame);
  }

  // The image's ordinary URL remains usable when scripts are unavailable.
  const dialog = $('#archive-viewer');
  const allLinks = $$('a[data-photo]');
  const photos = [...new Map(allLinks.map(a => [a.dataset.photo, a])).values()];
  const stage = $('.archive-stage');
  const image = $('#archive-image');
  let current = 0;
  let savedScroll = 0;
  let sourceElement;
  let pushed = false;
  let returnUrl = '';
  let messageTimer;
  const viewerMotion = window.CamiloViewerMotion?.create({dialog, stage, image, reduced: calm, onStep: stepPhoto});

  function photoSlug() {
    if (!location.hash.startsWith('#fragment/')) return null;
    try { return decodeURIComponent(location.hash.slice(10)); } catch { return null; }
  }
  function setZoom(zoomed) {
    stage.classList.toggle('is-zoomed', zoomed);
    stage.tabIndex = zoomed ? 0 : -1;
    stage.setAttribute('aria-label', text('Image agrandie, faites défiler pour explorer', 'Enlarged image, scroll to explore'));
    $('.archive-zoom').setAttribute('aria-pressed', String(zoomed));
    $('.archive-zoom').textContent = zoomed ? text('Réduire −', 'Reduce −') : text('Agrandir +', 'Enlarge +');
    stage.scrollTo({top: 0, left: 0, behavior: 'instant'});
  }
  function renderPhoto() {
    const link = photos[current];
    if (!link) return;
    const original = $('img', link);
    const nextSrc = link.href;
    if (image.src !== nextSrc) {
      stage.classList.add('image-loading');
      $('.viewer-image-error', dialog).hidden = true;
      image.src = nextSrc;
    }
    image.alt = original.alt;
    const caption = en() ? link.dataset.captionEn : link.dataset.captionFr;
    $('#archive-title').textContent = caption || text('Fragment du journal', 'Journal fragment');
    $('#archive-description').textContent = original.alt;
    $('#archive-counter').textContent = (current + 1) + ' / ' + photos.length;
    setZoom(false);
  }
  function showPhoto(index, source, addHistory = true) {
    if (!dialog || typeof dialog.showModal !== 'function') return;
    const wasOpen = dialog.open;
    current = index;
    if (!dialog.open) {
      sourceElement = source || document.activeElement;
      savedScroll = scrollY;
      returnUrl = location.pathname + location.search + (photoSlug() ? '' : location.hash);
      // Record the reading position before fixing the body for the modal.
      // Otherwise the browser stores zero in the previous history entry.
      if (addHistory) history.pushState({journalPhoto: true}, '', '#fragment/' + photos[current].dataset.photo);
      pushed = Boolean(history.state?.journalPhoto);
      dialog.showModal();
      document.body.style.top = '-' + savedScroll + 'px';
      document.body.classList.add('viewer-open');
      $('.archive-close').focus({preventScroll: true});
    }
    renderPhoto();
    if (!wasOpen || viewerMotion?.closing) viewerMotion?.open(sourceElement);
  }
  function hidePhoto() {
    if (!dialog?.open) return;
    viewerMotion?.reset();
    dialog.close();
    document.body.classList.remove('viewer-open');
    document.body.style.top = '';
    window.scrollTo({top: savedScroll, behavior: 'instant'});
    $('.archive-copy-fallback').hidden = true;
    $('.archive-message').textContent = '';
    clearTimeout(messageTimer);
    if (sourceElement?.isConnected) sourceElement.focus({preventScroll: true});
    requestFrame();
  }
  function closePhoto() {
    const goBack = pushed && Boolean(photoSlug());
    const finish = () => {
      hidePhoto();
      if (goBack) history.back();
      else history.replaceState(null, '', returnUrl || location.pathname + location.search);
    };
    if (viewerMotion) viewerMotion.close(finish);
    else finish();
  }
  function syncPhoto() {
    const slug = photoSlug();
    const index = photos.findIndex(a => a.dataset.photo === slug);
    if (index >= 0) showPhoto(index, null, false);
    else if (viewerMotion?.closing) viewerMotion.close(hidePhoto, true);
    else hidePhoto();
  }
  function stepPhoto(step) {
    if (!dialog?.open || !photos.length || viewerMotion?.closing) return;
    const render = () => {
      current = (current + step + photos.length) % photos.length;
      renderPhoto();
      history.replaceState({journalPhoto: true}, '', '#fragment/' + photos[current].dataset.photo);
    };
    if (viewerMotion) viewerMotion.step(step, render);
    else render();
  }
  function installViewer() {
    if (!dialog) return;
    allLinks.forEach(link => {
      link.setAttribute('aria-haspopup', 'dialog');
      link.addEventListener('click', event => {
        if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || typeof dialog.showModal !== 'function') return;
        event.preventDefault();
        showPhoto(photos.findIndex(a => a.dataset.photo === link.dataset.photo), link);
      });
    });
    image.addEventListener('load', () => stage.classList.remove('image-loading'));
    image.addEventListener('error', () => {
      stage.classList.remove('image-loading');
      $('.viewer-image-error', dialog).hidden = false;
    });
    $('.archive-close').addEventListener('click', closePhoto);
    dialog.addEventListener('cancel', event => { event.preventDefault(); closePhoto(); });
    $('.archive-prev').addEventListener('click', () => stepPhoto(-1));
    $('.archive-next').addEventListener('click', () => stepPhoto(1));
    const togglePhotoZoom = () => {
      if (viewerMotion?.closing) return;
      viewerMotion?.reset();
      setZoom(!stage.classList.contains('is-zoomed'));
    };
    $('.archive-zoom').addEventListener('click', togglePhotoZoom);
    image.addEventListener('click', togglePhotoZoom);
    dialog.addEventListener('keydown', event => {
      if (event.key === 'Tab') {
        const controls = $$('a[href],button:not(:disabled),input,[tabindex="0"]', dialog).filter(el => el.getClientRects().length);
        const first = controls[0]; const last = controls[controls.length - 1];
        if ((!event.shiftKey && document.activeElement === last) || (event.shiftKey && document.activeElement === first) || !dialog.contains(document.activeElement)) {
          event.preventDefault(); (event.shiftKey ? last : first).focus();
        }
      }
      if (event.target.matches('input') || stage.classList.contains('is-zoomed')) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault(); stepPhoto(event.key === 'ArrowRight' ? 1 : -1);
      }
    });
    if (!viewerMotion) {
      let pointer;
      stage.addEventListener('pointerdown', event => {
        if (!event.isPrimary || event.pointerType === 'mouse' || stage.classList.contains('is-zoomed')) { pointer = null; return; }
        pointer = {id: event.pointerId, x: event.clientX, y: event.clientY};
        stage.setPointerCapture(event.pointerId);
      });
      stage.addEventListener('pointerup', event => {
        if (!pointer || pointer.id !== event.pointerId) return;
        const dx = event.clientX - pointer.x; const dy = event.clientY - pointer.y;
        pointer = null;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) stepPhoto(dx < 0 ? 1 : -1);
      });
      stage.addEventListener('pointercancel', () => { pointer = null; });
    }
    $('.archive-copy').addEventListener('click', async () => {
      // Copy the current origin so local previews do not claim to be published pages.
      const url = location.href;
      try {
        await navigator.clipboard.writeText(url);
        $('.archive-message').textContent = text('Lien copié', 'Link copied');
        clearTimeout(messageTimer);
        messageTimer = setTimeout(() => { $('.archive-message').textContent = ''; }, 2500);
      } catch {
        $('.archive-copy-fallback').hidden = false;
        $('#archive-url').value = url;
        $('#archive-url').focus(); $('#archive-url').select();
      }
    });
    $('.archive-link-close').addEventListener('click', () => {
      $('.archive-copy-fallback').hidden = true;
      $('.archive-copy').focus();
    });
    window.addEventListener('popstate', syncPhoto);
    window.addEventListener('hashchange', syncPhoto);
    syncPhoto();
  }

  if (isJournal) {
    root.lang = read('cr-language') === 'en' ? 'en' : 'fr';
    $('.language-toggle').addEventListener('click', () => {
      root.lang = en() ? 'fr' : 'en';
      save('cr-language', root.lang);
    });
    $('.motion-toggle').addEventListener('click', () => {
      userReduced = !userReduced;
      save('cr-motion', userReduced ? 'reduced' : 'full');
      updateMotion();
    });
    systemMotion.addEventListener('change', updateMotion);
    $('#year').textContent = new Date().getFullYear();
    window.addEventListener('scroll', requestFrame, {passive: true});
    window.addEventListener('resize', requestFrame, {passive: true});
  }
  translate();
  new MutationObserver(translate).observe(root, {attributes: true, attributeFilter: ['lang']});
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting || calm()) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }), {threshold: .04, rootMargin: '0px 0px 25px 0px'});
    root.classList.add('journal-ready');
    $$('.paper-reveal').forEach(el => observer.observe(el));
  }
  installViewer();
  requestFrame();
})();
