const words = [
  "PUZZLE",
  "JAVASCRIPT",
  "KOTLIN",
  "ANDROID",
  "COMPUTER",
  "PROGRAMMING"
];

let selectedWord = "";
let guessedLetters = [];
let wrongLetters = [];
let difficulty = "easy";

let timer;
let timeLeft = 0;

const wordDisplay = document.getElementById("wordDisplay");
const keyboard = document.getElementById("keyboard");
const wrongLettersText = document.getElementById("wrongLetters");
const timerDisplay = document.getElementById("timer");

const bodyParts = document.querySelectorAll(
  ".head, .body, .left-arm, .right-arm, .left-leg, .right-leg"
);

const messageBox = document.getElementById("messageBox");
const messageTitle = document.getElementById("messageTitle");
const finalWord = document.getElementById("finalWord");

const winSound = document.getElementById("winSound");

function setDifficulty(level) {
  difficulty = level;

  if (difficulty === "medium") {
    timeLeft = 180;
  } else if (difficulty === "hard") {
    timeLeft = 60;
  } else {
    timeLeft = 0;
  }

  startGame();
}

function startGame() {
  selectedWord = words[Math.floor(Math.random() * words.length)];

  guessedLetters = [];
  wrongLetters = [];

  clearInterval(timer);

  messageBox.classList.add("hidden");

  bodyParts.forEach(part => {
    part.classList.add("hidden");
  });

  createKeyboard();
  updateWordDisplay();

  wrongLettersText.textContent = "";

  if (difficulty !== "easy") {
    startTimer();
  } else {
    timerDisplay.textContent = "No Time Limit";
  }
}

function startTimer() {
  updateTimerDisplay();

  timer = setInterval(() => {
    timeLeft--;

    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timer);
      showMessage("TIME'S UP!");
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  timerDisplay.textContent =
    `Time Left: ${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function updateWordDisplay() {
  const display = selectedWord
    .split("")
    .map(letter =>
      guessedLetters.includes(letter) ? letter : "_"
    )
    .join(" ");

  wordDisplay.textContent = display;

  if (!display.includes("_")) {
    winSound.play();
    showMessage("YOU WIN!");
  }
}

function createKeyboard() {
  keyboard.innerHTML = "";

  for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i);

    const button = document.createElement("button");

    button.textContent = letter;

    button.addEventListener("click", () => {
      handleGuess(letter, button);
    });

    keyboard.appendChild(button);
  }
}

function handleGuess(letter, button) {
  button.disabled = true;

  if (selectedWord.includes(letter)) {
    guessedLetters.push(letter);
    updateWordDisplay();
  } else {
    wrongLetters.push(letter);

    wrongLettersText.textContent = wrongLetters.join(", ");

    showBodyPart();

    if (wrongLetters.length === 6) {
      showMessage("GAME OVER");
    }
  }
}

function showBodyPart() {
  bodyParts[wrongLetters.length - 1]
    .classList.remove("hidden");
}

function showMessage(message) {
  clearInterval(timer);

  messageTitle.textContent = message;

  finalWord.textContent = selectedWord;

  messageBox.classList.remove("hidden");

  const buttons = keyboard.querySelectorAll("button");

  buttons.forEach(button => {
    button.disabled = true;
  });
}

document.getElementById("restartBtn")
  .addEventListener("click", startGame);

setDifficulty("easy");