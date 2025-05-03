export type Variant = 'contained' | 'outlined' | 'text';
type Color =
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
  roundiness?: string;
  color?: Color;
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
}
