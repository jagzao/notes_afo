import styles from './NoteCardSkeleton.module.css';

export const NoteCardSkeleton = () => {
  return (
    <div className={styles.skeleton}>
      <div className={styles.header}>
        <div className={styles.title} />
        <div className={styles.actions} />
      </div>
      <div className={styles.content}>
        <div className={styles.line} />
        <div className={styles.line} />
        <div className={`${styles.line} ${styles.short}`} />
      </div>
      <div className={styles.footer}>
        <div className={styles.tag} />
        <div className={styles.tag} />
      </div>
    </div>
  );
};

interface NoteGridSkeletonProps {
  count?: number;
}

export const NoteGridSkeleton: React.FC<NoteGridSkeletonProps> = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <NoteCardSkeleton key={index} />
      ))}
    </>
  );
};
