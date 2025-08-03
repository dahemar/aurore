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
wrapWords("h1, h2");

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
