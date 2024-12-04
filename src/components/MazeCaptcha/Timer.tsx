import React from 'react';

interface TimerProps {
  timeLeft: number;
}

export const Timer: React.FC<TimerProps> = ({ timeLeft }) => (
  <div className="absolute top-2 right-2 bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
    {timeLeft}s
  </div>
);