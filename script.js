const categories = {

  animals: [
    "ELEPHANT",
    "GIRAFFE",
    "KANGAROO",
    "DOLPHIN",
    "CROCODILE"
  ],

  countries: [
    "MEXICO",
    "BRAZIL",
    "CANADA",
    "JAPAN",
    "GERMANY"
  ],

  famousPeople: [
    "EINSTEIN",
    "SHAKESPEARE",
    "MICHAELJORDAN",
    "BEETHOVEN",
    "NAPOLEON"
  ],

  food: [
    "PIZZA",
    "HAMBURGER",
    "SPAGHETTI",
    "TACOS",
    "CHOCOLATE"
  ],

  ldsProphets: [
    "NELSON",
    "MONSON",
    "HINCKLEY",
    "KIMBALL",
    "MCKAY"
  ]

};

const hints = {

  ELEPHANT:
    "The largest land animal.",

  GIRAFFE:
    "This animal has a very long neck.",

  KANGAROO:
    "An Australian animal that jumps.",

  DOLPHIN:
    "A very intelligent sea animal.",

  CROCODILE:
    "A dangerous reptile with strong jaws.",

  MEXICO:
    "Country south of the United States.",

  BRAZIL:
    "Largest country in South America.",

  CANADA:
    "Country north of the United States.",

  JAPAN:
    "Island nation famous for sushi and anime.",

  GERMANY:
    "European country known for Oktoberfest.",

  EINSTEIN:
    "Scientist who developed relativity.",

  SHAKESPEARE:
    "Famous English playwright.",

  MICHAELJORDAN:
    "Legendary basketball player.",

  BEETHOVEN:
    "Famous classical composer.",

  NAPOLEON:
    "French military leader and emperor.",

  PIZZA:
    "Popular Italian food with cheese.",

  HAMBURGER:
    "Sandwich often served with fries.",

  SPAGHETTI:
    "Long pasta noodles.",

  TACOS:
    "Mexican food served in tortillas.",

  CHOCOLATE:
    "Sweet treat made from cocoa.",

  NELSON:
    "Current LDS prophet in 2026.",

  MONSON:
    "LDS prophet before Russell M. Nelson.",

  HINCKLEY:
    "Very beloved LDS prophet from the 1990s.",

  KIMBALL:
    "LDS prophet who emphasized missionary work.",

  MCKAY:
    "LDS prophet known for education emphasis."

};

let selectedWord = "";

let selectedCategory = "";

let guessedLetters = [];

let wrongLetters = [];

let difficulty = "easy";

let timer;

let timeLeft = 0;

let score = 0;

let highScore =
  localStorage.getItem("highScore") || 0;

let multiplayerMode = false;

// =========================
// DOM ELEMENTS
// =========================

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

const loseSound =
  document.getElementById("loseSound");

const highScoreText =
  document.getElementById("highScore");

const categoryText =
  document.getElementById("categoryText");

const hintBtn =
  document.getElementById("hintBtn");

const hintText =
  document.getElementById("hintText");

const customWordInput =
  document.getElementById("customWord");

const multiplayerBtn =
  document.getElementById("multiplayerBtn");

const scoreText =
  document.getElementById("scoreText");

// =========================
// BODY PARTS
// =========================

const bodyParts = document.querySelectorAll(
  ".rope, .head, .body, .left-arm, .right-arm, .left-leg, .right-leg"
);

// =========================
// DISPLAY HIGH SCORE
// =========================

highScoreText.textContent =
  highScore;

// =========================
// PLAY SOUND
// =========================

function playSound(sound) {

  try {

    sound.pause();

    sound.currentTime = 0;

    const playPromise =
      sound.play();

    if (playPromise !== undefined) {

      playPromise.catch(() => {});
    }

  }

  catch (error) {

    console.log(error);
  }

}

// =========================
// FORMAT CATEGORY
// =========================

function formatCategory(category) {

  switch (category) {

    case "animals":
      return "Animals";

    case "countries":
      return "Countries";

    case "famousPeople":
      return "Famous People";

    case "food":
      return "Food";

    case "ldsProphets":
      return "LDS Prophets";

    default:
      return category;
  }

}

// =========================
// UPDATE HIGH SCORE
// =========================

function updateHighScore() {

  // Save High Score
  if (score > highScore) {

    highScore = score;

    localStorage.setItem(
      "highScore",
      highScore
    );

    highScoreText.textContent =
      highScore;
  }

}

// =========================
// DIFFICULTY
// =========================

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

// =========================
// START GAME
// =========================

function startGame() {

  if (multiplayerMode) {

    selectedWord =
      customWordInput.value
        .toUpperCase()
        .trim();

    selectedCategory =
      "Multiplayer";

    categoryText.textContent =
      "Multiplayer";
  }

  else {

    // Random Category
    const categoryNames =
      Object.keys(categories);

    selectedCategory =
      categoryNames[
        Math.floor(Math.random() * categoryNames.length)
      ];

    // Random Word
    const categoryWords =
      categories[selectedCategory];

    selectedWord =
      categoryWords[
        Math.floor(Math.random() * categoryWords.length)
      ];

    // Display Category
    categoryText.textContent =
      formatCategory(selectedCategory);

  }

  guessedLetters = [];

  wrongLetters = [];

  score = 0;

  scoreText.textContent =
    score;

  clearInterval(timer);

  messageBox.classList.add("hidden");

  bodyParts.forEach(part => {

    part.classList.add("hidden");

  });

  wrongLettersText.textContent = "";

  hintText.textContent =
    "None";

  hintBtn.disabled = false;

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

// =========================
// TIMER
// =========================

function startTimer() {

  updateTimerDisplay();

  timer = setInterval(() => {

    timeLeft--;

    updateTimerDisplay();

    if (timeLeft <= 0) {

      clearInterval(timer);

      playSound(loseSound);

      showMessage("TIME'S UP!");
    }

  }, 1000);

}

// =========================
// TIMER DISPLAY
// =========================

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

// =========================
// UPDATE WORD DISPLAY
// =========================

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

  wordDisplay.textContent =
    display;

  // =========================
  // WIN CONDITION
  // =========================

  if (!display.includes("_")) {

    // Difficulty Bonus
    if (difficulty === "medium") {

      score += 25;
    }

    else if (difficulty === "hard") {

      score += 50;
    }

    // Hint Penalty
    if (hintBtn.disabled) {

      score -= 15;
    }

    // Prevent Negative Score
    if (score < 0) {

      score = 0;
    }

    // Update Score Display
    scoreText.textContent =
      score;

    // Update High Score
    updateHighScore();

    // Play Win Sound
    playSound(winSound);

    // Show Win Message
    showMessage("YOU WIN!");
  }

}

// =========================
// CREATE KEYBOARD
// =========================

function createKeyboard() {

  keyboard.innerHTML = "";

  for (let i = 65; i <= 90; i++) {

    const letter =
      String.fromCharCode(i);

    const button =
      document.createElement("button");

    button.textContent =
      letter;

    button.addEventListener(
      "click",
      () => {

        handleGuess(letter, button);

      }
    );

    keyboard.appendChild(button);
  }

}

// =========================
// HANDLE GUESS
// =========================

function handleGuess(letter, button) {

  button.disabled = true;

  // =========================
  // CORRECT GUESS
  // =========================

  if (selectedWord.includes(letter)) {

    if (!guessedLetters.includes(letter)) {

      guessedLetters.push(letter);

      // Add Score
      score += 10;

      scoreText.textContent =
        score;
    }

    updateWordDisplay();

  }

  // =========================
  // WRONG GUESS
  // =========================

  else {

    wrongLetters.push(letter);

    // Remove Score
    score -= 5;

    // Prevent Negative Score
    if (score < 0) {

      score = 0;
    }

    scoreText.textContent =
      score;

    wrongLettersText.textContent =
      wrongLetters.join(", ");

    showBodyPart();

    // Lose Condition
    if (wrongLetters.length === 7) {

      playSound(loseSound);

      updateHighScore();

      showMessage("GAME OVER");
    }

  }

}

// =========================
// SHOW BODY PART
// =========================

function showBodyPart() {

  bodyParts[
    wrongLetters.length - 1
  ].classList.remove("hidden");

}

// =========================
// SHOW MESSAGE
// =========================

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

// =========================
// PHYSICAL KEYBOARD SUPPORT
// =========================

document.addEventListener("keydown", event => {

  const letter =
    event.key.toUpperCase();

  if (/^[A-Z]$/.test(letter)) {

    const buttons =
      keyboard.querySelectorAll("button");

    buttons.forEach(button => {

      if (
        button.textContent === letter &&
        !button.disabled
      ) {

        button.click();
      }

    });

  }

});

// =========================
// RESTART BUTTON
// =========================

restartBtn.addEventListener(
  "click",
  startGame
);

// =========================
// MULTIPLAYER BUTTON
// =========================

multiplayerBtn.addEventListener(
  "click",
  () => {

    const customWord =
      customWordInput.value
        .trim()
        .toUpperCase();

    // Validation
    if (
      customWord === "" ||
      !/^[A-Z]+$/.test(customWord)
    ) {

      alert(
        "Enter a valid word using letters only."
      );

      return;
    }

    multiplayerMode = true;

    startGame();

    // Clear input
    customWordInput.value = "";

  }
);

// =========================
// HINT BUTTON
// =========================

hintBtn.addEventListener(
  "click",
  () => {

    hintText.textContent =
      hints[selectedWord];

    hintBtn.disabled = true;

  }
);

// =========================
// DEFAULT START
// =========================

multiplayerMode = false;
setDifficulty("easy");