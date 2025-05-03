import { ButtonProps as Props } from '../types';

export const ContainedButton = ({
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
      className={`border border-transparent bg-${color} hover:bg-${color}-hover active:bg-${color}-active ${color === 'white' ? 'text-black' : 'text-white'} py-3 px-5 cursor-pointer ${!disabled || 'opacity-50 !cursor-not-allowed !bg-disabled hover:!bg-disabled active:!bg-disabled !text-black'} ${loading ? 'cursor-wait' : ''} ${props.className || ''}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled || loading}
      aria-label="button"
      aria-disabled={disabled || loading}
    >
      {children}
    </button>
  );
};
