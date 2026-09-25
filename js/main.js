/* ==============================================
   main.js - 全站共用邏輯
   目前功能：背景音樂（鳥叫聲）自動播放 + 開關按鈕
   ============================================== */

(() => {
  // 音樂檔案路徑：請把音檔放在網站根目錄，命名為 music.mp3
  const audio = new Audio('music.mp3');
  audio.loop = true;
  audio.volume = 0.5;

  // 動態產生右上角的開關按鈕
  const btn = document.createElement('button');
  btn.className = 'sound-toggle';
  btn.setAttribute('aria-label', '切換背景音樂');
  btn.textContent = '🔊';
  document.body.appendChild(btn);

  let userMuted = false; // 使用者是否手動關閉過

  const updateIcon = () => {
    btn.textContent = audio.paused ? '🔇' : '🔊';
    btn.classList.toggle('is-muted', audio.paused);
  };

  // 嘗試自動播放；若被瀏覽器擋下，改成第一次點擊頁面時補播放
  const tryAutoplay = () => {
    audio.play()
      .then(updateIcon)
      .catch(() => {
        const resumeOnInteract = () => {
          if (!userMuted) {
            audio.play().then(updateIcon).catch(() => {});
          }
          document.removeEventListener('click', resumeOnInteract);
          document.removeEventListener('touchstart', resumeOnInteract);
        };
        document.addEventListener('click', resumeOnInteract, { once: true });
        document.addEventListener('touchstart', resumeOnInteract, { once: true });
      });
  };

  // 按鈕點擊：手動開關
  btn.addEventListener('click', () => {
    if (audio.paused) {
      userMuted = false;
      audio.play().then(updateIcon).catch(() => {});
    } else {
      userMuted = true;
      audio.pause();
      updateIcon();
    }
  });

  tryAutoplay();
  updateIcon();
})();

/* ==============================================
   手機版漢堡選單
   把 .site-nav 底下的 <a> 連結動態包進 .site-nav-links，
   並插入切換按鈕；桌機版外觀完全不受影響。
   ============================================== */
(() => {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;

  // 把現有的 <a> 連結搬進一個新容器
  const links = Array.from(nav.querySelectorAll('a'));
  const linksWrap = document.createElement('div');
  linksWrap.className = 'site-nav-links';
  links.forEach(link => linksWrap.appendChild(link));
  nav.appendChild(linksWrap);

  // 插入漢堡切換按鈕
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'nav-toggle';
  toggleBtn.setAttribute('aria-label', '開啟選單');
  toggleBtn.textContent = '☰';
  nav.insertBefore(toggleBtn, linksWrap);

  toggleBtn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggleBtn.textContent = isOpen ? '✕' : '☰';
  });

  // 點擊連結後自動收合（手機版體驗更順）
  links.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggleBtn.textContent = '☰';
    });
  });
})();