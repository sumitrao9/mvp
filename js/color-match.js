// Enhanced Color Match Game Logic for Kidex - with animations and sound effects

const colorMap = {
  red:    { key: '1', sound: 'https://cdn.pixabay.com/audio/2022/03/15/audio_115b9e3b7e.mp3', hex: '#ef4444' },
  blue:   { key: '2', sound: 'https://cdn.pixabay.com/audio/2022/03/15/audio_115b9e3b7e.mp3', hex: '#3b82f6' },
  green:  { key: '3', sound: 'https://cdn.pixabay.com/audio/2022/03/15/audio_115b9e3b7e.mp3', hex: '#22c55e' },
  yellow: { key: '4', sound: 'https://cdn.pixabay.com/audio/2022/03/15/audio_115b9e3b7e.mp3', hex: '#eab308' },
  purple: { key: '5', sound: 'https://cdn.pixabay.com/audio/2022/03/15/audio_115b9e3b7e.mp3', hex: '#a855f7' },
  orange: { key: '6', sound: 'https://cdn.pixabay.com/audio/2022/03/15/audio_115b9e3b7e.mp3', hex: '#f97316' },
  cyan:   { key: '7', sound: 'https://cdn.pixabay.com/audio/2022/03/15/audio_115b9e3b7e.mp3', hex: '#06b6d4' }
};

const difficulties = {
  3: ['red', 'blue', 'green'],
  5: ['red', 'blue', 'green', 'yellow', 'purple'],
  7: ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'cyan']
};

let sequence = [];
let userStep = 0;
let score = 0;
let highScore = 0;
let timer = 60;
let timerInterval = null;
let playing = false;
let soundOn = true;
let currentColors = difficulties[3];
let inputLocked = false;

const canvas = document.getElementById('color-canvas');
const ctx = canvas.getContext('2d');
const colorBtns = Array.from(document.querySelectorAll('.color-btn'));
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('high-score');
const timeEl = document.getElementById('time');
const messageEl = document.getElementById('game-message');
const restartBtn = document.getElementById('restart-btn');
const difficultySel = document.getElementById('difficulty');
const soundBtn = document.getElementById('sound-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const helpBtn = document.getElementById('help-btn');
const confettiContainer = document.getElementById('confetti-container');

let audioCache = {};

// Resize canvas to fit container responsively
function resizeCanvas() {
  let parentWidth = canvas.parentElement.clientWidth - 40; // Adjust for padding
  let size = Math.min(parentWidth, 300);
  if (window.innerWidth <= 480) {
    size = Math.min(window.innerWidth * 0.8, 280);
  }
  canvas.width = size;
  canvas.height = size;
  if (playing && !inputLocked) {
    clearCanvasWithMessage("Your turn!");
  }
}

// Play sound for a color
function playSound(color) {
  if (!soundOn) return;
  if (!audioCache[color]) {
    audioCache[color] = new Audio(colorMap[color].sound);
  }
  audioCache[color].currentTime = 0;
  audioCache[color].play();
}

// Animate button press with scale and shadow
function animateButtonPress(btn) {
  btn.style.transform = 'scale(1.1)';
  btn.style.boxShadow = '0 0 15px 5px ' + btn.style.backgroundColor;
  setTimeout(() => {
    btn.style.transform = '';
    btn.style.boxShadow = '';
  }, 200);
}

// Draw color circle on canvas
function drawColor(color) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = colorMap[color].hex;
  ctx.beginPath();
  ctx.arc(canvas.width/2, canvas.height/2, canvas.width/2 - 20, 0, 2 * Math.PI);
  ctx.fill();
}

// Show the sequence to the user with animation
function showSequence(seq, i = 0) {
  inputLocked = true;
  if (i >= seq.length) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setMessage('Your turn!');
    inputLocked = false;
    return;
  }
  drawColor(seq[i]);
  playSound(seq[i]);
  const btn = colorBtns.find(b => b.getAttribute('data-color') === seq[i]);
  if (btn) animateButtonPress(btn);
  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setTimeout(() => showSequence(seq, i + 1), 300);
  }, 700);
}

// Start next round by adding a new color to sequence
function nextRound() {
  sequence.push(currentColors[Math.floor(Math.random() * currentColors.length)]);
  userStep = 0;
  setTimeout(() => showSequence(sequence), 500);
}

// Start or restart the game
function startGame() {
  sequence = [];
  score = 0;
  timer = 60;
  scoreEl.textContent = score;
  timeEl.textContent = timer;
  setMessage('Watch the sequence!');
  playing = true;
  restartBtn.textContent = 'Restart';
  nextRound();
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer--;
    timeEl.textContent = timer;
    if (timer <= 0) {
      endGame(false);
    }
  }, 1000);
}

// End the game and show message
function endGame(win) {
  playing = false;
  clearInterval(timerInterval);
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('colorMatchHighScore', highScore);
    highScoreEl.textContent = highScore;
  }
  setMessage(win ? 'You win! 🎉' : 'Game over!');
  if (win || score > 0) launchConfetti();
}

// Handle user input and check correctness
function handleUserInput(color) {
  if (!playing || inputLocked) return;
  playSound(color);
  const btn = colorBtns.find(b => b.getAttribute('data-color') === color);
  if (btn) animateButtonPress(btn);
  flashButton(color, color === sequence[userStep]);
  if (color === sequence[userStep]) {
    userStep++;
    if (userStep === sequence.length) {
      score++;
      scoreEl.textContent = score;
      nextRound();
    }
  } else {
    endGame(false);
  }
}

// Flash button for feedback
function flashButton(color, correct) {
  const btn = colorBtns.find(b => b.getAttribute('data-color') === color);
  if (!btn) return;
  btn.classList.add(correct ? 'btn-success' : 'btn-danger');
  setTimeout(() => btn.classList.remove('btn-success', 'btn-danger'), 300);
}

// Launch confetti animation with more colors and shapes
function launchConfetti() {
  confettiContainer.innerHTML = '';
  const shapes = ['circle', 'square', 'triangle'];
  for (let i = 0; i < 60; i++) {
    const conf = document.createElement('div');
    conf.style.position = 'absolute';
    conf.style.left = Math.random() * 100 + 'vw';
    conf.style.top = '-10px';
    conf.style.width = '12px';
    conf.style.height = '12px';
    conf.style.background = Object.values(colorMap)[Math.floor(Math.random() * currentColors.length)].hex;
    conf.style.borderRadius = shapes[Math.floor(Math.random() * shapes.length)] === 'circle' ? '50%' : '0';
    conf.style.opacity = 0.8;
    conf.style.transition = 'top 1.2s linear, left 1.2s linear';
    confettiContainer.appendChild(conf);
    setTimeout(() => {
      conf.style.top = '90vh';
      conf.style.left = Math.random() * 100 + 'vw';
    }, 10);
    setTimeout(() => conf.remove(), 1300);
  }
}

// Update color buttons for current difficulty
function updateButtons() {
  colorBtns.forEach((btn, i) => {
    if (currentColors[i]) {
      btn.style.display = '';
      btn.className = 'color-btn ' + currentColors[i];
      btn.setAttribute('data-color', currentColors[i]);
      btn.setAttribute('aria-label', currentColors[i][0].toUpperCase() + currentColors[i].slice(1));
      btn.textContent = currentColors[i][0].toUpperCase() + currentColors[i].slice(1);
    } else {
      btn.style.display = 'none';
    }
  });
}

// Set game message and update ARIA live region
function setMessage(msg) {
  messageEl.textContent = msg;
  messageEl.setAttribute('aria-live', 'polite');
}

// Clear canvas and show message
function clearCanvasWithMessage(msg) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = `bold ${canvas.width / 15}px 'Comic Neue'`;
  ctx.fillStyle = '#6b7280';
  ctx.textAlign = 'center';
  ctx.fillText(msg, canvas.width / 2, canvas.height / 2);
}

// Event listeners and initialization
document.addEventListener('DOMContentLoaded', () => {
  highScore = parseInt(localStorage.getItem('colorMatchHighScore')) || 0;
  highScoreEl.textContent = highScore;
  updateButtons();
  restartBtn.addEventListener('click', startGame);
  colorBtns.forEach(btn => {
    btn.addEventListener('click', e => handleUserInput(btn.getAttribute('data-color')));
  });
  difficultySel.addEventListener('change', e => {
    currentColors = difficulties[difficultySel.value];
    updateButtons();
    startGame();
  });
  soundBtn.addEventListener('click', () => {
    soundOn = !soundOn;
    soundBtn.setAttribute('aria-pressed', soundOn);
    soundBtn.textContent = soundOn ? '🔊' : '🔇';
  });
  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });
  helpBtn.addEventListener('click', () => {
    const modal = new bootstrap.Modal(document.getElementById('instructions-modal'));
    modal.show();
  });
  document.addEventListener('keydown', e => {
    if (!playing || inputLocked) return;
    const idx = Object.values(colorMap).findIndex(c => c.key === e.key && currentColors.includes(Object.keys(colorMap)[Object.values(colorMap).indexOf(c)]));
    if (idx !== -1) {
      handleUserInput(currentColors[idx]);
    }
    if (e.key === 'Enter') startGame();
  });
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  setMessage("Click 'Start Game'");
  updateButtons();
});
