/**
 * TagBadge Component
 * Displays a single tag with optional remove functionality
 */

import type { Tag } from '@keep-plus-plus/types';
import styles from './TagBadge.module.css';

interface TagBadgeProps {
  tag: Tag;
  removable?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
}

export const TagBadge: React.FC<TagBadgeProps> = ({
  tag,
  removable = false,
  onClick,
  onRemove,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <span
      className={`${styles.tag} ${onClick ? styles.tagClickable : ''} ${
        removable ? styles.tagRemovable : ''
      }`}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {tag.name}
      {removable && onRemove && (
        <button
          className={styles.removeButton}
          onClick={handleRemove}
          aria-label={`Remove ${tag.name}`}
          type="button"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </span>
  );
};
