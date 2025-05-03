type LogoVariant = 'line' | 'filled' | 'outline';
type LogoColor = 'primary' | 'secondary' | 'tertiary';

interface Props {
  variant?: LogoVariant;
  color?: LogoColor;
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
