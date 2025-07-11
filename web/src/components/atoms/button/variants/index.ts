import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  // Base styles
  "py-3 px-5 cursor-pointer border transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        contained: "border-transparent text-white",
        outlined: "border-2 bg-transparent",
        text: "border-transparent bg-transparent",
      },
      color: {
        primary: "",
        accent: "",
        black: "",
        white: "",
        success: "",
        warning: "",
        neutral: "",
        error: "",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "",
      },
      loading: {
        true: "cursor-wait",
        false: "",
      },
    },
    compoundVariants: [
      // Contained variants
      {
        variant: "contained",
        color: "primary",
        className: "bg-primary text-white hover:bg-primary-hover active:bg-primary-active focus:ring-2 focus:ring-primary-weak focus:ring-offset-2",
      },
      {
        variant: "contained",
        color: "accent",
        className: "bg-accent text-white hover:bg-accent-hover active:bg-accent-active focus:ring-2 focus:ring-accent-weak focus:ring-offset-2",
      },
      {
        variant: "contained",
        color: "black",
        className: "bg-black text-white hover:bg-black-hover active:bg-black-active focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
      },
      {
        variant: "contained",
        color: "white",
        className: "bg-white text-black hover:bg-white-hover active:bg-white-active focus:ring-2 focus:ring-gray-300 focus:ring-offset-2",
      },
      {
        variant: "contained",
        color: "success",
        className: "bg-success text-white hover:bg-success-hover active:bg-success-active focus:ring-2 focus:ring-success-weak focus:ring-offset-2",
      },
      {
        variant: "contained",
        color: "warning",
        className: "bg-warning text-white hover:bg-warning-hover active:bg-warning-active focus:ring-2 focus:ring-warning-weak focus:ring-offset-2",
      },
      {
        variant: "contained",
        color: "neutral",
        className: "bg-neutral text-white hover:bg-neutral-hover active:bg-neutral-active focus:ring-2 focus:ring-neutral-weak focus:ring-offset-2",
      },
      {
        variant: "contained",
        color: "error",
        className: "bg-error text-white hover:bg-error-hover active:bg-error-active focus:ring-2 focus:ring-error-weak focus:ring-offset-2",
      },
      // Outlined variants
      {
        variant: "outlined",
        color: "primary",
        className: "border-primary text-primary hover:border-primary-hover hover:text-primary-hover hover:bg-primary-weaker active:border-primary-active active:text-primary-active active:bg-primary-weak focus:ring-2 focus:ring-primary-weak focus:ring-offset-2",
      },
      {
        variant: "outlined",
        color: "accent",
        className: "border-accent text-accent hover:border-accent-hover hover:text-accent-hover hover:bg-accent-weaker active:border-accent-active active:text-accent-active active:bg-accent-weak focus:ring-2 focus:ring-accent-weak focus:ring-offset-2",
      },
      {
        variant: "outlined",
        color: "black",
        className: "border-black text-black hover:border-black-hover hover:text-black-hover hover:bg-black-weaker active:border-black-active active:text-black-active active:bg-black-weak focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
      },
      {
        variant: "outlined",
        color: "white",
        className: "border-black text-black hover:border-black-hover hover:text-black-hover hover:bg-black-weaker active:border-black-active active:text-black-active active:bg-black-weak focus:ring-2 focus:ring-gray-300 focus:ring-offset-2",
      },
      {
        variant: "outlined",
        color: "success",
        className: "border-success text-success hover:border-success-hover hover:text-success-hover hover:bg-success-weaker active:border-success-active active:text-success-active active:bg-success-weak focus:ring-2 focus:ring-success-weak focus:ring-offset-2",
      },
      {
        variant: "outlined",
        color: "warning",
        className: "border-warning text-warning hover:border-warning-hover hover:text-warning-hover hover:bg-warning-weaker active:border-warning-active active:text-warning-active active:bg-warning-weak focus:ring-2 focus:ring-warning-weak focus:ring-offset-2",
      },
      {
        variant: "outlined",
        color: "neutral",
        className: "border-neutral text-neutral hover:border-neutral-hover hover:text-neutral-hover hover:bg-neutral-weaker active:border-neutral-active active:text-neutral-active active:bg-neutral-weak focus:ring-2 focus:ring-neutral-weak focus:ring-offset-2",
      },
      {
        variant: "outlined",
        color: "error",
        className: "border-error text-error hover:border-error-hover hover:text-error-hover hover:bg-error-weaker active:border-error-active active:text-error-active active:bg-error-weak focus:ring-2 focus:ring-error-weak focus:ring-offset-2",
      },
      // Text variants
      {
        variant: "text",
        color: "primary",
        className: "text-primary hover:text-primary-hover hover:bg-primary-weaker active:text-primary-active active:bg-primary-weak focus:ring-2 focus:ring-primary-weak focus:ring-offset-2",
      },
      {
        variant: "text",
        color: "accent",
        className: "text-accent hover:text-accent-hover hover:bg-accent-weaker active:text-accent-active active:bg-accent-weak focus:ring-2 focus:ring-accent-weak focus:ring-offset-2",
      },
      {
        variant: "text",
        color: "black",
        className: "text-black hover:text-black-hover hover:bg-black-weaker active:text-black-active active:bg-black-weak focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
      },
      {
        variant: "text",
        color: "white",
        className: "text-black hover:text-black-hover hover:bg-black-weaker active:text-black-active active:bg-black-weak focus:ring-2 focus:ring-gray-300 focus:ring-offset-2",
      },
      {
        variant: "text",
        color: "success",
        className: "text-success hover:text-success-hover hover:bg-success-weaker active:text-success-active active:bg-success-weak focus:ring-2 focus:ring-success-weak focus:ring-offset-2",
      },
      {
        variant: "text",
        color: "warning",
        className: "text-warning hover:text-warning-hover hover:bg-warning-weaker active:text-warning-active active:bg-warning-weak focus:ring-2 focus:ring-warning-weak focus:ring-offset-2",
      },
      {
        variant: "text",
        color: "neutral",
        className: "text-neutral hover:text-neutral-hover hover:bg-neutral-weaker active:text-neutral-active active:bg-neutral-weak focus:ring-2 focus:ring-neutral-weak focus:ring-offset-2",
      },
      {
        variant: "text",
        color: "error",
        className: "text-error hover:text-error-hover hover:bg-error-weaker active:text-error-active active:bg-error-weak focus:ring-2 focus:ring-error-weak focus:ring-offset-2",
      },
      // Disabled state overrides
      {
        disabled: true,
        className: "opacity-50 cursor-not-allowed bg-disabled hover:bg-disabled active:bg-disabled text-black border-disabled",
      },
    ],
    defaultVariants: {
      variant: "contained",
      color: "primary",
      disabled: false,
      loading: false,
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
