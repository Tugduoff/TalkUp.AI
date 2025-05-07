interface Props {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
}

export const BaseInput = ({
  type = 'text',
  placeholder = 'Enter text',
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
      aria-label={placeholder}
      id={placeholder}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      className="px-4 py-2 border border-border-strong placeholder:text rounded-sm font-display font-normal text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors duration-200 ease-in-out disabled:cursor-not-allowed disabled:bg-disabled disabled:opacity-50"
    />
  );
};
