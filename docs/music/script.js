const audio = document.getElementById("audio-player");
const playBtn = document.getElementById("play");
const pauseBtn = document.getElementById("pause");

playBtn.addEventListener("click", () => {
  audio.play();
});

pauseBtn.addEventListener("click", () => {
  audio.pause();
});

// می‌تونی بعدا لیست آهنگ و کنترل next/prev رو هم اضافه کنی
