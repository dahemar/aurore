const images = document.querySelectorAll(".clickable");
const overlay = document.getElementById("overlay");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");

images.forEach((image) => {
  image.addEventListener("click", () => {
    lightboxImage.src = image.src;
    lightboxCaption.textContent = image.getAttribute("data-caption");
    overlay.classList.remove("hidden");
  });
});

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.classList.add("hidden");
  }
});

function wrapWords(selector) {
  document.querySelectorAll(selector).forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words
      .map((w) => `<span class="hover-word">${w}</span>`)
      .join(" ");
  });
}
wrapWords("h1, h2:not(.type-h2)");

let activeWord = "";
let mouseX = 0,
  mouseY = 0;

document.querySelectorAll(".hover-word").forEach((span) => {
  span.addEventListener("mouseenter", () => {
    activeWord = span.textContent;
  });
});

document.addEventListener("mousemove", (e) => {
  mouseX = e.pageX;
  mouseY = e.pageY;
});

setInterval(() => {
  if (!activeWord) return;
  const trail = document.createElement("span");
  trail.className = "trail";
  trail.textContent = activeWord;
  trail.style.left = mouseX + "px";
  trail.style.top = mouseY + "px";
  document.body.appendChild(trail);
  setTimeout(() => trail.remove(), 1000);
}, 50);

document.addEventListener("DOMContentLoaded", () => {
  const audioFiles = ["audio/1.m4a", "audio/2.m4a", "audio/3.m4a"];
  let currentTrack = 0;
  const player = document.getElementById("audio-player");

  function playNext() {
    player.src = audioFiles[currentTrack];
    player.play().catch((err) => {
      console.error("Playback failed:", err);
    });
    currentTrack = (currentTrack + 1) % audioFiles.length;
  }

  player.addEventListener("ended", playNext);
});

document.addEventListener("DOMContentLoaded", () => {
  const orchid = document.querySelector(".start-audio");
  const sfxPlayer = document.getElementById("sfx-player");
  const sfxFiles = ["audio/1.m4a", "audio/2.m4a", "audio/3.m4a"];
  let currentSfx = 0;

  function playNextSfx() {
    if (currentSfx < sfxFiles.length) {
      sfxPlayer.src = sfxFiles[currentSfx];
      sfxPlayer.loop = false;
      sfxPlayer.play().catch((err) => {
        console.warn("Orchid sound blocked:", err);
      });
    }
  }

  // Detect if we're on the homepage
  const isHome =
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/";

  if (orchid && sfxPlayer) {
    orchid.addEventListener("click", (e) => {
      if (isHome) {
        e.preventDefault(); // Prevent link, stay on homepage
        currentSfx = 0;
        playNextSfx();
      }
      // Else: do nothing, link will redirect to homepage normally
    });

    sfxPlayer.addEventListener("ended", () => {
      currentSfx++;
      if (currentSfx < sfxFiles.length) {
        playNextSfx();
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const speed = 50; // ms per character
  const startDelay = 300; // ms before starting

  document.querySelectorAll(".type-h2").forEach((el) => {
    const text = (el.getAttribute("data-text") || "").trim();
    if (!text) return;

    el.textContent = ""; // clear existing
    let i = 0;

    function type() {
      if (i < text.length) {
        el.textContent += text[i++];
        setTimeout(type, speed);
      }
    }
    setTimeout(type, startDelay);
  });
});

// Persist audio playback across page navigation
document.addEventListener('DOMContentLoaded', () => {
  const audioPlayer = document.getElementById('audio-player');
  const dropdown = document.getElementById('tech-select');
  
  if (!audioPlayer || !dropdown) return;

  // Save audio state before page unload
  window.addEventListener('beforeunload', () => {
    if (audioPlayer.src && !audioPlayer.paused) {
      localStorage.setItem('audioSrc', audioPlayer.src);
      localStorage.setItem('audioTime', audioPlayer.currentTime);
      localStorage.setItem('audioPlaying', 'true');
    } else {
      localStorage.removeItem('audioSrc');
      localStorage.removeItem('audioTime');
      localStorage.removeItem('audioPlaying');
    }
  });

  // Restore audio state when page loads
  const savedSrc = localStorage.getItem('audioSrc');
  const savedTime = localStorage.getItem('audioTime');
  const wasPlaying = localStorage.getItem('audioPlaying') === 'true';

  if (savedSrc) {
    // Set the source first
    audioPlayer.src = savedSrc;
    
    // Update dropdown to match
    if (dropdown) {
      dropdown.value = savedSrc;
    }

    // Restore time and play if it was playing
    audioPlayer.addEventListener('loadedmetadata', () => {
      if (savedTime) {
        audioPlayer.currentTime = parseFloat(savedTime);
      }
      if (wasPlaying) {
        audioPlayer.play().catch(err => {
          console.warn('Auto-resume failed:', err);
        });
      }
    }, { once: true });
  }
});

// ---------- SPA navigation to preserve audio between pages ----------
(function () {
  function initTypewriter() {
    document.querySelectorAll('.type-h2').forEach((el) => {
      if (el.dataset.typed === 'true') return;
      const text = (el.getAttribute('data-text') || '').trim();
      if (!text) return;
      el.textContent = '';
      let i = 0;
      const speed = 50;
      const startDelay = 300;
      function type() {
        if (i < text.length) {
          el.textContent += text[i++];
          setTimeout(type, speed);
        }
      }
      setTimeout(type, startDelay);
      el.dataset.typed = 'true';
    });
  }

  function initFloatingGallery() {
    const gallery = document.getElementById('floating-gallery');
    if (!gallery || gallery.dataset.initialized === 'true') return;

    let draggingFigure = null;
    let offsetX = 0;
    let offsetY = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let animationFrameId;

    function startDrag(e) {
      const isTouch = e.type.startsWith('touch');
      const pointer = isTouch ? e.touches[0] : e;
      const fig = document.elementFromPoint(pointer.clientX, pointer.clientY)?.closest('figure');
      if (!fig) return;
      draggingFigure = fig;
      const rect = fig.getBoundingClientRect();
      const galleryRect = gallery.getBoundingClientRect();
      offsetX = pointer.clientX - rect.left;
      offsetY = pointer.clientY - rect.top;
      fig.style.cursor = 'grabbing';
      targetX = rect.left - galleryRect.left;
      targetY = rect.top - galleryRect.top;
      currentX = targetX;
      currentY = targetY;

      if (isTouch) {
        document.addEventListener('touchmove', onDrag, { passive: false });
        document.addEventListener('touchend', endDrag);
      } else {
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', endDrag);
      }
      animate();
    }

    function onDrag(e) {
      if (!draggingFigure) return;
      const isTouch = e.type.startsWith('touch');
      const pointer = isTouch ? e.touches[0] : e;
      const galleryRect = gallery.getBoundingClientRect();
      targetX = pointer.clientX - galleryRect.left - offsetX;
      targetY = pointer.clientY - galleryRect.top - offsetY;
      if (isTouch) e.preventDefault();
    }

    function animate() {
      if (!draggingFigure) return;
      currentX += (targetX - currentX) * 0.2;
      currentY += (targetY - currentY) * 0.2;
      draggingFigure.style.left = `${currentX}px`;
      draggingFigure.style.top = `${currentY}px`;
      animationFrameId = requestAnimationFrame(animate);
    }

    function endDrag() {
      if (draggingFigure) {
        draggingFigure.style.cursor = 'grab';
        draggingFigure = null;
      }
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', endDrag);
      document.removeEventListener('touchmove', onDrag);
      document.removeEventListener('touchend', endDrag);
    }

    gallery.addEventListener('mousedown', startDrag);
    gallery.addEventListener('touchstart', startDrag, { passive: false });
    gallery.dataset.initialized = 'true';
  }

  function initChecklistHighlight() {
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1);
    const pageToCheckbox = {
      'page1.html': 'item1',
      'page2.html': 'item2',
      'page3.html': 'item3',
      'page4.html': 'item4',
    };
    const checkboxId = pageToCheckbox[filename];
    document.querySelectorAll('.checklist input[type="checkbox"]').forEach((cb) => (cb.checked = false));
    if (checkboxId) {
      const checkbox = document.getElementById(checkboxId);
      if (checkbox) checkbox.checked = true;
    }
  }

  function initTechSelectBinding() {
    const dropdown = document.getElementById('tech-select');
    const audioPlayer = document.getElementById('audio-player');
    if (!dropdown || !audioPlayer) return;
    if (dropdown.dataset.bound === 'true') return;

    dropdown.addEventListener('change', () => {
      const selected = dropdown.value;
      if (selected) {
        audioPlayer.src = selected;
        audioPlayer.play().catch((err) => {
          console.warn('Autoplay failed:', err);
        });
      }
    });

    dropdown.dataset.bound = 'true';
  }

  function initOrchidSfx() {
    const orchid = document.querySelector('.start-audio');
    const sfxPlayer = document.getElementById('sfx-player');
    const sfxFiles = ['audio/1.m4a', 'audio/2.m4a', 'audio/3.m4a'];
    let currentSfx = 0;
    if (!orchid || !sfxPlayer) return;
    if (orchid.dataset.bound === 'true') return;

    function playNextSfx() {
      if (currentSfx < sfxFiles.length) {
        sfxPlayer.src = sfxFiles[currentSfx];
        sfxPlayer.loop = false;
        sfxPlayer.play().catch((err) => {
          console.warn('Orchid sound blocked:', err);
        });
      }
    }

    orchid.addEventListener('click', (e) => {
      const isHomeNow = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
      const mainPlayer = document.getElementById('audio-player');
      if (isHomeNow && mainPlayer && mainPlayer.paused) {
        e.preventDefault();
        currentSfx = 0;
        playNextSfx();
      }
    });
    sfxPlayer.addEventListener('ended', () => {
      currentSfx++;
      if (currentSfx < sfxFiles.length) playNextSfx();
    });

    orchid.dataset.bound = 'true';
  }

  function reinitPageFeatures() {
    initTypewriter();
    initFloatingGallery();
    initChecklistHighlight();
    initTechSelectBinding();
    initOrchidSfx();
  }

  async function navigateTo(url, push = true) {
    try {
      const target = new URL(url, window.location.href);
      const response = await fetch(target.href, { credentials: 'same-origin' });
      if (!response.ok) throw new Error(`Failed to load ${target.href}`);
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');

      const newContainer = doc.querySelector('.container');
      const currentContainer = document.querySelector('.container');
      if (newContainer && currentContainer) {
        currentContainer.replaceWith(newContainer);
      }

      // Update body classes (e.g., page1, home)
      document.body.className = doc.body.className;

      // Update document title
      if (doc.title) document.title = doc.title;

      if (push) {
        history.pushState({}, '', target.href);
      }

      reinitPageFeatures();
    } catch (err) {
      console.error(err);
      window.location.href = url; // fallback to full navigation
    }
  }

  // Intercept internal links to .html pages
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href]');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (!href) return;

    // Build absolute URL for robust checks (works with relative paths and file://)
    const url = new URL(href, window.location.href);
    const isHtml = url.pathname.endsWith('.html');
    const isExternal = url.origin !== window.location.origin;
    const isDownload = anchor.hasAttribute('download');
    const isHash = href.startsWith('#');
    const opensNewTab = anchor.target === '_blank';

    if (isHtml && !isExternal && !isDownload && !isHash && !opensNewTab) {
      e.preventDefault();
      navigateTo(url.href);
    }
  });

  window.addEventListener('popstate', () => {
    navigateTo(window.location.pathname, false);
  });

  // Initial init after first load
  document.addEventListener('DOMContentLoaded', () => {
    reinitPageFeatures();
  });
})();
