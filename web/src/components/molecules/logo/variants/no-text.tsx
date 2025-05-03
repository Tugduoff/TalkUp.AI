import LogoSvg from '@components/atoms/logo-svg';
import { LogoColor } from '@components/atoms/logo-svg/types';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  color?: LogoColor;
}

export const NoTextLogo = ({ color = 'primary', ...props }: Props) => {
  return (
    <div {...props} className={`flex items-center justify-center h-10 ${props.className || ''}`}>
      <LogoSvg color={color} size={38} />
    </div>
  );
};
