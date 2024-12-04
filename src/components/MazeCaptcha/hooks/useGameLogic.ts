import { useState, useEffect, useCallback } from 'react';
import { generateMaze } from '../utils/mazeGenerator';
import { Position, GameState } from '../types';

const INITIAL_TIME = 30; // seconds
const MAZE_SIZE = 20;

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>({
    maze: generateMaze(MAZE_SIZE),
    playerPos: { x: 1, y: 1 },
    goalPos: { x: MAZE_SIZE - 2, y: MAZE_SIZE - 2 },
    isActive: false,
  });

  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      maze: generateMaze(MAZE_SIZE),
      playerPos: { x: 1, y: 1 },
      isActive: true,
    }));
    setTimeLeft(INITIAL_TIME);
    setIsGameOver(false);
    setScore(0);
  }, []);

  const resetGame = useCallback(() => {
    startGame();
  }, [startGame]);

  const movePlayer = useCallback((direction: string) => {
    if (!gameState.isActive || isGameOver) return;

    setGameState(prev => {
      const newPos: Position = { ...prev.playerPos };

      switch (direction) {
        case 'up':
          newPos.y -= 1;
          break;
        case 'down':
          newPos.y += 1;
          break;
        case 'left':
          newPos.x -= 1;
          break;
        case 'right':
          newPos.x += 1;
          break;
      }

      // Check if move is valid
      if (
        newPos.x < 0 ||
        newPos.x >= MAZE_SIZE ||
        newPos.y < 0 ||
        newPos.y >= MAZE_SIZE ||
        prev.maze[newPos.y][newPos.x] === 1
      ) {
        return prev;
      }

      // Check if reached goal
      if (newPos.x === prev.goalPos.x && newPos.y === prev.goalPos.y) {
        setScore(prev => prev + 1);
        return {
          ...prev,
          maze: generateMaze(MAZE_SIZE),
          playerPos: { x: 1, y: 1 },
        };
      }

      // Dynamically update maze
      const newMaze = [...prev.maze];
      if (Math.random() < 0.1) {
        const rx = Math.floor(Math.random() * MAZE_SIZE);
        const ry = Math.floor(Math.random() * MAZE_SIZE);
        if (rx !== newPos.x || ry !== newPos.y) {
          newMaze[ry][rx] = 0;
        }
      }

      return {
        ...prev,
        playerPos: newPos,
        maze: newMaze,
      };
    });
  }, [gameState.isActive, isGameOver]);

  useEffect(() => {
    if (!gameState.isActive) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          setIsGameOver(true);
          setGameState(prev => ({ ...prev, isActive: false }));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.isActive]);

  return {
    gameState,
    startGame,
    resetGame,
    movePlayer,
    isGameOver,
    timeLeft,
    score,
  };
};