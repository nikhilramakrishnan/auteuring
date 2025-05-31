---
title: "4. collection"
weight: 40
---

# collection

a selection of tracks and experiments.

<style>
.music-player {
  max-width: 100%;
  margin: 2em 0;
  padding-left: 0;
}

.now-playing {
  margin-bottom: 1.5em;
}

.player-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1em;
}

.control-buttons {
  display: flex;
  align-items: center;
  gap: 0.25em;
  margin-left: -4px;
}

.control-button {
  background: none;
  border: none;
  padding: 0.25em;
  cursor: pointer;
  color: var(--body-font-color);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
}

.control-button svg {
  width: 16px;
  height: 16px;
}

.control-button:hover {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.control-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.time-display {
  font-size: 0.8em;
  color: #666;
}

.current-track {
  flex: 1;
  min-width: 200px;
}

.track-title {
  font-weight: normal;
  font-size: 0.9em;
}

.track-info {
  color: #666;
  font-size: 0.8em;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: #f0f0f0;
  margin: 1em 0;
  cursor: pointer;
  position: relative;
}

.progress {
  height: 100%;
  background: #666;
  width: 0;
  transition: width 0.1s;
}


.track-list {
  list-style: none;
  padding: 0;
  padding-left: 0 !important;
  margin: 0;
  margin-left: 0 !important;
}

.track-item {
  padding: 0.75em 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.15s;
}

.track-item:hover {
  background: rgba(0, 0, 0, 0.02);
}

.track-item.active {
  background: rgba(0, 0, 0, 0.02);
}

.track-item.active:hover {
  background: rgba(0, 0, 0, 0.02);
}

.track-item:last-child {
  border-bottom: none;
}

.track-duration {
  font-size: 0.8em;
  color: #999;
}

@media (max-width: 600px) {
  .player-controls {
    gap: 0.5em;
  }
  
  .play-button {
    padding: 0.5em 1em;
  }
  
  .current-track {
    width: 100%;
    margin-top: 0.5em;
  }
}

@media (prefers-color-scheme: dark) {
  .track-info, .time-display {
    color: #999;
  }
  
  .track-item {
    border-bottom-color: #333;
  }
  
  .track-item:hover {
    background: rgba(255, 255, 255, 0.03);
  }
  
  .track-item.active {
    background: rgba(255, 255, 255, 0.03);
  }
  
  .track-item.active:hover {
    background: rgba(255, 255, 255, 0.03);
  }
  
  .control-button:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .progress-bar {
    background: #2a2a2a;
  }
  
  .progress {
    background: #999;
  }
}
</style>

<div class="music-player">
  <div class="now-playing">
    <div class="track-title" id="currentTitle">select a track</div>
    <div class="track-info" id="currentInfo"></div>
  </div>
  
  <div class="progress-bar" id="progressBar">
    <div class="progress" id="progress"></div>
  </div>
  
  <div class="player-controls">
    <div class="control-buttons">
      <button class="control-button" id="prevButton" title="Previous track">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="19 20 9 12 19 4 19 20"></polygon>
          <line x1="5" y1="19" x2="5" y2="5"></line>
        </svg>
      </button>
      <button class="control-button" id="playButton" title="Play/Pause">
        <svg class="play-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        <svg class="pause-icon" style="display: none;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
      </button>
      <button class="control-button" id="nextButton" title="Next track">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="5 4 15 12 5 20 5 4"></polygon>
          <line x1="19" y1="5" x2="19" y2="19"></line>
        </svg>
      </button>
    </div>
    <span class="time-display" id="timeDisplay">0:00 / 0:00</span>
  </div>
  
  <ul class="track-list" id="trackList">
    <li class="track-item" data-src="https://tracks.auteur.ing/file/auteuring/FTRAX003%20Kaaris%20-%20Charge%20(Iyer%20Rework).mp3" data-title="kaaris - charge (iyer rework)" data-info="FTRAX003">
      <div>
        <div class="track-title">kaaris - charge (iyer rework)</div>
        <div class="track-info">FTRAX003</div>
      </div>
      <div class="track-duration"></div>
    </li>
    <li class="track-item" data-src="https://tracks.auteur.ing/file/auteuring/FTRAX008%20Alex%20Gaudino%20-%20Destination%20Calabria%20(Iyer%20Rework).mp3" data-title="alex gaudino - destination calabria (iyer rework)" data-info="FTRAX008">
      <div>
        <div class="track-title">alex gaudino - destination calabria (iyer rework)</div>
        <div class="track-info">FTRAX008</div>
      </div>
      <div class="track-duration"></div>
    </li>
    <li class="track-item" data-src="https://tracks.auteur.ing/file/auteuring/FTRAX028%20The%20Weeknd%20and%20Future%20-%20Low%20Life%20(Iyer%20VIP).mp3" data-title="the weeknd and future - low life (iyer vip)" data-info="FTRAX028">
      <div>
        <div class="track-title">the weeknd and future - low life (iyer vip)</div>
        <div class="track-info">FTRAX028</div>
      </div>
      <div class="track-duration"></div>
    </li>
    <li class="track-item" data-src="https://tracks.auteur.ing/file/auteuring/FTRAX035%20Alfred%20English%20-%20Mire%20(Iyer%20VIP).mp3" data-title="alfred english - mire (iyer vip)" data-info="FTRAX035">
      <div>
        <div class="track-title">alfred english - mire (iyer vip)</div>
        <div class="track-info">FTRAX035</div>
      </div>
      <div class="track-duration"></div>
    </li>
    <li class="track-item" data-src="https://tracks.auteur.ing/file/auteuring/FTRAX041%20Tre%20Mission%20-%20Gang%20(iyer%20edit).mp3" data-title="tre mission - gang (iyer edit)" data-info="FTRAX041">
      <div>
        <div class="track-title">tre mission - gang (iyer edit)</div>
        <div class="track-info">FTRAX041</div>
      </div>
      <div class="track-duration"></div>
    </li>
    <li class="track-item" data-src="https://tracks.auteur.ing/file/auteuring/FTRAX049%20Sir%20Spyro%20-%20Topper%20Top%20(Iyer%20Remix).mp3" data-title="sir spyro - topper top (iyer remix)" data-info="FTRAX049">
      <div>
        <div class="track-title">sir spyro - topper top (iyer remix)</div>
        <div class="track-info">FTRAX049</div>
      </div>
      <div class="track-duration"></div>
    </li>
    <li class="track-item" data-src="https://tracks.auteur.ing/file/auteuring/FTRAX053%20Amir%20Obe%20-%20Wish%20U%20Well%20(iyer%20Remix).mp3" data-title="amir obe - wish u well (iyer remix)" data-info="FTRAX053">
      <div>
        <div class="track-title">amir obe - wish u well (iyer remix)</div>
        <div class="track-info">FTRAX053</div>
      </div>
      <div class="track-duration"></div>
    </li>
    <li class="track-item" data-src="https://tracks.auteur.ing/file/auteuring/FTRAX057%20GOTH%20TRAD%20-%20SEEKER%20(IYER%20REMIX).mp3" data-title="goth trad - seeker (iyer remix)" data-info="FTRAX057">
      <div>
        <div class="track-title">goth trad - seeker (iyer remix)</div>
        <div class="track-info">FTRAX057</div>
      </div>
      <div class="track-duration"></div>
    </li>
  </ul>
</div>

<script>
const audio = new Audio();
const playButton = document.getElementById('playButton');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const currentTitle = document.getElementById('currentTitle');
const currentInfo = document.getElementById('currentInfo');
const progressBar = document.getElementById('progressBar');
const progress = document.getElementById('progress');
const timeDisplay = document.getElementById('timeDisplay');
const trackList = document.getElementById('trackList');
const trackItems = document.querySelectorAll('.track-item');

let currentTrackIndex = -1;
let isPlaying = false;

// Format time in mm:ss
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Load and play track
function loadTrack(index) {
  if (index < 0 || index >= trackItems.length) return;
  
  const track = trackItems[index];
  const src = track.dataset.src;
  const title = track.dataset.title;
  const info = track.dataset.info;
  
  // Update UI
  currentTitle.textContent = title;
  currentInfo.textContent = info;
  
  // Update active state
  trackItems.forEach(item => item.classList.remove('active'));
  track.classList.add('active');
  
  // Load audio
  audio.src = src;
  currentTrackIndex = index;
  
  // Update button states
  prevButton.disabled = index === 0;
  nextButton.disabled = index === trackItems.length - 1;
  
  // Auto play if already playing
  if (isPlaying) {
    audio.play();
  }
}

// Update play/pause icon
function updatePlayPauseIcon() {
  const playIcon = playButton.querySelector('.play-icon');
  const pauseIcon = playButton.querySelector('.pause-icon');
  
  if (isPlaying) {
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
  } else {
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
  }
}

// Play/pause toggle
playButton.addEventListener('click', () => {
  if (currentTrackIndex === -1) {
    loadTrack(0);
  }
  
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
  } else {
    audio.play();
    isPlaying = true;
  }
  updatePlayPauseIcon();
});

// Track click handler
trackItems.forEach((track, index) => {
  track.addEventListener('click', () => {
    loadTrack(index);
    audio.play();
    isPlaying = true;
    updatePlayPauseIcon();
  });
});

// Update progress
audio.addEventListener('timeupdate', () => {
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = percent + '%';
  
  timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration || 0)}`;
});

// Progress bar click
progressBar.addEventListener('click', (e) => {
  if (audio.duration) {
    const percent = e.offsetX / progressBar.offsetWidth;
    audio.currentTime = percent * audio.duration;
  }
});

// Auto play next track
audio.addEventListener('ended', () => {
  if (currentTrackIndex < trackItems.length - 1) {
    loadTrack(currentTrackIndex + 1);
    audio.play();
  } else {
    isPlaying = false;
    updatePlayPauseIcon();
  }
});

// Handle loading errors
audio.addEventListener('error', () => {
  currentTitle.textContent = 'error loading track';
  isPlaying = false;
  updatePlayPauseIcon();
});

// Previous button
prevButton.addEventListener('click', () => {
  if (currentTrackIndex > 0) {
    loadTrack(currentTrackIndex - 1);
    if (isPlaying) {
      audio.play();
    }
  }
});

// Next button
nextButton.addEventListener('click', () => {
  if (currentTrackIndex < trackItems.length - 1) {
    loadTrack(currentTrackIndex + 1);
    if (isPlaying) {
      audio.play();
    }
  }
});

// Initialize button states
prevButton.disabled = true;
nextButton.disabled = true;
</script>