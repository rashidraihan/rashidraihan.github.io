// === CACHE BUSTING AND VERSION CONTROL ===
const SITE_VERSION = '6.1';

if (localStorage.getItem('siteVersion') !== SITE_VERSION) {
  console.log('New version detected:', SITE_VERSION);

  if ('caches' in window) {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => caches.delete(cacheName));
    });
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    });
  }

  sessionStorage.clear();
  localStorage.clear();
  localStorage.setItem('siteVersion', SITE_VERSION);

  window.location.reload();
}

// === CONFIGURATION ===
const CONFIG = {
  starCount: 50,
  letters: "10101010101010101010101010101010101010101010101010101010101010101010",
  linkColors: ['#4a9eff', '#ff5c5c', '#ff6ec7', '#4ade80', '#ff9a3d', '#b388ff', '#ffd93d'],
  // Every post on the site, used by the "random post" link
  posts: [
    'blog/deepsurf.html',
    'blog/stroke-prediction.html',
    'blog/turtle-shell.html',
    'blog/hello.html'
  ]
};

// === DOM ELEMENTS ===
const elements = {
  spaceBg: document.getElementById('spaceBg'),
  contactForm: document.getElementById('contactForm')
};

function randomColor() {
  return CONFIG.linkColors[Math.floor(Math.random() * CONFIG.linkColors.length)];
}

// === ANIMATIONS ===
function createStars() {
  if (!elements.spaceBg) return;

  for (let i = 0; i < CONFIG.starCount; i++) {
    const star = document.createElement('div');
    star.classList.add('star');

    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const size = Math.random() * 3;
    const delay = Math.random() * 5;

    star.style.left = `${posX}%`;
    star.style.top = `${posY}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.animationDelay = `${delay}s`;
    star.style.opacity = '0.15';

    elements.spaceBg.appendChild(star);
  }
}

// Scrambles a nav link's own text directly (no overlay box — this is
// what makes it render cleanly against the blurred sticky header).
function setupNavGlitch() {
  document.querySelectorAll(".nav-link").forEach(el => {
    const originalText = el.dataset.value || el.textContent;
    let animationInterval = null;

    el.addEventListener("mouseover", () => {
      let iteration = 0;
      if (animationInterval) clearInterval(animationInterval);

      el.style.setProperty('--link-color', randomColor());

      animationInterval = setInterval(() => {
        el.textContent = originalText
          .split("")
          .map((char, i) => i < iteration ? originalText[i] : CONFIG.letters[Math.floor(Math.random() * CONFIG.letters.length)])
          .join("");

        if (iteration >= originalText.length) {
          clearInterval(animationInterval);
          el.textContent = originalText;
        }
        iteration += 1 / 2;
      }, 30);
    });

    el.addEventListener("mouseout", () => {
      if (animationInterval) clearInterval(animationInterval);
      el.textContent = originalText;
    });
  });
}

// On touch devices, tapping a nav link normally navigates before the
// glitch-scramble text effect is even visible. Delay the actual
// navigation just long enough for it to finish playing.
function setupMobileNavDelay() {
  const isTouch = window.matchMedia('(hover: none)').matches;
  if (!isTouch) return;

  document.querySelectorAll('.nav-link[href]').forEach(link => {
    if (link.target === '_blank') return; // opens in a new tab, no unload to race against

    link.addEventListener('click', function(e) {
      if (this.dataset.navDelayed) return; // second tap: let it through
      e.preventDefault();
      const href = this.getAttribute('href');
      const text = this.dataset.value || this.textContent;
      const duration = text.length * 2 * 30 + 120;
      this.dataset.navDelayed = 'true';
      setTimeout(() => { window.location.href = href; }, duration);
    });
  });
}

// Content links and post titles continuously cycle through the
// palette, and jump to a fresh color on hover. Tags have their own
// separate hover-only glow effect defined in CSS.
function setupRainbowLinks() {
  document.querySelectorAll('.rc-underline, .rc-color').forEach(el => {
    const cycle = () => el.style.setProperty('--rc-color', randomColor());
    cycle();
    setInterval(cycle, 2200 + Math.random() * 1800);
    el.addEventListener('mouseenter', cycle);
  });
}

// "Read a random one" link — picks a real post from CONFIG.posts
function setupRandomPostLink() {
  document.querySelectorAll('[data-random-post]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const current = window.location.pathname.split('/').pop();
      let choices = CONFIG.posts.filter(p => !p.endsWith(current));
      if (choices.length === 0) choices = CONFIG.posts;
      const pick = choices[Math.floor(Math.random() * choices.length)];
      const prefix = window.location.pathname.includes('/blog/') ? '../' : '';
      window.location.href = prefix + pick;
    });
  });
}

// === TAG FILTERING (blog.html only) ===
// Reads ?tag=slug from the URL and shows only matching posts,
// hiding any year section left with nothing in it.
function setupTagFilter() {
  const filterStatus = document.getElementById('filterStatus');
  const yearBlocks = document.querySelectorAll('.year-block');
  if (!filterStatus || yearBlocks.length === 0) return;

  const params = new URLSearchParams(window.location.search);
  const activeTag = params.get('tag');

  if (!activeTag) {
    document.querySelectorAll('.post-item').forEach(item => { item.style.display = ''; });
    yearBlocks.forEach(block => { block.style.display = ''; });
    filterStatus.style.display = 'none';
    return;
  }

  let matchCount = 0;
  yearBlocks.forEach(block => {
    const items = block.querySelectorAll('.post-item');
    let blockHasMatch = false;
    items.forEach(item => {
      const tags = (item.dataset.tags || '').split(' ');
      const matches = tags.includes(activeTag);
      item.style.display = matches ? '' : 'none';
      if (matches) { matchCount++; blockHasMatch = true; }
    });
    block.style.display = blockHasMatch ? '' : 'none';
  });

  filterStatus.style.display = 'block';
  filterStatus.innerHTML = matchCount > 0
    ? `Showing posts tagged <strong>#${activeTag}</strong> &middot; <a href="blog.html" class="rc-underline">clear filter</a>`
    : `No posts tagged <strong>#${activeTag}</strong> yet &middot; <a href="blog.html" class="rc-underline">clear filter</a>`;

  // Highlight the matching tag pill(s) so it's clear which filter is active
  document.querySelectorAll('.tag').forEach(tagEl => {
    const slug = tagEl.textContent.trim().replace(/^#/, '');
    tagEl.classList.toggle('tag-active', slug === activeTag);
  });
}

// On touch devices, tapping a tag normally navigates before the ring
// animation is even visible (the page unloads too fast). Delay the
// actual navigation just long enough for the reveal to play out.
// Anchor-only links (like the year tags) don't unload the page, so
// they're handled separately below instead.
function setupMobileTagDelay() {
  const isTouch = window.matchMedia('(hover: none)').matches;
  if (!isTouch) return;

  document.querySelectorAll('.tag[href]').forEach(tag => {
    const href = tag.getAttribute('href');
    if (href.startsWith('#')) return;

    tag.addEventListener('click', function(e) {
      if (this.dataset.tagDelayed) return; // second tap: let it through
      e.preventDefault();
      this.classList.add('tag-tap');
      this.dataset.tagDelayed = 'true';
      setTimeout(() => { window.location.href = href; }, 600);
    });
  });
}

// Year tags (#year-2026, #year-2025, ...) never unload the page, so
// only one should ever look "active" at a time — clicking one clears
// the ring from every other year tag first.
function setupYearTags() {
  const yearTags = document.querySelectorAll('.year-row .tag');
  yearTags.forEach(tag => {
    tag.addEventListener('click', () => {
      yearTags.forEach(t => t.classList.remove('tag-tap'));
      tag.classList.add('tag-tap');
    });
  });
}

// Tag ring: on hover, its rainbow colors continuously rotate,
// starting from a random point each time you hover.
function setupTagSpin() {
  document.querySelectorAll('.tag').forEach(tag => {
    let angle = Math.random() * 360;
    let raf = null;

    const step = () => {
      angle = (angle + 1.2) % 360;
      tag.style.setProperty('--hue-rotate', angle + 'deg');
      raf = requestAnimationFrame(step);
    };

    tag.addEventListener('mouseenter', () => {
      angle = Math.random() * 360;
      tag.style.setProperty('--hue-rotate', angle + 'deg');
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(step);
    });

    tag.addEventListener('mouseleave', () => {
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    });
  });
}

// === NAVIGATION ===
function highlightCurrentPage() {
  const path = window.location.pathname;
  const currentPage = path.split('/').pop() || 'index.html';
  const isBlogSection = currentPage === 'blog.html' || path.includes('/blog/');
  const isHome = currentPage === 'index.html' || currentPage === '';
  const isSocials = currentPage === 'socials.html';

  document.querySelectorAll('.desktop-nav .nav-link').forEach(link => {
    link.classList.remove('active');
    if (isBlogSection && link.dataset.value === 'blog') link.classList.add('active');
    if (isHome && link.dataset.value === 'home') link.classList.add('active');
    if (isSocials && link.dataset.value === 'socials') link.classList.add('active');
  });
}

// === FORM HANDLING ===
function handleContactForm() {
  if (!elements.contactForm) return;

  elements.contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    alert(`Thank you for your message, ${name}! I'll get back to you soon.`);
    this.reset();
  });
}

// === INITIALIZATION ===
function init() {
  setupNavGlitch();
  setupMobileNavDelay();
  setupRainbowLinks();
  setupRandomPostLink();
  setupTagFilter();
  setupTagSpin();
  setupMobileTagDelay();
  setupYearTags();
  highlightCurrentPage();
  handleContactForm();
}

document.addEventListener('DOMContentLoaded', init);