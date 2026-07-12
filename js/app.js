/* ═══════════════════════════════════════════════
   CAMILO RIVERA — Portfolio 2026
   "Probably the most beautiful portfolio in the world"
   ═══════════════════════════════════════════════ */

// ── Données ─────────────────────────────────────
// Les œuvres sont des DONNÉES (works.json), plus du code. La galerie est
// construite au runtime depuis works.json, dans l'ordre du tableau (curatable
// en réordonnant le JSON). Aucun tirage aléatoire : l'ordre est FIXE et reproductible.
const SITE = 'https://www.camilorivera.ch/';
const PATHS = { paintings: 'images/paintings/', encres: 'images/encres/', shooting: 'images/shooting/' };

// ── Chapitres éditoriaux de la galerie ──────────
// Ligne d'accroche affichée sous les filtres, qui réagit au filtre actif.
// Édition libre : texte pur, un par clé de filtre. Ne réordonne PAS la grille.
const CHAPTER_LINES = {
  all:       'Le corpus entier — huile, encre de Chine et silence de l’atelier.',
  paintings: 'Série I — Huiles sur toile · 29 œuvres · gestes et empâtements',
  encres:    'Série II — Encres de Chine · 26 œuvres · le trait, le vide',
  shooting:  'L’atelier — Bramois, Valais · 60 photographies'
};

// ── State ───────────────────────────────────────
let WORKS = [];                    // tableau works.json, dans l'ordre d'affichage
const WORKS_BY_SLUG = {};          // index slug → œuvre

let currentFilter = 'all';
let lightboxGallery = [];
let lightboxIndex = 0;
let lightboxOpen = false;
let lightboxSourceEl = null;       // vignette d'origine → restitution du focus
let lightboxPushed = false;        // a-t-on empilé une entrée d'historique à l'ouverture ?
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let ringX = 0, ringY = 0;

// Registre commun des callbacks scroll (pattern ticking : un seul
// listener passif, un seul rAF, N mises à jour dedans).
const scrollCallbacks = [];
let scrollTicking = false;

// ── Préférences de mouvement / capacités ────────
// prefers-reduced-motion : neutralise TOUTES les animations « plaisir »
// (ken burns, morph View Transitions, cartel, ressort de swipe).
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
// View Transitions same-document : progressive enhancement du morph
// vignette ⇄ œuvre. Absente ou reduced-motion → repli FLIP intact.
function supportsViewTransitions() {
  return typeof document.startViewTransition === 'function';
}
function useViewTransition() {
  return supportsViewTransitions() && !prefersReducedMotion();
}
const VT_NAME = 'oeuvre-morph';

// Échappe le texte injecté en innerHTML (cartel). Les données works.json
// sont maîtrisées, mais on reste correct par principe.
function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]
  ));
}

// ── Init ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initHeroTextReveal();
  initNavigation();
  initLightbox();
  initParallax();
  initScrollReveal();
  initTextReveal();
  initScrollProgress();
  initBackToTop();
  initScrollDispatcher();
  // La galerie est asynchrone (fetch works.json) : les hooks qui dépendent des
  // vignettes (observers, curseur galerie, magnétique, deep-link) sont enchaînés
  // APRÈS le rendu réel, à l'intérieur de initGallery — plus de setTimeout arbitraires.
  initGallery();
});

// ══════════════════════════════════════════════
// HERO MACRO MATIÈRE — image plein écran, statique
// ══════════════════════════════════════════════
// La vidéo drone a été remplacée par un gros plan de matière de peinture
// (images/hero/hero-matiere-1.webp), servi en dur dans le HTML avec
// fetchpriority="high". Ken Burns + fondu d'émergence sont gérés en CSS
// (voir .hero-matiere-wrap) et neutralisés en reduced-motion — plus de JS ici.

// ══════════════════════════════════════════════
// CUSTOM CURSOR
// ══════════════════════════════════════════════
function initCustomCursor() {
  // Skip on touch devices
  if ('ontouchstart' in window) return;

  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth follow with lerp
  function animate() {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    ringX += (mouseX - ringX) * 0.08;
    ringY += (mouseY - ringY) * 0.08;

    dot.style.left = cursorX + 'px';
    dot.style.top = cursorY + 'px';
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';

    requestAnimationFrame(animate);
  }
  animate();

  // Hover states for interactive elements présents au chargement (nav, filtres).
  // Les vignettes de galerie, elles, sont câblées après leur rendu réel
  // (initGalleryInteractions), plus de setTimeout(100).
  document.querySelectorAll('a, button, .filter-btn').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// ══════════════════════════════════════════════
// GALLERY INTERACTIONS — curseur galerie + effet magnétique
// Câblé APRÈS le rendu réel de la galerie (fini les setTimeout 100/200).
// ══════════════════════════════════════════════
function initGalleryInteractions() {
  if ('ontouchstart' in window) return;

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      document.body.classList.remove('cursor-hover');
      document.body.classList.add('cursor-gallery');
    });

    // Effet magnétique : léger suivi du curseur.
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      item.style.transform = `translate(${x * 0.03}px, ${y * 0.03}px)`;
    });

    item.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-gallery');
      item.style.transform = '';
    });
  });
}

// ══════════════════════════════════════════════
// HERO TEXT REVEAL — word by word
// ══════════════════════════════════════════════
function initHeroTextReveal() {
  const title = document.querySelector('.hero-title');
  if (!title) return;

  // Get the HTML content and split by <br> and words
  const html = title.innerHTML;
  const lines = html.split('<br>');

  const wrapped = lines.map(line => {
    // Don't split inside HTML tags
    const words = line.trim().split(/\s+/);
    return words.map((word, i) => {
      // Preserve <em> tags. Le titre « émerge du pigment » : les mots
      // démarrent après le fondu de l'image hero (0.8s), pas avant.
      return `<span class="word"><span class="word-inner" style="animation-delay: ${0.9 + i * 0.08}s">${word}</span></span>`;
    }).join(' ');
  }).join('<br>');

  title.innerHTML = wrapped;
}

// ══════════════════════════════════════════════
// SCROLL DISPATCHER — un seul listener passif pour
// nav scrolled + parallax + scroll-progress + back-to-top
// ══════════════════════════════════════════════
function initScrollDispatcher() {
  window.addEventListener('scroll', () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      scrollCallbacks.forEach(cb => cb());
      scrollTicking = false;
    });
  }, { passive: true });
}

// ══════════════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════════════
function initNavigation() {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const mobile = document.querySelector('.nav-mobile');

  scrollCallbacks.push(() => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  if (toggle && mobile) {
    toggle.addEventListener('click', () => {
      const open = mobile.classList.toggle('open');
      toggle.classList.toggle('active', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });

    mobile.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('active');
        mobile.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      // #oeuvre/<slug> n'est pas une ancre de scroll : laisser le hash tel quel.
      if (href.startsWith('#oeuvre/')) return;
      const target = href === '#' ? null : document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ══════════════════════════════════════════════
// GALLERY — données → rendu
// ══════════════════════════════════════════════
// alt descriptif : œuvres → « Titre — technique, Camilo Rivera » ;
// atelier → « Atelier de Camilo Rivera — photo N ».
function altFor(work) {
  if (work.category === 'shooting') {
    const n = parseInt(work.slug.split('-')[1], 10);
    return `Atelier de Camilo Rivera — photo ${n}`;
  }
  return `${work.title} — ${work.technique}, Camilo Rivera`;
}

function createGalleryItem(work) {
  const src = PATHS[work.category] + work.file;

  const el = document.createElement('div');
  el.className = 'gallery-item clip-reveal';
  el.dataset.category = work.category;
  el.dataset.slug = work.slug;

  // Accessibilité : la vignette ouvre la lightbox → focusable + activable clavier.
  el.setAttribute('role', 'button');
  el.setAttribute('tabindex', '0');
  el.setAttribute('aria-label', altFor(work));

  const img = document.createElement('img');
  img.alt = altFor(work);
  img.loading = 'lazy';

  // Dimensions intrinsèques + srcset responsive (variantes générées par
  // tools/generate-image-variants.sh). Si l'image n'est pas dans DIMS
  // (fichier généré après le dernier passage du script), on ne pose
  // rien — repli silencieux sur le seul `src` pleine résolution.
  // ORDRE CRITIQUE : loading/width/height/sizes/srcset AVANT src —
  // affecter src en premier déclenche immédiatement le fetch de la
  // pleine résolution et le navigateur ne rétrograde jamais vers la
  // variante 480/800 ensuite (sélection déjà faite, ressource en cache).
  const dims = (typeof DIMS !== 'undefined') && DIMS[`${work.category}/${work.file}`];
  if (dims) {
    const [w, h] = dims;
    img.width = w;
    img.height = h;

    const stem = work.file.replace(/\.webp$/, '');
    const base = PATHS[work.category];
    // encodeURI() est indispensable ici : plusieurs fichiers contiennent
    // des espaces ("berceau bleu.webp") qui, non encodés, casseraient le
    // parsing de srcset (l'espace y sépare URL et descripteur de largeur).
    img.sizes = '(max-width: 480px) 92vw, (max-width: 1024px) 46vw, 30vw';
    img.srcset = [
      `${encodeURI(base + stem + '-480.webp')} 480w`,
      `${encodeURI(base + stem + '-800.webp')} 800w`,
      `${encodeURI(src)} ${w}w`
    ].join(', ');
  }
  img.src = src;

  const overlay = document.createElement('div');
  overlay.className = 'gallery-item-overlay';

  const info = document.createElement('span');
  info.className = 'gallery-item-info';
  info.textContent = work.technique;

  overlay.appendChild(info);
  el.appendChild(img);
  el.appendChild(overlay);

  const open = () => openLightbox(el, { history: 'push' });
  el.addEventListener('click', open);
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
  });

  return el;
}

async function initGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  try {
    const res = await fetch('works.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    WORKS = await res.json();
  } catch (err) {
    // Échec réseau : galerie vide, message console, pas de crash. Les compteurs
    // hardcodés d'index.html restent le repli no-JS et demeurent affichés.
    console.error('[galerie] Échec du chargement de works.json — galerie vide :', err);
    return;
  }

  WORKS.forEach(w => { WORKS_BY_SLUG[w.slug] = w; });

  // Rendu dans l'ordre du tableau (un seul reflow via fragment).
  const frag = document.createDocumentFragment();
  WORKS.forEach(work => frag.appendChild(createGalleryItem(work)));
  grid.appendChild(frag);

  // ── Enchaînement post-rendu réel ──
  updateFilterCounts(WORKS);
  observeGalleryReveal(grid);
  initGalleryInteractions();
  initFilters(grid);
  // Ligne éditoriale initiale (sans fondu — l'état de départ).
  const chapterEl = document.getElementById('gallery-chapter-line');
  if (chapterEl) chapterEl.textContent = CHAPTER_LINES[currentFilter] || CHAPTER_LINES.all;
  injectJsonLd(WORKS);
  handleInitialDeepLink(grid);
}

// Met à jour la ligne éditoriale sous les filtres, en fondu doux (0.3s CSS).
// Le texte est remplacé pendant le creux du fondu ; reduced-motion aplatit
// la transition (règle globale) — le texte change alors sans battement.
function renderChapterLine(filter) {
  const el = document.getElementById('gallery-chapter-line');
  if (!el) return;
  const text = CHAPTER_LINES[filter] || CHAPTER_LINES.all;
  if (el.textContent === text) return;
  el.classList.add('fading');
  window.setTimeout(() => {
    el.textContent = text;
    el.classList.remove('fading');
  }, 180);
}

// Compteurs de filtres calculés depuis works.json (les valeurs hardcodées
// d'index.html sont le repli no-JS ; on les remet à jour au chargement).
function updateFilterCounts(works) {
  const counts = { all: works.length, paintings: 0, encres: 0, shooting: 0 };
  works.forEach(w => { if (counts[w.category] !== undefined) counts[w.category]++; });

  document.querySelectorAll('.filter-btn').forEach(btn => {
    const span = btn.querySelector('.count');
    const key = btn.dataset.filter;
    if (span && counts[key] !== undefined) span.textContent = counts[key];
  });
}

// Entrée en scène (clip-path reveal) au scroll.
function observeGalleryReveal(grid) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px 80px 0px' });

  grid.querySelectorAll('.gallery-item').forEach((item, i) => {
    item.style.transitionDelay = `${(i % 8) * 0.05}s`;
    observer.observe(item);
  });
}

function initFilters(grid) {
  const btns = document.querySelectorAll('.filter-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      setFilter(btn.dataset.filter, grid);
      btns.forEach(b => {
        const active = b === btn;
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    });
  });
}

function setFilter(filter, grid) {
  currentFilter = filter;
  renderChapterLine(filter);
  grid.querySelectorAll('.gallery-item').forEach((item, i) => {
    const match = filter === 'all' || item.dataset.category === filter;
    item.classList.toggle('hidden', !match);
    if (match) item.style.transitionDelay = `${(i % 6) * 0.04}s`;
  });
}

// ══════════════════════════════════════════════
// SEO — JSON-LD injecté depuis works.json
// Un seul <script type="application/ld+json"> dans le <head> :
// Person (l'artiste) + ItemList de VisualArtwork (les 55 œuvres,
// l'atelier étant de la documentation, pas des œuvres).
// ══════════════════════════════════════════════
function injectJsonLd(works) {
  const personId = SITE + '#camilo-rivera';
  const person = {
    '@type': 'Person',
    '@id': personId,
    name: 'Camilo Rivera',
    jobTitle: 'Artiste peintre',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bramois',
      addressRegion: 'Valais',
      addressCountry: 'CH'
    },
    url: SITE,
    sameAs: [
      'https://www.instagram.com/camilohimself/',
      'https://osomcreative.ch'
    ]
  };

  const oeuvres = works.filter(w => w.category !== 'shooting');
  const itemList = {
    '@type': 'ItemList',
    name: 'Œuvres de Camilo Rivera',
    numberOfItems: oeuvres.length,
    itemListElement: oeuvres.map((w, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'VisualArtwork',
        name: w.title,
        artform: w.category === 'paintings' ? 'Peinture' : 'Dessin',
        artMedium: w.technique,
        creator: { '@id': personId },
        url: SITE + '#oeuvre/' + w.slug,
        image: SITE + encodeURI(PATHS[w.category] + w.file)
      }
    }))
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': [person, itemList] });
  document.head.appendChild(script);
}

// ══════════════════════════════════════════════
// DEEP-LINKS — #oeuvre/<slug>
// ══════════════════════════════════════════════
function parseOeuvreHash() {
  const m = location.hash.match(/^#oeuvre\/(.+)$/);
  return m ? decodeURIComponent(m[1]) : null;
}

function slugSelector(slug) {
  const safe = (window.CSS && CSS.escape) ? CSS.escape(slug) : slug;
  return `[data-slug="${safe}"]`;
}

function openWorkBySlug(slug, opts) {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;
  const el = grid.querySelector(slugSelector(slug));
  if (el) openLightbox(el, opts);
}

// Au chargement avec #oeuvre/<slug> : positionne la galerie en arrière-plan
// puis ouvre la lightbox. Slug inconnu → ignore silencieusement.
function handleInitialDeepLink(grid) {
  const slug = parseOeuvreHash();
  if (!slug) return;
  if (!WORKS_BY_SLUG[slug]) return;
  const el = grid.querySelector(slugSelector(slug));
  if (!el) return;
  el.scrollIntoView({ block: 'center' });
  openLightbox(el, { history: 'replace' });
}

// push  : ouverture par clic → empile une entrée #oeuvre/<slug>
// replace: deep-link au chargement / navigation flèche → remplace en place
// none  : réouverture via bouton Suivant du navigateur → ne touche pas l'historique
function syncLightboxHistory(slug, mode) {
  const url = '#oeuvre/' + slug;
  if (mode === 'push') history.pushState(null, '', url);
  else if (mode === 'replace') history.replaceState(null, '', url);
}

function onPopState() {
  if (lightboxOpen) {
    // Bouton Retour du navigateur alors que la lightbox est ouverte → on ferme.
    // L'historique a déjà bougé : teardown seul (pas de nouvelle manip d'historique).
    closeLightbox({ fromPopstate: true });
    return;
  }
  // Bouton Suivant vers un état #oeuvre → on rouvre la lightbox.
  const slug = parseOeuvreHash();
  if (slug && WORKS_BY_SLUG[slug]) openWorkBySlug(slug, { history: 'none' });
}

// ══════════════════════════════════════════════
// LIGHTBOX — Cinematic FLIP animation
// ══════════════════════════════════════════════
// Cartel de musée : titre (Cormorant italique) au-dessus d'une méta ligne
// (technique · dimensions · année, DM Sans petites capitales), séparés d'un
// filet doré. Atelier (title null) → méta seule, sans filet. Année &
// dimensions n'apparaissent que renseignées (null aujourd'hui → ignorées).
// Retourne du markup (innerHTML) car le cartel est structuré, plus une ligne.
function lightboxCaption(work) {
  const title = work.title;
  const meta = [work.technique, work.dimensions, work.year].filter(Boolean).join(' · ');
  let html = '';
  if (title) html += `<span class="cartel-title">${escapeHtml(title)}</span>`;
  if (title && meta) html += '<span class="cartel-rule" aria-hidden="true"></span>';
  if (meta) html += `<span class="cartel-meta">${escapeHtml(meta)}</span>`;
  return html;
}

// Libellé accessible (aria-label du dialog) : titre de l'œuvre, ou technique
// pour l'atelier (title null).
function lightboxLabel(work) {
  return work.title || work.technique;
}

// Précharge les voisines (index-1 / index+1, modulo) dans le cache
// navigateur : la flèche/le swipe suivant affiche une image déjà
// chargée — fini le flash noir pendant le fetch.
function preloadLightboxNeighbors(index) {
  if (lightboxGallery.length <= 1) return;
  const nextItem = lightboxGallery[(index + 1) % lightboxGallery.length];
  const prevItem = lightboxGallery[(index - 1 + lightboxGallery.length) % lightboxGallery.length];
  new Image().src = nextItem.src;
  new Image().src = prevItem.src;
}

function initLightbox() {
  document.addEventListener('keydown', (e) => {
    if (!lightboxOpen) return;
    switch (e.key) {
      case 'Escape': closeLightbox(); break;
      case 'ArrowLeft': e.preventDefault(); navigateLightbox(-1); break;
      case 'ArrowRight': e.preventDefault(); navigateLightbox(1); break;
      case 'Tab': trapLightboxFocus(e); break;
    }
  });

  // Bouton Retour/Suivant du navigateur.
  window.addEventListener('popstate', onPopState);
}

// Focus trap : Tab / Shift+Tab cyclent entre les contrôles de la lightbox.
function trapLightboxFocus(e) {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  const focusables = Array.from(lb.querySelectorAll('.lightbox-close, .lightbox-nav'))
    .filter(el => el.offsetParent !== null);   // ignore les contrôles masqués (display:none)
  if (!focusables.length) return;

  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const active = document.activeElement;

  if (!lb.contains(active)) {
    e.preventDefault();
    first.focus();
  } else if (e.shiftKey && active === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && active === last) {
    e.preventDefault();
    first.focus();
  }
}

// openLightbox : dispatcher. Deux chemins d'entrée qui gèrent CHACUN leur
// cycle complet. Le chemin View Transitions ne partage rien avec le
// setTimeout 600ms du FLIP (nettoyage des transform inline) : structure
// volontairement séparée pour éviter tout héritage croisé.
function openLightbox(sourceEl, opts = {}) {
  const histMode = opts.history || 'push';
  if (useViewTransition()) openLightboxVT(sourceEl, histMode);
  else openLightboxFlip(sourceEl, histMode);
}

// Construit et monte la lightbox : DOM + état + événements + focus +
// historique + préchargement voisins. SANS mise en scène d'entrée — chaque
// chemin (FLIP / VT) pose ensuite la sienne. `initialSrc` (optionnel) sert
// d'image de départ (chemin VT) ; à défaut on affiche la pleine réso.
// Retourne les nœuds utiles + `fullSrc` (URL pleine résolution à rétablir).
function createLightboxDOM(sourceEl, histMode, initialSrc) {
  const slug = sourceEl.dataset.slug;

  // Galerie de la lightbox = items visibles (respecte le filtre courant).
  const items = document.querySelectorAll('.gallery-item:not(.hidden)');
  lightboxGallery = Array.from(items).map(el => ({
    slug: el.dataset.slug,
    // .src (l'attribut) reste l'URL PLEINE RÉSOLUTION même si le navigateur a
    // chargé une variante srcset ; la lightbox affiche donc bien la pleine réso.
    src: el.querySelector('img').src,
    work: WORKS_BY_SLUG[el.dataset.slug],
    el
  }));

  lightboxIndex = lightboxGallery.findIndex(it => it.slug === slug);
  if (lightboxIndex === -1) lightboxIndex = 0;

  const entry = lightboxGallery[lightboxIndex];
  const work = entry.work;
  const isTouch = 'ontouchstart' in window;

  lightboxSourceEl = sourceEl;

  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.id = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', lightboxLabel(work));

  const bg = document.createElement('div');
  bg.className = 'lightbox-bg';

  const wrap = document.createElement('div');
  wrap.className = 'lightbox-image-wrap';
  const img = document.createElement('img');
  // initialSrc (chemin VT) = variante DÉJÀ peinte de la vignette : la boîte de
  // l'image est ainsi correctement proportionnée (image chargée) dès le snapshot
  // « après » du morph. À défaut (FLIP), on affiche directement la pleine réso.
  img.src = initialSrc || entry.src;
  img.alt = altFor(work);
  wrap.appendChild(img);

  const controls = document.createElement('div');
  controls.className = 'lightbox-controls';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'lightbox-close';
  closeBtn.setAttribute('aria-label', 'Fermer');
  closeBtn.textContent = '×';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'lightbox-nav lightbox-prev';
  prevBtn.setAttribute('aria-label', 'Œuvre précédente');
  prevBtn.textContent = '‹';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'lightbox-nav lightbox-next';
  nextBtn.setAttribute('aria-label', 'Œuvre suivante');
  nextBtn.textContent = '›';

  // Cartel de musée : markup structuré (titre + filet + méta).
  const cartel = document.createElement('div');
  cartel.className = 'lightbox-cartel';
  cartel.innerHTML = lightboxCaption(work);

  const counter = document.createElement('span');
  counter.className = 'lightbox-counter';
  counter.textContent = `${lightboxIndex + 1} / ${lightboxGallery.length}`;

  controls.appendChild(closeBtn);
  controls.appendChild(prevBtn);
  controls.appendChild(nextBtn);
  controls.appendChild(cartel);
  controls.appendChild(counter);

  lb.appendChild(bg);
  lb.appendChild(wrap);
  lb.appendChild(controls);

  document.body.appendChild(lb);
  document.body.style.overflow = 'hidden';
  document.body.classList.add('cursor-hidden');
  lightboxOpen = true;
  lightboxPushed = (histMode === 'push');

  preloadLightboxNeighbors(lightboxIndex);
  syncLightboxHistory(slug, histMode);

  // Focus initial sur le bouton fermer (preventScroll : la page ne bouge pas).
  closeBtn.focus({ preventScroll: true });

  // Events
  closeBtn.addEventListener('click', () => closeLightbox());
  prevBtn.addEventListener('click', () => navigateLightbox(-1));
  nextBtn.addEventListener('click', () => navigateLightbox(1));
  bg.addEventListener('click', () => closeLightbox());

  // ── MOBILE TOUCH: pinch-zoom, pan, swipe nav, swipe-down close ──
  if (isTouch) {
    initLightboxTouch(lb, wrap, img);
  } else {
    // Desktop: click to toggle zoom
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      img.classList.toggle('zoomed');
    });
  }

  return { lb, img, wrap, fullSrc: entry.src };
}

// ── Chemin FLIP (repli universel, inchangé) ──────
// Zoom cinématique depuis la vignette. Le nettoyage des transform/transition
// inline à 600ms rend la main à la règle CSS .zoomed (click-to-zoom desktop).
function openLightboxFlip(sourceEl, histMode) {
  const { lb, img } = createLightboxDOM(sourceEl, histMode);

  if (sourceEl) {
    const sourceRect = sourceEl.getBoundingClientRect();
    const destX = window.innerWidth / 2;
    const destY = window.innerHeight / 2;
    const sourceX = sourceRect.left + sourceRect.width / 2;
    const sourceY = sourceRect.top + sourceRect.height / 2;

    img.style.transform = `translate(${sourceX - destX}px, ${sourceY - destY}px) scale(0.3)`;
    img.style.opacity = '0.5';

    requestAnimationFrame(() => {
      lb.classList.add('active', 'flip-entrance');
      img.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s';
      img.style.transform = 'translate(0, 0) scale(1)';
      img.style.opacity = '1';

      // Fin du FLIP : on lâche transform/transition inline (cf. .zoomed).
      setTimeout(() => {
        img.style.transform = '';
        img.style.transition = '';
      }, 600);
    });
  } else {
    requestAnimationFrame(() => lb.classList.add('active', 'flip-entrance'));
  }
}

// ── Chemin View Transitions (progressive enhancement) ──
// Morph natif vignette → œuvre. L'IMG source porte view-transition-name dans
// le snapshot « avant » ; l'IMG lightbox le porte dans le snapshot « après »
// (un seul élément nommé par snapshot, sinon l'API annule le morph). Aucun
// transform inline, aucun setTimeout 600ms : le navigateur orchestre, on ne
// fait que nettoyer les noms à la fin.
function openLightboxVT(sourceEl, histMode) {
  const sourceImg = sourceEl.querySelector('img');
  // Image de départ = la variante DÉJÀ peinte de la vignette : garantit une
  // boîte bien proportionnée au snapshot « après ». On passe en pleine réso
  // une fois le morph terminé (même image, plus fine → swap invisible).
  const seedSrc = (sourceImg && (sourceImg.currentSrc || sourceImg.src)) || undefined;
  if (sourceImg) sourceImg.style.viewTransitionName = VT_NAME;

  let fullSrc;
  const vt = document.startViewTransition(() => {
    // On retire le nom de la vignette AVANT de le poser sur l'image lightbox.
    if (sourceImg) sourceImg.style.viewTransitionName = '';
    const built = createLightboxDOM(sourceEl, histMode, seedSrc);
    fullSrc = built.fullSrc;
    // vt-run coupe les transitions CSS fond/contrôles → snapshot « après » net.
    built.lb.classList.add('active', 'vt-run');
    if (built.img) built.img.style.viewTransitionName = VT_NAME;
  });

  vt.finished.finally(() => {
    if (sourceImg) sourceImg.style.viewTransitionName = '';
    const lb = document.getElementById('lightbox');
    if (lb) {
      lb.classList.remove('vt-run');
      const img = lb.querySelector('.lightbox-image-wrap img');
      if (img) {
        img.style.viewTransitionName = '';
        // Passage en pleine résolution (invisible : même image, plus fine).
        // img.src (IDL) est absolu, fullSrc aussi → comparaison fiable.
        if (fullSrc && img.src !== fullSrc) img.src = fullSrc;
      }
    }
  });
}

// ── Mobile Touch Handler ──────────────────────
function initLightboxTouch(lb, wrap, img) {
  let scale = 1;
  let panX = 0, panY = 0;
  let startTouches = null;
  let startScale = 1;
  let startPanX = 0, startPanY = 0;
  let lastTapTime = 0;
  let swipeStartX = 0, swipeStartY = 0;
  let isSwiping = false;
  let isPinching = false;
  let swipeDismissY = 0;

  function applyTransform() {
    img.style.transition = 'none';
    img.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
  }

  function animateTransform() {
    img.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
    img.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
  }

  function resetZoom() {
    scale = 1;
    panX = 0;
    panY = 0;
    animateTransform();
    lb.classList.remove('lightbox-zoomed');
  }

  function clampPan() {
    if (scale <= 1) { panX = 0; panY = 0; return; }
    const rect = img.getBoundingClientRect();
    const imgW = rect.width;
    const imgH = rect.height;
    const viewW = window.innerWidth;
    const viewH = window.innerHeight;
    const maxPanX = Math.max(0, (imgW - viewW) / 2);
    const maxPanY = Math.max(0, (imgH - viewH) / 2);
    panX = Math.max(-maxPanX, Math.min(maxPanX, panX));
    panY = Math.max(-maxPanY, Math.min(maxPanY, panY));
  }

  function getTouchDistance(t1, t2) {
    return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
  }

  function getTouchCenter(t1, t2) {
    return { x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 };
  }

  // Prevent default to stop browser zoom / scroll
  wrap.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      isPinching = true;
      isSwiping = false;
      startTouches = { d: getTouchDistance(e.touches[0], e.touches[1]) };
      startScale = scale;
      startPanX = panX;
      startPanY = panY;
    } else if (e.touches.length === 1) {
      isPinching = false;
      swipeStartX = e.touches[0].clientX;
      swipeStartY = e.touches[0].clientY;
      startPanX = panX;
      startPanY = panY;
      isSwiping = true;
      swipeDismissY = 0;
    }
  }, { passive: false });

  wrap.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2 && isPinching) {
      e.preventDefault();
      const newDist = getTouchDistance(e.touches[0], e.touches[1]);
      const ratio = newDist / startTouches.d;
      scale = Math.max(1, Math.min(4, startScale * ratio));

      if (scale > 1) {
        lb.classList.add('lightbox-zoomed');
      }

      clampPan();
      applyTransform();
    } else if (e.touches.length === 1 && isSwiping) {
      const dx = e.touches[0].clientX - swipeStartX;
      const dy = e.touches[0].clientY - swipeStartY;

      if (scale > 1.05) {
        // Panning while zoomed
        e.preventDefault();
        panX = startPanX + dx;
        panY = startPanY + dy;
        clampPan();
        applyTransform();
      } else {
        // Swipe navigation or dismiss
        swipeDismissY = dy;
        // Vertical drag → dismiss feedback
        if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) {
          e.preventDefault();
          const opacity = Math.max(0.2, 1 - Math.abs(dy) / 300);
          img.style.transition = 'none';
          img.style.transform = `translateY(${dy * 0.6}px) scale(${1 - Math.abs(dy) * 0.0008})`;
          lb.querySelector('.lightbox-bg').style.opacity = opacity;
        }
      }
    }
  }, { passive: false });

  wrap.addEventListener('touchend', (e) => {
    if (isPinching && e.touches.length < 2) {
      isPinching = false;
      if (scale < 1.1) resetZoom();
      else { clampPan(); animateTransform(); }
      return;
    }

    if (!isSwiping) return;
    isSwiping = false;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const dx = endX - swipeStartX;
    const dy = endY - swipeStartY;

    // If zoomed → snap pan
    if (scale > 1.05) {
      clampPan();
      animateTransform();
      return;
    }

    // Swipe down to close
    if (Math.abs(dy) > 120 && Math.abs(dy) > Math.abs(dx)) {
      closeLightbox();
      return;
    }

    // Reset dismiss feedback
    if (Math.abs(swipeDismissY) > 10) {
      img.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
      img.style.transform = 'translateY(0) scale(1)';
      lb.querySelector('.lightbox-bg').style.opacity = '';
      lb.querySelector('.lightbox-bg').style.transition = 'opacity 0.3s';
    }

    // Horizontal swipe → navigate (avec inertie ressort sur l'image sortante)
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      navigateLightbox(dx < 0 ? 1 : -1, { spring: true });
      return;
    }
  });

  // Double-tap to zoom
  wrap.addEventListener('click', (e) => {
    const now = Date.now();
    if (now - lastTapTime < 300) {
      e.stopPropagation();
      if (scale > 1.05) {
        resetZoom();
      } else {
        scale = 2.5;
        panX = 0;
        panY = 0;
        lb.classList.add('lightbox-zoomed');
        animateTransform();
      }
    }
    lastTapTime = now;
  });
}

// dir : ±1. opts.spring : au relâchement d'un swipe validé, l'image sortante
// glisse avec un ressort (spring) doux plutôt que l'easing par défaut. Les
// flèches (clavier/boutons) gardent le slide standard — inchangé.
function navigateLightbox(dir, opts = {}) {
  if (lightboxGallery.length <= 1) return;
  const spring = opts.spring === true && !prefersReducedMotion();

  lightboxIndex = (lightboxIndex + dir + lightboxGallery.length) % lightboxGallery.length;
  const entry = lightboxGallery[lightboxIndex];
  const work = entry.work;
  const lb = document.getElementById('lightbox');
  if (!lb) return;

  preloadLightboxNeighbors(lightboxIndex);

  const img = lb.querySelector('.lightbox-image-wrap img');
  const cartel = lb.querySelector('.lightbox-cartel');
  const counter = lb.querySelector('.lightbox-counter');

  lb.setAttribute('aria-label', lightboxLabel(work));

  // Ressort de swipe : easing spring-like, 0.35s, discret. Sinon on laisse
  // la transition CSS par défaut (.lightbox-image-wrap img) porter le slide.
  const out = spring ? 60 : 40;
  if (spring) {
    img.style.transition = 'transform 0.35s cubic-bezier(0.34, 1.3, 0.64, 1), opacity 0.3s';
  }

  img.style.opacity = '0';
  img.style.transform = `translateX(${dir * out}px) scale(0.97)`;
  img.classList.remove('zoomed');
  lb.classList.remove('lightbox-zoomed');

  setTimeout(() => {
    img.src = entry.src;
    img.alt = altFor(work);
    if (cartel) cartel.innerHTML = lightboxCaption(work);
    counter.textContent = `${lightboxIndex + 1} / ${lightboxGallery.length}`;

    img.style.transform = `translateX(${-dir * out}px) scale(0.97)`;
    requestAnimationFrame(() => {
      img.style.opacity = '1';
      img.style.transform = 'translateX(0) scale(1)';

      // Fin du slide : on relâche transform/transition inline (cf. .zoomed).
      setTimeout(() => {
        img.style.transform = '';
        img.style.transition = '';
      }, 600);
    });
  }, 200);

  // Deep-link : remplace le hash par le slug courant, sans empiler d'historique.
  syncLightboxHistory(entry.slug, 'replace');
}

// closeLightbox : dispatcher symétrique de l'ouverture. Chaque chemin gère
// son cycle (le VT ne dépend pas du setTimeout 500ms de fondu du FLIP).
function closeLightbox({ fromPopstate = false } = {}) {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  if (useViewTransition()) closeLightboxVT(lb, fromPopstate);
  else closeLightboxFlip(lb, fromPopstate);
}

// État commun de fermeture : sortie du mode modal, historique, restitution du
// focus. Partagé par les deux chemins ; ne touche PAS au DOM de la lightbox
// (retrait spécifique à chaque chemin).
function finalizeCloseState(fromPopstate) {
  lightboxOpen = false;
  document.body.style.overflow = '';
  document.body.classList.remove('cursor-hidden');

  // Historique : ne rien faire si la fermeture découle déjà d'un popstate
  // (le navigateur a déjà dépilé l'entrée).
  if (!fromPopstate) {
    if (lightboxPushed) {
      // On avait empilé une entrée #oeuvre à l'ouverture → on la dépile.
      // Le popstate qui suit voit lightboxOpen=false → aucun double teardown.
      history.back();
    } else {
      // Ouverture par deep-link direct (aucune entrée empilée) → on nettoie le hash.
      history.replaceState(null, '', location.pathname + location.search);
    }
  }
  lightboxPushed = false;

  // Restitution du focus à la vignette d'origine.
  if (lightboxSourceEl && typeof lightboxSourceEl.focus === 'function') {
    lightboxSourceEl.focus({ preventScroll: true });
  }
  lightboxSourceEl = null;
}

// ── Fermeture FLIP (repli universel, inchangé) ──
// Fondu via retrait de .active, puis retrait du nœud à 500ms.
function closeLightboxFlip(lb, fromPopstate) {
  lb.classList.remove('active');
  lb.classList.remove('lightbox-zoomed');
  setTimeout(() => lb.remove(), 500);
  finalizeCloseState(fromPopstate);
}

// ── Fermeture View Transitions ──
// Morph inverse œuvre → vignette. L'IMG lightbox est nommée pour le snapshot
// « avant » ; le teardown (retrait de la lightbox + nom reposé sur la vignette)
// constitue le snapshot « après ». On capture la vignette AVANT finalize
// (qui remet lightboxSourceEl à null).
function closeLightboxVT(lb, fromPopstate) {
  const img = lb.querySelector('.lightbox-image-wrap img');
  const sourceEl = lightboxSourceEl;
  const sourceImg = sourceEl && sourceEl.querySelector('img');

  lb.classList.remove('lightbox-zoomed');
  lb.classList.add('vt-run');
  if (img) img.style.viewTransitionName = VT_NAME;

  const vt = document.startViewTransition(() => {
    lb.remove();
    if (sourceImg) sourceImg.style.viewTransitionName = VT_NAME;
  });

  vt.finished.finally(() => {
    if (sourceImg) sourceImg.style.viewTransitionName = '';
  });

  finalizeCloseState(fromPopstate);
}

// ══════════════════════════════════════════════
// PARALLAX
// ══════════════════════════════════════════════
function initParallax() {
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (!parallaxEls.length) return;

  // getBoundingClientRect() par élément : acceptable une fois par frame,
  // c'est pourquoi ça reste dans le callback rAF du dispatcher commun.
  scrollCallbacks.push(() => {
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.1;
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const offset = (center - window.innerHeight / 2) * speed;

      const img = el.querySelector('img');
      if (img) {
        img.style.transform = `translateY(${offset}px)`;
      }
    });
  });
}

// ══════════════════════════════════════════════
// TEXT REVEAL — character by character
// ══════════════════════════════════════════════
function initTextReveal() {
  document.querySelectorAll('.section-title[data-reveal]').forEach(title => {
    let i = 0;

    // Wrap each character of a text node in a <span class="char">,
    // incrementing the delay counter globally across the whole title.
    const wrapChars = (str) => {
      const frag = document.createDocumentFragment();
      [...str].forEach(char => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = char === ' ' ? ' ' : char;
        span.style.transitionDelay = `${i * 0.025}s`;
        i++;
        frag.appendChild(span);
      });
      return frag;
    };

    // Walk childNodes instead of textContent so <br> and other elements
    // (ex. <em>) survive the rebuild.
    const walk = (node) => {
      const out = document.createDocumentFragment();
      node.childNodes.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
          out.appendChild(wrapChars(child.textContent));
        } else if (child.nodeName === 'BR') {
          out.appendChild(child.cloneNode(true));
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const clone = child.cloneNode(false);
          clone.appendChild(walk(child));
          out.appendChild(clone);
        }
      });
      return out;
    };

    const rebuilt = walk(title);
    title.innerHTML = '';
    title.appendChild(rebuilt);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.section-title[data-reveal]').forEach(el => observer.observe(el));
}

// ══════════════════════════════════════════════
// SCROLL REVEAL
// ══════════════════════════════════════════════
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .stagger').forEach(el => observer.observe(el));
}

// ══════════════════════════════════════════════
// SCROLL PROGRESS
// ══════════════════════════════════════════════
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;

  scrollCallbacks.push(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  });
}

// ══════════════════════════════════════════════
// BACK TO TOP
// ══════════════════════════════════════════════
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  scrollCallbacks.push(() => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
