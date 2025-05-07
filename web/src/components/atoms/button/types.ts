export type ButtonVariant = 'contained' | 'outlined' | 'text';
export type ButtonColor =
  | 'primary'
  | 'accent'
  | 'black'
  | 'white'
  | 'success'
  | 'warning'
  | 'neutral'
  | 'error';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColor;
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
}
