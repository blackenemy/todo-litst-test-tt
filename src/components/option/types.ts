export type OptionValue = string | number;

export interface SelectOption<T extends OptionValue = string> {
  value: T;
  label: string;
}

export interface OptionProps<T extends OptionValue = string> {
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}
