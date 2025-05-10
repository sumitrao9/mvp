// Game state management
class Game {
  constructor() {
    this.sequence = [];
    this.score = 0;
    this.highScore = localStorage.getItem('colorMatchHighScore') || 0;
  }
  // ... core game methods ...
}