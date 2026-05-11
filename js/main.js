import { Game } from './game.js';
import { Tracker } from './tracker.js';
import { UI } from './ui.js';

const canvas = document.querySelector('#gameCanvas');
const context = canvas.getContext('2d');
const video = document.querySelector('#cameraPreview');
const ui = new UI(document);
const game = new Game(canvas, context);

let tracker = null;
const targetFrameTime = 1000 / 60;
let previousTime = 0;
let accumulatedTime = 0;
let animationFrame = null;
let keyboardDirection = 'right';

function resizeCanvas() {
  const frame = canvas.parentElement;
  const size = Math.min(frame.clientWidth - 32, window.innerHeight * 0.76, 672);
  const pixelRatio = window.devicePixelRatio || 1;
  const pixelSize = Math.max(420, Math.floor(size * pixelRatio));

  canvas.style.width = `${pixelSize / pixelRatio}px`;
  canvas.style.height = `${pixelSize / pixelRatio}px`;
  game.resize(pixelSize);
  game.render();
}

async function startGame() {
  ui.show('calibration');
  ui.setStatus('Requesting webcam permission...');
  ui.setCalibrationProgress(0);

  try {
    tracker?.stop();
    tracker = new Tracker(video);
    await tracker.start();
    ui.setStatus('Look straight at the camera for calibration.');
    await tracker.calibrate((progress) => ui.setCalibrationProgress(progress));
    tracker.addEventListener('direction', (event) => game.setDirection(event.detail));
    tracker.addEventListener('status', (event) => ui.setStatus(event.detail));
    tracker.run();
    game.reset();
    game.setDirection(keyboardDirection);
    ui.hideScreens();
    ui.setStatus('Calibrated. Move your head to guide NeckPac.');
    startLoop();
  } catch (error) {
    ui.setStatus('Camera setup failed.');
    ui.showError(error.message);
  }
}

function startLoop() {
  previousTime = performance.now();
  accumulatedTime = 0;

  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }

  animationFrame = requestAnimationFrame(gameLoop);
}

function gameLoop(currentTime) {
  const deltaTime = Math.min(100, currentTime - previousTime);
  previousTime = currentTime;
  accumulatedTime += deltaTime;

  while (accumulatedTime >= targetFrameTime) {
    game.update(targetFrameTime);
    accumulatedTime -= targetFrameTime;
  }

  game.render();
  animationFrame = requestAnimationFrame(gameLoop);
}

function handleKeyboard(event) {
  const directionByKey = {
    ArrowLeft: 'left',
    KeyA: 'left',
    ArrowRight: 'right',
    KeyD: 'right',
    ArrowUp: 'up',
    KeyW: 'up',
    ArrowDown: 'down',
    KeyS: 'down',
  };
  const direction = directionByKey[event.code];

  if (direction) {
    event.preventDefault();
    keyboardDirection = direction;
    game.setDirection(direction);
    ui.setStatus(`Keyboard fallback: ${direction}`);
  }
}

ui.onStart(startGame);
game.addEventListener('score', (event) => ui.setScore(event.detail.score, event.detail.pelletsLeft));
game.addEventListener('win', (event) => ui.showWin(event.detail.score));
window.addEventListener('resize', resizeCanvas);
window.addEventListener('keydown', handleKeyboard);

resizeCanvas();
game.render();
