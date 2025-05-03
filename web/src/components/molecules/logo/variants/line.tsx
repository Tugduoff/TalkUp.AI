import LogoSvg from '@components/atoms/logo-svg';
import { LogoColor } from '@components/atoms/logo-svg/types';

interface Props {
  color?: LogoColor;
}

export const LineLogo = ({ color = 'primary' }: Props) => {
  console.log('LineLogo', color);

  return (
    <div className="flex items-center justify-center gap-3 h-10">
      <LogoSvg color={color} size={38} />
      <h1
        className={`text-[20px] leading-[20px] text-${color} uppercase font-display font-extrabold tracking-tight`}
      >
        TalkUp
      </h1>
    </div>
  );
};
