// === 🐾 Funny Animal GIFs ===
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
const fallback = gifs[0];
const animalGif = document.getElementById('animalGif');
animalGif.src = gifs[Math.floor(Math.random() * gifs.length)] || fallback;

// === 🌤️ Dynamic Time Greeting Phrases ===
const greetingPhrases = {
  morning: [
    'Good morning', '¡Buenos días', 'Bonjour', 'صباح الخير', 'おはようございます',
    'সুপ্রভাত', 'Buongiorno', 'Доброе утро', '좋은 아침입니다', 'Bom dia', 'Καλημέρα'
  ],
  afternoon: [
    'Good afternoon', '¡Buenas tardes', 'Bon après-midi', 'مساء الخير', 'こんにちは',
    'শুভ অপরাহ্ন', 'Buon pomeriggio', 'Добрый день', '안녕하세요', 'Boa tarde', 'Καλό απόγευμα'
  ],
  evening: [
    'Good evening', '¡Buenas noches', 'Bonsoir', 'مساء النور', 'こんばんは',
    'শুভ সন্ধ্যা', 'Buona sera', 'Добрый вечер', '안녕하십니까', 'Boa noite', 'Καλησπέρα'
  ]
};

function getGreetingByTime() {
  const hour = new Date().getHours();
  let period = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
  const phrases = greetingPhrases[period];
  return phrases[Math.floor(Math.random() * phrases.length)];
}

// === ⌨️ Typewriter Animation for Dynamic Greeting Only ===
const greetingEl = document.getElementById('greeting');
let fullGreeting = getGreetingByTime();
let charIndex = 0;

function typeGreeting() {
  if (charIndex < fullGreeting.length) {
    greetingEl.textContent = fullGreeting.slice(0, charIndex + 1);
    charIndex++;
    setTimeout(typeGreeting, 60);
  } else {
    setTimeout(() => {
      charIndex = 0;
      fullGreeting = getGreetingByTime();
      typeGreeting();
    }, 2500);
  }
}
typeGreeting();

// === 🌗 Theme Toggle ===
function toggleTheme() {
  document.body.classList.toggle('dark');
  document.querySelectorAll('a.black').forEach(el => {
    el.style.color = document.body.classList.contains('dark') ? 'white' : 'black';
  });
}

// === 🧠 Matrix Hover Text Glitch ===
const letters = "10101010101010101010101010101010101010101010101010101010101010101010";
document.querySelectorAll(".nav").forEach(el => {
  el.addEventListener("mouseover", () => {
    let iteration = 0;
    const originalText = el.dataset.value;

    const interval = setInterval(() => {
      el.innerText = originalText
        .split("")
        .map((_, i) => {
          return i < iteration ? originalText[i] : letters[Math.floor(Math.random() * letters.length)];
        })
        .join("");

      if (iteration >= originalText.length) clearInterval(interval);
      iteration += 0.5;
    }, 30);
  });
});
