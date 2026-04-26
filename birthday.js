// ========== STATE ==========
let currentPage = 1;
const pages = document.querySelectorAll('.page');
const totalPages = pages.length;

let typingFlags = { short: false, long: false, final: false };
let cakeClicked = false;

// 🔒 BIRTHDAY LOCK
let isUnlocked = false;
let lastTimeCheck = Date.now();

// CHANGE THIS DATE to actual birthday (April 27, 2026)
const targetDate = new Date("April 27, 2026 00:00:00").getTime();

// DOM elements
const countEl = document.getElementById('count');
const cakeDiv = document.getElementById('cake');
const cakeHint = document.getElementById('cakeHint');
const nextCakeBtn = document.getElementById('nextCakeBtn');
const nextMsg3Btn = document.getElementById('nextMsg3Btn');
const nextTypingBtn = document.getElementById('nextTypingBtn');
const starContainer = document.getElementById('starContainer');

// ========== ANTI-DEVTOOLS (naka-comment, pwedeng ibalik) ==========

// 1. Disable right click completely
// document.addEventListener('contextmenu', function(e) {
//   e.preventDefault();
//   return false;
// });

// 2. Disable all keyboard shortcuts for devtools
// document.addEventListener('keydown', function(e) {
//   const key = e.key;
//   const ctrl = e.ctrlKey;
//   const shift = e.shiftKey;
//   
//   // F12
//   if (key === 'F12') {
//     e.preventDefault();
//     return false;
//   }
//   // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
//   if (ctrl && shift && (key === 'I' || key === 'J' || key === 'C')) {
//     e.preventDefault();
//     return false;
//   }
//   // Ctrl+U (view source)
//   if (ctrl && key === 'u') {
//     e.preventDefault();
//     return false;
//   }
//   // Ctrl+Shift+K (Firefox)
//   if (ctrl && shift && key === 'K') {
//     e.preventDefault();
//     return false;
//   }
//   // Ctrl+Shift+E (Firefox)
//   if (ctrl && shift && key === 'E') {
//     e.preventDefault();
//     return false;
//   }
//   // Ctrl+S (save)
//   if (ctrl && key === 's') {
//     e.preventDefault();
//     return false;
//   }
//   // Ctrl+P (print)
//   if (ctrl && key === 'p') {
//     e.preventDefault();
//     return false;
//   }
// });

// 3. Disable inspect element via browser menu (debugger loop)
// setInterval(function() {
//   debugger;
// }, 100);

// 4. Disable console.log, warn, error
// console.log = function() {};
// console.warn = function() {};
// console.error = function() {};
// console.info = function() {};
// console.debug = function() {};

// 5. Detect devtools opening via width/height difference
// let devtoolsOpen = false;
// const devtoolsChecker = setInterval(function() {
//   const widthDiff = window.outerWidth - window.innerWidth > 160;
//   const heightDiff = window.outerHeight - window.innerHeight > 160;
//   
//   if ((widthDiff || heightDiff) && !devtoolsOpen) {
//     devtoolsOpen = true;
//     document.body.innerHTML = `
//       <div style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:Poppins;text-align:center;background:#020617;color:white;flex-direction:column;padding:20px;">
//         <div>
//           <h1 style="font-size:2rem;margin-bottom:20px;">🚫 Access Denied</h1>
//           <p style="margin-bottom:10px;">Please close DevTools to continue.</p>
//           <p style="font-size:0.8rem;opacity:0.7;">Let's keep the surprise magical! ✨</p>
//         </div>
//       </div>
//     `;
//   } else if (!widthDiff && !heightDiff && devtoolsOpen) {
//     devtoolsOpen = false;
//     location.reload();
//   }
// }, 1000);

// 6. Disable text selection
// document.addEventListener('selectstart', function(e) {
//   e.preventDefault();
//   return false;
// });

// 7. Disable copy/paste
// document.addEventListener('copy', function(e) {
//   e.preventDefault();
//   return false;
// });
// document.addEventListener('cut', function(e) {
//   e.preventDefault();
//   return false;
// });

// 8. Disable dragging of images/elements
// document.querySelectorAll('img, div').forEach(el => {
//   el.setAttribute('draggable', 'false');
// });

// 9. Block element inspection via DOM mutation
// const blockInspect = function() {
//   document.querySelectorAll('*').forEach(el => {
//     el.setAttribute('inspect', 'false');
//   });
// };
// setInterval(blockInspect, 500);

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
      <div style="font-size:clamp(1rem, 5vw, 2rem)">${days}d ${hours}h ${minutes}m</div>
      <div style="font-size:clamp(2rem, 10vw, 3.5rem); margin-top:10px">${seconds}s</div>
    `;
  }, 1000);
}

function startFinalCountdown() {
  let count = 3;
  countEl.innerHTML = `<div style="font-size:clamp(3rem, 15vw, 5rem)">${count}</div>`;
  
  const timer = setInterval(() => {
    count--;
    if (count >= 0) {
      if (count === 0) {
        countEl.innerHTML = `<div style="font-size:clamp(2rem, 10vw, 4rem)">🎉✨🎂✨🎉</div>`;
      } else {
        countEl.innerHTML = `<div style="font-size:clamp(3rem, 15vw, 5rem)">${count}</div>`;
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
      "Hoy Francyn! 👋\n\nHappy Birthday! 🎉 Sana masaya ang araw mo. Enjoy at mag-ingat! 💙",
      'nextMsg3Btn',
      'short'
    );
  }
  else if (currentPage === 4 && !typingFlags.long) {
    startTyping(
      'typing',
      "Francyn,\n\nHappy Birthday! 🎂\n\nGrabe, parang kailan lang nung nagkakilala tayo, pero ang bilis ng panahon. Sana sa araw na 'to maging mas masaya ka, mas matapang, at mas maniwala ka sa sarili mo.\n\nGinawa ko itong website greeting para sa iyo kasi gusto kong maging memorable ang araw mo. Alam kong favorite mo ang blue, kaya yan ang theme.\n\nSa maikling panahong magkakilala tayo ay isa ka sa mga taong nagpasaya ng bawat araw ko. Salamat sa mga kwentuhan, sa mga tawanan, at sa mga oras na magkakasama tayo. Hindi man perpekto ang buhay pero mas bearable dahil sa mga tao tulad mo.\n\nSana maging maganda ang taon na ito para sa iyo. Sana maabot mo lahat ng pangarap mo. Sana laging may dahilan para ngumiti kahit mahirap ang mga bagay.\n\nWish ko para sa iyo. Good health. Peace of mind. At mga taong magmamahal sa iyo ng totoo.\n\nSalamat sa pagiging kaibigan, Francyn. Sana magtagal pa tayo.\n\nHappy Birthday ulit. Enjoyin mo ang araw na ito para sa'yo. Dasurb mo yan. 🎉💙\n\nIngat ka palagi. 😊",
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
      setTimeout(typeChar, 18);
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
  const message = "Bago ko tapusin 'to.\n\nSalamat sa pagkakaibigan. Ang saya ko na nakilala kita.\n\nSana sa susunod na birthday mo ay nandito pa rin ako para batiin ka.\n\nDasurb mo ang lahat ng magagandang bagay sa mundo, Francyn. Huwag mong kakalimutan yun.\n\nHappy Birthday ulit. 🎂✨💙";
  
  let i = 0;
  function typeFinal() {
    if (i < message.length) {
      finalDiv.textContent += message.charAt(i);
      i++;
      setTimeout(typeFinal, 20);
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
  for (let i = 0; i < 30; i++) {
    const star = document.createElement('span');
    star.classList.add('star');
    star.textContent = stars[Math.floor(Math.random() * stars.length)];
    star.style.animationDelay = `${Math.random() * 0.8}s`;
    star.style.fontSize = `${1.3 + Math.random() * 2}rem`;
    starContainer.appendChild(star);
  }
}

// ========== CAKE INTERACTION ==========
function handleCakeClick(e) {
  if (!isUnlocked) return;
  e.stopPropagation();

  if (!cakeClicked) {
    if (cakeDiv.textContent === "🧁") {
      cakeDiv.textContent = "🎂";
    }
    
    cakeDiv.style.animation = 'wishFloat 0.7s forwards';
    setTimeout(() => {
      cakeDiv.style.animation = '';
    }, 700);
    
    cakeHint.classList.remove('hidden');
    nextCakeBtn.disabled = false;
    cakeClicked = true;
  }
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

// ========== EVENT LISTENERS ==========
cakeDiv?.addEventListener('click', handleCakeClick);
nextCakeBtn?.addEventListener('click', nextPage);
nextMsg3Btn?.addEventListener('click', nextPage);
nextTypingBtn?.addEventListener('click', nextPage);

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
