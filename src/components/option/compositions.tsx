import Option from "./option";
import type { SelectOption } from "./types";

export type StatusFilterValue = "all" | "completed" | "pending";

export const STATUS_OPTIONS: SelectOption<StatusFilterValue>[] = [
  { value: "all", label: "All" },
  { value: "completed", label: "Completed" },
  { value: "pending", label: "Pending" },
];

export function StatusOption({
  value,
  onChange,
}: {
  value: StatusFilterValue;
  onChange: (value: StatusFilterValue) => void;
}) {
  return (
    <Option
      options={STATUS_OPTIONS}
      value={value}
      onChange={onChange}
      label="Status"
    />
  );
}
