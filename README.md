# ArtVerse 🎨

## Introduction
ArtVerse is a modern, responsive web application that aggregates real-time data from the world's most famous art museums into a single, seamless gallery. It serves as a centralized reference hub for artists, art students, and enthusiasts, eliminating the need to scour multiple individual museum sites or generic search engines for high-quality, curated masterworks.

## Features
- **Real-Time Data**: Integrates data natively via the Art Institute of Chicago API, with robust programmatic fallbacks for Harvard Art Museums and The Rijksmuseum.
- **Dynamic Search**: Filter the entire gallery instantly by artwork title or artist name.
- **Museum Filtering**: Select exactly which museum collection you wish to view.
- **Sorting Options**: Toggle the organization of artworks natively.
- **Dark/Light Mode**: Full theme-switching support for comfortable browsing.
- **Favorite Toggling**: Interactive "Like" capabilities to bookmark favorite inspirational pieces.

## Technologies Used
- **HTML5 & CSS3** (Tailwind CSS for rapid responsive design)
- **Vanilla JavaScript (ES6)**
- No external heavy JS libraries or traditional loops (`for`/`while`) were used for data handling. The entire data processing lifecycle relies strictly on robust **Array Higher-Order Functions** (`.map`, `.filter`, `.sort`).

## Getting Started

### Prerequisites
To run this project, all you need is a modern web browser.

### Installation & Execution
1. Clone this repository to your local machine.
2. Open the project folder.
3. Simply launch `index.html` in any web browser (Chrome, Safari, Firefox). No local server is strictly necessary, though an extension like VS Code's "Live Server" is recommended for the best experience.

### API Configuration (Optional)
This project is configured out-of-the-box using the free Art Institute of Chicago API.
To see the live feeds for the other museums, you can optionally insert your free developer keys inside `script.js`:
- Harvard Art Museums API Key
- The Rijksmuseum API Key 
(Look for the `YOUR_HARVARD_API_KEY_HERE` placeholders in the code).

## Capstone Objectives Completed
- ✅ **Milestone 1**: Project Structure setup & README creation.
- ✅ **Milestone 2**: Public API integration via `fetch()`, dynamic DOM rendering, and responsive UI loading states.
- ✅ **Milestone 3**: Core interactive filtering, searching, standardizing, and UI toggling using strict Array HOF logic.
- ✅ **Milestone 4**: Final documentation refactoring.

---
*Created for the Capstone Project Submission.*
