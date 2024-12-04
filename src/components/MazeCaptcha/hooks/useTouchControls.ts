import { useCallback } from 'react';

export const useTouchControls = (movePlayer: (direction: string) => void) => {
  const touchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const startX = touch.clientX;
      const startY = touch.clientY;

      const handleTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          movePlayer(deltaX > 0 ? 'right' : 'left');
        } else {
          movePlayer(deltaY > 0 ? 'down' : 'up');
        }
      };

      const handleTouchEnd = () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };

      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    },
    [movePlayer]
  );

  return {
    onTouchStart: touchStart,
  };
};