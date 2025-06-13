import { ButtonProps as Props } from '../types';

/**
 * A button component with text styling.
 *
 * @component
 * @param {Object} props - The properties for the TextButton component
 * @param {'primary' | 'accent' | 'black' | 'white' | 'error' | 'warning' | 'neutral' | 'success'} [props.color='primary'] - The color scheme of the button
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {boolean} [props.loading=false] - Whether the button is in a loading state
 * @param {React.ReactNode} props.children - The content to display inside the button
 * @param {Function} [props.onClick=() => {}] - The function to call when the button is clicked
 * @param {Object} props.props - Additional HTML button attributes to be spread to the button element
 *
 * @returns {JSX.Element} A styled button component
 */
export const TextButton = ({
  color = 'primary',
  disabled = false,
  loading = false,
  children,
  onClick,
  ...props
}: Props) => {
  return (
    <button
      {...props}
      role="button"
      className={`border border-transparent text-${color} ${color === 'white' || color === 'black' ? '!text-black' : ''} py-3 px-5 cursor-pointer ${disabled ? 'opacity-50 !cursor-not-allowed !bg-transparent !text-disabled' : ''} ${loading ? 'cursor-wait' : `hover:text-${color}-hover active:text-${color}-active hover:bg-${color}-weaker active:bg-${color}-weak`} ${props.className || ''}`}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      onClick={disabled || loading ? undefined : onClick}
    >
      {children}
    </button>
  );
};
