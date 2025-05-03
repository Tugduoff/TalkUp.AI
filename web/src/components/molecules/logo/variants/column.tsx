import LogoSvg from '@components/atoms/logo-svg';
import { LogoColor } from '@components/atoms/logo-svg/types';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  color?: LogoColor;
}

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
