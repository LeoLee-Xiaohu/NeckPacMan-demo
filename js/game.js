import { MAZE_SIZE, drawMaze } from './maze.js';

export class Game {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.elapsedTime = 0;
  }

  update(deltaTime) {
    this.elapsedTime += deltaTime;
  }

  render() {
    const { width, height } = this.canvas;
    const tileSize = width / MAZE_SIZE;
    const pulse = (Math.sin(this.elapsedTime / 220) + 1) / 2;

    this.context.clearRect(0, 0, width, height);

    drawMaze(this.context, this.canvas);
    this.drawPlayer(width / 2, height / 2, tileSize * (0.42 + pulse * 0.04));
    this.drawStatus();
  }

  drawPlayer(x, y, radius) {
    this.context.fillStyle = '#facc15';
    this.context.beginPath();
    this.context.moveTo(x, y);
    this.context.arc(x, y, radius, 0.22 * Math.PI, 1.78 * Math.PI);
    this.context.closePath();
    this.context.fill();
  }

  drawStatus() {
    this.context.fillStyle = '#f8fafc';
    this.context.font = '20px ui-sans-serif, system-ui, sans-serif';
    this.context.fillText('Score: 0', 24, 36);
    this.context.fillStyle = '#94a3b8';
    this.context.font = '14px ui-sans-serif, system-ui, sans-serif';
    this.context.fillText('Canvas ready', 24, 60);
  }
}
