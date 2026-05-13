import { Game } from './game.js';
import { Tracker } from './tracker.js';

const canvas = document.querySelector('#gameCanvas');
const context = canvas.getContext('2d');
const game = new Game(canvas, context);
const tracker = new Tracker({
  video: document.querySelector('#cameraVideo'),
  canvas: document.querySelector('#meshCanvas'),
  statusElement: document.querySelector('#trackingStatus'),
  landmarkCountElement: document.querySelector('#landmarkCount'),
  cameraSizeElement: document.querySelector('#cameraSize'),
});

const targetFrameTime = 1000 / 60;
let previousTime = 0;
let accumulatedTime = 0;

function gameLoop(currentTime) {
  const deltaTime = currentTime - previousTime;
  previousTime = currentTime;
  accumulatedTime += deltaTime;

  while (accumulatedTime >= targetFrameTime) {
    game.update(targetFrameTime);
    accumulatedTime -= targetFrameTime;
  }

  game.render();
  requestAnimationFrame(gameLoop);
}

tracker.start().catch((error) => {
  console.error('Unable to initialize face tracking', error);
  document.querySelector('#trackingStatus').textContent = error.message;
});

game.render();
requestAnimationFrame(gameLoop);
