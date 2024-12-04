import React, { useEffect, useRef } from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import { Timer } from './Timer';
import { GameStatus } from './GameStatus';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { useTouchControls } from './hooks/useTouchControls';

export const MazeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    gameState,
    startGame,
    resetGame,
    movePlayer,
    isGameOver,
    timeLeft,
    score,
  } = useGameLogic();

  useKeyboardControls(movePlayer);
  const touchControls = useTouchControls(movePlayer);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the blocks near the goal
    const clearBlocksNearGoal = () => {
      const goalX = gameState.goalPos.x;
      const goalY = gameState.goalPos.y;

      // Set blocks around the goal to be walkable (clear them)
      const surroundingCoords = [
        { x: goalX - 1, y: goalY }, // Left of the goal
        { x: goalX, y: goalY - 1 }, // Above the goal

      ];

      surroundingCoords.forEach(({ x, y }) => {
        // Ensure coordinates are within bounds
        if (x >= 0 && y >= 0 && x < gameState.maze[0].length && y < gameState.maze.length) {
          gameState.maze[y][x] = 0; // Mark these blocks as walkable (0)
        }
      });
    };

    clearBlocksNearGoal();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw maze
      gameState.maze.forEach((row, y) => {
        row.forEach((cell, x) => {
          ctx.fillStyle = cell === 1 ? '#334155' : '#f1f5f9';
          ctx.fillRect(x * 20, y * 20, 20, 20);
        });
      });

      // Draw player
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(
        gameState.playerPos.x * 20 + 10,
        gameState.playerPos.y * 20 + 10,
        8,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Draw goal
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(
        gameState.goalPos.x * 20,
        gameState.goalPos.y * 20,
        20,
        20
      );

      requestAnimationFrame(render);
    };

    render();
  }, [gameState]);

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8">
      <h2 className="text-2xl font-bold text-gray-800">Maze CAPTCHA</h2>
      
      <div className="relative bg-white rounded-lg shadow-xl p-6">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="border-2 border-gray-200 rounded-lg"
          {...touchControls}
        />
        
        <Timer timeLeft={timeLeft} />
        <GameStatus
          score={score}
          isGameOver={isGameOver}
          onReset={resetGame}
          onStart={startGame}
        />
      </div>

      <div className="text-sm text-gray-600 max-w-md text-center">
        <p>Use arrow keys or swipe to navigate through the maze.</p>
        <p>Reach the green goal before time runs out!</p>
      </div>
    </div>
  );
};