import { MAZE_LAYOUT, MAZE_SIZE, isWall } from './maze.js';

export class Game {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.elapsedTime = 0;
    this.maze = MAZE_LAYOUT;
  }

  update(deltaTime) {
    this.elapsedTime += deltaTime;
  }

  render() {
    const { width, height } = this.canvas;
    const tileSize = width / MAZE_SIZE;
    const pulse = (Math.sin(this.elapsedTime / 220) + 1) / 2;

    this.context.clearRect(0, 0, width, height);
    this.context.fillStyle = '#000000';
    this.context.fillRect(0, 0, width, height);

    this.drawMaze(tileSize);
    this.drawPlayer(width / 2, height / 2, tileSize * (0.42 + pulse * 0.04));
    this.drawStatus();
  }

  drawMaze(tileSize) {
    this.maze.forEach((row, rowIndex) => {
      row.forEach((tile, columnIndex) => {
        const x = columnIndex * tileSize;
        const y = rowIndex * tileSize;

        if (isWall(tile)) {
          this.context.fillStyle = '#1d4ed8';
          this.context.fillRect(x, y, tileSize, tileSize);
          return;
        }

        this.context.fillStyle = '#f8fafc';
        this.context.beginPath();
        this.context.arc(x + tileSize / 2, y + tileSize / 2, tileSize * 0.08, 0, Math.PI * 2);
        this.context.fill();
      });
    });

    this.context.strokeStyle = 'rgba(29, 78, 216, 0.42)';
    this.context.lineWidth = 1;

    for (let index = 0; index <= MAZE_SIZE; index += 1) {
      const position = index * tileSize;

      this.context.beginPath();
      this.context.moveTo(position, 0);
      this.context.lineTo(position, this.canvas.height);
      this.context.stroke();

      this.context.beginPath();
      this.context.moveTo(0, position);
      this.context.lineTo(this.canvas.width, position);
      this.context.stroke();
    }
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
