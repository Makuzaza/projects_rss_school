# Hangman Game

A fun and interactive Hangman game built with JavaScript, HTML, and CSS.

## Features
- Randomly generated questions and answers.
- A fully functional on-screen keyboard.
- Tracks incorrect guesses with a gallows display.
- Displays a winning or losing message via a modal.

---

## Game Rules
1. A question is displayed, and the answer is hidden as underscores (`_`).
2. Use the on-screen keyboard or your physical keyboard to guess letters.
3. Each incorrect guess progresses the gallows. You lose if the gallows is fully drawn.
4. If you guess all the letters in the word before running out of attempts, you win.

---

## Project Structure

```
project/
|-- index.html           // Main HTML file
|-- style.css            // Stylesheet for the game
|-- game.js              // Main game logic
|-- helpers.js           // Helper functions
|-- assets/              // Images for the gallows
|-- README.md            // Documentation
```

---

## How to Run

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Open `index.html` in any modern browser.

3. Play the game!

---

## Development

### Prerequisites
- A text editor (e.g., VS Code, Sublime Text).
- A modern browser for testing.

### JavaScript Modules
- **`game.js`**: Contains the main game logic, including question generation, letter handling, and game state updates.
- **`helpers.js`**: Includes reusable utility functions for validating input, updating the UI, and managing the gallows display.

---

## Future Improvements
- Add a difficulty setting for varying word lengths.
- Include a timer for added challenge.
- Allow custom questions and answers.
- Enhance visual and audio feedback for correct and incorrect guesses.

---

## License
This project is open source and available under the [MIT License](LICENSE).

---

## Credits
- Images: Free assets from [Unsplash](https://unsplash.com/) and [Pixabay](https://pixabay.com/).
- Icons: [FontAwesome](https://fontawesome.com/).
- Inspiration: Classic Hangman game.

---

Enjoy playing the Hangman Game!
