import type { OptionProps, OptionValue } from './types';
import styles from './option.module.css';

function Option<T extends OptionValue = string>({
  options,
  value,
  onChange,
  label,
  disabled,
  className,
}: OptionProps<T>) {
  return (
    <div className={`${styles.wrapper}${className ? ` ${className}` : ''}`}>
      {label && <label className={styles.label}>{label}</label>}
      <select
        className={styles.select}
        value={value as string | number}
        onChange={(e) => onChange(e.target.value as T)}
        disabled={disabled}
      >
        {options.map((opt) => (
          <option key={String(opt.value)} value={opt.value as string | number}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Option;
