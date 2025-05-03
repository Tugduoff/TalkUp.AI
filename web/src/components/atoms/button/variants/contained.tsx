import { ButtonProps as Props } from '../types';

export const ContainedButton = ({
  roundiness = 'rounded-sm',
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
      className={`bg-${color} hover:bg-${color}-hover active:bg-${color}-active py-3 px-5 cursor-pointer ${roundiness} ${!disabled || 'opacity-50 !cursor-not-allowed !bg-disabled hover:!bg-disabled active:!bg-disabled'} ${loading ? 'cursor-wait' : ''} ${props.className || ''}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled || loading}
      aria-label="button"
      aria-disabled={disabled || loading}
    >
      {children}
    </button>
  );
};
