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
      className={`border border-transparent text-${color} ${color === 'white' || color === 'black' ? '!text-black' : ''} py-3 px-5 cursor-pointer ${disabled ? 'opacity-50 !cursor-not-allowed !bg-transparent !text-disabled' : ''} ${loading ? 'cursor-wait' : `hover:text-${color}-hover active:text-${color}-active hover:bg-${color}-weaker active:bg-${color}-weak`} ${props.className || ''}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled || loading}
      aria-label="button"
      aria-disabled={disabled || loading}
    >
      {children}
    </button>
  );
};
