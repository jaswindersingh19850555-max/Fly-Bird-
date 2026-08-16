const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("start");

let bird, pipes, score, running, frame;

function reset() {
  bird = { x: 80, y: 280, r: 16, vy: 0 };
  pipes = [];
  score = 0;
  frame = 0;
  running = true;
  startBtn.textContent = "Restart Game";
}

function flap() {
  if (!running) return;
  bird.vy = -7;
}

function addPipe() {
  const gap = 155;
  const top = 70 + Math.random() * 260;
  pipes.push({ x: canvas.width, top, gap, passed: false });
}

function endGame() {
  running = false;
}

function update() {
  if (!running) return;
  frame++;
  bird.vy += 0.35;
  bird.y += bird.vy;

  if (frame % 95 === 0) addPipe();

  for (const p of pipes) {
    p.x -= 2.7;
    if (!p.passed && p.x + 55 < bird.x) {
      p.passed = true;
      score++;
    }

    const hitX = bird.x + bird.r > p.x && bird.x - bird.r < p.x + 55;
    const hitY = bird.y - bird.r < p.top || bird.y + bird.r > p.top + p.gap;
    if (hitX && hitY) endGame();
  }

  pipes = pipes.filter(p => p.x > -70);

  if (bird.y - bird.r < 0 || bird.y + bird.r > canvas.height) endGame();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#8ed8ff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // clouds
  ctx.fillStyle = "rgba(255,255,255,.8)";
  for (let i = 0; i < 4; i++) {
    const x = (i * 130 + 30) % canvas.width;
    const y = 55 + (i % 2) * 85;
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.arc(x + 22, y - 8, 24, 0, Math.PI * 2);
    ctx.arc(x + 48, y, 18, 0, Math.PI * 2);
    ctx.fill();
  }

  // pipes
  for (const p of pipes) {
    ctx.fillStyle = "#39a852";
    ctx.fillRect(p.x, 0, 55, p.top);
    ctx.fillRect(p.x, p.top + p.gap, 55, canvas.height);
    ctx.fillStyle = "#2d8d43";
    ctx.fillRect(p.x - 5, p.top - 20, 65, 20);
    ctx.fillRect(p.x - 5, p.top + p.gap, 65, 20);
  }

  // bird
  ctx.fillStyle = "#ffd43b";
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#222";
  ctx.beginPath();
  ctx.arc(bird.x + 6, bird.y - 5, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f08c00";
  ctx.beginPath();
  ctx.moveTo(bird.x + 15, bird.y);
  ctx.lineTo(bird.x + 28, bird.y + 5);
  ctx.lineTo(bird.x + 15, bird.y + 9);
  ctx.fill();

  ctx.fillStyle = "#174b6b";
  ctx.font = "bold 32px Arial";
  ctx.fillText(score, 20, 45);

  if (!running) {
    ctx.fillStyle = "rgba(0,0,0,.45)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.font = "bold 34px Arial";
    ctx.fillText("Game Over", canvas.width / 2, 270);
    ctx.font = "22px Arial";
    ctx.fillText("Score: " + score, canvas.width / 2, 310);
    ctx.textAlign = "start";
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

canvas.addEventListener("click", flap);
document.addEventListener("keydown", e => {
  if (e.code === "Space") {
    e.preventDefault();
    flap();
  }
});
startBtn.addEventListener("click", reset);

reset();
loop();
