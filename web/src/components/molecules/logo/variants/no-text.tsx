import LogoSvg from '@/components/atoms/logo-svg';
import { LogoColor } from '@/components/atoms/logo-svg/types';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  color?: LogoColor;
}

/**
 * A variant of the logo that only displays the SVG icon without any accompanying text.
 * 
 * @component
 * @param {Object} props - The component props
 * @param {'primary' | 'accent'} [props.color='primary'] - The color of the logo
 * @param {React.HTMLAttributes<HTMLDivElement>} props - HTML div element attributes spread to the container
 * 
 * @returns {JSX.Element} A div container with the logo SVG
 */
export const NoTextLogo = ({ color = 'primary', ...props }: Props) => {
  return (
    <div
      {...props}
      className={`flex items-center justify-center h-10 ${props.className || ''}`}
    >
      <LogoSvg color={color} size={38} />
    </div>
  );
};
