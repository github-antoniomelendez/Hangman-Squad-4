const words = [
  "PUZZLE",
  "JAVASCRIPT",
  "KOTLIN",
  "ANDROID",
  "COMPUTER",
  "PROGRAMMING",
  "DEVELOPER",
  "SOFTWARE",
  "KEYBOARD"
];

let selectedWord = "";
let guessedLetters = [];
let wrongLetters = [];
let difficulty = "easy";

let timer;
let timeLeft = 0;

// Elements
const wordDisplay =
  document.getElementById("wordDisplay");

const keyboard =
  document.getElementById("keyboard");

const wrongLettersText =
  document.getElementById("wrongLetters");

const timerDisplay =
  document.getElementById("timer");

const messageBox =
  document.getElementById("messageBox");

const messageTitle =
  document.getElementById("messageTitle");

const finalWord =
  document.getElementById("finalWord");

const restartBtn =
  document.getElementById("restartBtn");

const winSound =
  document.getElementById("winSound");

// Body Parts
const bodyParts = document.querySelectorAll(
  ".rope, .head, .body, .left-arm, .right-arm, .left-leg, .right-leg"
);

// Difficulty
function setDifficulty(level) {

  difficulty = level;

  if (difficulty === "medium") {
    timeLeft = 60;
  }

  else if (difficulty === "hard") {
    timeLeft = 30;
  }

  else {
    timeLeft = 0;
  }

  startGame();
}

// Start Game
function startGame() {

  selectedWord =
    words[Math.floor(Math.random() * words.length)];

  guessedLetters = [];
  wrongLetters = [];

  clearInterval(timer);

  messageBox.classList.add("hidden");

  bodyParts.forEach(part => {
    part.classList.add("hidden");
  });

  wrongLettersText.textContent = "";

  createKeyboard();

  updateWordDisplay();

  if (difficulty !== "easy") {
    startTimer();
  }

  else {
    timerDisplay.textContent =
      "No Time Limit";
  }
}

// Timer
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

// Timer Display
function updateTimerDisplay() {

  const minutes =
    Math.floor(timeLeft / 60);

  const seconds =
    timeLeft % 60;

  timerDisplay.textContent =
    `Time Left: ${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
}

// Update Word
function updateWordDisplay() {

  const display =
    selectedWord
      .split("")
      .map(letter =>
        guessedLetters.includes(letter)
          ? letter
          : "_"
      )
      .join(" ");

  wordDisplay.textContent = display;

  // Win Condition
  if (!display.includes("_")) {

    try {

      winSound.pause();

      winSound.currentTime = 0;

      const playPromise =
        winSound.play();

      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }

    }

    catch (error) {
      console.log(error);
    }

    showMessage("YOU WIN!");

  }
}

// Keyboard
function createKeyboard() {

  keyboard.innerHTML = "";

  for (let i = 65; i <= 90; i++) {

    const letter =
      String.fromCharCode(i);

    const button =
      document.createElement("button");

    button.textContent = letter;

    button.addEventListener(
      "click",
      () => {
        handleGuess(letter, button);
      }
    );

    keyboard.appendChild(button);
  }
}

// Handle Guess
function handleGuess(letter, button) {

  button.disabled = true;

  // Correct Guess
  if (selectedWord.includes(letter)) {

    guessedLetters.push(letter);

    updateWordDisplay();

  }

  // Wrong Guess
  else {

    wrongLetters.push(letter);

    wrongLettersText.textContent =
      wrongLetters.join(", ");

    showBodyPart();

    // Lose Condition
    if (wrongLetters.length === 7) {

      showMessage("GAME OVER");

    }
  }
}

// Show Body Part
function showBodyPart() {

  bodyParts[
    wrongLetters.length - 1
  ].classList.remove("hidden");

}

// Show End Message
function showMessage(message) {

  clearInterval(timer);

  messageTitle.textContent =
    message;

  finalWord.textContent =
    selectedWord;

  messageBox.classList.remove("hidden");

  const buttons =
    keyboard.querySelectorAll("button");

  buttons.forEach(button => {
    button.disabled = true;
  });

}

// Restart
restartBtn.addEventListener(
  "click",
  startGame
);

// Default Start
setDifficulty("easy");