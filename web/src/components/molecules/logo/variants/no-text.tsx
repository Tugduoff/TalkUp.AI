import LogoSvg from '@components/atoms/logo-svg';
import { LogoColor } from '@components/atoms/logo-svg/types';

interface Props {
  color?: LogoColor;
}

export const NoTextLogo = ({ color = 'primary' }: Props) => {
  console.log('NoTextLogo', color);

  return (
    <div className="flex items-center justify-center h-10">
      <LogoSvg color={color} size={38} />
    </div>
  );
};
