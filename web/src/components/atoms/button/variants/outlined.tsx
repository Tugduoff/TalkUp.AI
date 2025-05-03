import { ButtonProps as Props } from '../types';

export const OutlinedButton = ({
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
      className={`border-${color} hover:border-${color}-hover active:border-${color}-active border hover:bg-${color}-weaker active:bg-${color}-weak text-${color} hover:text-${color}-hover active:text-${color}-active ${color === 'white' || color === 'black' ? '!text-black !border-black' : ''} py-3 px-5 cursor-pointer ${disabled ? 'opacity-50 !cursor-not-allowed !border-disabled !bg-transparent !text-disabled' : ''} ${loading ? 'cursor-wait' : ''} ${props.className || ''}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled || loading}
      aria-label="button"
      aria-disabled={disabled || loading}
    >
      {children}
    </button>
  );
};
