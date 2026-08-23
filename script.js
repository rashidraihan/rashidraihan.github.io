// === CACHE BUSTING AND VERSION CONTROL ===
const SITE_VERSION = '3.3';

// Force cache clear on version change
if (localStorage.getItem('siteVersion') !== SITE_VERSION) {
  console.log('New version detected:', SITE_VERSION);
  
  // Clear all caches
  if ('caches' in window) {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName);
      });
    });
  }
  
  // Clear service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister();
      });
    });
  }
  
  // Clear storage
  sessionStorage.clear();
  localStorage.clear();
  
  // Set new version
  localStorage.setItem('siteVersion', SITE_VERSION);
  localStorage.setItem('theme', 'light'); // Reset theme to default
  
  // Force reload
  window.location.reload();
}

// === CONFIGURATION ===
const CONFIG = {
  starCount: 50,
  letters: "10101010101010101010101010101010101010101010101010101010101010101010",
  cacheName: 'portfolio-cache'
};

// === STATE MANAGEMENT ===
let state = {};

// === DOM ELEMENTS ===
const elements = {
  spaceBg: document.getElementById('spaceBg'),
  mobileNav: document.getElementById('mobileNav'),
  menuToggle: document.querySelector('.mobile-menu-toggle'),
  contactForm: document.getElementById('contactForm')
};

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
    
    // Set initial opacity based on theme
    star.style.opacity = document.body.classList.contains('dark') ? '0.15' : '0';
    
    elements.spaceBg.appendChild(star);
  }
}

function setupMatrixGlitch() {
  document.querySelectorAll(".nav-link").forEach(el => {
    const originalText = el.dataset.value;
    
    // Create glitch overlay
    const glitchOverlay = document.createElement('div');
    glitchOverlay.className = 'glitch-overlay';
    glitchOverlay.style.minWidth = '100%';
    el.appendChild(glitchOverlay);
    
    // Set fixed width based on text
    const measureSpan = document.createElement('span');
    measureSpan.style.position = 'absolute';
    measureSpan.style.visibility = 'hidden';
    measureSpan.style.whiteSpace = 'nowrap';
    measureSpan.textContent = originalText;
    document.body.appendChild(measureSpan);
    
    el.style.minWidth = measureSpan.offsetWidth + 'px';
    document.body.removeChild(measureSpan);
    
    let animationInterval = null;
    
    el.addEventListener("mouseover", () => {
      let iteration = 0;
      
      if (animationInterval) clearInterval(animationInterval);
      
      animationInterval = setInterval(() => {
        glitchOverlay.textContent = originalText
          .split("")
          .map((_, i) => i < iteration ? originalText[i] : CONFIG.letters[Math.floor(Math.random() * CONFIG.letters.length)])
          .join("");

        if (iteration >= originalText.length) {
          clearInterval(animationInterval);
          setTimeout(() => glitchOverlay.textContent = '', 100);
        }
        iteration += 1 / 2;
      }, 30);
    });
    
    el.addEventListener("mouseout", () => {
      if (animationInterval) clearInterval(animationInterval);
      glitchOverlay.textContent = '';
    });
    
    // Close mobile menu on click
    el.addEventListener("click", () => {
      if (window.innerWidth <= 768) closeMobileMenu();
    });
  });
}

// === THEME MANAGEMENT ===
function toggleTheme() {
  document.body.classList.toggle('dark');
  
  // Update stars visibility
  document.querySelectorAll('.star').forEach(star => {
    star.style.opacity = document.body.classList.contains('dark') ? '0.15' : '0';
  });
  
  // Save preference
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}

// === NAVIGATION ===
function goToHome() {
  const path = window.location.pathname;
  if (!path.endsWith('index.html') && path !== '/' && !path.endsWith('/')) {
    window.location.href = 'index.html';
  }
}

function highlightCurrentPage() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    
    if (currentPage === 'index.html') return;
    
    if (currentPage === 'experiments.html' && link.dataset.value === 'Experiments') {
      link.classList.add('active');
    } else if (currentPage === 'column.html' && link.dataset.value === 'Column') {
      link.classList.add('active');
    }
  });
}

// === MOBILE MENU ===
function toggleMobileMenu() {
  elements.mobileNav.classList.toggle('active');
  elements.menuToggle.classList.toggle('active');
  document.body.style.overflow = elements.mobileNav.classList.contains('active') ? 'hidden' : 'auto';
}

function closeMobileMenu() {
  elements.mobileNav.classList.remove('active');
  elements.menuToggle.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Close menu when clicking outside or pressing Escape
document.addEventListener('click', (event) => {
  if (elements.mobileNav.classList.contains('active') && 
      !elements.mobileNav.contains(event.target) && 
      !elements.menuToggle.contains(event.target)) {
    closeMobileMenu();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMobileMenu();
});

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
  // Apply saved theme
  if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark');
  
  // Initialize animations
  createStars();
  setupMatrixGlitch();
  
  // Initialize navigation
  highlightCurrentPage();
  
  // Initialize forms
  handleContactForm();
}

// Start everything when DOM is loaded
document.addEventListener('DOMContentLoaded', init);