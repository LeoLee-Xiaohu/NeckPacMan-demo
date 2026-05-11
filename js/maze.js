export const MAZE_SIZE = 21;

export function createEmptyMaze(size = MAZE_SIZE) {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => 0));
}
