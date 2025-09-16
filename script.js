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

// Check for saved theme preference
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
}

// === 🧠 Matrix Hover Text Glitch ===
const letters = "10101010101010101010101010101010101010101010101010101010101010101010";

document.querySelectorAll(".nav-link").forEach(el => {
  el.addEventListener("mouseover", () => {
    let iteration = 0;
    const originalText = el.dataset.value;
    
    const interval = setInterval(() => {
      el.innerText = originalText
        .split("")
        .map((_, i) => {
          return i < iteration ? originalText[i] : letters[Math.floor(Math.random() * 26)];
        })
        .join("");

      if (iteration >= originalText.length) clearInterval(interval);
      iteration += 1 / 2;
    }, 30);
  });
  
  el.addEventListener("mouseout", () => {
    el.innerText = el.dataset.value;
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

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', function() {
  typeGreeting();
  createStars();
});