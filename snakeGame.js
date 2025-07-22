const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const gridSize = 16;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 8, y: 8 }];
let velocity = { x: 0, y: 0 };
let food = { x: 5, y: 5 };
let score = 0;
let gameInterval;

function drawRect(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
}

function resetGame() {
  snake = [{ x: 8, y: 8 }];
  velocity = { x: 0, y: 0 };
  food = randomFoodPosition();
  score = 0;
  updateScore();
}

function randomFoodPosition() {
  let position;
  do {
    position = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
  } while (snake.some(segment => segment.x === position.x && segment.y === position.y));
  return position;
}

function updateScore() {
  document.getElementById("scoreBoard").textContent = `Score: ${score}`;
}

function gameOver() {
  clearInterval(gameInterval);
  document.getElementById("btnStart").disabled = false;
  document.getElementById("btnNewGame").disabled = true;
  alert("Game Over! Your score: " + score);
}

function gameLoop() {
  // Move snake
  const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

  // Check walls
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    gameOver();
    return;
  }

  // Check self collision
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    gameOver();
    return;
  }

  snake.unshift(head);

  // Eat food
  if (head.x === food.x && head.y === food.y) {
    score++;
    updateScore();
    food = randomFoodPosition();
  } else {
    snake.pop();
  }

  // Draw everything
  ctx.fillStyle = "#121212";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawRect(food.x, food.y, "#ff6347"); // Food - tomato red

  snake.forEach((segment, idx) => {
    drawRect(segment.x, segment.y, idx === 0 ? "#32cd32" : "#228b22"); // Head bright green, body darker
  });
}

function setDirection(x, y) {
  // Prevent reverse direction
  if (velocity.x === -x || velocity.y === -y) return;
  velocity = { x, y };
}