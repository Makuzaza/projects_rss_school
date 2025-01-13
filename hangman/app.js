document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;

     // Variables
     let questions = [];
     let word = ""; // The word to guess
     let hint = ""; // Hint for the word
     let attemptsLeft = 6;
     let guessedLetters = new Set();

     async function fetchQuestions() {
        try {
            const response = await fetch("questions.json");
            questions = await response.json();
            console.log("Questions loaded:", questions);
            createStartScreen();
        } catch (error) {
            console.error("Failed to load questions:", error);
        }
    }

    // Select a random question
    function selectRandomQuestion() {
        const randomIndex = Math.floor(Math.random() * questions.length);
        const selected = questions[randomIndex];
        console.log("Selected question:", selected);
        word = selected.answer.toLowerCase(); // Set the word
        console.log("Word:", word);
        hint = selected.question; // Set the hint
        console.log("Hint:", hint);
    }

    // Create start screen
    function createStartScreen() {
        body.innerHTML = "";

        const startButton = document.createElement("button");
        startButton.textContent = "Start Game";
        startButton.addEventListener("click", () => {
            startGame();
        });

        body.appendChild(startButton);
    }

    // Create game UI
    function createGameUI() {
        body.innerHTML = "";

        // Gallows
        const gallows = document.createElement("div");
        gallows.id = "gallows";
        gallows.innerHTML = `<div id='hangman'></div>`;
        body.appendChild(gallows);

        // Word display
        const wordDisplay = document.createElement("div");
        wordDisplay.id = "word-display";
        wordDisplay.textContent = getWordDisplay();
        body.appendChild(wordDisplay);

        // Hint
        const hintDisplay = document.createElement("div");
        hintDisplay.id = "hint";
        hintDisplay.textContent = `Hint: ${hint}`;
        body.appendChild(hintDisplay);

        // Keyboard
        const keyboard = document.createElement("div");
        keyboard.id = "keyboard";
        for (let i = 65; i <= 90; i++) {
            const letter = String.fromCharCode(i);
            const button = document.createElement("button");
            button.textContent = letter;
            button.id = `key-${letter}`;
            button.addEventListener("click", () => {
                handleGuess(letter);
            });
            keyboard.appendChild(button);
        }
        body.appendChild(keyboard);

        // Event listener for physical keyboard
        document.addEventListener("keydown", handlePhysicalKey);
    }

    // Start the game
    function startGame() {
        guessedLetters.clear();
        attemptsLeft = 6;
        createGameUI();
        selectRandomQuestion();
        createGameUI();
    }

    // Handle guesses
    function handleGuess(letter) {
        if (guessedLetters.has(letter) || attemptsLeft === 0) return;

        guessedLetters.add(letter);
        document.getElementById(`key-${letter}`).disabled = true;

        if (word.includes(letter.toLowerCase())) {
            updateWordDisplay();
            if (checkWin()) {
                endGame(true);
            }
        } else {
            attemptsLeft--;
            updateGallows();
            if (attemptsLeft === 0) {
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
            .map((letter) => (guessedLetters.has(letter.toUpperCase()) ? letter : "_"))
            .join(" ");
    }

    // Update gallows
    function updateGallows() {
        const hangman = document.getElementById("hangman");
        hangman.innerHTML = `Head Body LeftArm RightArm LeftLeg RightLeg`.split(" ")
            .slice(0, 6 - attemptsLeft)
            .map((part) => `<div class='${part}'></div>`)
            .join("");
    }

    // Check for win
    function checkWin() {
        return word.split("").every((letter) => guessedLetters.has(letter.toUpperCase()));
    }

    // End game
    function endGame(win) {
        document.removeEventListener("keydown", handlePhysicalKey);

        const message = document.createElement("div");
        message.id = "end-message";
        message.textContent = win ? "You won!" : `You lost! The word was "${word}".`;
        body.appendChild(message);

        const restartButton = document.createElement("button");
        restartButton.textContent = "Play Again";
        restartButton.addEventListener("click", () => {
            createStartScreen();
        });
        body.appendChild(restartButton);
    }

    // Initialize
    fetchQuestions().then(() => {
        createStartScreen();
    });
});
