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

// Hangman body parts
const bodyParts = document.querySelectorAll(
  ".head, .body, .left-arm, .right-arm, .left-leg, .right-leg"
);

// Difficulty Selection
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

  // Hide message
  messageBox.classList.add("hidden");

  // Reset body parts
  bodyParts.forEach(part => {
    part.classList.add("hidden");
  });

  // Reset wrong letters
  wrongLettersText.textContent = "";

  // Create keyboard
  createKeyboard();

  // Update word display
  updateWordDisplay();

  // Timer
  if (difficulty !== "easy") {
    startTimer();
  }

  else {
    timerDisplay.textContent =
      "No Time Limit";
  }
}

// Timer Function
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

// Update Timer Display
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

// Word Display
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

  // WIN CONDITION
  if (!display.includes("_")) {

    // PLAY WIN SOUND
    winSound.currentTime = 0;

    winSound.play()
      .then(() => {
        console.log("Winning sound played");
      })
      .catch(error => {
        console.log("Audio blocked:", error);
      });

    showMessage("YOU WIN!");

  }
}

// Create Keyboard
function createKeyboard() {

  keyboard.innerHTML = "";

  for (let i = 65; i <= 90; i++) {

    const letter =
      String.fromCharCode(i);

    const button =
      document.createElement("button");

    button.textContent = letter;

    button.addEventListener("click",
      () => {
        handleGuess(letter, button);
      });

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

    if (wrongLetters.length === 6) {

      showMessage("GAME OVER");

    }
  }
}

// Show Body Part
function showBodyPart() {

  bodyParts[wrongLetters.length - 1]
    .classList.remove("hidden");

}

// End Game Message
function showMessage(message) {

  clearInterval(timer);

  messageTitle.textContent = message;

  finalWord.textContent =
    selectedWord;

  messageBox.classList.remove("hidden");

  // Disable keyboard
  const buttons =
    keyboard.querySelectorAll("button");

  buttons.forEach(button => {
    button.disabled = true;
  });
}

// Restart Game
restartBtn.addEventListener(
  "click",
  startGame
);

// Start Default Game
setDifficulty("easy");