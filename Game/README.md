# Kidex Game Collection

This folder contains the Kidex educational games and related pages, structured for deployment on GitHub Pages.

## Folder Structure

- `index.html` - Main Color Match game page.
- `games.html` - Games hub page listing all available games with tabs.
- `games/color-match.html` - Standalone Color Match game page embedded in games.html.
- `about.html` - About page with mission and information.
- `css/styles.css` - Common and game-specific styles.
- `js/color-match.js` - Modular JavaScript logic for the Color Match game.
- `js/features.js` - Utility features (e.g., daily challenge seed).
- `js/game-core.js` - Core game state management class (base for games).

## Features

- Modular and accessible Color Match game with difficulty levels, sound toggle, fullscreen, and help modal.
- Responsive design using Bootstrap 5 and custom CSS.
- Games hub with tabs and iframe embedding.
- Consistent navigation and footer across pages.

## Deployment

To deploy on GitHub Pages:

1. Push the entire `Game` folder to your GitHub repository.
2. In repository settings, enable GitHub Pages and set the source to the root or `/Game` folder as needed.
3. Access the site via the GitHub Pages URL.

## Testing

Open `index.html` or `games.html` locally in a modern browser to test functionality and responsiveness.
