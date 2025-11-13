import { useEffect, useRef, useState } from 'react';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number;
  resistance?: number;
  disabled?: boolean;
}

export const usePullToRefresh = ({
  onRefresh,
  threshold = 80,
  resistance = 2.5,
  disabled = false,
}: UsePullToRefreshOptions) => {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const currentY = useRef(0);

  useEffect(() => {
    if (disabled) return;

    let isTouching = false;

    const handleTouchStart = (e: TouchEvent) => {
      // Only start if at top of page
      if (window.scrollY === 0 && e.touches[0]) {
        startY.current = e.touches[0].clientY;
        isTouching = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouching || isRefreshing || !e.touches[0]) return;

      currentY.current = e.touches[0].clientY;
      const delta = currentY.current - startY.current;

      if (delta > 0) {
        // Apply resistance
        const distance = delta / resistance;
        setPullDistance(distance);
        setIsPulling(distance > threshold);

        // Prevent scrolling when pulling down
        if (distance > 10) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = async () => {
      if (!isTouching) return;

      isTouching = false;

      if (pullDistance > threshold && !isRefreshing) {
        setIsRefreshing(true);
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
          setPullDistance(0);
          setIsPulling(false);
        }
      } else {
        setPullDistance(0);
        setIsPulling(false);
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [disabled, isRefreshing, onRefresh, pullDistance, resistance, threshold]);

  return {
    isPulling,
    isRefreshing,
    pullDistance,
  };
};
