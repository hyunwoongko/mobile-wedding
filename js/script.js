// ============================================
// 모바일 청첩장 스크립트
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initCalendar();
  initCountdown();
  initImageModal();
  initMusic();
  window.addEventListener('load', function() {
    setTimeout(initScrollAnimations, 500);
  });
  // Map is now embedded via iframe
  initKakao();
});

// ============================================
// Calendar
// ============================================
function initCalendar() {
  const dateStr = CONFIG.wedding.date;
  const [year, month, day] = dateStr.split('-').map(Number);
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const tbody = document.getElementById('cal-body');
  if (!tbody) return;

  let html = '';
  let dayCount = 1;

  for (let row = 0; row < 6; row++) {
    if (dayCount > daysInMonth) break;
    html += '<tr>';
    for (let col = 0; col < 7; col++) {
      if (row === 0 && col < firstDay) {
        html += '<td></td>';
      } else if (dayCount > daysInMonth) {
        html += '<td></td>';
      } else {
        const isWedding = dayCount === day;
        const isSun = col === 0;
        const isSat = col === 6;
        let cls = [];
        if (isWedding) cls.push('today');
        if (isSun) cls.push('sun');
        if (isSat) cls.push('sat');
        html += isWedding
          ? `<td class="${cls.join(' ')}"><span class="day-num">${dayCount}</span></td>`
          : `<td class="${cls.join(' ')}">${dayCount}</td>`;
        dayCount++;
      }
    }
    html += '</tr>';
  }
  tbody.innerHTML = html;
}

// ============================================
// Copy account number
// ============================================
function copyAccount(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => showToast('계좌번호가 복사되었습니다'));
  } else {
    fallbackCopy(text, '계좌번호가 복사되었습니다');
  }
}

// ============================================
// Copy text (address etc.)
// ============================================
function copyText(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => showToast('복사되었습니다'));
  } else {
    fallbackCopy(text, '복사되었습니다');
  }
}

// ============================================
// Copy URL
// ============================================
function copyURL() {
  const url = window.location.href;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => showToast('청첩장 주소가 복사되었습니다'));
  } else {
    fallbackCopy(url, '청첩장 주소가 복사되었습니다');
  }
}

function fallbackCopy(text, msg) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  showToast(msg);
}

// ============================================
// Toast
// ============================================
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ============================================
// Scroll Animations
// ============================================
function initScrollAnimations() {
  // Fade-in / slide-up elements
  var animEls = document.querySelectorAll('.anim');
  var animObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        animObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.02 });

  animEls.forEach(function(el) {
    animObserver.observe(el);
  });

  // Stagger gallery photos
  var grids = document.querySelectorAll('.anim-stagger');
  grids.forEach(function(grid) {
    var items = grid.querySelectorAll('.gi');
    var gridObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var idx = Array.prototype.indexOf.call(items, entry.target);
          entry.target.style.transitionDelay = (idx % 3) * 0.1 + 's';
          entry.target.classList.add('visible');
          gridObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    items.forEach(function(item) {
      gridObserver.observe(item);
    });
  });
}

// ============================================
// D-Day Countdown
// ============================================
function initCountdown() {
  var weddingDate = new Date('2026-08-22T14:00:00+09:00');

  function update() {
    var now = new Date();
    var diff = weddingDate - now;
    var timerEl = document.getElementById('countdown-timer');
    var textEl = document.getElementById('countdown-text');
    if (!timerEl || !textEl) return;

    if (diff <= 0) {
      timerEl.textContent = '';
      textEl.textContent = '현웅 ♥ 세은의 결혼식이 시작되었습니다.';
      return;
    }

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((diff % (1000 * 60)) / 1000);

    timerEl.innerHTML = '<span class="cd-num">' + days + '</span><span class="cd-colon">:</span><span class="cd-num">' + String(hours).padStart(2,'0') + '</span><span class="cd-colon">:</span><span class="cd-num">' + String(minutes).padStart(2,'0') + '</span><span class="cd-colon">:</span><span class="cd-num">' + String(seconds).padStart(2,'0') + '</span>';
    textEl.innerHTML = '현웅, 세은의 결혼식이 <span class="cd-highlight">' + days + '일</span> 남았습니다.';
  }

  update();
  setInterval(update, 1000);
}

// ============================================
// Image Modal (gallery click-to-zoom)
// ============================================
function initImageModal() {
  const modal = document.getElementById('img-modal');
  if (!modal) return;

  const modalImg = modal.querySelector('img');

  // Gallery grid images
  document.querySelectorAll('.photo-grid .gi img').forEach(img => {
    img.addEventListener('click', () => {
      const fullSrc = img.getAttribute('data-full') || img.src;
      modalImg.src = fullSrc;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      var bgmBtn = document.getElementById('bgm-btn');
      if (bgmBtn) bgmBtn.style.display = 'none';
    });
  });

  // Close on click background or close button
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('img-modal-close')) {
      closeImgModal();
    }
  });
}

function closeImgModal() {
  const modal = document.getElementById('img-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    var bgmBtn = document.getElementById('bgm-btn');
    if (bgmBtn) bgmBtn.style.display = 'flex';
  }
}

// ============================================
// Music
// ============================================
function initMusic() {
  if (!CONFIG.music.enabled) return;

  const btn = document.getElementById('bgm-btn');
  const audio = document.getElementById('bgm');
  if (!btn || !audio) return;

  audio.src = CONFIG.music.src;
  btn.classList.add('show');
  let playing = false;

  const iconOn = btn.querySelector('.icon-on');
  const iconOff = btn.querySelector('.icon-off');

  function updateIcon() {
    iconOn.style.display = playing ? 'block' : 'none';
    iconOff.style.display = playing ? 'none' : 'block';
    btn.style.opacity = playing ? '1' : '0.5';
  }

  btn.addEventListener('click', () => {
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    playing = !playing;
    updateIcon();
  });

  const autoPlay = () => {
    audio.play().then(() => {
      playing = true;
      updateIcon();
    }).catch(() => {});
  };

  // Try immediate autoplay first
  autoPlay();

  // Fallback: play on first user interaction
  document.addEventListener('touchstart', autoPlay, { once: true });
  document.addEventListener('click', autoPlay, { once: true });
  document.addEventListener('scroll', autoPlay, { once: true });
}

// ============================================
// Map (Kakao Maps)
// ============================================
function initMap() {
  const mapEl = document.getElementById('map-area');
  if (!mapEl) return;

  if (typeof L !== 'undefined') {
    const map = L.map(mapEl, {
      center: [CONFIG.venue.lat, CONFIG.venue.lng],
      zoom: 17,
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: false,
      attributionControl: false,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);
    L.marker([CONFIG.venue.lat, CONFIG.venue.lng]).addTo(map)
      .bindPopup(CONFIG.venue.name).openPopup();
  } else {
    mapEl.innerHTML = `
      <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#e8e4e0;color:#999;font-size:13px;cursor:pointer;flex-direction:column;gap:8px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#bbb"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        <span>지도를 보려면 클릭하세요</span>
      </div>
    `;
    mapEl.addEventListener('click', () => {
      window.open(`https://map.naver.com/v5/search/${encodeURIComponent(CONFIG.venue.fullAddress)}`);
    });
  }
}

// ============================================
// Kakao SDK Init + Share
// ============================================
function initKakao() {
  if (typeof Kakao === 'undefined') return;
  if (CONFIG.kakao.jsKey && CONFIG.kakao.jsKey !== 'YOUR_KAKAO_JS_KEY') {
    if (!Kakao.isInitialized()) {
      Kakao.init(CONFIG.kakao.jsKey);
    }
  }
}

function shareKakao() {
  if (typeof Kakao === 'undefined' || !Kakao.isInitialized()) {
    showToast('카카오 SDK를 설정해주세요 (config.js)');
    return;
  }

  Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: CONFIG.kakao.shareTitle,
      description: CONFIG.kakao.shareDescription,
      imageUrl: window.location.origin + '/images/main.jpg',
      link: {
        mobileWebUrl: window.location.href,
        webUrl: window.location.href,
      },
    },
    buttons: [{
      title: '청첩장 보기',
      link: {
        mobileWebUrl: window.location.href,
        webUrl: window.location.href,
      },
    }],
  });
}
