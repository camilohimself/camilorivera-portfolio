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

// Featured paintings for horizontal scroll
const FEATURED = [
  { src: "images/paintings/Abstrait 2017.webp", label: "Huile sur toile" },
  { src: "images/encres/DE67C11E-EA54-4B63-AF46-35AB65BC9A1E.webp", label: "Encre de Chine" },
  { src: "images/paintings/berceau bleu.webp", label: "Huile sur toile" },
  { src: "images/paintings/2069C456-9AE8-4F5A-B35E-52B80A9605D2.webp", label: "Huile sur toile" },
  { src: "images/encres/82E94A6B-E49D-4430-91AC-94D596E18576.webp", label: "Encre de Chine" },
  { src: "images/paintings/lejaune.webp", label: "Huile sur toile" },
  { src: "images/paintings/76845302_2716476255134187_2382461608643389949_n.webp", label: "Huile sur toile" },
  { src: "images/encres/3AF5264E-328A-4A24-BC65-4E7586AAF4D8.webp", label: "Encre de Chine" },
];

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

// ── Init ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initHeroTextReveal();
  initNavigation();
  initFeatured();
  initGallery();
  initLightbox();
  initParallax();
  initScrollReveal();
  initTextReveal();
  initScrollProgress();
  initBackToTop();
  initCookieBanner();
});

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
    document.querySelectorAll('.gallery-item, .featured-item').forEach(el => {
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
// FEATURED — Horizontal Scroll
// ══════════════════════════════════════════════
function initFeatured() {
  const track = document.getElementById('featured-track');
  if (!track) return;

  FEATURED.forEach(item => {
    const el = document.createElement('div');
    el.className = 'featured-item';

    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.label;
    img.loading = 'lazy';

    const overlay = document.createElement('div');
    overlay.className = 'featured-item-overlay';

    const label = document.createElement('span');
    label.className = 'featured-item-label';
    label.textContent = item.label;

    overlay.appendChild(label);
    el.appendChild(img);
    el.appendChild(overlay);

    // Click opens lightbox
    el.addEventListener('click', () => {
      openLightbox(null, item.src);
    });

    track.appendChild(el);
  });

  // Drag to scroll
  let isDown = false;
  let startX, scrollLeft;

  track.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });

  track.addEventListener('mouseleave', () => { isDown = false; });
  track.addEventListener('mouseup', () => { isDown = false; });

  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollLeft - walk;
  });
}

// ══════════════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════════════
function initNavigation() {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const mobile = document.querySelector('.nav-mobile');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

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
  img.src = item.src;
  img.alt = item.technique;
  img.loading = 'lazy';

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
      allItems.push({ category, src: PATHS[category] + file, technique: LABELS[category], index: i });
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

  // If from featured, add it
  if (lightboxGallery.length === 0) {
    lightboxGallery = FEATURED.map(f => ({ src: f.src, technique: f.label, el: null }));
  }

  const filename = src.split('/').pop();
  lightboxIndex = lightboxGallery.findIndex(item => item.src.includes(filename));
  if (lightboxIndex === -1) lightboxIndex = 0;

  const item = lightboxGallery[lightboxIndex];

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
    });
  } else {
    requestAnimationFrame(() => lb.classList.add('active'));
  }

  // Events
  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => navigateLightbox(-1));
  nextBtn.addEventListener('click', () => navigateLightbox(1));

  bg.addEventListener('click', closeLightbox);

  img.addEventListener('click', (e) => {
    e.stopPropagation();
    img.classList.toggle('zoomed');
  });

  // Touch swipe
  let touchStartX = 0;
  lb.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) navigateLightbox(diff > 0 ? 1 : -1);
  });
}

function navigateLightbox(dir) {
  if (lightboxGallery.length <= 1) return;

  lightboxIndex = (lightboxIndex + dir + lightboxGallery.length) % lightboxGallery.length;
  const item = lightboxGallery[lightboxIndex];
  const lb = document.getElementById('lightbox');
  if (!lb) return;

  const img = lb.querySelector('.lightbox-image-wrap img');
  const technique = lb.querySelector('.lightbox-technique');
  const counter = lb.querySelector('.lightbox-counter');

  img.style.opacity = '0';
  img.style.transform = `translateX(${dir * 40}px) scale(0.97)`;
  img.classList.remove('zoomed');

  setTimeout(() => {
    img.src = item.src;
    img.alt = item.technique;
    technique.textContent = item.technique;
    counter.textContent = `${lightboxIndex + 1} / ${lightboxGallery.length}`;

    img.style.transform = `translateX(${-dir * 40}px) scale(0.97)`;
    requestAnimationFrame(() => {
      img.style.opacity = '1';
      img.style.transform = 'translateX(0) scale(1)';
    });
  }, 200);
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;

  lb.classList.remove('active');
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

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

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
  }, { passive: true });
}

// ══════════════════════════════════════════════
// TEXT REVEAL — character by character
// ══════════════════════════════════════════════
function initTextReveal() {
  document.querySelectorAll('.section-title[data-reveal]').forEach(title => {
    const text = title.textContent;
    title.innerHTML = '';

    // Split by lines (look for <br> in original HTML)
    const originalHTML = title.dataset.reveal || text;

    [...text].forEach((char, i) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = char === ' ' ? '\u00a0' : char;
      span.style.transitionDelay = `${i * 0.025}s`;
      title.appendChild(span);
    });
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

  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  }, { passive: true });
}

// ══════════════════════════════════════════════
// BACK TO TOP
// ══════════════════════════════════════════════
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ══════════════════════════════════════════════
// COOKIE BANNER
// ══════════════════════════════════════════════
function initCookieBanner() {
  if (localStorage.getItem('cookies-choice')) return;

  const banner = document.getElementById('cookie-banner');
  if (!banner) return;

  setTimeout(() => banner.classList.add('visible'), 1500);

  const dismiss = () => {
    banner.classList.add('hiding');
    banner.classList.remove('visible');
    setTimeout(() => banner.remove(), 600);
  };

  document.getElementById('cookie-accept').addEventListener('click', () => {
    localStorage.setItem('cookies-choice', 'accepted');
    dismiss();
  });

  document.getElementById('cookie-decline').addEventListener('click', () => {
    localStorage.setItem('cookies-choice', 'declined');
    dismiss();
  });
}
