import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Reminder } from '@keep-plus-plus/types';
import styles from './ReminderPicker.module.css';

interface ReminderPickerProps {
  noteId: string;
  currentReminder?: Reminder | null;
  onSet: (date: Date) => Promise<void>;
  onClear?: () => Promise<void>;
}

interface QuickOption {
  label: string;
  time: string;
  getDate: () => Date;
}

const getQuickOptions = (): QuickOption[] => {
  const now = new Date();

  // Later today (in 3 hours)
  const laterToday = new Date(now);
  laterToday.setHours(now.getHours() + 3, 0, 0, 0);

  // Tomorrow at 9 AM
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);

  // Next week (7 days from now at 9 AM)
  const nextWeek = new Date(now);
  nextWeek.setDate(now.getDate() + 7);
  nextWeek.setHours(9, 0, 0, 0);

  return [
    {
      label: 'Later today',
      time: laterToday.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      getDate: () => laterToday,
    },
    {
      label: 'Tomorrow',
      time: 'Tomorrow at 9:00 AM',
      getDate: () => tomorrow,
    },
    {
      label: 'Next week',
      time: nextWeek.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      getDate: () => nextWeek,
    },
  ];
};

export const ReminderPicker: React.FC<ReminderPickerProps> = ({
  currentReminder,
  onSet,
  onClear,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const quickOptions = getQuickOptions();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowCustom(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
    return undefined;
  }, [isOpen]);

  // Initialize custom date/time with current reminder or default
  useEffect(() => {
    if (showCustom) {
      if (currentReminder) {
        const date = new Date(currentReminder.fireAt);
        setCustomDate(date.toISOString().split('T')[0] as string);
        setCustomTime(date.toTimeString().slice(0, 5));
      } else {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0);
        setCustomDate(tomorrow.toISOString().split('T')[0] as string);
        setCustomTime('09:00');
      }
    }
  }, [showCustom, currentReminder]);

  const handleQuickSet = async (option: QuickOption) => {
    try {
      await onSet(option.getDate());
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to set reminder:', error);
    }
  };

  const handleCustomSet = async () => {
    if (!customDate || !customTime) return;

    try {
      const [year, month, day] = customDate.split('-').map(Number);
      const [hours, minutes] = customTime.split(':').map(Number);

      if (year === undefined || month === undefined || day === undefined || hours === undefined || minutes === undefined) {
        return;
      }

      const date = new Date(year, month - 1, day, hours, minutes, 0, 0);
      await onSet(date);
      setIsOpen(false);
      setShowCustom(false);
    } catch (error) {
      console.error('Failed to set custom reminder:', error);
    }
  };

  const handleClear = async () => {
    if (onClear) {
      try {
        await onClear();
        setIsOpen(false);
      } catch (error) {
        console.error('Failed to clear reminder:', error);
      }
    }
  };

  const isCustomValid = customDate && customTime;

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        className={`${styles.button} ${currentReminder ? styles.active : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        aria-label={currentReminder ? 'Edit reminder' : 'Add reminder'}
        title={currentReminder ? 'Edit reminder' : 'Add reminder'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.dropdown}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {!showCustom ? (
              <>
                <div className={styles.section}>
                  <div className={styles.sectionTitle}>Quick options</div>
                  {quickOptions.map((option) => (
                    <button
                      key={option.label}
                      className={styles.option}
                      onClick={() => handleQuickSet(option)}
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div className={styles.optionContent}>
                        <div className={styles.optionLabel}>{option.label}</div>
                        <div className={styles.optionTime}>{option.time}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className={styles.section}>
                  <button
                    className={styles.option}
                    onClick={() => setShowCustom(true)}
                    type="button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <div className={styles.optionContent}>
                      <div className={styles.optionLabel}>Pick date & time</div>
                    </div>
                  </button>
                </div>

                {currentReminder && onClear && (
                  <div className={styles.section}>
                    <button className={styles.clearButton} onClick={handleClear} type="button">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Clear reminder
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.customPicker}>
                <div className={styles.dateTimeInputs}>
                  <input
                    type="date"
                    className={styles.input}
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <input
                    type="time"
                    className={styles.input}
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                  />
                </div>

                <div className={styles.actions}>
                  <button
                    className={`${styles.actionButton} ${styles.cancelButton}`}
                    onClick={() => setShowCustom(false)}
                    type="button"
                  >
                    Back
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.setButton}`}
                    onClick={handleCustomSet}
                    disabled={!isCustomValid}
                    type="button"
                  >
                    Set reminder
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
