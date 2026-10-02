/* A shared, ordinary map of the journey. The links remain real page URLs. */
(() => {
  'use strict';
  const root = document.documentElement;
  const base = new URL((root.dataset.siteRoot || '.') + '/', document.baseURI);
  const pages = [
    ['', 'L’entrée', 'The entrance', 'Revenir à la surface', 'Back to the surface'],
    ['oeuvres/', 'Les œuvres', 'The works', 'Peintures, encres, atelier', 'Paintings, ink, studio'],
    ['journal/', 'Le journal', 'The journal', 'Choisir un autre chemin', 'Choose another path'],
    ['journal/carnets/', 'Les carnets', 'The notebooks', 'Le trait cherche sa voie', 'The line finds its way'],
    ['journal/matieres/', 'La matière', 'The paint', 'Dans l’épaisseur de la couleur', 'Inside the colour'],
    ['journal/les-caves/', 'Les caves', 'The cellars', 'La lumière au fond du passage', 'Light at the end of the passage'],
    ['journal/traces/', 'Les traces', 'The traces', 'Des morceaux de vie', 'Fragments of life'],
    ['journal/reserves/', 'La réserve', 'The archive', '73 fragments à retrouver', '73 fragments to rediscover'],
    ['journal/hors-cadre/', 'Hors cadre', 'Outside the frame', 'Avant un tableau, une vie', 'Before a painting, a life']
  ];
  // Line icons from the page’s shared symbols (<svg class="svg-defs">), never text glyphs.
  const icon = name => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'icon'); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', '#icon-' + name); svg.append(use);
    return svg;
  };
  const dialog = document.createElement('dialog');
  dialog.id = 'journey-map';
  dialog.className = 'journey-map-dialog';
  dialog.setAttribute('aria-labelledby', 'journey-map-title');
  const head = document.createElement('div');
  head.className = 'journey-map-head';
  const title = document.createElement('h2'); title.id = 'journey-map-title';
  const close = document.createElement('button'); close.type = 'button'; close.className = 'close-button'; close.append(icon('close'));
  head.append(title, close);
  const nav = document.createElement('nav'); nav.className = 'journey-map-links';
  const entries = pages.map((page, i) => {
    const link = document.createElement('a'); link.href = new URL(page[0], base).href;
    const number = document.createElement('span'); number.className = 'map-number'; number.textContent = String(i).padStart(2, '0'); number.setAttribute('aria-hidden', 'true');
    const name = document.createElement('span'); name.className = 'map-name';
    const caption = document.createElement('span'); caption.className = 'map-caption';
    const arrow = document.createElement('span'); arrow.className = 'map-arrow'; arrow.append(icon('north-east')); arrow.setAttribute('aria-hidden', 'true');
    if (new URL(link.href).pathname === location.pathname) link.setAttribute('aria-current', 'page');
    link.append(number, name, caption, arrow); nav.append(link);
    return {page, name, caption};
  });
  const foot = document.createElement('p'); foot.className = 'journey-map-foot';
  dialog.append(head, nav, foot); document.body.append(dialog);
  function translate() {
    const en = root.lang === 'en';
    title.textContent = en ? 'Every path is open.' : 'Tous les chemins sont ouverts.';
    close.setAttribute('aria-label', en ? 'Close the index' : 'Fermer l’index');
    nav.setAttribute('aria-label', en ? 'All pages' : 'Toutes les pages');
    foot.textContent = en ? 'There is no need to begin at the beginning.' : 'Rien n’oblige à commencer par le début.';
    entries.forEach(({page, name, caption}) => { name.textContent = page[en ? 2 : 1]; caption.textContent = page[en ? 4 : 3]; });
  }
  // The index opens in a drop from its button and closes back into it (js/drop.js).
  let opener = null;
  document.querySelectorAll('[data-open-map]').forEach(button => {
    button.setAttribute('aria-haspopup', 'dialog'); button.setAttribute('aria-controls', dialog.id);
    button.addEventListener('click', () => {
      document.querySelectorAll('video').forEach(video => video.pause());
      opener = button;
      const show = () => { if (!dialog.open) dialog.showModal(); close.focus({preventScroll: true}); };
      if (window.CamiloDrop) window.CamiloDrop.swap(show, {origin: button}); else show();
    });
  });
  const hide = () => {
    if (!dialog.open) return;
    if (window.CamiloDrop) window.CamiloDrop.swap(() => dialog.close(), {closing: dialog, returnTo: opener});
    else dialog.close();
  };
  close.addEventListener('click', hide);
  dialog.addEventListener('cancel', event => { event.preventDefault(); hide(); });
  // A chosen page keeps the index on screen until the next page replaces it: no empty frame between the two.
  addEventListener('pagehide', () => { if (dialog.open) dialog.close(); });
  new MutationObserver(translate).observe(root, {attributes: true, attributeFilter: ['lang']});
  translate();
})();
