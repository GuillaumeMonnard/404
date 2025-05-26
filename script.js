const board = document.getElementById("board");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("reset");

let currentPlayer = "X";
let grid = Array(9).fill(null);
let confettiAnimationId = null;

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkWinner() {
  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    if (grid[a] && grid[a] === grid[b] && grid[a] === grid[c]) {
      const cells = document.querySelectorAll(".cell");
      cells[a].classList.add("win");
      cells[b].classList.add("win");
      cells[c].classList.add("win");
      return grid[a];
    }
  }
  if (!grid.includes(null)) return "Draw";
  return null;
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (grid[index] || checkWinner()) return;

  grid[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  e.target.classList.add("taken");

  const winner = checkWinner();
  if (!statusText) return;
  if (winner) {
    statusText.textContent =
      winner === "Draw" ? "Draw" : `Player ${winner} won !`;

    if (winner !== "Draw") {
      startTextConfetti(winner);
    }
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function resetGame() {
  grid = Array(9).fill(null);
  currentPlayer = "X";
  if (!statusText) return;
  statusText.textContent = "Player X begins";
  board.querySelectorAll(".cell").forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("taken", "win");
  });

  const canvas = document.getElementById("world");
  const ctx = canvas.getContext("2d");
  if (confettiAnimationId) {
    cancelAnimationFrame(confettiAnimationId);
    confettiAnimationId = null;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function createBoard() {
  board.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;
    cell.addEventListener("click", handleClick);
    board.appendChild(cell);
  }
}

resetBtn.addEventListener("click", resetGame);
createBoard();

function startTextConfetti(winnerLetter) {
  const canvas = document.getElementById("world");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confettis = [];
  const NUM_CONFETTI = 150;

  for (let i = 0; i < NUM_CONFETTI; i++) {
    confettis.push({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      speed: Math.random() * 5 + 3,
      fontSize: Math.random() * 20 + 30,
      opacity: Math.random() * 0.5 + 0.5,
      rotation: Math.random() * 2 * Math.PI,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettis.forEach((c) => {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rotation);
      ctx.font = `${c.fontSize}px lores-12, sans-serif`;
      ctx.fillStyle = `rgba(243,177,224, ${c.opacity})`;
      ctx.fillText(winnerLetter, 0, 0);
      ctx.restore();

      c.y += c.speed;
      c.rotation += 0.01;

      if (c.y > canvas.height) {
        c.y = -50;
        c.x = Math.random() * canvas.width;
      }
    });

    confettiAnimationId = requestAnimationFrame(draw);
  }

  draw();
}

resetBtn.addEventListener("click", () => {
  // Enlève la classe animated pour "stopper" l'animation
  board.classList.remove("animated");

  // Forcer un reflow pour que le navigateur remarque le changement
  void board.offsetWidth;

  // Puis on remet la classe pour relancer l'animation
  board.classList.add("animated");

  // Puis on appelle resetGame pour tout réinitialiser
  resetGame();
});
