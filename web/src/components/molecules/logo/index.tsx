import { LogoColor } from '@/components/atoms/logo-svg/types';

import { ColumnLogo } from './variants/column';
import { LineLogo } from './variants/line';
import { NoTextLogo } from './variants/no-text';

export type LogoVariant = 'line' | 'column' | 'no-text';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  variant?: LogoVariant;
  color?: LogoColor;
}

/**
 * Logo component that renders a specific variant of the logo.
 *
 * @component
 * @param {Object} props - The component props
 * @param {'line' | 'column' | 'no-text'} [props.variant='line'] - The logo layout variant
 * @param {'primary' | 'accent'} [props.color='primary'] - The color scheme for the logo
 *
 * @returns {JSX.Element | null} The logo component or null if variant is unknown
 */
const Logo = ({ variant = 'line', color = 'primary', ...props }: Props) => {
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

export default Logo;
