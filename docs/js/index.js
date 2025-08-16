const audio = document.getElementById("audio");
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
const source = audioCtx.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(audioCtx.destination);

analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function draw() {
  requestAnimationFrame(draw);
  analyser.getByteFrequencyData(dataArray);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const barWidth = (canvas.width / bufferLength) * 2.5;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i] / 2;
    ctx.fillStyle = `rgb(${barHeight + 100}, 50, 200)`;
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    x += barWidth + 1;
  }
}

audio.onplay = () => {
  audioCtx.resume();
  draw();
};

// دکمه‌های کنترل موزیک
function playPause() {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

function prevTrack() {
  alert("Previous Track (می‌تونی بعدا لیست آهنگ‌ها اضافه کنی)");
}

function nextTrack() {
  alert("Next Track (می‌تونی بعدا لیست آهنگ‌ها اضافه کنی)");
}
