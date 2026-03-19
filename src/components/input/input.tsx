import type { InputProps } from './types';
import styles from './input.module.css';

function Input({
  label,
  error,
  helperText,
  isRequired = false,
  className,
  disabled,
  ...props
}: InputProps) {
  return (
    <div className={styles.inputWrapper}>
      {label && (
        <label className={styles.label}>
          {label}
          {isRequired && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        className={`${styles.input} ${error ? styles.inputError : ''} ${disabled ? styles.inputDisabled : ''} ${className || ''}`}
        disabled={disabled}
        {...props}
      />
      {error && <p className={styles.errorText}>{error}</p>}
      {helperText && !error && <p className={styles.helperText}>{helperText}</p>}
    </div>
  );
}

export default Input;
