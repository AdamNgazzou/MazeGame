import React from 'react';

interface GameStatusProps {
  score: number;
  isGameOver: boolean;
  onReset: () => void;
  onStart: () => void;
}

export const GameStatus: React.FC<GameStatusProps> = ({
  score,
  isGameOver,
  onReset,
  onStart,
}) => (
  <div className="absolute top-2 left-2 flex flex-col gap-2">
    <div className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
      Score: {score}
    </div>
    {isGameOver && (
      <button
        onClick={onReset}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
      >
        Try Again
      </button>
    )}
    {!isGameOver && score === 0 && (
      <button
        onClick={onStart}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
      >
        Start Game
      </button>
    )}
  </div>
);