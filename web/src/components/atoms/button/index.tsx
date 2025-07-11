import { ButtonProps, ButtonVariant } from './types';
import { buttonVariants } from './variants';
import { twMerge } from 'tailwind-merge';

interface Props extends ButtonProps {
  variant?: ButtonVariant;
}

/**
 * A customizable button component that supports different variants and states.
 *
 * @component
 * @param {Object} props - The component props
 * @param {'contained' | 'outlined' | 'text'} [props.variant='contained'] - The visual style variant of the button
 * @param {'primary' | 'accent' | 'black' | 'white' | 'error' | 'warning' | 'neutral' | 'success'} [props.color='primary'] - The color scheme of the button
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {boolean} [props.loading=false] - Whether to show a loading indicator
 * @param {React.ReactNode} props.children - The content to be displayed inside the button
 * @param {Function} [props.onClick=() => {}] - Callback fired when the button is clicked
 * @param {Object} props.props - Additional HTML button attributes to be spread to the button element
 *
 * @returns {JSX.Element} The button component
 */
export const Button = ({
  variant = 'contained',
  color = 'primary',
  disabled = false,
  loading = false,
  children,
  onClick = () => {},
  ...props
}: Props) => {
  const styles = twMerge(
    buttonVariants({
      variant,
      color,
      disabled,
      loading
    }),
    props.className
  );

  return (
    <button
      {...props}
      className={styles}
      disabled={disabled || loading}
      onClick={disabled || loading ? undefined : onClick}
      role="button"
      aria-disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading && !disabled && <span className="loader" />}
      {children}
    </button>
  );
};
