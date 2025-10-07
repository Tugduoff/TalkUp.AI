import { cva } from 'class-variance-authority';

export const iconVariants = cva('', {
  variants: {
    size: {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-8 h-8',
    },
    color: {
      primary: 'text-primary',
      accent: 'text-accent',
      black: 'text-black',
      white: 'text-white',
      success: 'text-success',
      warning: 'text-warning',
      neutral: 'text-neutral',
      error: 'text-error',
      inherit: 'text-inherit',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'inherit',
  },
});
