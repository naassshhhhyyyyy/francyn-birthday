// ========== STATE ==========
let currentPage = 1;
const pages = document.querySelectorAll('.page');
const totalPages = pages.length;

let typingFlags = { short: false, long: false, final: false };
let cakeClicked = false;

// 🔒 BIRTHDAY LOCK
let isUnlocked = false;
let lastTimeCheck = Date.now();

// CHANGE THIS DATE to actual birthday: "May 19, 2026 00:00:00"
// For testing: 5 seconds from now
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

  if (currentPage === 3 && !typingFlags.short) {
    startTyping(
      'message3',
      "Hoy Francyn! 👋\n\nHappy Birthday! 🎉 Sana masarap ulam mo today haha. Ingat ka palagi at mag-enjoy ka sa araw mo. Miss you! 💙",
      'nextMsg3Btn',
      'short'
    );
  }
  else if (currentPage === 4 && !typingFlags.long) {
    startTyping(
      'typing',
      "Francyn,\n\nGinawa ko 'tong website greeting kasi gusto ko lang may maiba sa birthday mo. Alam ko favorite mo dark blue, kaya yan theme niya.\n\n19 ka na? Grabe ang bilis ng panahon! Sana maging masaya ka ngayong taon. Hindi man perfect ang buhay, pero sana lagi mo maalala na may mga tao na nagmamahal sa'yo.\n\nWish ko lang healthy ka palagi at maabot mo lahat ng pangarap mo. Enjoyin mo lang ang bawat araw, okay?\n\nHappy Birthday ulit, Francyn! Ingat. 🎂💙",
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
      setTimeout(typeChar, 25);
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
  const message = "Isa lang masasabi ko...\n\nSalamat sa pagiging ikaw. Sana maging masaya ang 19th birthday mo. Dasurb mo lahat ng magagandang bagay sa mundo. 💙\n\nIngat lagi, Francyn! 🎂✨";
  
  let i = 0;
  function typeFinal() {
    if (i < message.length) {
      finalDiv.textContent += message.charAt(i);
      i++;
      setTimeout(typeFinal, 28);
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
