/* Camilo Rivera — collection, visionneuse et mouvement au défilement. */
(() => {
  'use strict';

  const SITE = 'https://www.camilorivera.ch/';
  const EMAIL = 'camrivera@protonmail.com';
  const PAGE_SIZE = 12;
  const CATEGORIES = ['paintings', 'encres', 'shooting'];
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const root = document.documentElement;
  const grid = $('#gallery-grid');
  const viewer = $('#viewer');
  const stage = $('#viewer-stage');
  const viewerImage = $('#viewer-image');
  const systemMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const originalCopy = new Map($$('[data-i18n]').map(el => [el, el.innerHTML]));
  const originalAttributes = new Map();
  let language = 'fr';
  let works = [];
  let bySlug = new Map();
  let currentFilter = new URLSearchParams(location.search).get('collection') || 'all';
  if (!CATEGORIES.includes(currentFilter)) currentFilter = 'all';
  let visibleCount = PAGE_SIZE;
  let collectionLoading = false;
  let sourceElement = null;
  let viewerWorks = [];
  let viewerIndex = 0;
  let viewerPushed = false;
  let returnUrl = '';
  let savedScroll = 0;
  let shareTimer;
  let requestedFrame = false;
  let userReduced = readPreference('cr-motion') === 'reduced';

  const english = {
    location: 'Bramois, Valais · Switzerland', works: 'The works', about: 'About', contact: 'Contact',
    heroEyebrow: 'Scattered notes of a painter', heroLine1: 'Paint.', heroLine2: 'Keep <em>traces.</em>',
    heroDescription: 'Painting is something that never lies.',
    heroSignature: 'An artist born in Chile, rooted in Valais.',
    collection: 'The collection', galleryTitle: 'What the gesture<br><em>leaves behind.</em>',
    galleryIntro: 'Texture, line, silence.<br> Each work, another way<br> of seeing.',
    allWorks: 'The works', paintings: 'Paintings', inks: 'Inks', studio: 'The studio',
    galleryTip: 'Something catches your eye? Come closer.',
    galleryError: 'The full collection could not be loaded. You can still explore these first works.',
    retry: 'Try again', loadMore: 'Continue exploring',
    matterKicker: 'Inside the gesture', matterLine1: 'It all begins', matterLine2: 'with a gesture.',
    matterDetail: 'Ink on paper · In the studio', matterNote: 'Ink settles. A figure emerges.',
    filmSilent: 'Silent film',
    filmDescription: 'Seen from above, a figure is drawn in ink, then blue and purple inks spread across the paper. The film ends on the finished work. There is no sound.',
    behindWorks: 'Behind the works', portraitCaption: 'In the studio, Bramois',
    aboutTitle: 'Paint.<br>Draw.<br><em>Build.</em>',
    aboutLead: 'Born in Chile. Raised in Valais.<br>And always, the need to create.',
    aboutBody1: 'I have been painting for about ten years. First in oils: the texture, the gesture, the abstraction. Then came India ink, and with it, the figure. A more exposed, more direct line.',
    aboutBody2: 'That same impulse leads me to create websites and applications at OSOM Labs, the agency I founded in Bramois. From canvas to code, starting with nothing and building something that holds.',
    discoverOsom: 'The other side of the gesture: OSOM Labs',
    studioNotebook: 'Studio notebook', studioTitle: 'Where it all<br><em>takes shape.</em>', visitStudio: 'Step into the studio',
    conversation: 'The conversation continues', contactTitle: 'A work.<br>An idea.<br><em>Let’s talk.</em>',
    contactText: 'A question about a work, a collaboration,<br>or simply a wish to connect.',
    share: 'Share', close: 'Close', imageError: 'The image could not be loaded.',
    inquire: 'Ask about this work', zoom: 'Enlarge', viewerHint: 'Swipe to explore', copyLink: 'Copy this link'
  };
  const labels = {
    fr: {
      title: 'Camilo Rivera — Peindre et garder des traces',
      technique: {paintings: 'Huile sur toile', encres: 'Encre de Chine', shooting: 'Photographie d’atelier'},
      loading: 'La collection se prépare…', images: 'images', of: 'sur',
      unknown: 'Cette œuvre ne figure pas dans la collection.', copied: 'Lien copié',
      zoomIn: 'Agrandir', zoomOut: 'Réduire', motionOff: 'Réduire les animations',
      motionOn: 'Activer les animations', systemMotion: 'Animations réduites selon votre réglage système',
      selection: 'Les œuvres — huile sur toile et encre de Chine.',
      paintings: 'La matière, le geste, l’abstraction.', encres: 'Le trait, la figure, le vide.',
      shooting: 'Le quotidien de l’atelier, à Bramois.',
      studioTitle: 'À l’atelier', inquiry: 'À propos de', imageAlt: 'de Camilo Rivera',
      network: 'La collection n’a pas pu être chargée.', available: 'Disponible',
      stage: 'Image agrandie, faites défiler pour explorer'
    },
    en: {
      title: 'Camilo Rivera — Paint and keep traces',
      technique: {paintings: 'Oil on canvas', encres: 'India ink', shooting: 'Studio photograph'},
      loading: 'Preparing the collection…', images: 'images', of: 'of',
      unknown: 'This work could not be found in the collection.', copied: 'Link copied',
      zoomIn: 'Enlarge', zoomOut: 'Reduce', motionOff: 'Reduce animations',
      motionOn: 'Enable animations', systemMotion: 'Animations reduced by your system preference',
      selection: 'The works — oil on canvas and India ink.',
      paintings: 'Texture, gesture, abstraction.', encres: 'Line, figure, empty space.',
      shooting: 'Everyday moments in the studio, in Bramois.',
      studioTitle: 'In the studio', inquiry: 'About', imageAlt: 'by Camilo Rivera',
      network: 'The collection could not be loaded.', available: 'Available',
      stage: 'Enlarged image, scroll to explore'
    }
  };
  const attributeTranslations = {
    '.skip-link': {text: 'Skip to content'},
    '.wordmark[aria-label]': {'aria-label': 'Camilo Rivera, home'},
    '.desktop-nav': {'aria-label': 'Main navigation'},
    '.mobile-dock': {'aria-label': 'Mobile navigation'},
    '.gallery-filters': {'aria-label': 'Filter the collection'},
    '#geste .film-poster': {alt: 'An ink figure with washes of blue and purple, in the process of being created'},
    '#atelier-film': {'aria-label': 'A figure takes shape in ink'},
    '.about-portrait img': {alt: 'Camilo Rivera working in his studio'},
    '.studio-photo': {'aria-label': 'Explore the studio photographs'},
    '.studio-photo img': {alt: 'A moment in Camilo Rivera’s studio'},
    '.contact-round': {'aria-label': 'Write to Camilo Rivera'},
    '.back-top': {'aria-label': 'Back to top'},
    '.viewer-share': {'aria-label': 'Share this work'},
    '.viewer-close': {'aria-label': 'Close the viewer'},
    '.viewer-prev': {'aria-label': 'Previous work'},
    '.viewer-next': {'aria-label': 'Next work'},
    '.share-fallback-close': {'aria-label': 'Close the share link'}
  };

  function readPreference(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }
  function savePreference(key, value) {
    try { localStorage.setItem(key, value); } catch { /* Preferences are optional. */ }
  }
  function t(key) { return labels[language][key]; }
  function reducedMotion() { return userReduced || systemMotion.matches; }
  function imagePath(work) { return 'images/' + work.category + '/' + work.file; }
  function workTitle(work) {
    return work.title || (t('studioTitle') + ' · ' + work.slug.split('-').pop());
  }
  function workTechnique(work) {
    // A curator may add a more specific technique; preserve it in the source language.
    const known = {paintings: 'Huile sur toile', encres: 'Encre de Chine', shooting: 'Atelier'};
    return work.technique === known[work.category] ? t('technique')[work.category] : work.technique;
  }
  function workAlt(work) { return workTitle(work) + ' — ' + workTechnique(work) + ', ' + t('imageAlt'); }
  function filteredWorks() {
    return works.filter(work => currentFilter === 'all' ? work.category !== 'shooting' : work.category === currentFilter);
  }

  function setLanguage(next) {
    language = next === 'en' ? 'en' : 'fr';
    root.lang = language;
    document.title = t('title');
    for (const [el, french] of originalCopy) {
      el.innerHTML = language === 'en' ? (english[el.dataset.i18n] || french) : french;
    }
    for (const [selector, attributes] of Object.entries(attributeTranslations)) {
      $$(selector).forEach(el => {
        for (const [attribute, value] of Object.entries(attributes)) {
          const key = el;
          if (!originalAttributes.has(key)) originalAttributes.set(key, {});
          const originals = originalAttributes.get(key);
          if (!(attribute in originals)) originals[attribute] = attribute === 'text' ? el.textContent : el.getAttribute(attribute);
          const nextValue = language === 'en' ? value : originals[attribute];
          if (attribute === 'text') el.textContent = nextValue;
          else el.setAttribute(attribute, nextValue);
        }
      });
    }
    const toggle = $('.language-toggle');
    toggle.textContent = language === 'fr' ? 'EN' : 'FR';
    toggle.setAttribute('aria-label', language === 'fr' ? 'Switch to English' : 'Passer en français');
    updateMotionControl();
    if (works.length) {
      renderGallery();
      if (viewer.open) renderViewer();
    }
    savePreference('cr-language', language);
    scheduleScroll();
  }

  function updateMotionControl() {
    const calm = reducedMotion();
    root.classList.toggle('motion-reduced', calm);
    const button = $('.motion-toggle');
    const label = systemMotion.matches ? t('systemMotion') : calm ? t('motionOn') : t('motionOff');
    button.setAttribute('aria-pressed', String(calm));
    button.setAttribute('aria-label', label);
    button.title = label;
    button.disabled = systemMotion.matches;
    $('.motion-symbol').textContent = calm ? '▷' : 'Ⅱ';
    if (calm) $$('.reveal').forEach(el => el.classList.add('is-visible'));
  }

  let revealObserver;
  function observeReveals(scope = document) {
    if (!revealObserver || reducedMotion()) {
      $$('.reveal', scope).forEach(el => el.classList.add('is-visible'));
      return;
    }
    $$('.reveal:not(.is-visible)', scope).forEach(el => revealObserver.observe(el));
  }

  function initMotion() {
    if ('IntersectionObserver' in window) {
      revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      }, {threshold: .06, rootMargin: '0px 0px 24px 0px'});
      root.classList.add('motion-ready');
    }
    updateMotionControl();
    observeReveals();
    $('.motion-toggle').addEventListener('click', () => {
      userReduced = !userReduced;
      savePreference('cr-motion', userReduced ? 'reduced' : 'full');
      updateMotionControl();
      scheduleScroll();
    });
    systemMotion.addEventListener('change', () => {
      updateMotionControl();
      scheduleScroll();
    });
    window.addEventListener('scroll', scheduleScroll, {passive: true});
    window.addEventListener('resize', scheduleScroll, {passive: true});
    scheduleScroll();
  }

  function scheduleScroll() {
    if (requestedFrame) return;
    requestedFrame = true;
    requestAnimationFrame(updateScroll);
  }

  function updateScroll() {
    requestedFrame = false;
    if (viewer.open) return;
    const viewport = window.innerHeight;
    const y = window.scrollY;
    const maxScroll = root.scrollHeight - viewport;
    $('.scroll-progress').style.transform = 'scaleX(' + (maxScroll > 0 ? y / maxScroll : 0) + ')';
    const navPoint = viewport * .42;
    let active = '';
    for (const id of ['journal', 'gallery', 'about', 'contact']) {
      const rect = document.getElementById(id).getBoundingClientRect();
      if (rect.top <= navPoint && rect.bottom > navPoint) active = id;
    }
    $$('[data-section]').forEach(link => {
      if (link.dataset.section === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    if (reducedMotion()) return;
    const matter = $('.matter');
    const rect = matter.getBoundingClientRect();
    if (rect.top < viewport && rect.bottom > 0) {
      const progress = Math.max(0, Math.min(1, (viewport - rect.top) / rect.height));
      matter.style.setProperty('--matter-inset', Math.max(0, 19 - progress * 34) + '%');
      matter.style.setProperty('--matter-scale', String(.92 + Math.min(1, progress * 1.7) * .08));
      matter.style.setProperty('--matter-left', ((1 - progress) * -18) + 'px');
      matter.style.setProperty('--matter-right', ((1 - progress) * 18) + 'px');
    }
  }

  function makeCard(work) {
    const link = document.createElement('a');
    link.className = 'work-card reveal';
    link.href = imagePath(work);
    link.dataset.work = work.slug;
    const hanging = grid.childElementCount % 8;
    link.dataset.hang = String(hanging + 1);
    link.dataset.category = work.category;
    link.setAttribute('aria-label', (language === 'fr' ? 'Voir ' : 'View ') + workAlt(work));
    link.setAttribute('aria-haspopup', 'dialog');
    const frame = document.createElement('div');
    frame.className = 'work-image';
    const img = document.createElement('img');
    img.alt = workAlt(work);
    img.loading = 'lazy';
    img.decoding = 'async';
    const dims = typeof DIMS !== 'undefined' ? DIMS[work.category + '/' + work.file] : null;
    if (dims) {
      img.width = dims[0];
      img.height = dims[1];
      const stem = imagePath(work).replace(/\.webp$/, '');
      const variants = [480, 800].filter(width => width < dims[0]).map(width => encodeURI(stem + '-' + width + '.webp') + ' ' + width + 'w');
      variants.push(encodeURI(imagePath(work)) + ' ' + dims[0] + 'w');
      const mobileWidths = [83, 46, 40, 53, 90, 46, 38, 75];
      const desktopWidths = [57, 37, 30, 42, 64, 24, 29, 50];
      img.sizes = `(max-width: 700px) ${mobileWidths[hanging]}vw, ${desktopWidths[hanging]}vw`;
      img.srcset = variants.join(', ');
    }
    img.src = imagePath(work);
    frame.append(img);
    const caption = document.createElement('div');
    caption.className = 'work-caption';
    const title = document.createElement('span');
    title.textContent = workTitle(work);
    const technique = document.createElement('small');
    technique.textContent = workTechnique(work);
    title.append(technique);
    const arrow = document.createElement('span');
    arrow.textContent = '↗';
    arrow.setAttribute('aria-hidden', 'true');
    caption.append(title, arrow);
    link.append(frame, caption);
    return link;
  }

  function renderGallery(append = false) {
    const filtered = filteredWorks();
    if (!append) {
      $$('.reveal', grid).forEach(el => revealObserver?.unobserve(el));
      grid.replaceChildren();
    }
    const start = grid.childElementCount;
    for (const work of filtered.slice(start, visibleCount)) grid.append(makeCard(work));
    $('#gallery-count').textContent = Math.min(visibleCount, filtered.length) + ' ' + t('of') + ' ' + filtered.length + ' ' + t('images');
    $('#gallery-status').textContent = currentFilter === 'all' ? t('selection') : t(currentFilter);
    $('#load-more').hidden = visibleCount >= filtered.length;
    $$('.filter-btn').forEach(button => {
      const filter = button.dataset.filter;
      const count = works.filter(work => filter === 'all' ? work.category !== 'shooting' : work.category === filter).length;
      $('.count', button).textContent = count;
      const selected = filter === currentFilter;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    observeReveals(grid);
    scheduleScroll();
  }

  function setFilter(filter) {
    if (!works.length || !['all', ...CATEGORIES].includes(filter)) return;
    currentFilter = filter;
    visibleCount = PAGE_SIZE;
    renderGallery();
  }

  async function loadCollection() {
    if (collectionLoading) return;
    collectionLoading = true;
    $('#gallery-status').textContent = t('loading');
    $('#gallery-retry').disabled = true;
    grid.setAttribute('aria-busy', 'true');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch('works.json', {signal: controller.signal});
      if (!response.ok) throw new Error('Collection HTTP ' + response.status);
      const data = await response.json();
      const slugs = new Set();
      if (!Array.isArray(data) || !data.length || !data.every(work => {
        if (!work || typeof work.slug !== 'string' || !/^[a-z0-9-]+$/.test(work.slug) || slugs.has(work.slug)) return false;
        slugs.add(work.slug);
        return CATEGORIES.includes(work.category) && typeof work.file === 'string' &&
          !/[\\\/]/.test(work.file) && work.file.endsWith('.webp') && typeof work.technique === 'string';
      })) throw new Error('Invalid collection');
      works = data;
      bySlug = new Map(works.map(work => [work.slug, work]));
      $('#gallery-error').hidden = true;
      renderGallery();
      injectStructuredData();
      syncFromUrl();
    } catch {
      $('#gallery-error').hidden = false;
      $('#gallery-status').textContent = t('network');
    } finally {
      clearTimeout(timeout);
      collectionLoading = false;
      $('#gallery-retry').disabled = false;
      grid.setAttribute('aria-busy', 'false');
    }
  }

  function injectStructuredData() {
    const personId = SITE + '#camilo-rivera';
    const person = {'@type': 'Person', '@id': personId, name: 'Camilo Rivera', jobTitle: 'Artiste peintre', url: SITE,
      address: {'@type': 'PostalAddress', addressLocality: 'Bramois', addressRegion: 'Valais', addressCountry: 'CH'},
      sameAs: ['https://www.instagram.com/camilohimself/', 'https://www.osom.ch']};
    const artworks = works.filter(work => work.category !== 'shooting');
    const list = {'@type': 'ItemList', name: 'Œuvres de Camilo Rivera', numberOfItems: artworks.length,
      itemListElement: artworks.map((work, index) => ({
        '@type': 'ListItem', position: index + 1,
        item: {'@type': 'VisualArtwork', name: work.title, artMedium: work.technique,
          creator: {'@id': personId}, url: SITE + '#oeuvre/' + work.slug,
          image: SITE + encodeURI(imagePath(work))}
      }))};
    let script = $('#collection-schema');
    if (!script) {
      script = document.createElement('script');
      script.id = 'collection-schema';
      script.type = 'application/ld+json';
      document.head.append(script);
    }
    script.textContent = JSON.stringify({'@context': 'https://schema.org', '@graph': [person, list]});
  }

  function hashSlug() {
    if (!location.hash.startsWith('#oeuvre/')) return null;
    try { return decodeURIComponent(location.hash.slice(8)); } catch { return null; }
  }

  const viewerMotion = window.CamiloViewerMotion?.create({
    dialog: viewer, stage, image: viewerImage,
    reduced: () => reducedMotion() || root.classList.contains('motion-reduced'), onStep: navigateViewer
  });

  function openWork(slug, source = null, mode = 'push') {
    const work = bySlug.get(slug);
    if (!work || typeof viewer.showModal !== 'function') return;
    const wasOpen = viewer.open;
    if (!wasOpen) {
      sourceElement = source || document.activeElement;
      returnUrl = location.pathname + location.search + (location.hash.startsWith('#oeuvre/') ? '#gallery' : location.hash);
      const current = filteredWorks();
      viewerWorks = current.some(item => item.slug === slug) ? current :
        works.filter(item => work.category === 'shooting' ? item.category === 'shooting' : item.category !== 'shooting');
      savedScroll = window.scrollY;
      // Save the real reading position before the fixed body changes the viewport.
      if (mode === 'push') history.pushState({portfolioViewer: true}, '', '#oeuvre/' + slug);
      viewer.showModal();
      document.body.style.top = '-' + savedScroll + 'px';
      document.body.classList.add('viewer-open');
    }
    viewerIndex = viewerWorks.findIndex(item => item.slug === slug);
    if (viewerIndex < 0) {
      viewerWorks = works.filter(item => work.category === 'shooting' ? item.category === 'shooting' : item.category !== 'shooting');
      viewerIndex = viewerWorks.findIndex(item => item.slug === slug);
    }
    if (mode === 'push') {
      viewerPushed = true;
      if (wasOpen) history.pushState({portfolioViewer: true}, '', '#oeuvre/' + slug);
    } else {
      viewerPushed = Boolean(history.state?.portfolioViewer);
    }
    renderViewer();
    if (!wasOpen) {
      $('.viewer-close').focus({preventScroll: true});
      if (viewerMotion) viewerMotion.open(sourceElement);
      else if (!reducedMotion() && typeof viewerImage.animate === 'function') {
        viewerImage.animate([
          {opacity: .2, transform: 'translateY(18px) scale(.97)'},
          {opacity: 1, transform: 'translateY(0) scale(1)'}
        ], {duration: 550, easing: 'cubic-bezier(.16,1,.3,1)'});
      }
    } else if (viewerMotion?.closing) viewerMotion.open(sourceElement);
  }

  function renderViewer() {
    const work = viewerWorks[viewerIndex];
    if (!work) return;
    resetZoom();
    $('.share-fallback').hidden = true;
    $('.viewer-message').textContent = '';
    clearTimeout(shareTimer);
    $('#viewer-title').textContent = workTitle(work);
    $('#viewer-meta').textContent = workTechnique(work);
    $('#viewer-extra').textContent = [
      work.dimensions, work.year,
      work.available === true ? t('available') : null
    ].filter(value => value !== null && value !== undefined && value !== '').join(' · ');
    $('#viewer-counter').textContent = String(viewerIndex + 1).padStart(2, '0') + ' / ' + String(viewerWorks.length).padStart(2, '0');
    viewerImage.alt = workAlt(work);
    $('.viewer-image-error').hidden = true;
    const nextSrc = new URL(imagePath(work), location.href).href;
    if (viewerImage.src !== nextSrc) {
      stage.classList.add('image-loading');
      viewerImage.src = imagePath(work);
    }
    const subject = t('inquiry') + ' ' + workTitle(work);
    const body = SITE + '#oeuvre/' + work.slug;
    $('#viewer-inquire').href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    $('#viewer-inquire [data-i18n]').textContent = work.category === 'shooting'
      ? (language === 'fr' ? 'Parlons de l’atelier' : 'Ask about the studio')
      : (language === 'fr' ? 'À propos de cette œuvre' : 'Ask about this work');
    // Only one adjacent full-size image is prefetched; Save-Data opts out.
    if (!navigator.connection?.saveData && viewerWorks.length > 1) {
      const next = viewerWorks[(viewerIndex + 1) % viewerWorks.length];
      new Image().src = imagePath(next);
    }
  }

  function navigateViewer(direction) {
    if (!viewer.open || !viewerWorks.length || viewerMotion?.closing) return;
    const render = () => {
      viewerIndex = (viewerIndex + direction + viewerWorks.length) % viewerWorks.length;
      const slug = viewerWorks[viewerIndex].slug;
      history.replaceState(history.state, '', '#oeuvre/' + slug);
      renderViewer();
    };
    if (viewerMotion) viewerMotion.step(direction, render);
    else {
      render();
      if (!reducedMotion() && typeof viewerImage.animate === 'function') {
        viewerImage.animate([{opacity: .25, transform: 'translateX(' + (direction * 22) + 'px)'}, {opacity: 1, transform: 'translateX(0)'}], {duration: 280, easing: 'cubic-bezier(.16,1,.3,1)'});
      }
    }
  }

  function closeViewer(fromHistory = false) {
    if (!viewer.open) return;
    const finish = () => {
      viewer.close();
      resetZoom();
      document.body.classList.remove('viewer-open');
      document.body.style.top = '';
      window.scrollTo({top: savedScroll, behavior: 'instant'});
      const goBack = viewerPushed;
      viewerPushed = false;
      const readingPosition = savedScroll;
      const readingUrl = returnUrl;
      const readingSource = sourceElement;
      const restoreReadingPosition = () => requestAnimationFrame(() => {
        if (!viewer.open && location.pathname + location.search + location.hash === readingUrl) {
          window.scrollTo({top: readingPosition, behavior: 'instant'});
          if (readingSource?.isConnected) readingSource.focus({preventScroll: true});
        }
      });
      if (!fromHistory) {
        if (goBack) {
          // Native history restoration follows popstate; restore our exact reading point after it.
          window.addEventListener('popstate', restoreReadingPosition, {once: true});
          history.back();
        }
        else if (location.hash.startsWith('#oeuvre/')) history.replaceState(null, '', returnUrl);
      } else restoreReadingPosition();
      if (sourceElement?.isConnected) sourceElement.focus({preventScroll: true});
      sourceElement = null;
      clearTimeout(shareTimer);
      scheduleScroll();
    };
    if (viewerMotion) viewerMotion.close(finish, fromHistory);
    else finish();
  }

  function syncFromUrl() {
    const slug = hashSlug();
    if (slug && bySlug.has(slug)) {
      if (!viewer.open || viewerWorks[viewerIndex]?.slug !== slug) openWork(slug, null, 'history');
    } else {
      if (viewer.open) closeViewer(true);
      if (slug) $('#gallery-status').textContent = t('unknown');
    }
  }

  function resetZoom() {
    stage.classList.remove('is-zoomed');
    stage.removeAttribute('tabindex');
    stage.removeAttribute('aria-label');
    $('.viewer-zoom').setAttribute('aria-pressed', 'false');
    $('.viewer-zoom [data-i18n]').textContent = t('zoomIn');
    $('.viewer-zoom>span:last-child').textContent = '+';
    stage.scrollTop = 0;
    stage.scrollLeft = 0;
  }

  function toggleZoom() {
    if (viewerMotion?.closing) return;
    viewerMotion?.reset();
    if (stage.classList.contains('is-zoomed')) return resetZoom();
    stage.classList.add('is-zoomed');
    stage.tabIndex = 0;
    stage.setAttribute('aria-label', t('stage'));
    $('.viewer-zoom').setAttribute('aria-pressed', 'true');
    $('.viewer-zoom [data-i18n]').textContent = t('zoomOut');
    $('.viewer-zoom>span:last-child').textContent = '−';
    stage.scrollLeft = (stage.scrollWidth - stage.clientWidth) / 2;
    stage.scrollTop = (stage.scrollHeight - stage.clientHeight) / 2;
  }

  async function shareWork() {
    const work = viewerWorks[viewerIndex];
    if (!work) return;
    const url = SITE + '#oeuvre/' + work.slug;
    const title = workTitle(work) + ' — Camilo Rivera';
    try {
      if (navigator.share && matchMedia('(pointer: coarse)').matches) {
        await navigator.share({title, url});
        return;
      }
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(url);
      if (!viewer.open) return;
      $('.viewer-message').textContent = t('copied');
      shareTimer = setTimeout(() => { $('.viewer-message').textContent = ''; }, 2600);
    } catch (error) {
      if (error.name === 'AbortError' || !viewer.open) return;
      $('.share-fallback').hidden = false;
      $('#share-url').value = url;
      $('#share-url').focus();
      $('#share-url').select();
    }
  }

  function initViewer() {
    viewer.addEventListener('cancel', event => {
      event.preventDefault();
      closeViewer();
    });
    $('.viewer-close').addEventListener('click', () => closeViewer());
    $('.viewer-prev').addEventListener('click', () => navigateViewer(-1));
    $('.viewer-next').addEventListener('click', () => navigateViewer(1));
    $('.viewer-zoom').addEventListener('click', toggleZoom);
    $('.viewer-share').addEventListener('click', shareWork);
    $('.share-fallback-close').addEventListener('click', () => {
      $('.share-fallback').hidden = true;
      $('.viewer-share').focus();
    });
    viewerImage.addEventListener('load', () => {
      stage.classList.remove('image-loading');
      $('.viewer-image-error').hidden = true;
    });
    viewerImage.addEventListener('error', () => {
      stage.classList.remove('image-loading');
      $('.viewer-image-error').hidden = false;
    });
    viewerImage.addEventListener('dblclick', toggleZoom);
    viewer.addEventListener('keydown', event => {
      if (event.key === 'Tab') {
        const controls = $$('a[href], button:not(:disabled), input, [tabindex="0"]', viewer)
          .filter(el => el.getClientRects().length > 0);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (first && ((!event.shiftKey && document.activeElement === last) ||
            (event.shiftKey && document.activeElement === first) ||
            !viewer.contains(document.activeElement))) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
        }
        return;
      }
      if (event.target.matches('input') || stage.classList.contains('is-zoomed')) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        navigateViewer(event.key === 'ArrowRight' ? 1 : -1);
      }
    });
    if (!viewerMotion) {
      let pointerStart = null;
      stage.addEventListener('pointerdown', event => {
        if (!event.isPrimary || event.pointerType === 'mouse' || stage.classList.contains('is-zoomed')) { pointerStart = null; return; }
        pointerStart = {x: event.clientX, y: event.clientY, id: event.pointerId};
        stage.setPointerCapture(event.pointerId);
      });
      stage.addEventListener('pointerup', event => {
        if (!pointerStart || pointerStart.id !== event.pointerId) return;
        const dx = event.clientX - pointerStart.x;
        const dy = event.clientY - pointerStart.y;
        pointerStart = null;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) navigateViewer(dx < 0 ? 1 : -1);
      });
      stage.addEventListener('pointercancel', () => { pointerStart = null; });
    }
    window.addEventListener('popstate', syncFromUrl);
    window.addEventListener('hashchange', syncFromUrl);
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('a[data-work]');
    if (link && bySlug.has(link.dataset.work) && typeof viewer.showModal === 'function' &&
        !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      openWork(link.dataset.work, link);
      return;
    }
    const studioLink = event.target.closest('[data-show-studio]');
    if (studioLink && works.length) {
      event.preventDefault();
      setFilter('shooting');
      $('#gallery').scrollIntoView({behavior: reducedMotion() ? 'instant' : 'smooth'});
      history.replaceState(null, '', '#gallery');
      $('.filter-btn[data-filter="shooting"]').focus({preventScroll: true});
    }
  });

  $$('.filter-btn').forEach(button => button.addEventListener('click', () => {
    if (button.dataset.filter === currentFilter) return;
    if (window.CamiloMotion) window.CamiloMotion.recompose(grid, () => setFilter(button.dataset.filter), $('.gallery-toolbar'), button);
    else setFilter(button.dataset.filter);
  }));
  $('#load-more').addEventListener('click', () => {
    const previousCount = grid.childElementCount;
    visibleCount += PAGE_SIZE;
    renderGallery(true);
    const nextCard = grid.children[previousCount];
    if (nextCard) {
      nextCard.classList.add('is-visible');
      nextCard.focus({preventScroll: true});
      nextCard.scrollIntoView({block: 'start', behavior: reducedMotion() ? 'instant' : 'smooth'});
    }
  });
  $('#gallery-retry').addEventListener('click', loadCollection);
  $('.language-toggle').addEventListener('click', () => setLanguage(language === 'fr' ? 'en' : 'fr'));
  $('#year').textContent = new Date().getFullYear();
  initMotion();
  initViewer();
  if (readPreference('cr-language') === 'en') setLanguage('en');
  loadCollection();
})();
