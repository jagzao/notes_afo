/**
 * ColorPicker Component
 * Allows users to select colors for their notes
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { NoteColor } from '@keep-plus-plus/types';
import styles from './ColorPicker.module.css';

interface ColorPickerProps {
  selectedColor: NoteColor;
  onColorChange: (color: NoteColor) => void;
}

const COLORS: Array<{ value: NoteColor; className: string; label: string }> = [
  { value: 'default', className: styles.colorDefault as string, label: 'Default' },
  { value: 'coral', className: styles.colorRed as string, label: 'Coral' },
  { value: 'peach', className: styles.colorOrange as string, label: 'Melocotón' },
  { value: 'sand', className: styles.colorYellow as string, label: 'Arena' },
  { value: 'mint', className: styles.colorGreen as string, label: 'Menta' },
  { value: 'sage', className: styles.colorBlue as string, label: 'Salvia' },
  { value: 'fog', className: styles.colorIndigo as string, label: 'Niebla' },
  { value: 'storm', className: styles.colorPurple as string, label: 'Tormenta' },
  { value: 'dusk', className: styles.colorPink as string, label: 'Crepúsculo' },
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
    return undefined;
  }, [isOpen]);

  const handleColorSelect = (color: NoteColor) => {
    onColorChange(color);
    setIsOpen(false);
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Cambiar color"
        title="Cambiar color"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="13.5" cy="6.5" r=".5" />
          <circle cx="17.5" cy="10.5" r=".5" />
          <circle cx="8.5" cy="7.5" r=".5" />
          <circle cx="6.5" cy="12.5" r=".5" />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.palette}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
          >
            {COLORS.map((color) => (
              <button
                key={color.value}
                className={`${styles.colorOption} ${color.className} ${
                  selectedColor === color.value ? styles.selected : ''
                }`}
                onClick={() => handleColorSelect(color.value)}
                aria-label={color.label}
                title={color.label}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
