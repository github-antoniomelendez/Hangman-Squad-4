const words = [
  "PYTHON",
  "JAVA",
  "KOTLIN",
  "ANDROID",
  "COMPUTER",
  "PROGRAM"
];

let selectedWord = "";
let guessedLetters = [];
let wrongLetters = [];

const wordDisplay = document.getElementById("wordDisplay");
const keyboard = document.getElementById("keyboard");
const wrongLettersText = document.getElementById("wrongLetters");

const bodyParts = document.querySelectorAll(
  ".head, .body, .left-arm, .right-arm, .left-leg, .right-leg"
);

const messageBox = document.getElementById("messageBox");
const messageTitle = document.getElementById("messageTitle");
const finalWord = document.getElementById("finalWord");

function startGame() {
  selectedWord = words[Math.floor(Math.random() * words.length)];

  guessedLetters = [];
  wrongLetters = [];

  messageBox.classList.add("hidden");

  bodyParts.forEach(part => {
    part.classList.add("hidden");
  });

  createKeyboard();
  updateWordDisplay();
  wrongLettersText.textContent = "";
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
    showMessage("YOU WIN!");
  }
}

function createKeyboard() {
  keyboard.innerHTML = "";

  for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i);

    const button = document.createElement("button");
    button.textContent = letter;

    button.addEventListener("click", () => handleGuess(letter, button));

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
  bodyParts[wrongLetters.length - 1].classList.remove("hidden");
}

function showMessage(message) {
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

startGame();