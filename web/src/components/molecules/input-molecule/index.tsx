import { BaseInput } from '@/components/atoms/base-input';
import { CheckboxInput } from '@/components/atoms/checkbox-input';
import { SelectorInput } from '@/components/atoms/selector-input';
import { TextArea } from '@/components/atoms/text-area';
import React from 'react';

import { InputMoleculeProps, InputType, SelectorOption } from './type';

export const InputMolecule: React.FC<InputMoleculeProps> = ({
  type,
  id,
  label,
  helperText,
  name = id,
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
            onChange={
              onChange as (e: React.ChangeEvent<HTMLInputElement>) => void
            }
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            placeholder={placeholder}
            {...rest}
          />
        );
      case 'selector':
        if (!options) {
          console.error(
            `InputMolecule (${id}): 'options' prop is required for 'selector' type.`,
          );
          return null;
        }
        return (
          <SelectorInput
            name={name}
            value={value as string}
            onChange={
              onChange as (e: React.ChangeEvent<HTMLSelectElement>) => void
            }
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
            onChange={
              onChange as (e: React.ChangeEvent<HTMLTextAreaElement>) => void
            }
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
              onChange={
                onChange as (e: React.ChangeEvent<HTMLInputElement>) => void
              }
              disabled={disabled}
              readOnly={readOnly}
              required={required}
              {...rest}
            />
            {label && (
              <label htmlFor={id} className="text-sm font-semibold text-text">
                {label}
              </label>
            )}
          </div>
        );
      default:
        console.warn(`InputMolecule (${id}): Unknown input type: ${type}`);
        return null;
    }
  };

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
