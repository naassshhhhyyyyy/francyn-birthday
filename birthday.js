// birthday.js (FIXED COUNTDOWN)

// ---------- STATE ----------
let currentPage = 1;
const pages = document.querySelectorAll('.page');
const totalPages = pages.length;
let typingFlags = { short: false, long: false };
let cakeUnlocked = false;
let cakeClicked = false;

// 🔐 BIRTHDAY LOCK (May 19, 2026)
let isUnlocked = false;
let lastTimestamp = Date.now();
const targetBirthday = new Date("April 24, 2026 00:00:00").getTime();

// DOM Elements
const countEl = document.getElementById('count');
const cakeDiv = document.getElementById('cake');
const cakeMsgDiv = document.getElementById('cakeMessage');
const nextCakeBtn = document.getElementById('nextCakeBtn');
const nextMsgBtn = document.getElementById('nextMsgBtn');
const nextLetterBtn = document.getElementById('nextLetterBtn');
const themeToggle = document.getElementById('themeToggle');
const starFieldContainer = document.getElementById('starField');

// ---------- TIME VALIDATION & TAMPER PROOF ----------
function verifyTimeIntegrity() {
  const now = Date.now();
  if (now < lastTimestamp - 4000 || now > lastTimestamp + 3000000) {
    isUnlocked = false;
    pages.forEach((page, idx) => {
      page.classList.remove('active');
      page.classList.add('prev');
      if (idx === 0) {
        page.classList.add('active');
        page.classList.remove('prev');
      }
    });
    currentPage = 1;
  }
  lastTimestamp = now;
}
setInterval(verifyTimeIntegrity, 1800);

// ---------- PAGE TRANSITION ----------
function goToPage(pageNum) {
  verifyTimeIntegrity();
  if (!isUnlocked && pageNum !== 1) return;
  if (pageNum > totalPages || pageNum < 1) return;

  pages.forEach(page => {
    page.classList.remove('active');
    page.classList.add('prev');
  });
  const target = pages[pageNum - 1];
  if (!target) return;
  target.classList.remove('prev');
  target.classList.add('active');
  currentPage = pageNum;

  if (currentPage === 3 && !typingFlags.short) {
    startTypingEffect(
      'shortMsg',
      '✨ Happy Birthday, Francyn! ✨\n\nYou bring a beautiful light into this world — like deep ocean gems under starry skies. May your day be filled with laughter, love, and endless joy. 🎉💙',
      'nextMsgBtn',
      'short'
    );
  } 
  else if (currentPage === 4 && !typingFlags.long) {
    startTypingEffect(
      'longLetter',
      '💙 Dearest Francyn,\n\nI wanted to create something special just for you — because you deserve magic on your birthday. Turning another year older isnt just about counting candles; its about celebrating the incredible person you are becoming. Youre someone with a heart that shines in the darkest blue, determined, kind, and full of dreams.\n\nThis year, I hope every sunrise brings you hope, every challenge makes you stronger, and every quiet moment reminds you how deeply you are loved. The world is brighter because youre in it. Keep chasing stars, making art out of ordinary days, and never dim your glow.\n\nMay the universe send you oceans of happiness, exciting adventures, and peace that stays. Youre not just a friend — youre a constellation. ✨\n\nHappy, happy birthday! 💙🎂',
      'nextLetterBtn',
      'long'
    );
  } 
  else if (currentPage === 5 && !typingFlags.final) {
    const finalDiv = document.getElementById('finalMessage');
    if (finalDiv) {
      finalDiv.textContent = "";
      let finalText = "✨ May all your wishes bloom like midnight flowers under a silver moon. You are extraordinary, Francyn. Cheers to you and the amazing journey ahead! 🌙💫";
      let idxFinal = 0;
      function typeFinal() {
        if (idxFinal < finalText.length) {
          finalDiv.textContent += finalText.charAt(idxFinal);
          idxFinal++;
          setTimeout(typeFinal, 32);
        } else {
          generateStars();
          typingFlags.final = true;
        }
      }
      typeFinal();
    } else {
      generateStars();
    }
  }
}

function generateStars() {
  if (!starFieldContainer) return;
  starFieldContainer.innerHTML = '';
  const starArray = ['🌟', '⭐', '✨', '💫', '🌠', '⭐️', '🌟'];
  for (let i = 0; i < 18; i++) {
    const starSpan = document.createElement('span');
    starSpan.classList.add('star');
    const randomStar = starArray[Math.floor(Math.random() * starArray.length)];
    starSpan.textContent = randomStar;
    starSpan.style.animationDelay = `${Math.random() * 0.7}s`;
    starSpan.style.fontSize = `${1.2 + Math.random() * 2.2}rem`;
    starFieldContainer.appendChild(starSpan);
  }
}

function startTypingEffect(elementId, message, nextBtnId, flagKey) {
  const element = document.getElementById(elementId);
  if (!element) return;
  element.textContent = '';
  let i = 0;
  function addChar() {
    if (i < message.length) {
      element.textContent += message.charAt(i);
      i++;
      setTimeout(addChar, 28);
    } else {
      const btn = document.getElementById(nextBtnId);
      if (btn) btn.disabled = false;
      typingFlags[flagKey] = true;
    }
  }
  addChar();
}

function nextPage() {
  if (!isUnlocked) return;
  if (currentPage === 5) return;
  goToPage(currentPage + 1);
}

// ✅ FIXED COUNTDOWN FUNCTION
function startCountdownGuard() {
  const interval = setInterval(() => {
    const now = Date.now();
    const distance = targetBirthday - now;
    
    // CHECK IF BIRTHDAY HAS ARRIVED
    if (distance <= 0) {
      clearInterval(interval);
      isUnlocked = true;
      startUnlockCountdownSequence();
      return;
    }
    
    // FORMAT THE COUNTDOWN DISPLAY
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // UPDATE THE DISPLAY
    countEl.innerHTML = `
      <div style="font-size: 2rem; letter-spacing: 2px;">${days}d ${hours}h ${minutes}m</div>
      <div style="font-size: 3rem; margin-top: 12px;">${seconds}s</div>
    `;
  }, 1000);
}

function startUnlockCountdownSequence() {
  let timer = 3;
  countEl.innerHTML = `<div style="font-size: 6rem;">${timer}</div>`;
  const cdInterval = setInterval(() => {
    timer--;
    if (timer >= 0) {
      if (timer === 0) {
        countEl.innerHTML = `<div style="font-size: 5rem;">🎉✨🎂✨🎉</div>`;
      } else {
        countEl.innerHTML = `<div style="font-size: 6rem;">${timer}</div>`;
      }
    }
    if (timer < 0) {
      clearInterval(cdInterval);
      goToPage(2);
    }
  }, 1000);
}

// ---------- CAKE INTERACTION ----------
function handleCakeCelebration(e) {
  if (!isUnlocked) return;
  e.stopPropagation();
  if (cakeClicked) return;
  
  cakeDiv.style.animation = 'candleWish 0.6s forwards';
  setTimeout(() => {
    cakeDiv.style.animation = '';
  }, 600);
  
  cakeDiv.style.filter = 'drop-shadow(0 0 12px #ffc285)';
  setTimeout(() => {
    cakeDiv.style.filter = '';
  }, 800);
  
  cakeMsgDiv.classList.remove('hidden');
  cakeMsgDiv.textContent = "💙 You made a wish! Happy birthday Francyn! 💙";
  nextCakeBtn.disabled = false;
  cakeClicked = true;
}

// ---------- THEME TOGGLE ----------
function toggleTheme() {
  document.body.classList.toggle('dark');
  themeToggle.textContent = document.body.classList.contains('dark') ? "☀️" : "🌙";
}

// ---------- SWIPE & KEYBOARD ----------
let touchStartX = 0;
document.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
});
document.addEventListener('touchend', (e) => {
  if (!isUnlocked) return;
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (diff > 55 && currentPage < totalPages) {
    nextPage();
  }
});

document.addEventListener('keydown', (e) => {
  if (!isUnlocked) return;
  if (e.key === 'ArrowRight' && currentPage < totalPages) {
    nextPage();
  }
});

// ---------- ANTI-INSPECTOR ----------
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', function (e) {
  if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) || (e.ctrlKey && e.key === 'U')) {
    e.preventDefault();
  }
});

// ---------- EVENT LISTENERS ----------
cakeDiv?.addEventListener('click', handleCakeCelebration);
nextCakeBtn?.addEventListener('click', nextPage);
nextMsgBtn?.addEventListener('click', nextPage);
nextLetterBtn?.addEventListener('click', () => {
  if (!isUnlocked) return;
  goToPage(5);
});
themeToggle?.addEventListener('click', toggleTheme);

// ---------- INITIALIZE ----------
pages.forEach((pg, idx) => {
  if (idx === 0) {
    pg.classList.add('active');
    pg.classList.remove('prev');
  } else {
    pg.classList.add('prev');
  }
});

// START THE COUNTDOWN
startCountdownGuard();

console.log("🎂 Happy Birthday Francyn — Countdown active!");
