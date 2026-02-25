/* ═══════════════════════════════════════════════
   CAMILO RIVERA — Portfolio 2026
   Main Application
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
    "IMG_0586.webp",
    "IMG_0763.webp",
    "IMG_0792 2.webp",
    "IMG_0869 2.webp",
    "IMG_4098.webp",
    "IMG_4104.webp",
    "IMG_5030.webp",
    "IMG_5036.webp",
    "IMG_5048.webp",
    "berceau bleu.webp",
    "lejaune.webp",
    "119134831_121586616111055_4139209887395335536_n.webp",
    "329029653_2862536503883613_6873245196459249783_n.webp",
    "44489551_735378140156879_8490676937891947937_n.webp",
    "45991042_353783608509449_6629598230452393544_n.webp",
    "46141362_136434087338223_1568855912250128174_n.webp",
    "46522503_1183661995121902_5060497401993855762_n.webp",
    "47203626_201263684162569_3329879816042593797_n.webp",
    "76845302_2716476255134187_2382461608643389949_n.webp",
    "Abstrait 2017-2.webp",
    "Abstrait 2017.webp"
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
    "IMG_1894.webp",
    "IMG_1963.webp",
    "IMG_2057.webp",
    "IMG_2161.webp",
    "IMG_3708.webp",
    "IMG_3710.webp",
    "IMG_3718.webp",
    "IMG_3727.webp",
    "IMG_3736.webp",
    "IMG_3737.webp",
    "IMG_3868 2.webp",
    "IMG_4810 2.webp",
    "IMG_4815.webp",
    "IMG_4936.webp"
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
    "IMG_4420-opt.webp", "IMG_4421-opt.webp", "IMG_4423-opt.webp",
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
    "IMG_4633-opt.webp", "IMG_4670-opt.webp"
  ]
};

const LABELS = {
  paintings: 'Huile sur toile',
  encres: 'Encre de Chine',
  shooting: 'Atelier'
};

const PATHS = {
  paintings: 'images/paintings/',
  encres: 'images/encres/',
  shooting: 'images/shooting/'
};

// ── State ───────────────────────────────────────

let currentFilter = 'all';
let lightboxGallery = [];
let lightboxIndex = 0;
let lightboxOpen = false;

// ── Init ────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initGallery();
  initLightbox();
  initScrollReveal();
  initScrollProgress();
  initBackToTop();
  initCookieBanner();
});

// ── Navigation ──────────────────────────────────

function initNavigation() {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const mobile = document.querySelector('.nav-mobile');

  // Scroll effect
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Mobile toggle
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

  // Smooth scroll for anchor links
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

// ── Gallery ─────────────────────────────────────

function createGalleryItem(item) {
  const el = document.createElement('div');
  el.className = 'gallery-item';
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
    openLightbox(item.category, item.src);
  });

  return el;
}

function initGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  // Build all items
  const allItems = [];

  for (const [category, files] of Object.entries(GALLERY)) {
    files.forEach((file, i) => {
      allItems.push({
        category,
        src: PATHS[category] + file,
        technique: LABELS[category],
        index: i
      });
    });
  }

  // Interleave for visual variety
  const shuffled = interleaveGallery(allItems);

  // Render using safe DOM methods
  shuffled.forEach(item => {
    grid.appendChild(createGalleryItem(item));
  });

  // Stagger entrance with IntersectionObserver
  requestAnimationFrame(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px 60px 0px' });

    grid.querySelectorAll('.gallery-item').forEach((item, i) => {
      item.style.transitionDelay = `${(i % 6) * 0.06}s`;
      observer.observe(item);
    });
  });

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      setFilter(filter, grid);
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

  // Shuffle within each group
  Object.values(groups).forEach(arr => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  });

  // Round-robin interleave
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

// ── Lightbox ────────────────────────────────────

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

function createLightbox(item, total) {
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.id = 'lightbox';

  // Image wrapper
  const wrap = document.createElement('div');
  wrap.className = 'lightbox-image-wrap';
  const img = document.createElement('img');
  img.src = item.src;
  img.alt = item.technique;
  wrap.appendChild(img);

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'lightbox-close';
  closeBtn.setAttribute('aria-label', 'Fermer');
  closeBtn.textContent = '\u00d7';

  // Nav buttons
  const prevBtn = document.createElement('button');
  prevBtn.className = 'lightbox-nav lightbox-prev';
  prevBtn.setAttribute('aria-label', 'Pr\u00e9c\u00e9dent');
  prevBtn.textContent = '\u2039';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'lightbox-nav lightbox-next';
  nextBtn.setAttribute('aria-label', 'Suivant');
  nextBtn.textContent = '\u203a';

  // Info
  const technique = document.createElement('span');
  technique.className = 'lightbox-technique';
  technique.textContent = item.technique;

  const counter = document.createElement('span');
  counter.className = 'lightbox-counter';
  counter.textContent = `${lightboxIndex + 1} / ${total}`;

  lb.appendChild(wrap);
  lb.appendChild(closeBtn);
  lb.appendChild(prevBtn);
  lb.appendChild(nextBtn);
  lb.appendChild(technique);
  lb.appendChild(counter);

  // Events
  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => navigateLightbox(-1));
  nextBtn.addEventListener('click', () => navigateLightbox(1));

  lb.addEventListener('click', (e) => {
    if (e.target === lb) closeLightbox();
  });

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

  return lb;
}

function openLightbox(category, src) {
  // Build gallery from visible items
  const items = document.querySelectorAll('.gallery-item:not(.hidden)');
  lightboxGallery = Array.from(items).map(el => ({
    src: el.querySelector('img').src,
    technique: el.querySelector('.gallery-item-info').textContent
  }));

  // Find index by matching filename
  const filename = src.split('/').pop();
  lightboxIndex = lightboxGallery.findIndex(item => item.src.includes(filename));
  if (lightboxIndex === -1) lightboxIndex = 0;

  const lb = createLightbox(lightboxGallery[lightboxIndex], lightboxGallery.length);
  document.body.appendChild(lb);
  document.body.style.overflow = 'hidden';
  lightboxOpen = true;

  requestAnimationFrame(() => lb.classList.add('active'));
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
  img.style.transform = `translateX(${dir * 30}px)`;
  img.classList.remove('zoomed');

  setTimeout(() => {
    img.src = item.src;
    img.alt = item.technique;
    technique.textContent = item.technique;
    counter.textContent = `${lightboxIndex + 1} / ${lightboxGallery.length}`;

    img.style.transform = `translateX(${-dir * 30}px)`;
    requestAnimationFrame(() => {
      img.style.opacity = '1';
      img.style.transform = 'translateX(0)';
    });
  }, 180);
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;

  lb.classList.remove('active');
  lightboxOpen = false;
  document.body.style.overflow = '';

  setTimeout(() => lb.remove(), 400);
}

// ── Scroll Reveal ───────────────────────────────

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

// ── Scroll Progress ─────────────────────────────

function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  }, { passive: true });
}

// ── Back to Top ─────────────────────────────────

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

// ── Cookie Banner ───────────────────────────────

function initCookieBanner() {
  if (localStorage.getItem('cookies-choice')) return;

  const banner = document.getElementById('cookie-banner');
  if (!banner) return;

  // Show after 1.5s delay
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
