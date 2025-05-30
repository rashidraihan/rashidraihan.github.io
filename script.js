// script.js updated
const gifs = [
  'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
  'https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif',
  'https://media.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy.gif',
  'https://media.giphy.com/media/13borq7Zo2kulO/giphy.gif',
  'https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif',
  'https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif',
  'https://media.giphy.com/media/6VoDJzfRjJNbG/giphy.gif',
  'https://media.giphy.com/media/GyJ8p0Um850ic/giphy.gif',
  'https://media.giphy.com/media/cuPm4p4pClZVC/giphy.gif',
  'https://media.giphy.com/media/blPpTGDhn6hEI/giphy.gif'
   
];

document.getElementById('animalGif').src = gifs[Math.floor(Math.random() * gifs.length)];

const greetings = ['As-salamu Alaykum', 'السلام عليكم', 'Hey!','¡Hola!', 'Bonjour!', 'Ciao!', 'Hallo!', 'Olá!', 'こんにちは!', '안녕하세요!', '你好!', 'Привет!', 'नमस्ते!', 'שלום!', 'Здраво!', 'Γειά σου!', 'สวัสดี!', 'హలో!', 'Wassup!', 'مرحبًا!'];
let greetIndex = 0;
let charIndex = 0;
const greetingEl = document.getElementById('greeting');
function typeGreeting() {
  if (charIndex < greetings[greetIndex].length) {
    greetingEl.textContent += greetings[greetIndex][charIndex];
    charIndex++;
    setTimeout(typeGreeting, 60);
  } else {
    setTimeout(() => {
      greetingEl.textContent = '';
      charIndex = 0;
      greetIndex = (greetIndex + 1) % greetings.length;
      typeGreeting();
    }, 1600);
  }
}
typeGreeting();

function toggleTheme() {
  document.body.classList.toggle('dark');
  document.querySelectorAll('a.black').forEach(el => {
    el.style.color = document.body.classList.contains('dark') ? 'white' : 'black';
  });
}

// Randomly change letters on hover effect for navigation links
const letters = "10101010101010101010101010101010101010101010101010101010101010101010";

document.querySelectorAll(".nav").forEach(el => {
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
});



