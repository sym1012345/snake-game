const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let velocity = { x: 0, y: 0 };
let food = randomFood();
let gameInterval;

function randomFood() {
  return {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount),
  };
}

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  // Move snake head
  const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

  // Wrap edges
  if (head.x < 0) head.x = tileCount - 1;
  if (head.x >= tileCount) head.x = 0;
  if (head.y < 0) head.y = tileCount - 1;
  if (head.y >= tileCount) head.y = 0;

  // Check collision with snake body
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    clearInterval(gameInterval);
    alert("Game Over! Your score: " + (snake.length - 1));
    resetGame();
    return;
  }

  snake.unshift(head);

  // Eat food
  if (head.x === food.x && head.y === food.y) {
    food = randomFood();
  } else {
    snake.pop();
  }

  // Draw snake
  ctx.fillStyle = "lime";
  snake.forEach(segment => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
  });
}

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  velocity = { x: 0, y: 0 };
  food = randomFood();
  clearInterval(gameInterval);
}

function gameLoop() {
  draw();
}

function startGame() {
  resetGame();
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 100);
}

window.addEventListener("keydown", e => {
  switch (e.key) {
    case "ArrowUp":
      if (velocity.y === 1) break;
      velocity = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (velocity.y === -1) break;
      velocity = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (velocity.x === 1) break;
      velocity = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (velocity.x === -1) break;
      velocity = { x: 1, y: 0 };
      break;
  }
});