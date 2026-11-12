(() => {
  const audio = document.getElementById('audioPlayer');
  const playButton = document.getElementById('playButton');
  const seekBar = document.getElementById('seekBar');
  const volumeBar = document.getElementById('volumeBar');
  const nowTitle = document.getElementById('nowTitle');
  const nowArtist = document.getElementById('nowArtist');
  const currentTime = document.getElementById('currentTime');
  const duration = document.getElementById('duration');
  const trackList = document.getElementById('trackList');
  const upload = document.getElementById('musicUpload');
  let tracks = Array.from(document.querySelectorAll('.track-row')).map(row => ({
    title: row.dataset.title, artist: row.dataset.artist, src: row.dataset.src, row
  }));
  let currentIndex = -1;
  let temporaryUrls = [];

  const fmt = seconds => {
    if (!Number.isFinite(seconds)) return '0:00';
    return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
  };

  function updateRows() {
    tracks.forEach((track, i) => {
      if (!track.row) return;
      const active = i === currentIndex;
      track.row.classList.toggle('playing', active);
      const button = track.row.querySelector('.track-play');
      if (button) button.textContent = active && !audio.paused ? 'Ⅱ' : '▶';
    });
  }

  function loadTrack(index, autoplay = true) {
    if (!tracks.length) return;
    currentIndex = (index + tracks.length) % tracks.length;
    const track = tracks[currentIndex];
    audio.src = track.src;
    nowTitle.textContent = track.title;
    nowArtist.textContent = track.artist || 'Bibliothèque locale';
    document.getElementById('playerArt').textContent = '♫';
    updateRows();
    if (autoplay) audio.play().then(() => { playButton.textContent = 'Ⅱ'; updateRows(); }).catch(() => {
      playButton.textContent = '▶';
    });
  }

  function togglePlay() {
    if (!tracks.length) {
      upload.click();
      return;
    }
    if (currentIndex < 0) return loadTrack(0, true);
    if (audio.paused) audio.play().then(() => { playButton.textContent = 'Ⅱ'; updateRows(); }).catch(() => {});
    else audio.pause();
  }

  playButton.addEventListener('click', togglePlay);
  document.getElementById('heroPlay').addEventListener('click', togglePlay);
  document.getElementById('prevButton').addEventListener('click', () => {
    if (audio.currentTime > 3) audio.currentTime = 0;
    else loadTrack(currentIndex <= 0 ? tracks.length - 1 : currentIndex - 1);
  });
  document.getElementById('nextButton').addEventListener('click', () => loadTrack(currentIndex + 1));
  audio.addEventListener('play', () => { playButton.textContent = 'Ⅱ'; updateRows(); });
  audio.addEventListener('pause', () => { playButton.textContent = '▶'; updateRows(); });
  audio.addEventListener('ended', () => { if (tracks.length > 1) loadTrack(currentIndex + 1); else { audio.currentTime = 0; audio.pause(); } });
  audio.addEventListener('loadedmetadata', () => { duration.textContent = fmt(audio.duration); });
  audio.addEventListener('timeupdate', () => {
    currentTime.textContent = fmt(audio.currentTime);
    seekBar.value = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  });
  seekBar.addEventListener('input', () => { if (audio.duration) audio.currentTime = (Number(seekBar.value) / 100) * audio.duration; });
  volumeBar.addEventListener('input', () => { audio.volume = Number(volumeBar.value) / 100; });
  audio.volume = 0.8;

  function wireRow(row, index) {
    row.querySelector('.track-cover').addEventListener('click', () => loadTrack(index));
    row.querySelector('.track-play').addEventListener('click', () => {
      if (currentIndex === index && !audio.paused) audio.pause();
      else if (currentIndex === index) togglePlay();
      else loadTrack(index);
    });
  }
  tracks.forEach((track, index) => wireRow(track.row, index));

  upload.addEventListener('change', event => {
    const files = Array.from(event.target.files || []).filter(file => file.type.startsWith('audio/'));
    if (!files.length) return;
    temporaryUrls.forEach(URL.revokeObjectURL);
    temporaryUrls = [];
    tracks = files.map(file => {
      const src = URL.createObjectURL(file);
      temporaryUrls.push(src);
      return { title: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '), artist: 'Depuis ton téléphone', src, row: null };
    });
    trackList.innerHTML = '';
    tracks.forEach((track, index) => {
      const row = document.createElement('article');
      row.className = 'track-row';
      row.dataset.src = track.src;
      row.innerHTML = '<button class="track-cover" aria-label="Lire ce morceau"><span>♫</span></button><div class="track-info"><b></b><small>Depuis ton téléphone</small></div><span class="track-tag">LOCAL</span><button class="track-play" aria-label="Lire ce morceau">▶</button>';
      row.querySelector('.track-info b').textContent = track.title;
      trackList.appendChild(row);
      track.row = row;
      wireRow(row, index);
    });
    loadTrack(0);
    upload.value = '';
  });

  document.getElementById('themeButton').addEventListener('click', () => document.body.classList.toggle('light-mode'));
  document.querySelectorAll('.nav-item').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    if (button.dataset.view === 'library') document.getElementById('trackList').scrollIntoView({ behavior: 'smooth', block: 'center' });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  }));
})();