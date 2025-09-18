// === 🌍 Greeting Animation ===
const greetings = ['As-salamu Alaykum', 'السلام عليكم', 'আসসালামু আলাইকুম', 'Hey!','¡Hola!', 'Bonjour!', 'Ciao!', 'Hallo!', 'Olá!', 'こんにちは!', '안녕하세요!', '你好!', 'Привет!', 'Здраво!', 'Γειά σου!', 'สวัสดี!', 'హలో!', 'Wassup!', 'مرحبًا!'];
let greetIndex = 0;
let charIndex = 0;
const greetingEl = document.getElementById('greeting');

function typeGreeting() {
  if (greetingEl && charIndex < greetings[greetIndex].length) {
    greetingEl.textContent += greetings[greetIndex][charIndex];
    charIndex++;
    setTimeout(typeGreeting, 60);
  } else if (greetingEl) {
    setTimeout(() => {
      greetingEl.textContent = '';
      charIndex = 0;
      greetIndex = (greetIndex + 1) % greetings.length;
      typeGreeting();
    }, 1600);
  }
}

// === 🌗 Theme Toggle ===
function toggleTheme() {
  document.body.classList.toggle('dark');
  
  // Update stars visibility based on theme
  const stars = document.querySelectorAll('.star');
  stars.forEach(star => {
    if (document.body.classList.contains('dark')) {
      star.style.opacity = '0.3';
    } else {
      star.style.opacity = '0';
    }
  });
  
  // Save theme preference
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}

// === Home Navigation ===
function goToHome() {
  // Only navigate if we're not already on the home page
  if (!window.location.pathname.endsWith('index.html') && 
      window.location.pathname !== '/' &&
      !window.location.pathname.endsWith('/')) {
    window.location.href = 'index.html';
  }
}

// === Mobile Menu Toggle ===
function toggleMobileMenu() {
  const mobileNav = document.getElementById('mobileNav');
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  
  mobileNav.classList.toggle('active');
  menuToggle.classList.toggle('active');
  
  // Prevent body scrolling when mobile nav is open
  if (mobileNav.classList.contains('active')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
}

// Close mobile menu
function closeMobileMenu() {
  const mobileNav = document.getElementById('mobileNav');
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  
  mobileNav.classList.remove('active');
  menuToggle.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Check for saved theme preference
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
}

// === 🧠 Matrix Hover Text Glitch - COMPLETELY FIXED NO-SHAKE VERSION ===
const letters = "10101010101010101010101010101010101010101010101010101010101010101010";

document.querySelectorAll(".nav-link").forEach(el => {
  // Store original text
  const originalText = el.dataset.value;
  
  // Create glitch overlay element
  const glitchOverlay = document.createElement('div');
  glitchOverlay.className = 'glitch-overlay';
  glitchOverlay.style.minWidth = '100%';
  el.appendChild(glitchOverlay);
  
  // Set fixed width based on the original text
  const measureSpan = document.createElement('span');
  measureSpan.style.position = 'absolute';
  measureSpan.style.visibility = 'hidden';
  measureSpan.style.whiteSpace = 'nowrap';
  measureSpan.textContent = originalText;
  document.body.appendChild(measureSpan);
  
  const exactWidth = measureSpan.offsetWidth;
  el.style.minWidth = exactWidth + 'px';
  document.body.removeChild(measureSpan);
  
  let animationInterval = null;
  
  el.addEventListener("mouseover", () => {
    let iteration = 0;
    
    // Clear any existing animation
    if (animationInterval) clearInterval(animationInterval);
    
    animationInterval = setInterval(() => {
      glitchOverlay.textContent = originalText
        .split("")
        .map((_, i) => {
          return i < iteration ? originalText[i] : letters[Math.floor(Math.random() * letters.length)];
        })
        .join("");

      if (iteration >= originalText.length) {
        clearInterval(animationInterval);
        // Reset after completion
        setTimeout(() => {
          glitchOverlay.textContent = '';
        }, 100);
      }
      iteration += 1 / 2;
    }, 30);
  });
  
  el.addEventListener("mouseout", () => {
    // Clear animation and hide overlay
    if (animationInterval) clearInterval(animationInterval);
    glitchOverlay.textContent = '';
  });
  
  // Close mobile menu when a link is clicked
  el.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      closeMobileMenu();
    }
  });
});

// === Create starry background ===
function createStars() {
  const spaceBg = document.getElementById('spaceBg');
  if (spaceBg) {
    const starCount = 100;
    
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      
      // Random position
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      
      // Random size
      const size = Math.random() * 3;
      
      // Random animation delay
      const delay = Math.random() * 5;
      
      star.style.left = `${posX}%`;
      star.style.top = `${posY}%`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.animationDelay = `${delay}s`;
      
      spaceBg.appendChild(star);
    }
    
    // Update stars visibility based on current theme
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
      if (document.body.classList.contains('dark')) {
        star.style.opacity = '0.3';
      } else {
        star.style.opacity = '0';
      }
    });
  }
}

// Highlight current page in navigation
function highlightCurrentPage() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  
  navLinks.forEach(link => {
    // Remove any existing active class
    link.classList.remove('active');
    
    // Check if this link points to the current page
    // On home page (index.html), NO navigation item should be active
    if (currentPage === 'index.html') {
      // No active links on home page
      return;
    } else if (currentPage === 'experiments.html' && link.dataset.value === 'Experiments') {
      link.classList.add('active');
    } else if (currentPage === 'column.html' && link.dataset.value === 'Column') {
      link.classList.add('active');
    }
  });
}

// Contact form handling
function handleContactForm() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;
      
      // Here you would typically send the form data to a server
      // For now, we'll just show an alert and reset the form
      alert(`Thank you for your message, ${name}! I'll get back to you soon.`);
      contactForm.reset();
    });
  }
}

// Close mobile menu when clicking outside or on close button
document.addEventListener('click', function(event) {
  const mobileNav = document.getElementById('mobileNav');
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  
  if (mobileNav.classList.contains('active') && 
      !mobileNav.contains(event.target) && 
      !mobileMenuToggle.contains(event.target)) {
    closeMobileMenu();
  }
});

// Close mobile menu when pressing Escape key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeMobileMenu();
  }
});

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', function() {
  typeGreeting();
  createStars();
  highlightCurrentPage();
  handleContactForm();
  
  // Add cursor pointer to profile images for better UX
  document.querySelectorAll('.profile-image').forEach(img => {
    img.style.cursor = 'pointer';
  });
});

// ===== ENHANCED OFFLINE FUNCTIONALITY =====

// Register Service Worker with better error handling
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('SW registered: ', registration);
        
        // Check for updates every hour
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
      })
      .catch(function(registrationError) {
        console.log('SW registration failed: ', registrationError);
      });
  }
}

// Enhanced offline/online detection
let isOnline = true;
const onlineStatusListeners = [];

function updateOnlineStatus() {
  const newStatus = navigator.onLine;
  
  if (newStatus !== isOnline) {
    isOnline = newStatus;
    
    if (isOnline) {
      hideOfflineIndicator();
      console.log('Online - connection restored');
      
      // Refresh the page if it was previously offline
      if (sessionStorage.getItem('wasOffline') === 'true') {
        sessionStorage.removeItem('wasOffline');
        window.location.reload();
      }
    } else {
      showOfflineIndicator();
      sessionStorage.setItem('wasOffline', 'true');
      console.log('Offline - using cached content');
    }
    
    // Notify all listeners
    onlineStatusListeners.forEach(listener => listener(isOnline));
  }
}

function showOfflineIndicator() {
  hideOfflineIndicator(); // Remove existing first
  
  const indicator = document.createElement('div');
  indicator.id = 'offline-indicator';
  indicator.innerHTML = '📶 Offline - Showing cached version';
  indicator.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #ff9800;
    color: white;
    padding: 10px 15px;
    border-radius: 5px;
    z-index: 10000;
    font-size: 14px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    animation: slideIn 0.3s ease;
    font-family: 'Inter', sans-serif;
  `;
  
  document.body.appendChild(indicator);
}

function hideOfflineIndicator() {
  const indicator = document.getElementById('offline-indicator');
  if (indicator) {
    indicator.remove();
  }
}

// Enhanced resume availability check
function checkResumeAvailability() {
  const resumeLinks = document.querySelectorAll('a[href*="resume.pdf"]');
  
  if (!navigator.onLine) {
    // Check if resume is cached
    caches.match('/resume.pdf')
      .then(response => {
        if (!response) {
          // Add offline handler to resume links
          resumeLinks.forEach(link => {
            const originalClick = link.onclick;
            
            link.onclick = function(e) {
              if (!navigator.onLine) {
                e.preventDefault();
                alert('Resume not available offline. Please connect to the internet to download it.');
                return false;
              }
              
              if (originalClick) {
                return originalClick.call(this, e);
              }
            };
            
            // Visual indication that resume is offline
            link.style.opacity = '0.7';
            link.title = 'Connect to internet to download';
          });
        }
      });
  } else {
    // Restore normal behavior when online
    resumeLinks.forEach(link => {
      link.style.opacity = '';
      link.title = '';
    });
  }
}

// Listen for online/offline events
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// Initial setup
document.addEventListener('DOMContentLoaded', function() {
  // Your existing functions
  typeGreeting();
  createStars();
  highlightCurrentPage();
  handleContactForm();
  
  // Enhanced offline functionality
  registerServiceWorker();
  updateOnlineStatus();
  checkResumeAvailability();
  
  // Periodically check resume availability (every 30 seconds)
  setInterval(checkResumeAvailability, 30000);
  
  // Add cursor pointer to profile images
  document.querySelectorAll('.profile-image').forEach(img => {
    img.style.cursor = 'pointer';
  });
});

// Add online status listener capability
function addOnlineStatusListener(callback) {
  onlineStatusListeners.push(callback);
  callback(isOnline); // Call immediately with current status
}

// Debug function to check what's cached
function checkCache() {
  caches.open(CACHE_NAME).then(cache => {
    cache.keys().then(keys => {
      console.log('Cached resources:', keys.map(key => key.url));
    });
  });
}

// Run this in browser console to see what's cached
window.checkCache = checkCache;