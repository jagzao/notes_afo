import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
import styles from './PullToRefresh.module.css';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  disabled?: boolean;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  disabled = false,
}) => {
  const { isPulling, isRefreshing, pullDistance } = usePullToRefresh({
    onRefresh,
    disabled,
  });

  const showIndicator = (isPulling || isRefreshing) && pullDistance > 0;
  const indicatorOpacity = Math.min(pullDistance / 80, 1);
  const indicatorScale = Math.min(pullDistance / 80, 1);

  return (
    <div className={styles.container}>
      <AnimatePresence>
        {showIndicator && (
          <motion.div
            className={styles.indicator}
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: indicatorOpacity,
              y: Math.min(pullDistance, 60),
              scale: indicatorScale,
            }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className={styles.spinner}
              animate={{ rotate: isRefreshing ? 360 : 0 }}
              transition={{
                duration: 1,
                repeat: isRefreshing ? Infinity : 0,
                ease: 'linear',
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
            </motion.div>
            <span className={styles.text}>
              {isRefreshing ? 'Refreshing...' : isPulling ? 'Release to refresh' : 'Pull to refresh'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={styles.content}
        style={{
          transform: showIndicator ? `translateY(${Math.min(pullDistance, 60)}px)` : undefined,
          transition: isRefreshing ? 'none' : 'transform 0.2s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
};
