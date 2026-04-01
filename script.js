const board = document.getElementById("gameBoard");
const movesDisplay = document.getElementById("moves");
const matchesDisplay = document.getElementById("matches");
const winMessage = document.getElementById("winMessage");
const restartBtn = document.getElementById("restartBtn");
const difficultySelect = document.getElementById("difficulty");
const leaderboardList = document.getElementById("leaderboardList");

/* Demon Slayer images */
const images = [
  "images/tanjiro.jpg", // Tanjiro
  "images/nezuko.jpg", // Nezuko
  "images/zenitsu.jpg", // Zenitsu
  "images/inosuke.jpg", // Inosuke
  "images/giyu.jpg", // Giyu
  "images/rengoku.jpg", // Rengoku
  "images/shinobu.jpg", // Shinobu
  "images/muzan.jpg"  // Muzan
];

const voices = {
  "images/tanjiro.jpg": "images/sounds/tanjiro.mp3",
  "images/nezuko.jpg": "images/sounds/nezuko.mp3",
  "images/zenitsu.jpg": "images/sounds/zenitsu.mp3",
  "images/inosuke.jpg": "images/sounds/inosuke.mp3",
  "images/giyu.jpg": "images/sounds/giyu.mp3",
  "images/rengoku.jpg": "images/sounds/rengoku.mp3",
  "images/shinobu.jpg": "images/sounds/shinobu.mp3",
  "images/muzan.jpg": "images/sounds/muzan.mp3"
};

let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let moves = 0;
let matches = 0;

/* Sounds */
const flipSound = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-card-flip-1564.mp3");
const matchSound = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-game-success-1945.mp3");
const winSound = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3");

/* Difficulty Setup */
function getDifficultySettings() {
  const diff = difficultySelect.value;

  if (diff === "easy") return { pairs: 6, class: "easy" };
  if (diff === "medium") return { pairs: 8, class: "medium" };
  return { pairs: 12, class: "hard" };
}

/* Shuffle */
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

/* Create Board */
function createBoard() {
  const { pairs, class: gridClass } = getDifficultySettings();

  board.className = "game-board " + gridClass;
  board.innerHTML = "";

  const selected = images.slice(0, pairs);
  cards = shuffle([...selected, ...selected]);

  cards.forEach(src => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-back">🎐</div>
        <div class="card-front" style="background-image:url('${src}')"></div>
      </div>
    `;

    card.addEventListener("click", () => flipCard(card, src));
    board.appendChild(card);
  });
}

/* Flip */
function flipCard(card, src) {
  if (lockBoard || card.classList.contains("flip")) return;

  flipSound.play();
  card.classList.add("flip");

  // Play character voice
  if (voices[src]) {
    const voice = new Audio(voices[src]);
    voice.play();
  }

  if (!firstCard) {
    firstCard = { card, src };
    return;
  }

  secondCard = { card, src };
  moves++;
  movesDisplay.textContent = moves;

  checkMatch();
}

/* Check */
function checkMatch() {
  if (firstCard.src === secondCard.src) {
    matchSound.play();

    firstCard.card.classList.add("matched");
    secondCard.card.classList.add("matched");

    matches++;
    matchesDisplay.textContent = matches;

    resetTurn();

    if (matches === cards.length / 2) {
      winGame();
    }
  } else {
    lockBoard = true;

    setTimeout(() => {
      firstCard.card.classList.remove("flip");
      secondCard.card.classList.remove("flip");
      resetTurn();
    }, 700);
  }
}

/* Reset turn */
function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

/* Win */
function winGame() {
  winSound.play();
  winMessage.classList.remove("hidden");

  saveScore(moves);
}

/* Restart */
restartBtn.addEventListener("click", startGame);
difficultySelect.addEventListener("change", startGame);

function startGame() {
  moves = 0;
  matches = 0;
  movesDisplay.textContent = 0;
  matchesDisplay.textContent = 0;
  winMessage.classList.add("hidden");

  createBoard();
}

/* Leaderboard */
function saveScore(score) {
  let scores = JSON.parse(localStorage.getItem("leaderboard")) || [];

  scores.push(score);
  scores.sort((a, b) => a - b);
  scores = scores.slice(0, 5);

  localStorage.setItem("leaderboard", JSON.stringify(scores));
  renderLeaderboard();
}

function renderLeaderboard() {
  let scores = JSON.parse(localStorage.getItem("leaderboard")) || [];

  leaderboardList.innerHTML = scores
    .map(s => `<li>⭐ ${s} moves</li>`)
    .join("");
}

/* Init */
renderLeaderboard();
startGame();