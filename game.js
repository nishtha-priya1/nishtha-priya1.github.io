const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let grade;
let score = 0;
let gameRunning = false;
let paused = false;

// Dino
let dinoY = 200;
let velocityY = 0;
const gravity = 1;

// Obstacle
let obstacleX = 800;
let obstacleType = "normal"; // normal or monster

// Math
let correctAnswer = null;

// Start game
function startGame(selectedGrade) {
  grade = selectedGrade;
  document.getElementById("menu").style.display = "none";
  document.getElementById("score").style.display = "block";
  canvas.style.display = "block";
  gameRunning = true;
  gameLoop();
}

// Main loop
function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawDino();
  drawObstacle();

  if (!paused) {
    updateDino();
    updateObstacle();
  }

  requestAnimationFrame(gameLoop);
}

// Dino logic
function drawDino() {
  ctx.fillRect(50, dinoY, 40, 40);
}

function updateDino() {
  dinoY += velocityY;
  velocityY += gravity;

  if (dinoY > 200) {
    dinoY = 200;
    velocityY = 0;
  }
}

document.addEventListener("keydown", e => {
  if (e.code === "Space" && dinoY === 200 && !paused) {
    velocityY = -15;
  }
});

// Obstacle logic
function drawObstacle() {
  if (obstacleType === "monster") {
    ctx.fillStyle = "red";
  } else {
    ctx.fillStyle = "black";
  }
  ctx.fillRect(obstacleX, 220, 30, 30);
  ctx.fillStyle = "black";
}

function updateObstacle() {
  obstacleX -= 5;

  if (obstacleX < -30) {
    obstacleX = 800;
    score++;
    document.getElementById("score").innerText = "Score: " + score;
    obstacleType = Math.random() < 0.3 ? "monster" : "normal";
  }

  // Collision
  if (obstacleX < 90 && obstacleX > 50 && dinoY >= 200) {
    if (obstacleType === "monster") {
      triggerQuestion();
    } else {
      gameOver();
    }
  }
}

// Math question
function triggerQuestion() {
  paused = true;
  document.getElementById("questionBox").style.display = "block";

  const q = generateQuestion();
  document.getElementById("questionText").innerText = q.text;
  correctAnswer = q.answer;
}

function generateQuestion() {
  let a = Math.floor(Math.random() * 10);
  let b = Math.floor(Math.random() * 10);

  if (grade === 5) {
    a += 10;
  }
  if (grade === 8) {
    a += 10;
    b += 10;
  }

  return {
    text: `${a} + ${b}`,
    answer: a + b
  };
}

function submitAnswer() {
  const userAnswer = Number(document.getElementById("answerInput").value);

  if (userAnswer === correctAnswer) {
    paused = false;
    obstacleX = 800;
    document.getElementById("questionBox").style.display = "none";
    document.getElementById("answerInput").value = "";
  } else {
    gameOver();
  }
}

// Game over
function gameOver() {
  alert("Game Over!");
  location.reload();
}
