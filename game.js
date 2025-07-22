const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreboard = document.getElementById("scoreboard");
const status = document.getElementById("status");
const newGameBtn = document.getElementById("newgame");

const gridSize = 15;
const tileCount = canvas.width / gridSize;

let snake = [];
let velocity = {x: 1, y: 0}; // start moving right immediately
let apple = {x: 5, y: 5};
let score = 0;
let gameInterval;

function resetGame() {
  snake = [{x: 10, y: 10}];
  velocity = {x: 1, y: 0};
  score = 0;
  placeApple();
  scoreboard.textContent = `Score: ${score}`;
  status.textContent = "Recording webcam in background...";
  clearInterval(gameInterval);
  gameInterval = setInterval(drawGame, 150);
}

function placeApple() {
  apple.x = Math.floor(Math.random() * tileCount);
  apple.y = Math.floor(Math.random() * tileCount);
  // Avoid placing apple on snake
  for (let part of snake) {
    if (part.x === apple.x && part.y === apple.y) placeApple();
  }
}

function drawGame() {
  updateSnake();
  drawEverything();
}

function updateSnake() {
  const head = {x: snake[0].x + velocity.x, y: snake[0].y + velocity.y};

  // Wrap around edges
  if (head.x < 0) head.x = tileCount -1;
  if (head.x >= tileCount) head.x = 0;
  if (head.y < 0) head.y = tileCount -1;
  if (head.y >= tileCount) head.y = 0;

  // Check collision with self
  for (let part of snake) {
    if (part.x === head.x && part.y === head.y) {
      alert("Game Over! Final Score: " + score);
      resetGame();
      return;
    }
  }

  snake.unshift(head);

  // Check apple eat
  if (head.x === apple.x && head.y === apple.y) {
    score++;
    scoreboard.textContent = `Score: ${score}`;
    placeApple();
  } else {
    snake.pop();
  }
}

function drawEverything() {
  // Clear canvas
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  ctx.fillStyle = "#0f0";
  for (let part of snake) {
    ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize -1, gridSize -1);
  }

  // Draw apple
  ctx.fillStyle = "#f00";
  ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize -1, gridSize -1);
}

// Controls for keyboard
window.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && velocity.y !== 1) velocity = {x:0, y:-1};
  else if (e.key === "ArrowDown" && velocity.y !== -1) velocity = {x:0, y:1};
  else if (e.key === "ArrowLeft" && velocity.x !== 1) velocity = {x:-1, y:0};
  else if (e.key === "ArrowRight" && velocity.x !== -1) velocity = {x:1, y:0};
});

// Mobile swipe control
let touchStartX = null;
let touchStartY = null;
canvas.addEventListener('touchstart', e => {
  const touch = e.changedTouches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
});
canvas.addEventListener('touchend', e => {
  const touch = e.changedTouches[0];
  const dx = touch.clientX - touchStartX;
  const dy = touch.clientY - touchStartY;
  if(Math.abs(dx) > Math.abs(dy)) {
    if(dx > 30 && velocity.x !== -1) velocity = {x:1, y:0}; // swipe right
    else if(dx < -30 && velocity.x !== 1) velocity = {x:-1, y:0}; // swipe left
  } else {
    if(dy > 30 && velocity.y !== -1) velocity = {x:0, y:1}; // swipe down
    else if(dy < -30 && velocity.y !== 1) velocity = {x:0, y:-1}; // swipe up
  }
});

newGameBtn.addEventListener("click", resetGame);

resetGame();