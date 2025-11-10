import { Button } from '@keep-plus-plus/ui';
import styles from './HomePage.module.css';

export const HomePage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Notes</h2>
        <Button variant="primary" size="md">
          + New Note
        </Button>
      </div>

      <div className={styles.grid}>
        {/* Placeholder cards */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={styles.card}>
            <h3 className={styles.cardTitle}>Note {i}</h3>
            <p className={styles.cardDescription}>
              This is a placeholder note. Click to edit or create a new note to get started!
            </p>
            <div className={styles.cardFooter}>
              <span className={styles.cardDate}>Today</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.empty}>
        <div className={styles.emptyIcon}>📝</div>
        <h3 className={styles.emptyTitle}>No notes yet</h3>
        <p className={styles.emptyDescription}>Click "New Note" to create your first note</p>
      </div>
    </div>
  );
};
