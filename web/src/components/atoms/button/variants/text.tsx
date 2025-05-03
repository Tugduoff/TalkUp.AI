import { ButtonProps as Props } from '../types';

export const TextButton = ({
  color = 'primary',
  disabled = false,
  loading = false,
  children,
  onClick = () => {},
  ...props
}: Props) => {
  return (
    <button
      {...props}
      className={`border border-transparent hover:bg-${color}-weaker active:bg-${color}-weak text-${color} hover:text-${color}-hover active:text-${color}-active ${color === 'white' || color === 'black' ? '!text-black' : ''} py-3 px-5 cursor-pointer ${disabled ? 'opacity-50 !cursor-not-allowed !bg-transparent !text-disabled' : ''} ${loading ? 'cursor-wait' : ''} ${props.className || ''}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled || loading}
      aria-label="button"
      aria-disabled={disabled || loading}
    >
      {children}
    </button>
  );
};
