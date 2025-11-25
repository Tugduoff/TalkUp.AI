import { cva } from 'class-variance-authority';

const BubbleVariants = cva('rounded-full flex-shrink-0 h-4 w-4', {
  variants: {
    color: {
      blue: 'bg-accent',
      green: 'bg-success',
      red: 'bg-error',
      yellow: 'bg-warning',
    },
    size: {
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-6',
    },
  },
  defaultVariants: {
    color: 'blue',
    size: 'md',
  },
});

export { BubbleVariants };
