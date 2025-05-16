import { LogoColor } from '@/components/atoms/logo-svg/types';

import { ColumnLogo } from './variants/column';
import { LineLogo } from './variants/line';
import { NoTextLogo } from './variants/no-text';

type LogoVariant = 'line' | 'column' | 'no-text';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  variant?: LogoVariant;
  color?: LogoColor;
}

export const Logo = ({
  variant = 'line',
  color = 'primary',
  ...props
}: Props) => {
  switch (variant) {
    case 'line':
      return <LineLogo {...props} color={color} />;
    case 'column':
      return <ColumnLogo {...props} color={color} />;
    case 'no-text':
      return <NoTextLogo {...props} color={color} />;
    default:
      console.warn(`Unknown logo variant: ${variant}`);
      return null;
  }
};
