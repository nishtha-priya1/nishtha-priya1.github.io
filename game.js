const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let grade;
let score = 0;
let gameRunning = false;
let paused = false;
let monsterTriggered = false;
let jumpingOverMonster = false;

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

// Main game loop
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
  ctx.fillStyle = "green";
  ctx.fillRect(50, dinoY, 40, 40);
}

function updateDino() {
  // During paused mid-jump, freeze position
  if (!paused || jumpingOverMonster) {
    dinoY += velocityY;
    velocityY += gravity;

    if (dinoY > 200) {
      dinoY = 200;
      velocityY = 0;
    }
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
    ctx.fillRect(obstacleX, 180, 40, 80); // tall monster
  } else {
    ctx.fillStyle = "black";
    ctx.fillRect(obstacleX, 220, 30, 30); // normal obstacle
  }
}

function updateObstacle() {
  obstacleX -= 5;

  if (obstacleX < -50) {
    obstacleX = 800;
    score++;
    document.getElementById("score").innerText = "Score: " + score;
    obstacleType = Math.random() < 0.3 ? "monster" : "normal";
    monsterTriggered = false;
  }

  // Collision
  if (obstacleType === "monster") {
    // Mid-air → trigger question
    if (obstacleX < 90 && obstacleX > 50 && !monsterTriggered && dinoY < 200) {
      monsterTriggered = true;
      jumpingOverMonster = true;
      triggerQuestion();
    }
    // Ground collision → instant death
    else if (obstacleX < 90 && obstacleX > 50 && dinoY >= 200) {
      gameOver("Oh no! You died!");
    }
  } else {
    // Normal obstacle
    if (obstacleX < 90 && obstacleX > 50 && dinoY >= 200) {
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

// Generate grade-based question
function generateQuestion() {
  let a = Math.floor(Math.random() * 10) + 1;
  let b = Math.floor(Math.random() * 10) + 1;

  if (grade === 5) a += 10;
  if (grade === 8) {
    a += 10;
    b += 10;
  }

  return { text: `${a} + ${b}`, answer: a + b };
}

// Submit answer
function submitAnswer() {
  const userAnswer = Number(document.getElementById("answerInput").value);

  if (userAnswer === correctAnswer) {
    // Correct → finish jump
    paused = false;
    jumpingOverMonster = false;
    obstacleX = 800;
    document.getElementById("questionBox").style.display = "none";
    document.getElementById("answerInput").value = "";

    // Show Yay message
    const msg = document.getElementById("correctMessage");
    msg.style.display = "block";
    setTimeout(() => {
      msg.style.display = "none";
    }, 1000);

    monsterTriggered = false;
  } else {
    // Wrong → gravity crush
    velocityY = 20;
    paused = false;
    jumpingOverMonster = false;
  }
}

// Game over
function gameOver(message = "Game Over!") {
  gameRunning = false;
  paused = true;

  // Show game over screen
  const screen = document.getElementById("gameOverScreen");
  screen.style.display = "block";

  // Update message
  document.getElementById("gameOverMessage").innerText = message;
}

// Restart game
function restartGame() {
  location.reload();
}
