import { cva } from 'class-variance-authority';

export const activityBubbleVariants = cva(
  'absolute rounded-full border-2 border-white',
  {
    variants: {
      size: {
        sm: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5',
        md: 'w-3 h-3 -bottom-0.5 -right-0.5',
        lg: 'w-4 h-4 -bottom-1 -right-1',
      },
      status: {
        online: 'bg-success',
        offline: 'bg-neutral',
        away: 'bg-warning',
        busy: 'bg-error',
      },
    },
    defaultVariants: {
      size: 'md',
      status: 'offline',
    },
  },
);
