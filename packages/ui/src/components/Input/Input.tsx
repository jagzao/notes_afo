/**
 * Input component
 */

import React from 'react';
import { cn } from '../../utils/cn';
import styles from './Input.module.css';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  inputSize?: InputSize;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      inputSize = 'md',
      fullWidth = false,
      leftIcon,
      rightIcon,
      className,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(error);

    return (
      <div className={cn(styles.container, { [styles.fullWidth]: fullWidth })}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}

        <div className={styles.inputWrapper}>
          {leftIcon && <div className={styles.leftIcon}>{leftIcon}</div>}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              styles.input,
              styles[inputSize],
              {
                [styles.error]: hasError,
                [styles.withLeftIcon]: leftIcon,
                [styles.withRightIcon]: rightIcon,
              },
              className
            )}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />

          {rightIcon && <div className={styles.rightIcon}>{rightIcon}</div>}
        </div>

        {error && (
          <p id={`${inputId}-error`} className={styles.errorText} role="alert">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${inputId}-helper`} className={styles.helperText}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
