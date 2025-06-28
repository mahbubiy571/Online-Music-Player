const playBtn = document.querySelector("#play");
const forwardBtn = document.querySelector("#forward");
const backgwordBtn = document.querySelector("#backward");
const progressContainer = document.querySelector(".progress-container");
const progressEl = document.querySelector(".progress");
const audio = document.querySelector("audio");
const container = document.querySelector(".container");
const input = document.querySelector("input");
const volume = document.querySelector("#volume-changer");
const volumeText = document.querySelector("span");
const cover = document.getElementById("cover");
const musicTitle = document.getElementById("music-title");
const durationEl = document.getElementById("duration");
const currentTimeEl = document.getElementById("current-time");
const menuBtn = document.getElementById("menuBtn");
const speedMenu = document.getElementById("speedMenu");
const downloadEl = document.getElementById("download");

const songs = [
  "Saad Lamjarred - Enty",
  "Weeknd - Blinding Lights",
  "Jaloliddin Ahmadaliyev - Yuragimey",
];

let currentPlayingSong = 0;

function changeSong(current) {
  audio.src = `../audios/${songs[current]}.mp3`;
  downloadEl.href = `../audios/${songs[current]}.mp3`;
  cover.src = `../images/${songs[current]}.png`;
  musicTitle.textContent = songs[current];

  function onMetadataLoaded() {
    const duration = audio.duration;
    const minutes = String(Math.floor(duration / 60)).padStart(2, "0");
    const seconds = String(Math.floor(duration % 60)).padStart(2, "0");
    const time = `${minutes}:${seconds}`;
    durationEl.textContent = time;

    audio.removeEventListener("loadedmetadata", onMetadataLoaded);
  }

  audio.addEventListener("loadedmetadata", onMetadataLoaded);
}
changeSong(currentPlayingSong);

audio.volume = +volume.value / 100;
volumeText.textContent = `${volume.value}`;

function pause() {
  audio.pause();
  container.classList.remove("play");
  playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;

  clearInterval(bgColorInterval);
}

function play() {
  audio.play();
  container.classList.add("play");
  playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;

  clearInterval(bgColorInterval);

  bgColorInterval = setInterval(() => {
    document.body.style.backgroundColor = getRandomColor();
  }, 1000);
}

function nextSong() {
  if (currentPlayingSong < songs.length - 1) {
    currentPlayingSong++;
  } else {
    currentPlayingSong = 0;
  }

  changeSong(currentPlayingSong);
  play();
}

function prevSong() {
  if (currentPlayingSong > 0) {
    currentPlayingSong--;
  } else {
    currentPlayingSong = songs.length - 1;
  }

  changeSong(currentPlayingSong);
  play();
}

function muzicPlay() {
  const isPlaying = container.classList.contains("play");
  if (isPlaying) {
    pause();
  } else {
    play();
  }
}

function progress() {
  const duration = audio.duration;
  const currentTime = audio.currentTime;

  const elapsedTime = isNaN(currentTime) ? 0 : currentTime;

  const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, "0");
  const seconds = String(Math.floor(elapsedTime % 60)).padStart(2, "0");

  const time = `${minutes}:${seconds}`;
  currentTimeEl.textContent = time;

  const p = (currentTime / duration) * 100;
  progressEl.style.width = `${p}%`;
}

function changeTime(e) {
  const p = (e.offsetX / this.clientWidth) * 100;
  const currentTime = (audio.duration / 100) * p;
  audio.currentTime = currentTime;
}

let previousVolume = 1;

function volumeChange() {
  const vol = +volume.value / 100;
  audio.volume = vol;
  volumeText.textContent = `${volume.value}`;

  if (vol === 0) {
    volumeIcon.textContent = "🔇";
  } else if (vol > 0 && vol <= 0.5) {
    volumeIcon.textContent = "🔉";
  } else {
    volumeIcon.textContent = "🔊";
  }
}

volume.addEventListener("input", volumeChange);

volumeIcon.addEventListener("click", () => {
  if (audio.volume > 0) {
    previousVolume = audio.volume;
    audio.volume = 0;
    volume.value = 0;
    volumeText.textContent = "0";
    volumeIcon.textContent = "🔇";
  } else {
    audio.volume = previousVolume;
    volume.value = previousVolume * 100;
    volumeText.textContent = volume.value;
    volumeChange();
  }
});

menuBtn.addEventListener("click", () => {
  speedMenu.classList.toggle("hidden");
});

speedMenu.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    const speed = parseFloat(e.target.dataset.speed);
    audio.playbackRate = speed;
    speedMenu.classList.add("hidden");
  }
});

let bgColorInterval;

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

playBtn.addEventListener("click", muzicPlay);
audio.addEventListener("timeupdate", progress);
progressContainer.addEventListener("click", changeTime);
volume.addEventListener("input", volumeChange);
audio.addEventListener("ended", nextSong);
backgwordBtn.addEventListener("click", prevSong);
forwardBtn.addEventListener("click", nextSong);
