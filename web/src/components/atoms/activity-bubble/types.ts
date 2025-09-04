export type ActivityStatus = 'online' | 'offline' | 'away' | 'busy';
export type ActivitySize = 'sm' | 'md' | 'lg';

export interface ActivityBubbleProps
  extends React.HTMLAttributes<HTMLDivElement> {
  status: ActivityStatus;
  size?: ActivitySize;
  className?: string;
}
