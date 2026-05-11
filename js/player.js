import { DIRECTIONS } from './maze.js';

export class Player {
  constructor({ cell, tileSize, speedCellsPerSecond = 4 }) {
    this.tileSize = tileSize;
    this.speedCellsPerSecond = speedCellsPerSecond;
    this.radius = tileSize * 0.38;
    this.direction = 'right';
    this.nextDirection = 'right';
    this.x = (cell.x + 0.5) * tileSize;
    this.y = (cell.y + 0.5) * tileSize;
    this.mouthTime = 0;
  }

  setTileSize(tileSize) {
    const currentCell = this.getCell();
    this.tileSize = tileSize;
    this.radius = tileSize * 0.38;
    this.x = (currentCell.x + 0.5) * tileSize;
    this.y = (currentCell.y + 0.5) * tileSize;
  }

  queueDirection(direction) {
    if (DIRECTIONS[direction]) {
      this.nextDirection = direction;
    }
  }

  getCell() {
    return {
      x: Math.floor(this.x / this.tileSize),
      y: Math.floor(this.y / this.tileSize),
    };
  }

  isCentered() {
    const cell = this.getCell();
    const centerX = (cell.x + 0.5) * this.tileSize;
    const centerY = (cell.y + 0.5) * this.tileSize;

    return Math.abs(this.x - centerX) < 1.5 && Math.abs(this.y - centerY) < 1.5;
  }

  snapToCellCenter() {
    const cell = this.getCell();
    this.x = (cell.x + 0.5) * this.tileSize;
    this.y = (cell.y + 0.5) * this.tileSize;
  }

  update(deltaTime, canMove) {
    this.mouthTime += deltaTime;

    if (this.isCentered()) {
      this.snapToCellCenter();

      if (canMove(this.nextDirection)) {
        this.direction = this.nextDirection;
      }

      if (!canMove(this.direction)) {
        return;
      }
    }

    const vector = DIRECTIONS[this.direction];
    const distance = this.speedCellsPerSecond * this.tileSize * (deltaTime / 1000);
    this.x += vector.x * distance;
    this.y += vector.y * distance;
  }

  render(context) {
    const vector = DIRECTIONS[this.direction];
    const mouthOpen = 0.16 + ((Math.sin(this.mouthTime / 80) + 1) / 2) * 0.12;
    const startAngle = vector.angle + mouthOpen * Math.PI;
    const endAngle = vector.angle + (2 - mouthOpen) * Math.PI;

    context.fillStyle = '#facc15';
    context.beginPath();
    context.moveTo(this.x, this.y);
    context.arc(this.x, this.y, this.radius, startAngle, endAngle);
    context.closePath();
    context.fill();
  }
}
