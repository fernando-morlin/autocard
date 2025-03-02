# AutoCard

AutoCard is an AI-powered trading card game generator. Describe your wildest fantasy card idea, and let the AI conjure an image and card stats!

## Table of Contents

*   [About](#about)
*   [Features](#features)
*   [Technologies Used](#technologies-used)
*   [Getting Started](#getting-started)
    *   [Prerequisites](#prerequisites)
    *   [Installation](#installation)
*   [Usage](#usage)
*   [Project Structure](#project-structure)
*   [API Keys](#api-keys)
*   [Contributing](#contributing)
*   [License](#license)
*   [Acknowledgments](#acknowledgments)

## About

AutoCard is a web application that combines user-generated descriptions with the power of AI to generate trading card game content. It allows users to input a description for a card, and the application then leverages AI services to create an image and populate the card with stats, abilities, and flavor text.

## Features

*   **AI-Powered Image Generation:** Generates card images based on user descriptions using AI services like Stable Horde.
*   **AI-Driven Card Information:** Fills in card stats, abilities, and flavor text using LLMs like Google Gemini.
*   **Dynamic Card Display:** Presents the generated card with a customizable holographic effect and the ability to flip the card.
*   **Interactive UI:** Provides a user-friendly interface with input fields, buttons, and interactive elements.
*   **Card Collection:** Keeps a small collection of generated cards.
*   **Hand Display:** Show generated or placeholder cards in hand.
*   **Game State Info:** Show live data like life points and number of cards in deck.

## Technologies Used

*   **Frontend:**
    *   React
    *   Tailwind CSS
    *   HTML
    *   JavaScript
    *   Babel (for in-browser transpilation)
*   **AI Services:**
    *   Stable Horde (for image generation)
    *   Google Gemini (or similar LLM for card information - _API Key Required_)

## Getting Started

Follow these instructions to get AutoCard up and running on your local machine.

### Prerequisites

*   A modern web browser (Chrome, Firefox, Safari, Edge)
*   Internet connection (for accessing AI services and CDN dependencies)

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/fernando-morlin/autocard.git
    cd autocard
    ```

2.  Open `index.html` in your web browser.

## Usage

1.  Enter a description of the card you want to generate in the input field.
2.  Click the "Gerar Carta" (Generate Card) button.
3.  Wait for the AI services to generate the card image and information.
4.  View the generated card, flip it, toggle the holographic effect, and explore its details in the info panel.

## Project Structure

```
/
├── index.html             // Main HTML file
├── style.css              // CSS Styles
├── src/
│   ├── app.js             // Main application entry point (ReactDOM.render)
│   ├── components/
│   │   ├── CardGameInterface.js   // Container component, orchestrates everything
│   │   ├── CardDisplay.js         // Displays the generated card
│   │   ├── CardInfoPanel.js       // Displays card information
│   │   ├── GenerationInput.js     // Input field and generate button
│   │   ├── GameStateInfo.js       // Displays game state (LP, deck size, etc.)
│   │   └── HandDisplay.js        // Display cards in hand
│   ├── services/
│   │   └── ApiService.js         // Handles API calls (image and card info generation)
│   └── utils/
│       └── helpers.js          // Utility functions
```

## API Keys

To fully utilize AutoCard, you'll need to set up API keys for the AI services:

1. **API Key Setup**:
   - Copy `config.example.js` to `config.js`
   - Add your API keys to `config.js`:
     ```javascript
     window.CONFIG = {
       GEMINI_API_KEY: "your_actual_gemini_key_here",
       STABLE_HORDE_API_KEY: "your_actual_stable_horde_key_here"
     };
     ```

2. **API Key Sources**:
   - **Stable Horde API Key**: Get a key from [https://stablehorde.net/](https://stablehorde.net/)
   - **Google Gemini API Key**: Get a key from [Google AI Studio](https://aistudio.google.com/)

3. **Important Security Notes**:
   - `config.js` is listed in `.gitignore` to prevent accidental commits
   - NEVER commit your API keys to a public repository
   - Each developer needs to create their own local config file

## Contributing

Contributions are welcome! Feel free to submit pull requests with bug fixes, improvements, or new features.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

*   This project utilizes the free Stable Horde API to generate images.  Please be mindful of their usage guidelines.
*   The LLM portion was powered by Google's Gemini LLM.