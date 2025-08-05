import { BaseInput } from '@/components/atoms/base-input';
import { CheckboxInput } from '@/components/atoms/checkbox-input';
import { SelectorInput } from '@/components/atoms/selector-input';
import { TextArea } from '@/components/atoms/text-area';
import React, { useId } from 'react';

import { CommonInputProps, SelectorOption } from './type';

/**
 * InputMoleculeProps defines a flexible union type that supports
 * four different input types: base input, selector (dropdown),
 * textarea, and checkbox. Each type extends CommonInputProps and includes
 * additional attributes relevant to that specific input.
 */
type InputMoleculeProps =
  | ({
      type: 'base';
    } & CommonInputProps &
      Omit<
        React.InputHTMLAttributes<HTMLInputElement>,
        keyof CommonInputProps | 'type' | 'checked'
      >)
  | ({
      type: 'selector';
      options: SelectorOption[];
    } & CommonInputProps &
      Omit<
        React.SelectHTMLAttributes<HTMLSelectElement>,
        keyof CommonInputProps | 'type' | 'options'
      >)
  | ({
      type: 'textarea';
      resize?: boolean;
      rows?: number;
      cols?: number;
    } & CommonInputProps &
      Omit<
        React.TextareaHTMLAttributes<HTMLTextAreaElement>,
        keyof CommonInputProps | 'type' | 'rows' | 'cols'
      >)
  | ({
      type: 'checkbox';
    } & CommonInputProps &
      Omit<
        React.InputHTMLAttributes<HTMLInputElement>,
        keyof CommonInputProps | 'type' | 'value'
      >);

/**
 * InputMolecule is a polymorphic component that renders a flexible form input
 * based on the specified `type`. It supports:
 * - `base`: a standard text input
 * - `selector`: a dropdown select input
 * - `textarea`: a multi-line text area
 * - `checkbox`: a checkbox input
 *
 * It handles automatic ID generation using `useId`, optional labels,
 * helper text, and accessibility linking via the `aria-describedby` attribute to
 * associate helper text with its corresponding input field.
 *
 * @component
 * @param {InputMoleculeProps} props - Props describing which type of input to render and its behavior.
 * @returns {JSX.Element} A fully composed and styled input component.
 */
export const InputMolecule: React.FC<InputMoleculeProps> = (props) => {
  const generatedId = useId();
  const {
    id = generatedId,
    type,
    label,
    helperText,
    name,
    value,
    onChange,
    disabled,
    readOnly,
    required,
    placeholder,
    ...rest
  } = props;

  const shouldRenderExternalLabel = type !== 'checkbox' && label;
  const helperTextId = helperText ? `${id}-helper` : undefined;

  return (
    <div className="flex flex-col gap-1 mb-4">
      {shouldRenderExternalLabel && (
        <label htmlFor={id} className="text-sm font-semibold text-text">
          {label}
        </label>
      )}

      {type === 'base' && (
        <BaseInput
          id={id}
          name={name}
          value={typeof value === 'string' ? value : ''}
          onChange={
            onChange as (e: React.ChangeEvent<HTMLInputElement>) => void
          }
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          placeholder={placeholder ?? ''}
          aria-describedby={helperTextId}
          {...(rest as Omit<
            React.InputHTMLAttributes<HTMLInputElement>,
            keyof CommonInputProps | 'type' | 'checked'
          >)}
        />
      )}

      {type === 'selector' && (
        <SelectorInput
          id={id}
          name={name}
          value={typeof value === 'string' ? value : ''}
          onChange={
            onChange as (e: React.ChangeEvent<HTMLSelectElement>) => void
          }
          options={
            (props as Extract<InputMoleculeProps, { type: 'selector' }>).options
          }
          disabled={disabled}
          required={required}
          aria-describedby={helperTextId}
          {...(rest as Omit<
            React.SelectHTMLAttributes<HTMLSelectElement>,
            keyof CommonInputProps | 'type' | 'options'
          >)}
        />
      )}

      {type === 'textarea' && (
        <TextArea
          id={id}
          name={name}
          value={typeof value === 'string' ? value : ''}
          onChange={
            onChange as (e: React.ChangeEvent<HTMLTextAreaElement>) => void
          }
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          placeholder={placeholder ?? ''}
          resize={
            (props as Extract<InputMoleculeProps, { type: 'textarea' }>).resize
          }
          rows={
            (props as Extract<InputMoleculeProps, { type: 'textarea' }>).rows
          }
          cols={
            (props as Extract<InputMoleculeProps, { type: 'textarea' }>).cols
          }
          aria-describedby={helperTextId}
          {...(rest as Omit<
            React.TextareaHTMLAttributes<HTMLTextAreaElement>,
            keyof CommonInputProps | 'type' | 'rows' | 'cols'
          >)}
        />
      )}

      {type === 'checkbox' && (
        <div className="flex items-center gap-2">
          <CheckboxInput
            id={id}
            name={name}
            checked={!!value}
            onChange={
              onChange as (e: React.ChangeEvent<HTMLInputElement>) => void
            }
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            aria-describedby={helperTextId}
            {...(rest as Omit<
              React.InputHTMLAttributes<HTMLInputElement>,
              keyof CommonInputProps | 'type' | 'value'
            >)}
          />
          {label && (
            <label htmlFor={id} className="text-sm font-semibold text-text">
              {label}
            </label>
          )}
        </div>
      )}

      {helperText && (
        <p id={helperTextId} className="text-xs text-text-weakest mt-1">
          {helperText}
        </p>
      )}
    </div>
  );
};
