export const generateMaze = (size: number): number[][] => {
  const maze: number[][] = Array(size)
    .fill(0)
    .map(() => Array(size).fill(1));

  const stack: [number, number][] = [];
  const start: [number, number] = [1, 1];
  maze[start[1]][start[0]] = 0;
  stack.push(start);

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors = getUnvisitedNeighbors(current[0], current[1], maze);

    if (neighbors.length === 0) {
      stack.pop();
      continue;
    }

    const [nextX, nextY] = neighbors[Math.floor(Math.random() * neighbors.length)];
    maze[nextY][nextX] = 0;
    maze[current[1] + (nextY - current[1]) / 2][
      current[0] + (nextX - current[0]) / 2
    ] = 0;
    stack.push([nextX, nextY]);
  }

  // Ensure start and end are accessible
  maze[1][1] = 0;
  maze[size - 2][size - 2] = 0;

  return maze;
};

const getUnvisitedNeighbors = (
  x: number,
  y: number,
  maze: number[][]
): [number, number][] => {
  const neighbors: [number, number][] = [];
  const size = maze.length;

  [[2, 0], [-2, 0], [0, 2], [0, -2]].forEach(([dx, dy]) => {
    const newX = x + dx;
    const newY = y + dy;
    if (
      newX > 0 &&
      newX < size - 1 &&
      newY > 0 &&
      newY < size - 1 &&
      maze[newY][newX] === 1
    ) {
      neighbors.push([newX, newY]);
    }
  });

  return neighbors;
};