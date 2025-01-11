// import { isValidLetter, resetGallows, updateGallows, showModal, hideModal } from 'helpers.js';

function isValidLetter(letter) {
    return /^[a-z]$/i.test(letter);
}

function resetGallows() {
    incorrectGuesses = 0;
    updateGallows(incorrectGuesses);
}

function hideModal() {
    document.getElementById("modal").style.display = "none";
}

function showModal(message, word) {
    document.getElementById("modal-message").textContent = message;
    document.getElementById("modal-word").textContent = word;
    document.getElementById("modal").style.display = "block";
}

function updateGallows(step) {
    document.getElementById("gallows").src = `images/gallow-${step}.png`;
}

let secretWord = "";
let question = "";
let incorrectGuesses = 0;
let guessedLetters = [];

const maxAttempts = 6;
const questionsAndAnswers = [
    { question: "A device used to transmit sound over long distances.", answer: "telephone" },
    { question: "A container for carrying groceries.", answer: "basket" },
    { question: "An electronic machine for storing data.", answer: "computer" },
    { question: "A tool used to write on paper.", answer: "pencil" },
    { question: "A large body of water surrounded by land.", answer: "lake" },
    { question: "A vehicle with two wheels and pedals.", answer: "bicycle" },
    { question: "A fruit that keeps the doctor away.", answer: "apple" },
    { question: "A flying mammal.", answer: "bat" },
    { question: "A star at the center of our solar system.", answer: "sun" },
    { question: "A bird known for its colorful tail feathers.", answer: "peacock" },
];

function startGame() {
    const randomIndex = Math.floor(Math.random() * questionsAndAnswers.length);
    question = questionsAndAnswers[randomIndex].question;
    secretWord = questionsAndAnswers[randomIndex].answer.toLowerCase();

    incorrectGuesses = 0;
    guessedLetters = [];

    resetGallows();
    hideModal();
    displayQuestionAndUnderscores();
    enableKeyboard();
}

function displayQuestionAndUnderscores() {
    document.getElementById("question").textContent = question;
    const wordContainer = document.getElementById("word");
    wordContainer.innerHTML = secretWord
        .split("")
        .map(letter => guessedLetters.includes(letter) ? letter : "_")
        .join(" ");
}

function handleGuess(letter) {
    if (!isValidLetter(letter) || guessedLetters.includes(letter)) return;

    guessedLetters.push(letter);

    if (secretWord.includes(letter)) {
        displayQuestionAndUnderscores();

        if (secretWord.split(" ").join("") === guessedLetters.filter(l => secretWord.includes(l)).join("")) {
            showModal("Congratulations, you won!", secretWord);
            disableKeyboard();
        }
    } else {
        incorrectGuesses++;
        updateGallows(incorrectGuesses);

        if (incorrectGuesses === maxAttempts) {
            showModal("You lost!", secretWord);
            disableKeyboard();
        }
    }
    disableKey(letter);
}

function enableKeyboard() {
    const keys = document.querySelectorAll(".key");
    keys.forEach(key => {
        key.disabled = false;
        key.addEventListener("click", () => handleGuess(key.textContent));
    });
    document.addEventListener("keydown", handlePhysicalKeyPress);
}

function disableKeyboard() {
    const keys = document.querySelectorAll(".key");
    keys.forEach(key => (key.disabled = true));
    document.removeEventListener("keydown", handlePhysicalKeyPress);
}

function disableKey(letter) {
    const key = document.querySelector(`.key[data-letter="${letter}"]`);
    if (key) key.disabled = true;
}

function handlePhysicalKeyPress(event) {
    const letter = event.key.toLowerCase();
    handleGuess(letter);
}

// Start the game on page load
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("play-again").addEventListener("click", startGame);
    startGame();
});
