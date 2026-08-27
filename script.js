// === CACHE BUSTING AND VERSION CONTROL ===
const SITE_VERSION = '5.3';

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
    'blog/turtle-shell.html'
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

// Logo/brand text changes color on hover (heat-haze filter runs
// continuously via SVG) — same effect on every page's brand text.
function setupLogoHover() {
  document.querySelectorAll('.logo-wordmark').forEach(logo => {
    logo.addEventListener('mouseenter', () => {
      logo.style.setProperty('--logo-color', randomColor());
    });
  });
}

// Content links, post titles, tags, and footer text continuously
// cycle through the palette, and jump to a fresh color on hover.
function setupRainbowLinks() {
  document.querySelectorAll('.rc-underline, .rc-color, .tag').forEach(el => {
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
  createStars();
  setupNavGlitch();
  setupLogoHover();
  setupRainbowLinks();
  setupRandomPostLink();
  highlightCurrentPage();
  handleContactForm();
}

document.addEventListener('DOMContentLoaded', init);