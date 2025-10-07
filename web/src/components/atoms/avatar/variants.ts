import { cva } from 'class-variance-authority';

export const avatarVariants = cva(
  'relative flex items-center justify-center rounded-full bg-accent-weaker text-neutral font-medium overflow-hidden',
  {
    variants: {
      size: {
        xs: 'w-6 h-6 text-xs',
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-base',
        lg: 'w-12 h-12 text-lg',
        xl: 'w-16 h-16 text-xl',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);
