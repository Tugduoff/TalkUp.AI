import { ButtonProps, ButtonVariant } from './types';
import { ContainedButton } from './variants/contained';
import { OutlinedButton } from './variants/outlined';
import { TextButton } from './variants/text';

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
 * @returns {JSX.Element | null} The button component or null if variant is unknown
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
  switch (variant) {
    case 'contained':
      return (
        <ContainedButton
          {...props}
          color={color}
          disabled={disabled}
          loading={loading}
          onClick={onClick}
        >
          {children}
        </ContainedButton>
      );
    case 'outlined':
      return (
        <OutlinedButton
          {...props}
          color={color}
          disabled={disabled}
          loading={loading}
          onClick={onClick}
        >
          {children}
        </OutlinedButton>
      );
    case 'text':
      return (
        <TextButton
          {...props}
          color={color}
          disabled={disabled}
          loading={loading}
          onClick={onClick}
        >
          {children}
        </TextButton>
      );
    default:
      console.warn(`Unknown button variant: ${variant}`);
      return null;
  }
};
