import React from 'react';

interface Props {
  type?: string;
  placeholder?: string;
  name?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
}

export const BaseInput: React.FC<Props> = ({
  type = 'text',
  placeholder = 'Enter text',
  name = 'input',
  value = '',
  onChange = () => {},
  disabled = false,
  readOnly = false,
  required = false,
  ...props
}: Props) => {
  return (
    <input
      {...props}
      aria-label={name}
      id={name}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      className="px-4 py-2 text-sm font-normal transition-colors duration-200 ease-in-out border rounded-sm border-border-strong placeholder:text font-display focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:cursor-not-allowed disabled:bg-disabled disabled:opacity-50"
    />
  );
};
