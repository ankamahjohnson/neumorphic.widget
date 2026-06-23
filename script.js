// ── LIVE CLOCK ──
function updateClock() {
  const now  = new Date();
  const hrs  = now.getHours();
  const mins = now.getMinutes();
  const secs = now.getSeconds();

  document.getElementById('hourHand').style.transform   = `rotate(${(hrs % 12) * 30 + mins * 0.5}deg)`;
  document.getElementById('minuteHand').style.transform = `rotate(${mins * 6 + secs * 0.1}deg)`;
  document.getElementById('secondHand').style.transform = `rotate(${secs * 6}deg)`;

  const month = now.getMonth() + 1;
  const day   = now.getDate();
  document.getElementById('date').textContent = `${month}/${String(day).padStart(2, '0')}`;

  const hour = hrs % 12 || 12;
  const ampm = hrs >= 12 ? 'PM' : 'AM';
  document.getElementById('time').textContent = `${hour} ${ampm}`;
}

updateClock();
setInterval(updateClock, 1000);


// ── TRACK QUEUE ──
const tracks  = [];
let   current = 0;

function loadTrack(index) {
  if (!tracks.length) return;
  const t = tracks[index];

  const albumArt = document.getElementById('albumArt');
  albumArt.style.opacity = '0';

  setTimeout(() => {
    albumArt.src = t.src;
    albumArt.classList.add('visible');
    albumArt.style.opacity = '1';
    extractColor(albumArt);
  }, 200);

  document.getElementById('artPlaceholder').classList.add('hidden');

  // Track name — marquee if long
  const infoEl = document.getElementById('trackInfo');
  const textEl = document.getElementById('trackInfoText');
  textEl.textContent = t.name;
  infoEl.classList.toggle('marquee', t.name.length > 16);

  // Liked state
  const likeBtn = document.getElementById('likeBtn');
  likeBtn.classList.toggle('liked', t.liked);

  // Reset progress
  progressSeconds = 0;
  document.getElementById('progressFill').style.width = '0%';
  document.getElementById('currentTime').textContent  = '0:00';
}


// ── IMAGE UPLOAD ──
const fileInput     = document.getElementById('fileInput');
const uploadTrigger = document.getElementById('uploadTrigger');

function handleFiles(files) {
  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) return;

    // Cap queue at 5 tracks
    if (tracks.length >= 5) {
      alert('Queue is full. Long press a cover to remove it first.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
  const name = file.name.replace(/\.[^/.]+$/, '');
  tracks.push({ src: e.target.result, name, liked: false });
  saveToStorage();
  // Always jump to and display the newly added track
  current = tracks.length - 1;
  loadTrack(current);
};
    reader.readAsDataURL(file);
  });
}

fileInput.addEventListener('change', (e) => handleFiles(e.target.files));
uploadTrigger.addEventListener('click', () => fileInput.click());

// Drag and drop
const trackArt = document.getElementById('trackArt');

trackArt.addEventListener('dragover',  (e) => { e.preventDefault(); trackArt.style.opacity = '0.8'; });
trackArt.addEventListener('dragleave', ()  => { trackArt.style.opacity = '1'; });
trackArt.addEventListener('drop',      (e) => {
  e.preventDefault();
  trackArt.style.opacity = '1';
  handleFiles(e.dataTransfer.files);
});

// Long press to remove current track
let pressTimer;
trackArt.addEventListener('pointerdown', () => {
  pressTimer = setTimeout(() => {
    if (!tracks.length) return;
    tracks.splice(current, 1);
    saveToStorage();
    if (!tracks.length) {
      document.getElementById('albumArt').classList.remove('visible');
      document.getElementById('artPlaceholder').classList.remove('hidden');
      resetAccent();
    } else {
      current = Math.min(current, tracks.length - 1);
      loadTrack(current);
    }
  }, 600);
});
trackArt.addEventListener('pointerup',    () => clearTimeout(pressTimer));
trackArt.addEventListener('pointerleave', () => clearTimeout(pressTimer));


// ── PREV / NEXT ──
document.getElementById('prevBtn').addEventListener('click', () => {
  if (!tracks.length) return;
  current = (current - 1 + tracks.length) % tracks.length;
  loadTrack(current);
});

document.getElementById('nextBtn').addEventListener('click', () => {
  if (!tracks.length) return;
  current = (current + 1) % tracks.length;
  loadTrack(current);
});


// ── PLAY / PAUSE + PROGRESS ──
const playBtn  = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const waveform = document.getElementById('waveform');
let   playing  = false;
let   progressSeconds = 0;
const trackDuration   = 210;
let   progressTimer;

function formatTime(s) {
  const m   = Math.floor(s / 60);
  const sec = String(Math.floor(s % 60)).padStart(2, '0');
  return `${m}:${sec}`;
}

playBtn.addEventListener('click', () => {
  playing = !playing;
  playBtn.classList.toggle('playing', playing);
  waveform.classList.toggle('active', playing);

  if (playing) {
    playIcon.innerHTML = `<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>`;
    progressTimer = setInterval(() => {
      if (progressSeconds >= trackDuration) {
        progressSeconds = 0;
        if (tracks.length > 1) {
          current = (current + 1) % tracks.length;
          loadTrack(current);
        }
      }
      progressSeconds++;
      const pct = (progressSeconds / trackDuration) * 100;
      document.getElementById('progressFill').style.width = pct + '%';
      document.getElementById('currentTime').textContent  = formatTime(progressSeconds);
    }, 1000);
  } else {
    playIcon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"/>`;
    clearInterval(progressTimer);
  }
});

// Click progress bar to seek
document.querySelector('.progress-bar').addEventListener('click', function(e) {
  const rect = this.getBoundingClientRect();
  const pct  = (e.clientX - rect.left) / rect.width;
  progressSeconds = Math.floor(pct * trackDuration);
  document.getElementById('progressFill').style.width = (pct * 100) + '%';
  document.getElementById('currentTime').textContent  = formatTime(progressSeconds);
});


// ── LIKE TOGGLE ──
document.getElementById('likeBtn').addEventListener('click', (e) => {
  e.stopPropagation();
  const likeBtn = document.getElementById('likeBtn');
  likeBtn.classList.toggle('liked');
  if (tracks.length) {
    tracks[current].liked = likeBtn.classList.contains('liked');
    saveToStorage();
  }
  likeBtn.style.transform = 'scale(1.35)';
  setTimeout(() => { likeBtn.style.transform = 'scale(1)'; }, 200);
});


// ── VOLUME SLIDER ──
const volumeTrack = document.getElementById('volumeTrack');
const volumeFill  = document.getElementById('volumeFill');
const volumeThumb = document.getElementById('volumeThumb');
let   isDragging  = false;

function setVolume(e) {
  const rect = volumeTrack.getBoundingClientRect();
  let   pct  = (e.clientX - rect.left) / rect.width;
  pct = Math.max(0, Math.min(1, pct));
  volumeFill.style.width = (pct * 100) + '%';
  volumeThumb.style.left = (pct * 100) + '%';
}

volumeTrack.addEventListener('click',       setVolume);
volumeThumb.addEventListener('pointerdown', (e) => { isDragging = true; e.target.setPointerCapture(e.pointerId); });
volumeThumb.addEventListener('pointermove', (e) => { if (isDragging) setVolume(e); });
volumeThumb.addEventListener('pointerup',   ()  => { isDragging = false; });


// ── DOMINANT COLOR EXTRACTION ──
function extractColor(imgEl) {
  const canvas = document.createElement('canvas');
  const ctx    = canvas.getContext('2d');
  canvas.width  = 50;
  canvas.height = 50;

  imgEl.onload = () => {
    try {
      ctx.drawImage(imgEl, 0, 0, 50, 50);
      const data = ctx.getImageData(0, 0, 50, 50).data;

      let r = 0, g = 0, b = 0, count = 0;
      for (let i = 0; i < data.length; i += 16) {
        const pr = data[i];
        const pg = data[i + 1];
        const pb = data[i + 2];

        // Skip pixels that are too dark or too washed out
        if (pr < 30 && pg < 30 && pb < 30) continue;
        if (pr > 230 && pg > 230 && pb > 230) continue;

        r += pr;
        g += pg;
        b += pb;
        count++;
      }

      // Fallback if all pixels were skipped
      if (count === 0) return;

      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);

      const avg = Math.floor((r + g + b) / 3);
      const bgR = Math.floor(avg * 0.85 + r * 0.15);
      const bgG = Math.floor(avg * 0.85 + g * 0.15);
      const bgB = Math.floor(avg * 0.85 + b * 0.15);

      applyTheme(
        rgbToHex(bgR, bgG, bgB),
        lighten(bgR, bgG, bgB, 30),
        darken(bgR, bgG, bgB, 20),
        rgbToHex(r, g, b)
      );
    } catch(e) {
      console.warn('Color extraction failed:', e);
    }
  };

  // Handle already-cached images
  if (imgEl.complete && imgEl.naturalWidth !== 0) {
    imgEl.onload();
  }
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v =>
    Math.min(255, Math.max(0, v)).toString(16).padStart(2, '0')
  ).join('');
}

function lighten(r, g, b, amt) {
  return rgbToHex(Math.min(255, r + amt), Math.min(255, g + amt), Math.min(255, b + amt));
}

function darken(r, g, b, amt) {
  return rgbToHex(Math.max(0, r - amt), Math.max(0, g - amt), Math.max(0, b - amt));
}

function applyTheme(bg, light, dark, accent) {
  const root = document.documentElement;
  root.style.setProperty('--bg',           bg);
  root.style.setProperty('--shadow-light', light);
  root.style.setProperty('--shadow-dark',  dark);
  root.style.setProperty('--accent',       accent);
  document.body.style.background = bg;
}

function resetAccent() {
  const root = document.documentElement;
  root.style.setProperty('--bg',           '#e0e0e0');
  root.style.setProperty('--shadow-light', '#ffffff');
  root.style.setProperty('--shadow-dark',  '#bebebe');
  root.style.setProperty('--accent',       '#999');
  document.body.style.background = '#e0e0e0';
}


// ── LOCALSTORAGE ──
function saveToStorage() {
  try {
    localStorage.setItem('neu_tracks',  JSON.stringify(tracks));
    localStorage.setItem('neu_current', current);
  } catch(e) {
    // Storage full — remove oldest track and retry
    if (tracks.length > 1) {
      tracks.shift();
      saveToStorage();
    }
  }
}

function loadFromStorage() {
  try {
    const saved = localStorage.getItem('neu_tracks');
    if (!saved) return;
    const parsed = JSON.parse(saved);
    parsed.forEach(t => tracks.push(t));
    current = parseInt(localStorage.getItem('neu_current')) || 0;
    if (tracks.length) loadTrack(current);
  } catch(e) {}
}

loadFromStorage();