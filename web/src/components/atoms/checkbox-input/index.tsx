import React from 'react';

interface Props {
  name: string;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
}

export const CheckboxInput: React.FC<Props> = ({
  name,
  checked = false,
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
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      className="w-4 h-4 text-accent border-border-strong rounded focus:ring-accent focus:ring-2 disabled:cursor-not-allowed disabled:bg-disabled disabled:opacity-50"
    />
  );
};