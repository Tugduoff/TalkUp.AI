import { ButtonProps, Variant } from './types';
import { ContainedButton } from './variants/contained';

interface Props extends ButtonProps {
  variant?: Variant;
}

export const Button = ({
  variant = 'contained',
  roundiness = 'rounded-sm',
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
          roundiness={roundiness}
          disabled={disabled}
          loading={loading}
          onClick={onClick}
        >
          {children}
        </ContainedButton>
      );
    // case 'outlined':
    //   return (
    //     <OutlinedButton
    //       color={color}
    //       roundiness={roundiness}
    //       disabled={disabled}
    //       loading={loading}
    //       onClick={onClick}
    //       {...props}
    //     >
    //       {children}
    //     </OutlinedButton>
    //   )
    // case 'text':
    //   return (
    //     <TextButton
    //       color={color}
    //       roundiness={roundiness}
    //       disabled={disabled}
    //       loading={loading}
    //       onClick={onClick}
    //       {...props}
    //     >
    //       {children}
    //     </TextButton>
    //   )
    default:
      console.warn(`Unknown button variant: ${variant}`);
      return null;
  }
};
