import React from 'react';

/**
 * @typedef {'base' | 'selector' | 'textarea' | 'checkbox'} InputType
 * @description Defines the possible types of input elements the InputMolecule can render.
 */
export type InputType = 'base' | 'selector' | 'textarea' | 'checkbox';

/**
 * @interface SelectorOption
 * @description Defines the structure for an option within the SelectorInput.
 * @property {string} value - The actual value of the option.
 * @property {string} label - The visible label of the option.
 */
export interface SelectorOption {
  value: string;
  label: string;
}

/**
 * @interface InputMoleculeProps
 * @description Defines the properties for the InputMolecule component.
 * This component acts as a versatile wrapper for various input types,
 * simplifying their usage and providing consistent labeling and helper text.
 *
 * @property {InputType} type - Specifies the type of input to render ('base', 'selector', 'textarea', 'checkbox').
 * @property {string} id - A unique identifier for the input element, used for accessibility (htmlFor).
 * @property {string} [label] - The text label displayed for the input.
 * @property {string} [helperText] - Supplementary text displayed below the input.
 * @property {string} [name] - The 'name' attribute for the actual underlying input element. Defaults to `id` if not provided.
 *
 * @property {string | boolean} [value] - The controlled value of the input. For 'checkbox', this represents its 'checked' state (boolean). For others, it's the string value.
 * @property {(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void} [onChange] - Callback function triggered when the input's value changes.
 * @property {boolean} [disabled] - If 'true', the input will be disabled.
 * @property {boolean} [readOnly] - If 'true', the input will be read-only (behavior varies by input type).
 * @property {boolean} [required] - If 'true', the input must be filled before form submission.
 *
 * @property {string} [placeholder] - Placeholder text for 'base' and 'textarea' types.
 *
 * @property {SelectorOption[]} [options] - An array of options for the 'selector' type. Required if `type` is 'selector'.
 *
 * @property {boolean} [resize] - If 'true', allows resizing for 'textarea' type.
 * @property {number} [rows] - Specifies the visible number of lines for 'textarea' type.
 * @property {number} [cols] - Specifies the visible width in average characters for 'textarea' type.
 *
 * @property {any} [key: string] - Allows passing any additional HTML attributes directly to the underlying input element.
 */
export interface InputMoleculeProps {
  type: InputType;
  id: string;
  label?: string;
  helperText?: string;
  name?: string;

  value?: string | boolean;
  onChange?: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;

  placeholder?: string;

  options?: SelectorOption[];

  resize?: boolean;
  rows?: number;
  cols?: number;

  [key: string]: any;
}
