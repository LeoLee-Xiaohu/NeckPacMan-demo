import { Game } from './game.js';

const canvas = document.querySelector('#gameCanvas');
const context = canvas.getContext('2d');
const game = new Game(canvas, context);

const targetFrameTime = 1000 / 60;
let previousTime = 0;
let accumulatedTime = 0;

function gameLoop(currentTime) {
  const deltaTime = currentTime - previousTime;
  previousTime = currentTime;
  accumulatedTime += deltaTime;

  while (accumulatedTime >= targetFrameTime) {
    console.log('loop running');
    game.update(targetFrameTime);
    accumulatedTime -= targetFrameTime;
  }

  game.render();
  requestAnimationFrame(gameLoop);
}

game.render();
requestAnimationFrame(gameLoop);
