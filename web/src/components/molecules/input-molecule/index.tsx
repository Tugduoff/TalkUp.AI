import React from 'react';
import { BaseInput } from '@/components/atoms/base-input';
import { SelectorInput } from '@/components/atoms/selector-input';
import { TextArea } from '@/components/atoms/text-area';
import { CheckboxInput } from '@/components/atoms/checkbox-input';

type InputType = 'base' | 'selector' | 'textarea' | 'checkbox';

interface SelectorOption {
  value: string;
  label: string;
}

interface InputMoleculeProps {
  type: InputType;
  id: string; // Required for accessibility (htmlFor)
  label?: string;
  helperText?: string;
  name?: string; // name attribute for the actual input element
  
  // Common input props
  value?: string | boolean; // value for base, selector, textarea; checked for checkbox
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;

  // Specific props for base/textarea
  placeholder?: string;
  
  // Specific props for selector
  options?: SelectorOption[];

  // Specific props for textarea
  resize?: boolean;
  rows?: number;
  cols?: number;

  // Additional props to pass directly to the underlying input element
  [key: string]: any;
}

export const InputMolecule: React.FC<InputMoleculeProps> = ({
  type,
  id,
  label,
  helperText,
  name = id, // Default name to id if not provided
  value,
  onChange,
  disabled,
  readOnly,
  required,
  placeholder,
  options,
  resize,
  rows,
  cols,
  ...rest
}) => {
  const renderInput = () => {
    switch (type) {
      case 'base':
        return (
          <BaseInput
            name={name}
            value={value as string}
            onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            placeholder={placeholder}
            {...rest}
          />
        );
      case 'selector':
        if (!options) {
          console.error("InputMolecule: 'options' prop is required for 'selector' type.");
          return null;
        }
        return (
          <SelectorInput
            name={name}
            value={value as string}
            onChange={onChange as (e: React.ChangeEvent<HTMLSelectElement>) => void}
            options={options}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            {...rest}
          />
        );
      case 'textarea':
        return (
          <TextArea
            name={name}
            value={value as string}
            onChange={onChange as (e: React.ChangeEvent<HTMLTextAreaElement>) => void}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            placeholder={placeholder}
            resize={resize}
            rows={rows}
            cols={cols}
            {...rest}
          />
        );
      case 'checkbox':
        return (
          <div className="flex items-center gap-2">
            <CheckboxInput
              name={name}
              checked={value as boolean}
              onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
              disabled={disabled}
              readOnly={readOnly}
              required={required}
              {...rest}
            />
            {label && ( // For checkbox, the label is usually next to the input
              <label htmlFor={id} className="text-sm font-semibold text-text">
                {label}
              </label>
            )}
          </div>
        );
      default:
        console.warn(`InputMolecule: Unknown input type: ${type}`);
        return null;
    }
  };

  // For non-checkbox types, render the label above the input
  const shouldRenderExternalLabel = type !== 'checkbox' && label;

  return (
    <div className="flex flex-col gap-1 mb-4">
      {shouldRenderExternalLabel && (
        <label htmlFor={id} className="text-sm font-semibold text-text">
          {label}
        </label>
      )}
      {renderInput()}
      {helperText && (
        <p className="text-xs text-text-weakest mt-1">{helperText}</p>
      )}
    </div>
  );
};