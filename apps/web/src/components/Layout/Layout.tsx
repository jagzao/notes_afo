import { Outlet } from 'react-router-dom';
import { Header } from '../Header';
import { Sidebar } from '../Sidebar';
import { useReminderNotifications } from '../../hooks/useReminderNotifications';
import styles from './Layout.module.css';

export const Layout = () => {
  // Enable reminder notifications
  useReminderNotifications();

  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.container}>
        <Sidebar />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
