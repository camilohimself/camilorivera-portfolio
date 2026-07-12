/* ═══════════════════════════════════════════════
   CAMILO RIVERA — Portfolio 2026
   "Probably the most beautiful portfolio in the world"
   ═══════════════════════════════════════════════ */

// ── Gallery Data ────────────────────────────────

const GALLERY = {
  paintings: [
    "2069C456-9AE8-4F5A-B35E-52B80A9605D2.webp",
    "241240340_255290506453650_8691736928064111730_n.webp",
    "245ED55B-2694-478D-AF2A-2391A61F5005.webp",
    "4F9CB35A-F34A-4D53-B785-53F2C264A2CC 2.webp",
    "5bdca9d5-f8be-4cba-bf45-aa0a8a393a49.webp",
    "C02001B6-E7C4-4E98-8719-A72A5C222221.webp",
    "DA381FB0-8774-4F18-A775-176A062AA833 2.webp",
    "E69C2BAA-DDDB-4CAC-A621-FBBA68373234 3.webp",
    "FA261FBD-CB95-427F-A772-0D0A9E998D9E 2.webp",
    "IMG_0586.webp", "IMG_0763.webp", "IMG_0792 2.webp",
    "IMG_0869 2.webp", "IMG_4098.webp", "IMG_4104.webp",
    "IMG_5030.webp", "IMG_5036.webp", "IMG_5048.webp",
    "berceau bleu.webp", "lejaune.webp",
    "119134831_121586616111055_4139209887395335536_n.webp",
    "44489551_735378140156879_8490676937891947937_n.webp",
    "45991042_353783608509449_6629598230452393544_n.webp",
    "46141362_136434087338223_1568855912250128174_n.webp",
    "46522503_1183661995121902_5060497401993855762_n.webp",
    "47203626_201263684162569_3329879816042593797_n.webp",
    "76845302_2716476255134187_2382461608643389949_n.webp",
    "Abstrait 2017-2.webp", "Abstrait 2017.webp"
  ],
  encres: [
    "1025E971-FC37-4284-B104-508562EF2D17.webp",
    "27216297-5A1A-44BA-8F04-DE41FB32E77E.webp",
    "3873A3C3-3FEA-4EA1-88DF-DD5DBED3DE54.webp",
    "3AF5264E-328A-4A24-BC65-4E7586AAF4D8.webp",
    "43150C4B-17AB-4B21-B5BF-28B02985BE81.webp",
    "7390EA9D-8440-4D5A-99CE-0F93E80098FA.webp",
    "82E94A6B-E49D-4430-91AC-94D596E18576.webp",
    "9B6F8B83-B5BF-41A0-98D7-19C864B8EC90.webp",
    "B6BB33BB-CF53-433E-ABF8-55C5E44F0B4B.webp",
    "B7B8FC71-48B0-413E-9C58-C8F7450D6E51.webp",
    "CEEBA166-0861-40C9-90C3-8B7714BA8143.webp",
    "DE67C11E-EA54-4B63-AF46-35AB65BC9A1E.webp",
    "IMG_1894.webp", "IMG_1963.webp", "IMG_2057.webp",
    "IMG_2161.webp", "IMG_3708.webp", "IMG_3710.webp",
    "IMG_3718.webp", "IMG_3727.webp", "IMG_3736.webp",
    "IMG_3737.webp", "IMG_3868 2.webp", "IMG_4810 2.webp",
    "IMG_4815.webp", "IMG_4936.webp"
  ],
  shooting: [
    "IMG_4316-2-opt.webp", "IMG_4316-opt.webp", "IMG_4317-opt.webp",
    "IMG_4318-opt.webp", "IMG_4331-opt.webp", "IMG_4333-opt.webp",
    "IMG_4335-opt.webp", "IMG_4341-opt.webp", "IMG_4344-opt.webp",
    "IMG_4347-opt.webp", "IMG_4350-opt.webp", "IMG_4351 2-opt.webp",
    "IMG_4351-opt.webp", "IMG_4360 2-opt.webp", "IMG_4360-opt.webp",
    "IMG_4362-opt.webp", "IMG_4367-opt.webp", "IMG_4371-opt.webp",
    "IMG_4376-opt.webp", "IMG_4377-opt.webp", "IMG_4391-opt.webp",
    "IMG_4396-opt.webp", "IMG_4400-opt.webp", "IMG_4405-opt.webp",
    "IMG_4413-opt.webp", "IMG_4414-opt.webp", "IMG_4419-opt.webp",
    "IMG_4420-opt.webp", "IMG_4423-opt.webp",
    "IMG_4425-opt.webp", "IMG_4428-opt.webp", "IMG_4430-opt.webp",
    "IMG_4433-opt.webp", "IMG_4434-opt.webp", "IMG_4435-opt.webp",
    "IMG_4441-opt.webp", "IMG_4443-opt.webp", "IMG_4447-opt.webp",
    "IMG_4449-opt.webp", "IMG_4452-opt.webp", "IMG_4454-opt.webp",
    "IMG_4459-opt.webp", "IMG_4464-opt.webp", "IMG_4465-opt.webp",
    "IMG_4472-opt.webp", "IMG_4477-opt.webp", "IMG_4480-opt.webp",
    "IMG_4482-opt.webp", "IMG_4488-opt.webp", "IMG_4489-opt.webp",
    "IMG_4490-opt.webp", "IMG_4496-opt.webp", "IMG_4503-opt.webp",
    "IMG_4519-opt.webp", "IMG_4526-opt.webp", "IMG_4547-opt.webp",
    "IMG_4550-opt.webp", "IMG_4613-opt.webp", "IMG_4615-opt.webp",
    "IMG_4633-opt.webp"
  ]
};

const LABELS = { paintings: 'Huile sur toile', encres: 'Encre de Chine', shooting: 'Atelier' };
const PATHS = { paintings: 'images/paintings/', encres: 'images/encres/', shooting: 'images/shooting/' };

// ── State ───────────────────────────────────────
let currentFilter = 'all';
let lightboxGallery = [];
let lightboxIndex = 0;
let lightboxOpen = false;
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let ringX = 0, ringY = 0;

// Registre commun des callbacks scroll (pattern ticking : un seul
// listener passif, un seul rAF, N mises à jour dedans).
const scrollCallbacks = [];
let scrollTicking = false;

// ── Init ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initHeroVideo();
  initCustomCursor();
  initHeroTextReveal();
  initNavigation();
  initGallery();
  initLightbox();
  initParallax();
  initScrollReveal();
  initTextReveal();
  initScrollProgress();
  initBackToTop();
  initScrollDispatcher();
});

// ══════════════════════════════════════════════
// HERO VIDEO — rendition switch (pas de <source> en dur)
// ══════════════════════════════════════════════
function initHeroVideo() {
  const video = document.querySelector('.hero-video-wrap video');
  if (!video) return;

  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  video.src = isMobile ? 'videos/hero-drone-mobile.mp4' : 'videos/hero-drone-optimized.mp4';

  // L'autoplay peut être refusé par le navigateur (économie de données,
  // politique autoplay) — on ignore silencieusement, le poster reste affiché.
  video.play().catch(() => {});
}

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

  // Hover states for interactive elements
  document.querySelectorAll('a, button, .filter-btn').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Gallery items get special cursor
  const addGalleryCursor = () => {
    document.querySelectorAll('.gallery-item').forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.remove('cursor-hover');
        document.body.classList.add('cursor-gallery');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-gallery');
      });
    });
  };

  // Run after gallery is built
  setTimeout(addGalleryCursor, 100);

  // Magnetic hover effect on gallery items
  initMagneticHover();
}

// ══════════════════════════════════════════════
// MAGNETIC HOVER
// ══════════════════════════════════════════════
function initMagneticHover() {
  if ('ontouchstart' in window) return;

  // Debounced setup after gallery renders
  setTimeout(() => {
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const strength = 0.03;

        item.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });

      item.addEventListener('mouseleave', () => {
        item.style.transform = '';
      });
    });
  }, 200);
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
      // Preserve <em> tags
      return `<span class="word"><span class="word-inner" style="animation-delay: ${0.5 + i * 0.08}s">${word}</span></span>`;
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
      toggle.classList.toggle('active');
      mobile.classList.toggle('open');
      document.body.style.overflow = mobile.classList.contains('open') ? 'hidden' : '';
    });

    mobile.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('active');
        mobile.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ══════════════════════════════════════════════
// GALLERY
// ══════════════════════════════════════════════
function createGalleryItem(item) {
  const el = document.createElement('div');
  el.className = 'gallery-item clip-reveal';
  el.dataset.category = item.category;

  const img = document.createElement('img');
  img.alt = item.technique;
  img.loading = 'lazy';

  // Dimensions intrinsèques + srcset responsive (variantes générées par
  // tools/generate-image-variants.sh). Si l'image n'est pas dans DIMS
  // (fichier généré après le dernier passage du script), on ne pose
  // rien — repli silencieux sur le seul `src` pleine résolution.
  // ORDRE CRITIQUE : loading/width/height/sizes/srcset AVANT src —
  // affecter src en premier déclenche immédiatement le fetch de la
  // pleine résolution et le navigateur ne rétrograde jamais vers la
  // variante 480/800 ensuite (sélection déjà faite, ressource en cache).
  const dims = (typeof DIMS !== 'undefined') && DIMS[`${item.category}/${item.file}`];
  if (dims) {
    const [w, h] = dims;
    img.width = w;
    img.height = h;

    const stem = item.file.replace(/\.webp$/, '');
    const base = PATHS[item.category];
    // encodeURI() est indispensable ici : plusieurs fichiers contiennent
    // des espaces ("berceau bleu.webp") qui, non encodés, casseraient le
    // parsing de srcset (l'espace y sépare URL et descripteur de largeur).
    img.sizes = '(max-width: 480px) 92vw, (max-width: 1024px) 46vw, 30vw';
    img.srcset = [
      `${encodeURI(base + stem + '-480.webp')} 480w`,
      `${encodeURI(base + stem + '-800.webp')} 800w`,
      `${encodeURI(item.src)} ${w}w`
    ].join(', ');
  }
  img.src = item.src;

  const overlay = document.createElement('div');
  overlay.className = 'gallery-item-overlay';

  const info = document.createElement('span');
  info.className = 'gallery-item-info';
  info.textContent = item.technique;

  overlay.appendChild(info);
  el.appendChild(img);
  el.appendChild(overlay);

  el.addEventListener('click', () => {
    openLightbox(item.category, item.src, el);
  });

  return el;
}

function initGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  const allItems = [];
  for (const [category, files] of Object.entries(GALLERY)) {
    files.forEach((file, i) => {
      allItems.push({ category, file, src: PATHS[category] + file, technique: LABELS[category], index: i });
    });
  }

  const shuffled = interleaveGallery(allItems);
  shuffled.forEach(item => grid.appendChild(createGalleryItem(item)));

  // Stagger entrance with clip-path reveal
  requestAnimationFrame(() => {
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
  });

  // Filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setFilter(btn.dataset.filter, grid);
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

function interleaveGallery(items) {
  const groups = {};
  items.forEach(item => {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  });

  Object.values(groups).forEach(arr => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  });

  const result = [];
  const keys = Object.keys(groups);
  const maxLen = Math.max(...Object.values(groups).map(a => a.length));

  for (let i = 0; i < maxLen; i++) {
    for (const key of keys) {
      if (groups[key][i]) result.push(groups[key][i]);
    }
  }
  return result;
}

function setFilter(filter, grid) {
  currentFilter = filter;
  grid.querySelectorAll('.gallery-item').forEach((item, i) => {
    const match = filter === 'all' || item.dataset.category === filter;
    item.classList.toggle('hidden', !match);
    if (match) item.style.transitionDelay = `${(i % 6) * 0.04}s`;
  });
}

// ══════════════════════════════════════════════
// LIGHTBOX — Cinematic FLIP animation
// ══════════════════════════════════════════════
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
    }
  });
}

function openLightbox(category, src, sourceEl) {
  // Build gallery from visible items
  const items = document.querySelectorAll('.gallery-item:not(.hidden)');
  lightboxGallery = Array.from(items).map(el => ({
    src: el.querySelector('img').src,
    technique: el.querySelector('.gallery-item-info').textContent,
    el: el
  }));

  const filename = src.split('/').pop();
  lightboxIndex = lightboxGallery.findIndex(item => item.src.includes(filename));
  if (lightboxIndex === -1) lightboxIndex = 0;

  const item = lightboxGallery[lightboxIndex];
  const isTouch = 'ontouchstart' in window;

  // Create lightbox with separate bg for FLIP
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.id = 'lightbox';

  const bg = document.createElement('div');
  bg.className = 'lightbox-bg';

  const wrap = document.createElement('div');
  wrap.className = 'lightbox-image-wrap';
  const img = document.createElement('img');
  img.src = item.src;
  img.alt = item.technique;
  wrap.appendChild(img);

  const controls = document.createElement('div');
  controls.className = 'lightbox-controls';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'lightbox-close';
  closeBtn.setAttribute('aria-label', 'Fermer');
  closeBtn.textContent = '\u00d7';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'lightbox-nav lightbox-prev';
  prevBtn.textContent = '\u2039';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'lightbox-nav lightbox-next';
  nextBtn.textContent = '\u203a';

  const technique = document.createElement('span');
  technique.className = 'lightbox-technique';
  technique.textContent = item.technique;

  const counter = document.createElement('span');
  counter.className = 'lightbox-counter';
  counter.textContent = `${lightboxIndex + 1} / ${lightboxGallery.length}`;

  controls.appendChild(closeBtn);
  controls.appendChild(prevBtn);
  controls.appendChild(nextBtn);
  controls.appendChild(technique);
  controls.appendChild(counter);

  lb.appendChild(bg);
  lb.appendChild(wrap);
  lb.appendChild(controls);

  document.body.appendChild(lb);
  document.body.style.overflow = 'hidden';
  document.body.classList.add('cursor-hidden');
  lightboxOpen = true;

  preloadLightboxNeighbors(lightboxIndex);

  // FLIP animation from source element
  if (sourceEl) {
    const sourceRect = sourceEl.getBoundingClientRect();
    const destX = window.innerWidth / 2;
    const destY = window.innerHeight / 2;
    const sourceX = sourceRect.left + sourceRect.width / 2;
    const sourceY = sourceRect.top + sourceRect.height / 2;

    img.style.transform = `translate(${sourceX - destX}px, ${sourceY - destY}px) scale(0.3)`;
    img.style.opacity = '0.5';

    requestAnimationFrame(() => {
      lb.classList.add('active');
      img.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s';
      img.style.transform = 'translate(0, 0) scale(1)';
      img.style.opacity = '1';

      // Once the FLIP settle animation is done, drop the inline transform/transition
      // so the CSS .zoomed rule (desktop click-to-zoom) can take over again.
      setTimeout(() => {
        img.style.transform = '';
        img.style.transition = '';
      }, 600);
    });
  } else {
    requestAnimationFrame(() => lb.classList.add('active'));
  }

  // Events
  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => navigateLightbox(-1));
  nextBtn.addEventListener('click', () => navigateLightbox(1));

  bg.addEventListener('click', closeLightbox);

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

    // Horizontal swipe → navigate
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      navigateLightbox(dx < 0 ? 1 : -1);
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

function navigateLightbox(dir) {
  if (lightboxGallery.length <= 1) return;

  lightboxIndex = (lightboxIndex + dir + lightboxGallery.length) % lightboxGallery.length;
  const item = lightboxGallery[lightboxIndex];
  const lb = document.getElementById('lightbox');
  if (!lb) return;

  preloadLightboxNeighbors(lightboxIndex);

  const img = lb.querySelector('.lightbox-image-wrap img');
  const technique = lb.querySelector('.lightbox-technique');
  const counter = lb.querySelector('.lightbox-counter');

  img.style.opacity = '0';
  img.style.transform = `translateX(${dir * 40}px) scale(0.97)`;
  img.classList.remove('zoomed');
  lb.classList.remove('lightbox-zoomed');

  setTimeout(() => {
    img.src = item.src;
    img.alt = item.technique;
    technique.textContent = item.technique;
    counter.textContent = `${lightboxIndex + 1} / ${lightboxGallery.length}`;

    img.style.transform = `translateX(${-dir * 40}px) scale(0.97)`;
    requestAnimationFrame(() => {
      img.style.opacity = '1';
      img.style.transform = 'translateX(0) scale(1)';

      // Same as openLightbox: release the inline transform once the slide
      // transition has settled so CSS (.zoomed) can apply again.
      setTimeout(() => {
        img.style.transform = '';
      }, 600);
    });
  }, 200);
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;

  lb.classList.remove('active');
  lb.classList.remove('lightbox-zoomed');
  lightboxOpen = false;
  document.body.style.overflow = '';
  document.body.classList.remove('cursor-hidden');

  setTimeout(() => lb.remove(), 500);
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
        span.textContent = char === ' ' ? '\u00a0' : char;
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
