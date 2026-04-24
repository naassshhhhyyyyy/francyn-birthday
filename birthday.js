// ========== STATE ==========
let currentPage = 1;
const pages = document.querySelectorAll('.page');
const totalPages = pages.length;

let typingFlags = { short: false, long: false, final: false };
let cakeClicked = false;

// 🔒 BIRTHDAY LOCK (May 19, 2026)
let isUnlocked = false;
let lastTimeCheck = Date.now();
// const targetDate = new Date("April 27, 2026 00:00:00").getTime();

// FOR TESTING ONLY - Uncomment this line to test immediately (5 seconds)
const targetDate = new Date().getTime() + 5000;

// DOM elements
const countEl = document.getElementById('count');
const cakeDiv = document.getElementById('cake');
const cakeHint = document.getElementById('cakeHint');
const nextCakeBtn = document.getElementById('nextCakeBtn');
const nextMsg3Btn = document.getElementById('nextMsg3Btn');
const nextTypingBtn = document.getElementById('nextTypingBtn');
const themeToggleBtn = document.getElementById('themeToggle');
const starContainer = document.getElementById('starContainer');

// ========== TIME VALIDATION ==========
function validateTime() {
  const now = Date.now();
  if (now < lastTimeCheck - 5000) {
    isUnlocked = false;
    currentPage = 1;
    pages.forEach((page, index) => {
      page.classList.remove('active');
      page.classList.add('prev');
      if (index === 0) {
        page.classList.add('active');
        page.classList.remove('prev');
      }
    });
  }
  lastTimeCheck = now;
}

setInterval(validateTime, 2000);

// ========== COUNTDOWN ==========
function startCountdown() {
  const timer = setInterval(() => {
    const now = Date.now();
    const distance = targetDate - now;

    if (distance <= 0) {
      clearInterval(timer);
      isUnlocked = true;
      startFinalCountdown();
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    countEl.innerHTML = `
      <div style="font-size:2rem">${days}d ${hours}h ${minutes}m</div>
      <div style="font-size:3.5rem; margin-top:10px">${seconds}s</div>
    `;
  }, 1000);
}

function startFinalCountdown() {
  let count = 3;
  countEl.innerHTML = `<div style="font-size:5rem">${count}</div>`;
  
  const timer = setInterval(() => {
    count--;
    if (count >= 0) {
      if (count === 0) {
        countEl.innerHTML = `<div style="font-size:4rem">🎉✨🎂✨🎉</div>`;
      } else {
        countEl.innerHTML = `<div style="font-size:5rem">${count}</div>`;
      }
    }
    if (count < 0) {
      clearInterval(timer);
      goToPage(2);
    }
  }, 1000);
}

// ========== PAGE TRANSITION ==========
function goToPage(pageNum) {
  validateTime();
  if (!isUnlocked && pageNum !== 1) return;
  if (pageNum > totalPages) return;

  pages.forEach(page => {
    page.classList.remove('active');
    page.classList.add('prev');
  });

  const newPage = pages[pageNum - 1];
  if (!newPage) return;

  newPage.classList.remove('prev');
  newPage.classList.add('active');
  currentPage = pageNum;

  // Start typing effects based on page
  if (currentPage === 3 && !typingFlags.short) {
    startTyping(
      'message3',
      "💙 Happy Birthday, Francyn! 💙\n\nYou're like the deepest ocean — mysterious, beautiful, and full of wonders. Wishing you a year filled with dark blue skies, shining stars, and dreams that come true. ✨",
      'nextMsg3Btn',
      'short'
    );
  }
  else if (currentPage === 4 && !typingFlags.long) {
    startTyping(
      'typing',
      "Hello Francyn! 👋\n\nI made this website greeting just for you — because you deserve something special on your 19th birthday.\n\nNineteen years of you being in this world, and honestly? The world got brighter, calmer, and more beautiful. Your favorite color is dark blue, just like the night sky before dawn — mysterious, deep, and full of quiet strength.\n\nI hope this year brings you everything you've been wishing for. More laughter, more peace, more moments that take your breath away. You're not just growing older — you're growing into someone incredible.\n\nMay you always find reasons to smile, even on tough days. May you chase your dreams fearlessly. And may you always remember that someone out there thinks you're absolutely amazing.\n\nHappy 19th birthday, Francyn! Stay awesome. 💙🎂✨",
      'nextTypingBtn',
      'long'
    );
  }
  else if (currentPage === 5 && !typingFlags.final) {
    startFinalMessage();
  }
}

function nextPage() {
  if (!isUnlocked) return;
  if (currentPage === 5) return;
  goToPage(currentPage + 1);
}

// ========== TYPING EFFECTS ==========
function startTyping(elementId, message, btnId, flagKey) {
  const element = document.getElementById(elementId);
  if (!element) return;

  element.textContent = "";
  let i = 0;

  function typeChar() {
    if (i < message.length) {
      element.textContent += message.charAt(i);
      i++;
      setTimeout(typeChar, 28);
    } else {
      if (btnId) {
        const btn = document.getElementById(btnId);
        if (btn) btn.disabled = false;
      }
      typingFlags[flagKey] = true;
    }
  }

  typeChar();
}

function startFinalMessage() {
  const finalDiv = document.getElementById('finalMessage');
  if (!finalDiv) return;
  
  finalDiv.textContent = "";
  const message = "💫 One more thing... 💫\n\nYou are so much more than you know. Your presence is a gift to everyone around you. Keep shining, keep believing, and never forget — you are deeply loved.\n\nHappy Birthday, Francyn! May your year be as magical as you are. 🌙💙";
  
  let i = 0;
  function typeFinal() {
    if (i < message.length) {
      finalDiv.textContent += message.charAt(i);
      i++;
      setTimeout(typeFinal, 30);
    } else {
      generateStars();
      typingFlags.final = true;
    }
  }
  typeFinal();
}

function generateStars() {
  if (!starContainer) return;
  starContainer.innerHTML = '';
  const stars = ['🌟', '⭐', '✨', '💫', '⭐', '🌟', '✨', '🌠'];
  for (let i = 0; i < 24; i++) {
    const star = document.createElement('span');
    star.classList.add('star');
    star.textContent = stars[Math.floor(Math.random() * stars.length)];
    star.style.animationDelay = `${Math.random() * 0.8}s`;
    star.style.fontSize = `${1.3 + Math.random() * 2}rem`;
    starContainer.appendChild(star);
  }
}

// ========== CAKE INTERACTION (FIXED) ==========
function handleCakeClick(e) {
  if (!isUnlocked) return;
  e.stopPropagation();

  if (!cakeClicked) {
    // CHANGE FROM CUPCAKE 🧁 TO BIRTHDAY CAKE 🎂
    if (cakeDiv.textContent === "🧁") {
      cakeDiv.textContent = "🎂";
    }
    
    // Add wish animation
    cakeDiv.style.animation = 'wishFloat 0.7s forwards';
    setTimeout(() => {
      cakeDiv.style.animation = '';
    }, 700);
    
    cakeHint.classList.remove('hidden');
    nextCakeBtn.disabled = false;
    cakeClicked = true;
  }
}

// ========== THEME TOGGLE ==========
function toggleTheme() {
  document.body.classList.toggle('dark');
  themeToggleBtn.textContent = document.body.classList.contains('dark') ? "☀️" : "🌙";
}

// ========== SWIPE NAVIGATION ==========
let touchStart = 0;

document.addEventListener('touchstart', (e) => {
  touchStart = e.touches[0].clientX;
});

document.addEventListener('touchend', (e) => {
  if (!isUnlocked) return;
  const touchEnd = e.changedTouches[0].clientX;
  if (touchStart - touchEnd > 55 && currentPage < totalPages) {
    nextPage();
  }
});

// ========== KEYBOARD NAVIGATION ==========
document.addEventListener('keydown', (e) => {
  if (!isUnlocked) return;
  if (e.key === 'ArrowRight' && currentPage < totalPages) {
    nextPage();
  }
});

// ========== ANTI-INSPECT ==========
document.addEventListener('contextmenu', e => e.preventDefault());

document.addEventListener('keydown', function (e) {
  if (
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) ||
    (e.ctrlKey && e.key === 'U')
  ) {
    e.preventDefault();
  }
});

// ========== DEVTOOLS DETECT ==========
setInterval(() => {
  const devtoolsOpen = window.outerWidth - window.innerWidth > 160 ||
    window.outerHeight - window.innerHeight > 160;
  if (devtoolsOpen) {
    document.body.innerHTML = `
      <div style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:Poppins;text-align:center;background:#020617;color:white;">
        <div>
          <h1>🚫 Nice Try 😏</h1>
          <p>Let's keep the surprise magical!</p>
        </div>
      </div>
    `;
  }
}, 1000);

// ========== EVENT LISTENERS ==========
cakeDiv?.addEventListener('click', handleCakeClick);
nextCakeBtn?.addEventListener('click', nextPage);
nextMsg3Btn?.addEventListener('click', nextPage);
nextTypingBtn?.addEventListener('click', nextPage);
themeToggleBtn?.addEventListener('click', toggleTheme);

// ========== INIT ==========
pages.forEach((page, index) => {
  if (index === 0) {
    page.classList.add('active');
    page.classList.remove('prev');
  } else {
    page.classList.add('prev');
  }
});

startCountdown();

console.log("🔒 Locked until birthday... Happy Birthday Francyn! 💙");
