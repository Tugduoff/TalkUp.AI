import { cn } from '@/utils/cn';
import React, { JSX } from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name?: string;
}

/**
 * @component CheckboxInput
 * @description A reusable checkbox input component with consistent styling.
 * It handles the 'id' prop for accessibility and label association.
 *
 * @param {Props} props - The component's properties. All standard HTML attributes for <input type="checkbox"> are supported.
 * @param {string} [props.id] - The unique ID of the checkbox input element. Essential for label association.
 * @param {string} props.name - The name of the checkbox field.
 * @param {string} [props.className] - Additional CSS classes to apply to the checkbox.
 * @returns {JSX.Element} The rendered <input type="checkbox"> element with the provided props and styles.
 */
export const CheckboxInput: React.FC<Props> = ({
  id,
  name = 'checkbox',
  className,
  ...rest
}: Props): JSX.Element => {
  return (
    <input
      {...rest}
      id={id}
      name={name}
      type="checkbox"
      aria-label={name}
      className={cn(
        'w-4 h-4 text-accent border-borderStrong rounded focus:ring-accent focus:ring-2 disabled:cursor-not-allowed disabled:bg-disabled disabled:opacity-50',
        className,
      )}
    />
  );
};
