import LogoSvg from '@components/atoms/logo-svg';
import { LogoColor } from '@components/atoms/logo-svg/types';

interface Props {
  color?: LogoColor;
}

export const ColumnLogo = ({ color = 'primary' }: Props) => {
  console.log('ColumnLogo', color);

  return (
    <div className="flex flex-col items-center justify-center gap-2 h-20">
      <LogoSvg color={color} size={32} />
      <h1
        className={`text-[20px] leading-[20px] text-${color} uppercase font-display font-extrabold tracking-tight`}
      >
        TalkUp
      </h1>
    </div>
  );
};
