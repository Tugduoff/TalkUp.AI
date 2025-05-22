import { ButtonProps as Props } from '../types';

/**
 * A contained button component with customizable color, disabled and loading states.
 * 
 * @component
 * @param {Object} props - The component props.
 * @param {'primary' | 'accent' | 'black' | 'white' | 'error' | 'warning' | 'neutral' | 'success'} [props.color='primary'] - The color scheme of the button
 * @param {boolean} [props.disabled=false] - Whether the button is disabled.
 * @param {boolean} [props.loading=false] - Whether the button is in a loading state.
 * @param {React.ReactNode} props.children - The content to be rendered inside the button.
 * @param {Function} [props.onClick=() => {}] - The function to call when the button is clicked.
 * @param {Object} props.props - Additional HTML button attributes to be spread to the button element
 * 
 * @returns {JSX.Element} A styled button component with the specified properties.
 */
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
      className={`border border-transparent bg-${color} ${color === 'white' ? 'text-black' : 'text-white'} py-3 px-5 cursor-pointer ${disabled ? 'opacity-50 !cursor-not-allowed !bg-disabled hover:!bg-disabled active:!bg-disabled !text-black' : ''} ${loading ? 'cursor-wait' : `hover:bg-${color}-hover active:bg-${color}-active`} ${props.className || ''}`}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      aria-label="button"
      aria-disabled={disabled || loading}
      aria-busy={loading}
    >
      {children}
    </button>
  );
};
