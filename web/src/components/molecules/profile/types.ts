import { ActivityStatus } from '@/components/atoms/activity-bubble/types';
import { AvatarSize } from '@/components/atoms/avatar/types';

export interface ProfileProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  src?: string;
  alt?: string;
  fallback?: string;
  activityStatus?: ActivityStatus;
  avatarSize?: AvatarSize;
  showActivity?: boolean;
  showName?: boolean;
  className?: string;
}
