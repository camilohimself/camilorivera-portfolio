(() => {
  'use strict';

  const collection = document.getElementById('collection');
  const artwork = document.getElementById('artwork');
  if (!collection || !artwork) return;

  const inline = collection.hasAttribute('data-inline-collection');
  const site = new URL(`${document.documentElement.dataset.siteRoot || '.'}/`, document.baseURI);
  const grid = document.getElementById('collection-grid');
  const status = document.getElementById('collection-status');
  const collectionTitle = document.getElementById('collection-title');
  const more = document.getElementById('collection-more');
  const artworkImage = document.getElementById('artwork-image');
  const artworkTitle = document.getElementById('artwork-title');
  const artworkDetail = document.getElementById('artwork-detail');
  const artworkCounter = document.getElementById('artwork-counter');
  const original = document.getElementById('artwork-original');
  const previous = document.getElementById('artwork-prev');
  const next = document.getElementById('artwork-next');
  const zoom = document.getElementById('artwork-zoom');
  const share = document.getElementById('artwork-share');
  const contact = document.getElementById('artwork-contact');
  const shareStatus = document.getElementById('artwork-share-status');
  const stage = artwork.querySelector('.artwork-stage');
  const filters = [...collection.querySelectorAll('[data-filter]')];
  const categories = ['all', 'paintings', 'encres', 'shooting', 'memories'];
  const batchSize = 18;
  const stateKey = '__crCollection';
  const session = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const sources = {
    works: { url: new URL('works.json', site), status: 'loading', items: [] },
    memories: { url: new URL('journal/archives.json', site), status: 'loading', items: [] }
  };
  const words = {
    fr: {
      all: 'Œuvres', paintings: 'Peintures', encres: 'Encres', shooting: 'Atelier', memories: 'Souvenirs',
      loading: 'Chargement…', more: 'Poursuivre l’exploration', retry: 'Réessayer',
      unavailable: 'Cette image est introuvable.',
      failed: 'Le chargement a échoué. Les images restent accessibles depuis leurs liens directs.',
      zoom: 'Agrandir', unzoom: 'Revenir à l’ensemble', zoomRegion: 'Image agrandie. Utiliser les flèches pour explorer.', share: 'Partager', copied: 'Lien copié.',
      copyFallback: 'Lien à copier : ', contact: 'Parler de cette œuvre',
      subject: title => `À propos de ${title}`, count: (visible, total) => `${visible} sur ${total}`,
      techniques: { 'Huile sur toile': 'Huile sur toile', 'Encre de Chine': 'Encre de Chine', Atelier: 'Atelier' }
    },
    en: {
      all: 'Works', paintings: 'Paintings', encres: 'Inks', shooting: 'Studio', memories: 'Memories',
      loading: 'Loading…', more: 'Keep exploring', retry: 'Try again',
      unavailable: 'This image could not be found.',
      failed: 'The collection could not load. Images remain accessible through their direct links.',
      zoom: 'Zoom in', unzoom: 'See the whole image', zoomRegion: 'Enlarged image. Use the arrow keys to explore.', share: 'Share', copied: 'Link copied.',
      copyFallback: 'Link to copy: ', contact: 'Ask about this work',
      subject: title => `About ${title}`, count: (visible, total) => `${visible} of ${total}`,
      techniques: { 'Huile sur toile': 'Oil on canvas', 'Encre de Chine': 'India ink', Atelier: 'Studio' }
    }
  };
  let category = 'all';
  let visibleCount = batchSize;
  let activeRoute = null;
  let activeItems = [];
  let scrollLock = null;
  let historyPending = false;
  let gridRenderKey = '';
  let shownImage = '';
  let touchStart = null;
  let suppressImageClickUntil = 0;
  let artworkReturn = null;
  let collectionReturn = null;

  // The icon stays outside the translated label, so both languages keep it.
  const setLabel = (element, value) => { (element.querySelector(':scope > span') || element).textContent = value; };
  const lang = () => document.documentElement.lang.startsWith('en') ? 'en' : 'fr';
  const text = () => words[lang()];
  const currentState = () => history.state && typeof history.state === 'object' ? history.state : {};
  const overlayState = () => currentState()[stateKey];
  const collectionVisible = () => inline || collection.open;
  const sourceFor = selected => sources[selected === 'memories' ? 'memories' : 'works'];
  const isMemory = item => typeof item.id === 'string';
  const identifier = item => isMemory(item) ? item.id : item.slug;
  const technique = item => text().techniques[item.technique] || item.technique || '';
  const label = item => isMemory(item)
    ? item.alt?.[lang()] || item.alt?.fr || item.alt?.en || ''
    : item.title || technique(item);
  const imagePath = item => new URL(isMemory(item)
    ? item.file : `images/${item.category}/${item.file}`, site).href;
  const routeHash = route => `#${route.kind === 'memories' ? 'fragment' : 'oeuvre'}/${encodeURIComponent(route.id)}`;

  function credit(item) {
    const value = typeof item.credit === 'string'
      ? item.credit : item.credit?.[lang()] || item.credit?.fr || item.credit?.en || '';
    return lang() === 'en' ? value.replace(/^Photographies\s*:\s*/, 'Photography: ') : value;
  }

  function itemsFor(selected) {
    if (selected === 'memories') return sources.memories.items;
    return sources.works.items.filter(item => selected === 'all'
      ? item.category === 'paintings' || item.category === 'encres'
      : item.category === selected);
  }

  function queryCategory() {
    const selected = new URL(location.href).searchParams.get('collection');
    return categories.includes(selected) ? selected : null;
  }

  function readRoute() {
    const match = location.hash.match(/^#(oeuvre|fragment)\/([^/]+)$/);
    if (!match) return null;
    try {
      return { kind: match[1] === 'fragment' ? 'memories' : 'works', id: decodeURIComponent(match[2]) };
    } catch (_) {
      return null;
    }
  }

  function makeRetry(anchor, scope) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.retry = scope;
    button.hidden = true;
    anchor.insertAdjacentElement('afterend', button);
    return button;
  }
  const collectionRetry = collection.querySelector('[data-retry]') || makeRetry(status, 'collection');
  const artworkRetry = artwork.querySelector('[data-retry]') || makeRetry(artworkDetail, 'artwork');

  function syncScrollLock() {
    const locked = (!inline && collection.open) || artwork.open;
    if (locked && !scrollLock) {
      scrollLock = {
        x: window.scrollX, y: window.scrollY,
        position: document.body.style.position, top: document.body.style.top,
        left: document.body.style.left, width: document.body.style.width,
        overflow: document.body.style.overflow
      };
      Object.assign(document.body.style, {
        position: 'fixed', top: `${-scrollLock.y}px`, left: `${-scrollLock.x}px`, width: '100%', overflow: 'hidden'
      });
    } else if (!locked && scrollLock) {
      const saved = scrollLock;
      scrollLock = null;
      Object.assign(document.body.style, {
        position: saved.position, top: saved.top, left: saved.left, width: saved.width, overflow: saved.overflow
      });
      window.scrollTo({ left: saved.x, top: saved.y, behavior: 'instant' });
    }
  }

  function show(dialog) {
    if (inline && dialog === collection) return;
    if (!dialog.open) dialog.showModal();
    syncScrollLock();
  }

  function hide(dialog) {
    if (inline && dialog === collection) return;
    if (dialog.open) dialog.close();
    syncScrollLock();
  }

  function renderCollection() {
    const source = sourceFor(category);
    const list = itemsFor(category);
    const shown = Math.min(visibleCount, list.length);
    collectionTitle.textContent = text()[category];
    setLabel(more, text().more);
    collectionRetry.textContent = text().retry;
    collectionRetry.hidden = source.status !== 'error';
    more.hidden = source.status !== 'ready' || shown >= list.length;
    status.textContent = source.status === 'loading' ? text().loading
      : source.status === 'error' ? text().failed : text().count(shown, list.length);
    grid.setAttribute('aria-busy', String(source.status === 'loading'));
    filters.forEach(button => {
      const selected = button.dataset.filter === category;
      button.textContent = text()[button.dataset.filter];
      button.setAttribute('aria-pressed', String(selected));
      button.classList.toggle('is-active', selected);
    });

    // Leave static direct links available if the data service cannot respond.
    if (source.status !== 'ready') return;
    const renderKey = `${lang()}:${category}:${shown}:${list.length}`;
    if (gridRenderKey === renderKey) return;
    gridRenderKey = renderKey;
    const fragment = document.createDocumentFragment();
    for (const [index, item] of list.slice(0, shown).entries()) {
      const card = document.createElement('a');
      card.className = 'collection-card';
      card.href = imagePath(item);
      card.dataset[isMemory(item) ? 'memory' : 'piece'] = identifier(item);
      const image = document.createElement('img');
      image.className = 'collection-image';
      image.alt = label(item);
      image.loading = 'lazy';
      image.decoding = 'async';
      image.sizes = inline
        ? `(max-width: 600px) calc(50vw - 32px), (max-width: 900px) 43vw, ${index % 9 < 2 ? 43 : 27}vw`
        : '(max-width: 600px) calc(50vw - 30px), 28vw';
      if (isMemory(item)) {
        if (item.width && item.height) {
          image.width = item.width;
          image.height = item.height;
        }
        if (item.variants?.length) {
          image.srcset = item.variants.map(variant => `${new URL(variant.file, site).href} ${variant.width}w`).join(', ');
        }
        image.src = imagePath(item);
      } else {
        const dims = typeof DIMS !== 'undefined' ? DIMS[`${item.category}/${item.file}`] : null;
        const stem = imagePath(item).replace(/\.webp$/, '');
        // Every work in works.json has the existing 480px and 800px derivatives.
        const variants = [480, 800].map(width => `${stem}-${width}.webp ${width}w`);
        if (dims) {
          image.width = dims[0];
          image.height = dims[1];
          if (dims[0] > 800) variants.push(`${imagePath(item)} ${dims[0]}w`);
        }
        image.srcset = variants.join(', ');
        image.src = `${stem}-480.webp`;
      }
      const caption = document.createElement('span');
      caption.className = 'collection-caption';
      const title = document.createElement('span');
      title.textContent = label(item);
      caption.append(title);
      const details = isMemory(item) ? credit(item) : technique(item);
      if (details && details !== label(item)) {
        const detail = document.createElement('small');
        detail.textContent = details;
        caption.append(detail);
      }
      card.append(image, caption);
      fragment.append(card);
    }
    grid.replaceChildren(fragment);
  }

  function setZoom(enabled) {
    artwork.classList.toggle('is-zoomed', enabled);
    if (zoom) {
      zoom.setAttribute('aria-pressed', String(enabled));
      zoom.textContent = enabled ? text().unzoom : text().zoom;
    }
    if (stage) {
      if (enabled) {
        stage.tabIndex = 0;
        stage.setAttribute('role', 'region');
        stage.setAttribute('aria-label', text().zoomRegion);
        stage.focus({ preventScroll: true });
      } else {
        if (document.activeElement === stage) zoom?.focus({ preventScroll: true });
        stage.removeAttribute('tabindex');
        stage.removeAttribute('role');
        stage.removeAttribute('aria-label');
        stage.scrollTo({ left: 0, top: 0, behavior: 'instant' });
      }
    }
  }

  function clearShareStatus() {
    if (!shareStatus) return;
    shareStatus.replaceChildren();
    shareStatus.hidden = true;
  }

  function renderArtwork() {
    if (!activeRoute) return;
    const source = sources[activeRoute.kind];
    const item = source.items.find(candidate => identifier(candidate) === activeRoute.id);
    artworkRetry.textContent = text().retry;
    artworkRetry.hidden = source.status !== 'error';
    artworkImage.hidden = !item;
    original.hidden = !item;
    if (zoom) zoom.hidden = !item;
    if (share) { share.hidden = !item; share.textContent = text().share; }
    if (contact) contact.hidden = !item || isMemory(item) || item.category === 'shooting';
    if (!item) {
      activeItems = [];
      clearShareStatus();
      artworkImage.removeAttribute('src');
      artworkImage.alt = '';
      artworkTitle.textContent = source.status === 'loading' ? text().loading : text().unavailable;
      artworkDetail.textContent = source.status === 'error' ? text().failed : '';
      artworkCounter.textContent = '';
      original.removeAttribute('href');
      contact?.removeAttribute('href');
      previous.disabled = next.disabled = true;
      return;
    }
    const selected = collectionVisible() ? itemsFor(category) : [];
    activeItems = selected.some(candidate => identifier(candidate) === identifier(item)) ? selected
      : itemsFor(isMemory(item) ? 'memories' : item.category === 'shooting' ? 'shooting' : 'all');
    const imageKey = `${activeRoute.kind}/${activeRoute.id}`;
    if (shownImage !== imageKey) {
      shownImage = imageKey;
      setZoom(false);
      clearShareStatus();
    }
    artworkImage.src = imagePath(item);
    artworkImage.alt = label(item);
    artworkTitle.textContent = label(item);
    artworkDetail.textContent = [
      !isMemory(item) ? technique(item) : '',
      typeof item.year === 'string' || typeof item.year === 'number' ? item.year : '',
      typeof item.dimensions === 'string' ? item.dimensions : '',
      credit(item)
    ].filter(Boolean).join(' · ');
    artworkCounter.textContent = `${activeItems.indexOf(item) + 1} / ${activeItems.length}`;
    original.href = imagePath(item);
    if (zoom) zoom.textContent = artwork.classList.contains('is-zoomed') ? text().unzoom : text().zoom;
    if (contact && !contact.hidden) {
      setLabel(contact, text().contact);
      contact.href = `mailto:camrivera@protonmail.com?subject=${encodeURIComponent(text().subject(label(item)))}`;
    }
    previous.disabled = next.disabled = activeItems.length < 2;
  }

  function selectCategory(selected) {
    if (category !== selected) visibleCount = batchSize;
    category = selected;
  }

  function restoreFocus(closedCollection, closedRoute) {
    // Native dialog restoration cannot focus a card that was replaced by a new
    // batch, translation or filter render. Resolve its identity again instead.
    requestAnimationFrame(() => {
      if (artwork.open) return;
      const available = element => element?.isConnected && element !== document.body
        && element !== document.documentElement && element.getClientRects().length
        && !element.closest('[inert]');
      if (closedCollection && !collectionVisible()) {
        const target = available(collectionReturn) ? collectionReturn : document.querySelector('.signature');
        target?.focus({ preventScroll: true });
        return;
      }
      const scope = collectionVisible() ? collection : document;
      const matches = route => route && [...scope.querySelectorAll('a[data-piece], a[data-memory]')].find(link =>
        link.dataset[route.kind === 'memories' ? 'memory' : 'piece'] === route.id && available(link));
      const originalNode = artworkReturn?.node;
      const target = available(originalNode) && scope.contains(originalNode) ? originalNode
        : matches(artworkReturn?.route) || matches(closedRoute);
      if (target) target.focus({ preventScroll: true });
      else if (collectionVisible()) {
        collectionTitle.tabIndex = -1;
        collectionTitle.focus({ preventScroll: true });
      } else document.querySelector('.signature')?.focus({ preventScroll: true });
    });
  }

  function syncLocation() {
    const wasArtworkOpen = artwork.open;
    const wasCollectionOpen = !inline && collection.open;
    const closingRoute = activeRoute;
    const state = overlayState();
    const route = readRoute();
    const fromQuery = queryCategory();
    if (inline) {
      selectCategory(fromQuery || (route?.kind === 'memories' ? 'memories' : 'all'));
      renderCollection();
    }
    if (route) {
      if (state?.collection && categories.includes(state.category)) {
        selectCategory(state.category);
        renderCollection();
        show(collection);
      } else if (!inline && collection.open) {
        hide(collection);
      }
      activeRoute = route;
      renderArtwork();
      show(artwork);
    } else if (!inline && (state?.view === 'collection' || fromQuery)) {
      selectCategory(fromQuery || (categories.includes(state.category) ? state.category : 'all'));
      renderCollection();
      show(collection);
      activeRoute = null;
      hide(artwork);
    } else {
      activeRoute = null;
      hide(artwork);
      hide(collection);
    }
    const closedCollection = wasCollectionOpen && !collection.open;
    if ((wasArtworkOpen && !artwork.open) || closedCollection) restoreFocus(closedCollection, closingRoute);
  }

  // Opening or closing a dialog happens in a drop from the clicked element (js/drop.js).
  function dropSync(origin = null) {
    const drop = window.CamiloDrop;
    if (!drop) { syncLocation(); return; }
    const returnTo = artwork.open ? artworkReturn?.node : collectionReturn;
    drop.swap(syncLocation, { origin, returnTo });
  }

  function setHistory(state, url, replace = false) {
    const nextState = { ...currentState(), [stateKey]: { ...state, session } };
    history[replace ? 'replaceState' : 'pushState'](nextState, '', url);
  }

  function openCollection(selected = 'all', opener = null) {
    if (!inline && !collection.open) collectionReturn = opener || document.activeElement;
    const normalized = categories.includes(selected) ? selected : 'all';
    if (category !== normalized || !collectionVisible()) visibleCount = batchSize;
    category = normalized;
    const state = overlayState();
    const url = new URL(location.href);
    if (inline) {
      url.searchParams.set('collection', category);
      url.hash = 'gallery';
      setHistory({ view: 'collection', category }, url, category === queryCategory() && !artwork.open);
    } else if (!collection.open || artwork.open) {
      url.searchParams.set('collection', category);
      url.hash = 'gallery';
      setHistory({ view: 'collection', category, hasBack: true, returnUrl: location.href }, url);
    } else {
      url.searchParams.set('collection', category);
      setHistory({ ...state, category }, url, true);
    }
    if (inline) {
      syncLocation();
      document.getElementById('gallery')?.scrollIntoView({ behavior: 'instant', block: 'start' });
    } else dropSync(opener);
  }

  function openArtwork(route, opener = null) {
    if (!artwork.open) artworkReturn = { node: opener || document.activeElement, route };
    const state = overlayState();
    const url = new URL(location.href);
    url.hash = routeHash(route);
    setHistory({
      view: 'artwork', collection: collectionVisible(), category,
      hasBack: true, returnUrl: location.href,
      ...(artwork.open ? state : {})
    }, url, artwork.open);
    dropSync(opener);
  }

  function closeTop() {
    if (historyPending) return;
    setZoom(false);
    const state = overlayState();
    if (state?.session === session && state.hasBack) {
      historyPending = true;
      history.back();
      return;
    }
    const nextState = { ...currentState() };
    delete nextState[stateKey];
    const url = new URL(location.href);
    if (readRoute()) url.hash = inline ? 'gallery' : '';
    else { url.searchParams.delete('collection'); if (url.hash === '#gallery') url.hash = ''; }
    history.replaceState(nextState, '', url);
    dropSync();
  }

  function navigate(direction) {
    if (!activeRoute || activeItems.length < 2) return;
    const index = activeItems.findIndex(item => identifier(item) === activeRoute.id);
    const item = activeItems[(index + direction + activeItems.length) % activeItems.length];
    const route = { kind: isMemory(item) ? 'memories' : 'works', id: identifier(item) };
    const url = new URL(location.href);
    url.hash = routeHash(route);
    setHistory({ ...(overlayState() || {}), view: 'artwork', category, collection: collectionVisible() }, url, true);
    activeRoute = route;
    renderArtwork();
  }

  async function shareArtwork() {
    if (!activeRoute) return;
    const url = new URL('oeuvres/', site);
    url.searchParams.set('collection', category);
    url.hash = routeHash(activeRoute);
    const routeAtStart = routeHash(activeRoute);
    const title = artworkTitle.textContent;
    const stillCurrent = () => activeRoute && routeHash(activeRoute) === routeAtStart;
    if (navigator.share) {
      try { await navigator.share({ title: `${title} — Camilo Rivera`, url: url.href }); return; }
      catch (error) { if (error.name === 'AbortError') return; }
    }
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(url.href);
      if (shareStatus && stillCurrent()) { shareStatus.textContent = text().copied; shareStatus.hidden = false; }
    } catch (_) {
      if (!shareStatus || !stillCurrent()) return;
      const link = document.createElement('a');
      link.href = url.href;
      link.textContent = url.href;
      shareStatus.replaceChildren(document.createTextNode(text().copyFallback), link);
      shareStatus.hidden = false;
    }
  }

  async function loadSource(source, memory) {
    source.status = 'loading';
    try {
      const response = await fetch(source.url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Invalid collection');
      const valid = data.every(item => item && (memory
        ? typeof item.id === 'string' && /^images\/[a-z0-9_./-]+\.(webp|jpe?g|png)$/i.test(item.file)
        : typeof item.slug === 'string' && ['paintings', 'encres', 'shooting'].includes(item.category)
          && typeof item.file === 'string' && !/[\\/]/.test(item.file)));
      if (!valid) throw new Error('Invalid image entries');
      source.items = data;
      source.status = 'ready';
    } catch (_) {
      source.status = 'error';
    }
    renderCollection();
    renderArtwork();
  }

  function loadData(retry = false) {
    const pending = Object.entries(sources)
      .filter(([, source]) => !retry || source.status === 'error')
      .map(([kind, source]) => loadSource(source, kind === 'memories'));
    renderCollection();
    renderArtwork();
    return Promise.all(pending);
  }

  filters.forEach(button => button.addEventListener('click', () => openCollection(button.dataset.filter)));
  more.addEventListener('click', () => {
    const previousCount = Math.min(visibleCount, itemsFor(category).length);
    visibleCount += batchSize;
    renderCollection();
    grid.children[previousCount]?.focus({ preventScroll: true });
  });
  document.getElementById('collection-close')?.addEventListener('click', closeTop);
  document.getElementById('artwork-close').addEventListener('click', () => { setZoom(false); closeTop(); });
  previous.addEventListener('click', () => navigate(-1));
  next.addEventListener('click', () => navigate(1));
  zoom?.addEventListener('click', () => setZoom(!artwork.classList.contains('is-zoomed')));
  artworkImage.addEventListener('click', () => {
    if (Date.now() < suppressImageClickUntil) return;
    setZoom(!artwork.classList.contains('is-zoomed'));
  });
  share?.addEventListener('click', shareArtwork);
  [collectionRetry, artworkRetry].forEach(button => button.addEventListener('click', () => {
    window.crCollection.ready = loadData(true);
  }));

  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const opener = event.target.closest('[data-open-collection]');
    if (opener) {
      event.preventDefault();
      openCollection(opener.dataset.category || 'all', opener);
      return;
    }
    const link = event.target.closest('a[data-piece], a[data-memory]');
    if (!link) return;
    if (sources[link.hasAttribute('data-memory') ? 'memories' : 'works'].status === 'error') return;
    event.preventDefault();
    openArtwork(link.hasAttribute('data-memory')
      ? { kind: 'memories', id: link.dataset.memory }
      : { kind: 'works', id: link.dataset.piece }, link);
  });

  for (const dialog of inline ? [artwork] : [collection, artwork]) {
    dialog.addEventListener('cancel', event => {
      event.preventDefault();
      closeTop();
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeTop();
    });
    dialog.addEventListener('close', syncScrollLock);
  }

  stage?.addEventListener('touchstart', event => {
    if (event.touches.length !== 1 || artwork.classList.contains('is-zoomed')) { touchStart = null; return; }
    touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY, time: Date.now() };
  }, { passive: true });
  stage?.addEventListener('touchend', event => {
    if (!touchStart || !event.changedTouches.length) return;
    const deltaX = event.changedTouches[0].clientX - touchStart.x;
    const deltaY = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5 && Date.now() - touchStart.time < 800) {
      suppressImageClickUntil = Date.now() + 500;
      navigate(deltaX > 0 ? -1 : 1);
    }
    touchStart = null;
  }, { passive: true });
  stage?.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });

  document.addEventListener('keydown', event => {
    if (!artwork.open || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && !artwork.classList.contains('is-zoomed')) {
      event.preventDefault();
      navigate(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  window.addEventListener('popstate', () => {
    historyPending = false;
    dropSync();
  });
  window.addEventListener('hashchange', () => dropSync());
  const refreshLanguage = () => { renderCollection(); renderArtwork(); };
  window.addEventListener('crlanguage', refreshLanguage);
  document.addEventListener('crlanguage', refreshLanguage);
  new MutationObserver(refreshLanguage).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  window.crCollection = { ready: null, open: openCollection };
  window.v01Collection = window.crCollection;
  artworkTitle.setAttribute('aria-live', 'polite');
  artworkTitle.setAttribute('aria-atomic', 'true');
  category = queryCategory() || (readRoute()?.kind === 'memories' ? 'memories' : 'all');
  window.crCollection.ready = loadData();
  syncLocation();
})();
