document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  // Variables
  let questions = [];
  let word = ""; // The word to guess
  let hint = ""; // Hint for the word
  let attemptsLeft = 6;
  let guessedLetters = new Set();
  let gameEnded = false;

  async function fetchQuestions() {
    try {
      const response = await fetch("questions.json");
      questions = await response.json();
      // console.log("Questions loaded:", questions);
      startGame();
    } catch (error) {
      console.error("Failed to load questions:", error);
    }
  }

  // Select a random question
  function selectRandomQuestion() {
    const randomIndex = Math.floor(Math.random() * questions.length);
    const selected = questions[randomIndex];
    // console.log("Selected question:", selected);
    word = selected.answer.toLowerCase();
    // console.log("Word:", word);
    hint = selected.question;
    // console.log("Hint:", hint);
  }

  // Create game UI
  function createGameUI() {
    body.innerHTML = "";

    // Container
    const container = document.createElement("div");
    container.id = "container";
    body.appendChild(container);

    // Left column
    const leftColumn = document.createElement("div");
    leftColumn.id = "left-column";
    container.appendChild(leftColumn);

    const gallowsContainer = document.createElement("div");
    gallowsContainer.id = "gallows-container";
    leftColumn.appendChild(gallowsContainer);

    const gallowsBase = document.createElement("div");
    gallowsBase.id = "gallows-base";
    gallowsContainer.appendChild(gallowsBase);

    const gallowsVertical = document.createElement("div");
    gallowsVertical.id = "gallows-vertical";
    gallowsContainer.appendChild(gallowsVertical);

    const gallowsHorizontal = document.createElement("div");
    gallowsHorizontal.id = "gallows-horizontal";
    gallowsContainer.appendChild(gallowsHorizontal);

    const gallowsSmallVertical = document.createElement("div");
    gallowsSmallVertical.id = "gallows-small-vertical";
    gallowsContainer.appendChild(gallowsSmallVertical);

    const gallowsSupport = document.createElement("div");
    gallowsSupport.id = "gallows-support";
    gallowsContainer.appendChild(gallowsSupport);

    const hangman = document.createElement("div");
    hangman.id = "hangman";
    gallowsContainer.appendChild(hangman);

    // Name of the game
    const gameName = document.createElement("div");
    gameName.id = "game-name";
    gameName.textContent = "Hangman Game";
    leftColumn.appendChild(gameName);

    // Right column
    const rightColumn = document.createElement("div");
    rightColumn.id = "right-column";
    container.appendChild(rightColumn);

    // Word display
    const wordDisplay = document.createElement("div");
    wordDisplay.id = "word-display";
    wordDisplay.textContent = getWordDisplay();
    rightColumn.appendChild(wordDisplay);

    // Hint
    const hintDisplay = document.createElement("div");
    hintDisplay.id = "hint";
    hintDisplay.textContent = `Hint: ${hint.toUpperCase()}`;
    rightColumn.appendChild(hintDisplay);

    // Attempts left
    const attemptsDisplay = document.createElement("div");
    attemptsDisplay.id = "attempts";
    attemptsDisplay.innerHTML = `Incorrect guesses: <span class="attempts-left">${attemptsLeft}/6</span>`;
    rightColumn.appendChild(attemptsDisplay);

    // Keyboard
    const keyboard = document.createElement("div");
    keyboard.id = "keyboard";
    for (let i = 65; i <= 90; i++) {
      const letter = String.fromCharCode(i);
      const button = document.createElement("button");
      button.textContent = letter;
      button.id = `key-${letter}`;
      button.addEventListener("click", () => {
        if (!gameEnded) {
          handleGuess(letter);
        }
      });
      keyboard.appendChild(button);
    }
    rightColumn.appendChild(keyboard);

    // Event listener for physical keyboard
    document.addEventListener("keydown", handlePhysicalKey);
  }

  // Start the game
  function startGame() {
    guessedLetters.clear();
    attemptsLeft = 0;
    gameEnded = false;
    selectRandomQuestion();
    createGameUI();
  }

  // Handle guesses
  function handleGuess(letter) {
    if (guessedLetters.has(letter) || attemptsLeft === 6) return;

    guessedLetters.add(letter);
    document.getElementById(`key-${letter}`).disabled = true;

    if (word.includes(letter.toLowerCase())) {
      updateWordDisplay();
      if (checkWin()) {
        endGame(true);
      }
    } else {
      attemptsLeft++;
      updateGallows();
      document.getElementById(
        "attempts"
      ).innerHTML = `Incorrect guesses: <span class="attempts-left">${attemptsLeft}/6</span>`;
      if (attemptsLeft === 6) {
        endGame(false);
      }
    }
  }

  // Handle physical keyboard input
  function handlePhysicalKey(event) {
    const letter = event.key.toUpperCase();
    if (letter.length === 1 && letter >= "A" && letter <= "Z") {
      handleGuess(letter);
    }
  }

  // Update word display
  function updateWordDisplay() {
    const wordDisplay = document.getElementById("word-display");
    wordDisplay.textContent = getWordDisplay();
  }

  // Get word display
  function getWordDisplay() {
    return word
      .split("")
      .map((letter) =>
        guessedLetters.has(letter.toUpperCase()) ? letter : "_"
      )
      .join(" ");
  }

  // Update gallows
  function updateGallows() {
    const hangman = document.getElementById("hangman");
    hangman.innerHTML = `Head Body LeftArm RightArm LeftLeg RightLeg`
      .split(" ")
      .slice(0, attemptsLeft)
      .map((part) => `<div class='${part}'></div>`)
      .join("");
  }

  // Check for win
  function checkWin() {
    return word
      .split("")
      .every((letter) => guessedLetters.has(letter.toUpperCase()));
  }

  // End game
  function endGame(win) {
    gameEnded = true;
    document.removeEventListener("keydown", handlePhysicalKey);

    // Create modal
    const modal = document.createElement("div");
    modal.id = "modal";
    modal.innerHTML = `
  <div id="modal-content">
    <h2>${win ? "You WON!" : "You lost! Try again"}</h2>
    <p>The word was "${word.toLocaleUpperCase()}".</p>
    <button id="close-modal">Play again</button>
  </div>
`;
    body.appendChild(modal);

    // Add close modal functionality
    document.getElementById("close-modal").addEventListener("click", () => {
      modal.remove();
      startGame(); // Restart the game
    });

    // Add overlay for the modal
    const overlay = document.createElement("div");
    overlay.id = "overlay";
    body.appendChild(overlay);
  }

  // Initialize
  fetchQuestions().then(() => {
    startGame();
  });
});
