import { ButtonProps, Variant } from './types';
import { ContainedButton } from './variants/contained';
import { OutlinedButton } from './variants/outlined';
import { TextButton } from './variants/text';

interface Props extends ButtonProps {
  variant?: Variant;
}

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
