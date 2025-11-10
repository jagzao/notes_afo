import { useTheme } from '@keep-plus-plus/ui';
import { Button } from '@keep-plus-plus/ui';
import styles from './Header.module.css';

export const Header = () => {
  const { mode, toggleMode } = useTheme();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles.logo}>Keep++</h1>
      </div>

      <div className={styles.center}>
        <input
          type="search"
          placeholder="Search notes..."
          className={styles.search}
          aria-label="Search notes"
        />
      </div>

      <div className={styles.right}>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMode}
          aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
        >
          {mode === 'light' ? '🌙' : '☀️'}
        </Button>

        <Button variant="ghost" size="sm" aria-label="User menu">
          <span className={styles.avatar}>👤</span>
        </Button>
      </div>
    </header>
  );
};
