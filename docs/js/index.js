const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const audio = document.getElementById("audio");
const trackTitle = document.getElementById("track-title");

let playlist = [
  { title: "Sample Track 1", src: "media/sample.mp3" },
  { title: "Sample Track 2", src: "media/sample2.mp3" }
];

let currentTrack = 0;

function loadTrack(index) {
  audio.src = playlist[index].src;
  trackTitle.textContent = playlist[index].title;
  audio.load();
}

playBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
  } else {
    audio.pause();
    playBtn.innerHTML = `<i class="fas fa-play"></i>`;
  }
});

prevBtn.addEventListener("click", () => {
  currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
  loadTrack(currentTrack);
  audio.play();
});

nextBtn.addEventListener("click", () => {
  currentTrack = (currentTrack + 1) % playlist.length;
  loadTrack(currentTrack);
  audio.play();
});

// load first track
loadTrack(currentTrack);
