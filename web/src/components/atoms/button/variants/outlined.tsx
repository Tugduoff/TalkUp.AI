import { ButtonProps as Props } from '../types';

/**
 * OutlinedButton component provides a styled button with an outline appearance.
 *
 * @component
 * @param {Object} props - The component props
 * @param {'primary' | 'accent' | 'black' | 'white' | 'error' | 'warning' | 'neutral' | 'success'} [props.color='primary'] - The color scheme of the button
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {boolean} [props.loading=false] - Whether the button is in a loading state
 * @param {React.ReactNode} props.children - The content to be displayed inside the button
 * @param {Function} [props.onClick=() => {}] - Function to be called when the button is clicked
 * @param {Object} props.props - Additional HTML button attributes to be spread to the button element
 *
 * @returns {JSX.Element} A styled button component with outline appearance
 */
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
      className={`border-${color} border text-${color} ${color === 'white' || color === 'black' ? '!text-black !border-black' : ''} py-3 px-5 cursor-pointer ${disabled ? 'opacity-50 !cursor-not-allowed !border-disabled !bg-transparent !text-disabled' : ''} ${loading ? 'cursor-wait' : `hover:border-${color}-hover active:border-${color}-active hover:text-${color}-hover active:text-${color}-active hover:bg-${color}-weaker active:bg-${color}-weak`} ${props.className || ''}`}
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
