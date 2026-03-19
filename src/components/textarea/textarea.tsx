import * as React from 'react';
import type { TextareaProps } from './types';
import styles from './textarea.module.css';

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  isRequired = false,
  className,
  disabled,
  ...props
}) => {
  return (
    <div className={styles.textareaWrapper}>
      {label && (
        <label className={styles.label}>
          {label}
          {isRequired && <span className={styles.required}>*</span>}
        </label>
      )}
      <textarea
        className={`${styles.textarea} ${error ? styles.textareaError : ''} ${disabled ? styles.textareaDisabled : ''} ${className || ''}`}
        disabled={disabled}
        {...props}
      />
      {error && <p className={styles.errorText}>{error}</p>}
      {helperText && !error && <p className={styles.helperText}>{helperText}</p>}
    </div>
  );
};
