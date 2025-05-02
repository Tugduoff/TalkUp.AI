import { Logo as LogoTypes } from '@types/components/atoms/logo';

interface Props {
  variant?: LogoTypes.Variant;
  color?: LogoTypes.Color;
}

export const Logo = ({
  variant = 'line',
  color = 'primary',
}: Props) => {
  console.log('Logo', variant, color);

  return (
    <p>To come ...</p>
  );
};
