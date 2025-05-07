<<<<<<< HEAD
import React from 'react';

interface Props {
  placeholder?: string;
  name?: string;
=======
interface Props {
  placeholder?: string;
>>>>>>> 844dcd4... feat: add textarea atom component
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  resize?: boolean;
  rows?: number;
  cols?: number;
}

<<<<<<< HEAD
export const TextArea: React.FC<Props> = ({
  placeholder = 'Enter text',
  name = 'textarea',
=======
export const TextArea = ({
  placeholder = 'Enter text',
>>>>>>> 844dcd4... feat: add textarea atom component
  value = '',
  onChange = () => {},
  disabled = false,
  readOnly = false,
  required = false,
  resize = false,
  rows = 4,
  cols = 50,
  ...props
}: Props) => {
  return (
    <textarea
      {...props}
      aria-label={name}
      id={name}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      rows={rows}
      cols={cols}
      className={`${!resize ? 'resize-none' : 'resize'} disabled:resize-none px-4 py-2 border border-border-strong placeholder:text rounded-sm font-display font-normal text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors duration-200 ease-in-out disabled:cursor-not-allowed disabled:bg-disabled disabled:opacity-50`}
    />
  );
};
