import LogoSvg from '@/components/atoms/logo-svg';
import { LogoColor } from '@/components/atoms/logo-svg/types';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  color?: LogoColor;
}

/**
 * Renders a horizontal (line) version of the TalkUp logo.
 * This component displays the logo SVG alongside the "TalkUp" text.
 *
 * @component
 * @param {Object} props - Component properties
 * @param {'primary' | 'accent'} [props.color='primary'] - The color theme for the logo
 * @param {React.HTMLAttributes<HTMLDivElement>} props.props - All other div properties are passed through
 *
 * @returns {JSX.Element} A horizontal logo component with SVG and text
 */
export const LineLogo = ({ color = 'primary', ...props }: Props) => {
  return (
    <div
      {...props}
      className={`flex items-center justify-center gap-3 h-10 ${props.className || ''}`}
      data-testid="line-logo"
    >
      <LogoSvg color={color} size={38} />
      <h1
        className={`text-[20px] leading-[20px] text-${color} uppercase font-display font-extrabold tracking-tight select-none`}
      >
        TalkUp
      </h1>
    </div>
  );
};
