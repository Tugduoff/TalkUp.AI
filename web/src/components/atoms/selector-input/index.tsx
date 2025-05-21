import React from 'react';

interface SelectorOption {
  value: string;
  label: string;
}

interface Props {
  name: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectorOption[];
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
}

export const SelectorInput: React.FC<Props> = ({
  name,
  value = '',
  onChange = () => {},
  options,
  disabled = false,
  readOnly = false,
  required = false,
  ...props
}: Props) => {
  return (
    <select
      {...props}
      aria-label={name}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className="px-4 py-2 text-sm font-normal transition-colors duration-200 ease-in-out border rounded-sm border-border-strong font-display focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:cursor-not-allowed disabled:bg-disabled disabled:opacity-50"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};