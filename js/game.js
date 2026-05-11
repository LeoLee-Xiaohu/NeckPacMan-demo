import { Player } from './player.js';
import { DIRECTIONS, MAZE_LAYOUT, MAZE_SIZE, cellKey, cloneMaze, createPellets, isWallCell } from './maze.js';

const PLAYER_START = { x: 10, y: 10 };
const SCORE_PER_PELLET = 10;

export class Game extends EventTarget {
  constructor(canvas, context) {
    super();
    this.canvas = canvas;
    this.context = context;
    this.maze = cloneMaze();
    this.tileSize = this.canvas.width / MAZE_SIZE;
    this.player = new Player({ cell: PLAYER_START, tileSize: this.tileSize });
    this.pellets = createPellets(PLAYER_START);
    this.score = 0;
    this.running = false;
    this.won = false;
  }

  reset() {
    this.maze = cloneMaze();
    this.tileSize = this.canvas.width / MAZE_SIZE;
    this.player = new Player({ cell: PLAYER_START, tileSize: this.tileSize });
    this.pellets = createPellets(PLAYER_START);
    this.score = 0;
    this.running = true;
    this.won = false;
    this.dispatchScore();
  }

  setDirection(direction) {
    this.player.queueDirection(direction);
  }

  resize(pixelSize) {
    this.canvas.width = pixelSize;
    this.canvas.height = pixelSize;
    this.tileSize = pixelSize / MAZE_SIZE;
    this.player.setTileSize(this.tileSize);
  }

  update(deltaTime) {
    if (!this.running || this.won) {
      return;
    }

    this.player.update(deltaTime, (direction) => this.canPlayerMove(direction));
    this.collectPellet();
  }

  canPlayerMove(direction) {
    const vector = DIRECTIONS[direction];

    if (!vector) {
      return false;
    }

    const cell = this.player.getCell();
    return !isWallCell(cell.x + vector.x, cell.y + vector.y, this.maze);
  }

  collectPellet() {
    const cell = this.player.getCell();
    const key = cellKey(cell.x, cell.y);

    if (!this.pellets.has(key)) {
      return;
    }

    this.pellets.delete(key);
    this.score += SCORE_PER_PELLET;
    this.dispatchScore();

    if (this.pellets.size === 0) {
      this.won = true;
      this.running = false;
      this.dispatchEvent(new CustomEvent('win', { detail: { score: this.score } }));
    }
  }

  render() {
    const { width, height } = this.canvas;

    this.context.clearRect(0, 0, width, height);
    this.context.fillStyle = '#000000';
    this.context.fillRect(0, 0, width, height);

    this.drawMaze();
    this.drawPellets();
    this.player.render(this.context);
    this.drawScore();
  }

  drawMaze() {
    this.maze.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 1) {
          const inset = this.tileSize * 0.05;
          this.context.fillStyle = '#1d4ed8';
          this.context.fillRect(
            x * this.tileSize + inset,
            y * this.tileSize + inset,
            this.tileSize - inset * 2,
            this.tileSize - inset * 2,
          );
        }
      });
    });
  }

  drawPellets() {
    this.context.fillStyle = '#f8fafc';

    this.pellets.forEach((key) => {
      const [x, y] = key.split(',').map(Number);
      this.context.beginPath();
      this.context.arc((x + 0.5) * this.tileSize, (y + 0.5) * this.tileSize, this.tileSize * 0.11, 0, Math.PI * 2);
      this.context.fill();
    });
  }

  drawScore() {
    this.context.fillStyle = '#f8fafc';
    this.context.font = `${Math.max(16, this.tileSize * 0.58)}px ui-sans-serif, system-ui, sans-serif`;
    this.context.fillText(`Score: ${this.score}`, this.tileSize * 0.75, this.tileSize * 1.05);
  }

  dispatchScore() {
    this.dispatchEvent(new CustomEvent('score', { detail: { score: this.score, pelletsLeft: this.pellets.size } }));
  }
}
