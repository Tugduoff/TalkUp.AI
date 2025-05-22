import LogoSvg from '@/components/atoms/logo-svg';
import { LogoColor } from '@/components/atoms/logo-svg/types';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  color?: LogoColor;
}

/**
 * A logo component that displays the TalkUp logo in a column layout.
 * Consists of a LogoSvg component above the "TalkUp" text.
 *
 * @component
 * @param {Object} props - The component props
 * @param {'primary' | 'accent'} [props.color='primary'] - The color theme for the logo (applies to both SVG and text)
 * @param {string} [props.className] - Additional CSS classes to apply to the container
 *
 * @returns {JSX.Element} A column-oriented logo with SVG icon and text
 */
export const ColumnLogo = ({ color = 'primary', ...props }: Props) => {
  return (
    <div
      {...props}
      className={`flex flex-col items-center justify-center gap-2 h-20 ${props.className || ''}`}
    >
      <LogoSvg color={color} size={32} />
      <h1
        className={`text-[20px] leading-[20px] text-${color} uppercase font-display font-extrabold tracking-tight select-none`}
      >
        TalkUp
      </h1>
    </div>
  );
};
