import { LogoColor } from '@components/atoms/logo-svg/types';

import { LineLogo } from './variants/line';
import { ColumnLogo } from './variants/column';
import { NoTextLogo } from './variants/no-text';

type LogoVariant = 'line' | 'column' | 'no-text';

interface Props {
  variant?: LogoVariant;
  color?: LogoColor;
}

export const Logo = ({ variant = 'line', color = 'primary' }: Props) => {
  console.log('Logo', variant, color);

  switch (variant) {
    case 'line':
      return <LineLogo color={color} />;
    case 'column':
      return <ColumnLogo color={color} />;
    case 'no-text':
      return <NoTextLogo color={color} />;
    default:
      console.warn(`Unknown logo variant: ${variant}`);
      return null;
  }
};
