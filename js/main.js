import { Game } from './game.js';
import { Tracker } from './tracker.js';
import { CalibrationOverlay } from './ui.js';

const canvas = document.querySelector('#gameCanvas');
const context = canvas.getContext('2d');
const game = new Game(canvas, context);
const tracker = new Tracker();
const calibrationOverlay = new CalibrationOverlay();

const calibrationDuration = 3000;

const targetFrameTime = 1000 / 60;
let previousTime = 0;
let accumulatedTime = 0;

function calculateMeanPose(samples) {
  const totals = samples.reduce(
    (accumulator, sample) => ({
      yaw: accumulator.yaw + sample.yaw,
      pitch: accumulator.pitch + sample.pitch,
    }),
    { yaw: 0, pitch: 0 },
  );

  return {
    yaw: totals.yaw / samples.length,
    pitch: totals.pitch / samples.length,
  };
}

function runCalibration() {
  return new Promise((resolve) => {
    const samples = [];
    const startTime = performance.now();

    calibrationOverlay.show();

    function collectSample(currentTime) {
      const elapsedTime = currentTime - startTime;
      const remainingTime = Math.max(0, calibrationDuration - elapsedTime);
      const secondsRemaining = Math.max(1, Math.ceil(remainingTime / 1000));

      samples.push(tracker.getPose());
      calibrationOverlay.update(secondsRemaining);

      if (elapsedTime < calibrationDuration) {
        requestAnimationFrame(collectSample);
        return;
      }

      const neutralBaseline = calculateMeanPose(samples);
      tracker.setNeutralBaseline(neutralBaseline);
      calibrationOverlay.hide();
      resolve(neutralBaseline);
    }

    requestAnimationFrame(collectSample);
  });
}

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

async function start() {
  await tracker.start();
  await runCalibration();
  game.render();
  requestAnimationFrame(gameLoop);
}

start();
