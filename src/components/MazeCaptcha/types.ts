export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  maze: number[][];
  playerPos: Position;
  goalPos: Position;
  isActive: boolean;
}