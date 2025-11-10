import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

const navItems = [
  { path: '/', label: 'Notes', icon: '📝' },
  { path: '/archive', label: 'Archive', icon: '📦' },
  { path: '/trash', label: 'Trash', icon: '🗑️' },
];

export const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            end
          >
            <span className={styles.icon} aria-hidden="true">
              {item.icon}
            </span>
            <span className={styles.label}>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
