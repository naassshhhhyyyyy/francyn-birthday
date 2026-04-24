// birthday.js

// ---------- STATE ----------
let currentPage = 1;
const pages = document.querySelectorAll('.page');
const totalPages = pages.length;
let typingFlags = { short: false, long: false };
let cakeUnlocked = false;      // for enabling next button
let cakeClicked = false;       // for animation once

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

// Audio reference (soft chime optional but we manage)
const softAudio = document.getElementById('softChime');
// Not using actual music but we can add subtle beep? Actually optional — no gift/song needed,
// but we use a soft chime if source exists. but no src by default = no error.

// ---------- TIME VALIDATION & TAMPER PROOF ----------
function verifyTimeIntegrity() {
  const now = Date.now();
  if (now < lastTimestamp - 4000 || now > lastTimestamp + 3000000) {
    // time rolled back suspiciously!
    isUnlocked = false;
    // force redirect to page1
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

  // start typing effects when entering specific pages
  if (currentPage === 3 && !typingFlags.short) {
    startTypingEffect(
      'shortMsg',
      "✨ Happy Birthday, Francyn! ✨\n\nYou bring a beautiful light into this world — like deep ocean gems under starry skies. May your day be filled with laughter, love, and endless joy. 🎉💙",
      'nextMsgBtn',
      'short'
    );
  } 
  else if (currentPage === 4 && !typingFlags.long) {
    startTypingEffect(
      'longLetter',
      "💙 Dearest Francyn,\n\nI wanted to create something special just for you — because you deserve magic on your birthday. Turning another year older isn't just about counting candles; it's about celebrating the incredible person you are becoming. You're someone with a heart that shines in the darkest blue, determined, kind, and full of dreams.\n\nThis year, I hope every sunrise brings you hope, every challenge makes you stronger, and every quiet moment reminds you how deeply you are loved. The world is brighter because you're in it. Keep chasing stars, making art out of ordinary days, and never dim your glow.\n\nMay the universe send you oceans of happiness, exciting adventures, and peace that stays. You're not just a friend — you're a constellation. ✨\n\nHappy, happy birthday! 💙🎂",
      'nextLetterBtn',
      'long'
    );
  } 
  else if (currentPage === 5 && !typingFlags.final) {
    // final magical message with stars animation (no gift)
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
          generateStars(); // create star explosion effect
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
  if (currentPage === 5) {
    // final page has no "next", but we protect anyway
    return;
  }
  goToPage(currentPage + 1);
}

// ---------- COUNTDOWN & UNLOCK ----------
function startCountdownGuard() {
  const interval = setInterval(() => {
    const now = Date.now();
    const distance = targetBirthday - now;
    if (distance <= 0) {
      clearInterval(interval);
      isUnlocked = true;
      // Start final 3-2-1 GO countdown effect separately
      startUnlockCountdownSequence();
      return;
    }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);
    countEl.innerHTML = `<span style="font-size:2rem">${days}d</span> <span style="font-size:1.8rem">${hours}h</span> <span style="font-size:1.8rem">${minutes}m</span><br><span style="font-size:2.5rem">${seconds}s</span>`;
  }, 1000);
}

function startUnlockCountdownSequence() {
  let timer = 3;
  countEl.innerHTML = `<div style="font-size:6rem">${timer}</div>`;
  const cdInterval = setInterval(() => {
    timer--;
    if (timer >= 0) {
      countEl.innerHTML = `<div style="font-size:6rem">${timer === 0 ? '🎉' : timer}</div>`;
    }
    if (timer < 0) {
      clearInterval(cdInterval);
      goToPage(2);
    }
  }, 1000);
}

// ---------- CAKE INTERACTION (Enhanced with wish spark)----------
function handleCakeCelebration(e) {
  if (!isUnlocked) return;
  e.stopPropagation();
  if (cakeClicked) return;
  
  // add magical animation on cake (candle blow effect)
  cakeDiv.style.animation = 'candleWish 0.6s forwards';
  setTimeout(() => {
    cakeDiv.style.animation = '';
  }, 600);
  
  // change cake emoji to lit cake? Actually stays as cake but add spark
  cakeDiv.style.filter = 'drop-shadow(0 0 12px #ffc285)';
  setTimeout(() => {
    cakeDiv.style.filter = '';
  }, 800);
  
  cakeMsgDiv.classList.remove('hidden');
  cakeMsgDiv.textContent = "💙 You made a wish! Happy birthday Francyn! 💙";
  nextCakeBtn.disabled = false;
  cakeClicked = true;
  
  // Optional gentle chime effect if we had audio but we don't require song,
  // since requirement: remove the gift and song — so we don't call any audio.
  // So keep silent - just visual spark.
}

// ---------- THEME TOGGLE dark/blue ----------
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
  } else if (diff < -55 && currentPage > 2) {
    // optional back but we can ignore for simplicity, prevent overswipe
  }
});

document.addEventListener('keydown', (e) => {
  if (!isUnlocked) return;
  if (e.key === 'ArrowRight' && currentPage < totalPages) {
    nextPage();
  }
});

// ---------- ANTI-INSPECTOR / DEVTOOLS DETECTION (fun security) ----------
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', function (e) {
  if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) || (e.ctrlKey && e.key === 'U')) {
    e.preventDefault();
  }
});

let devtoolsOpenFlag = false;
setInterval(() => {
  const widthDiff = window.outerWidth - window.innerWidth > 150;
  const heightDiff = window.outerHeight - window.innerHeight > 150;
  if ((widthDiff || heightDiff) && !devtoolsOpenFlag) {
    devtoolsOpenFlag = true;
    document.body.innerHTML = `<div style="background:#03071e; color:#fff; display:flex; justify-content:center; align-items:center; height:100vh; font-family: monospace; flex-direction:column;"><h1>🔒 Keep the mystery alive</h1><p>✨ Enjoy the surprise later ✨</p></div>`;
  } else if (!widthDiff && !heightDiff && devtoolsOpenFlag) {
    // restore? but avoid complexity, reload maybe but fine.
  }
}, 1800);

// ---------- EVENT LISTENERS ----------
cakeDiv?.addEventListener('click', handleCakeCelebration);
nextCakeBtn?.addEventListener('click', nextPage);
nextMsgBtn?.addEventListener('click', nextPage);
nextLetterBtn?.addEventListener('click', () => {
  if (!isUnlocked) return;
  goToPage(5);
});
themeToggle?.addEventListener('click', toggleTheme);

// Additional: if final page has no next button, ensure no error.
// Reset / prevent out of bounds

// __________ INIT __________
pages.forEach((pg, idx) => {
  if (idx === 0) {
    pg.classList.add('active');
    pg.classList.remove('prev');
  } else {
    pg.classList.add('prev');
  }
});
startCountdownGuard();

// preload stars quiet
console.log("🎂 Happy Birthday Francyn — Countdown active until May 19, 2026");
