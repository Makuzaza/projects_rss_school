
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