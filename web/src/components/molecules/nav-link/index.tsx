import { Button } from '@/components/atoms/button';
import { Icon } from '@/components/atoms/icon';
import { IconName } from '@/components/atoms/icon/icon-map';
import { IconProps } from '@/components/atoms/icon/types';
import { Link } from '@tanstack/react-router';

interface Props {
  to: string;
  label: string;
  icon?: IconName;
  iconProps?: Omit<IconProps, 'icon'>;
}

const NavLink = ({ to, label, icon, iconProps }: Props) => {
  return (
    <Link to={to} className="[&.active]:font-bold w-full">
      <Button
        variant="text"
        color="neutral"
        size="md"
        className="w-full justify-start px-3 py-2"
      >
        {icon && (
          <Icon
            icon={icon}
            size="md"
            color="accent"
            className="mr-3"
            {...iconProps}
          />
        )}
        {label}
      </Button>
    </Link>
  );
};

export default NavLink;
