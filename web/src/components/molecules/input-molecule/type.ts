/**
 * @interface SelectorOption
 * @description Defines the structure of an option for the SelectorInput component.
 * @property {string} value - The value of the option.
 * @property {string} label - The displayed label of the option.
 */
export interface SelectorOption {
  value: string;
  label: string;
}

/**
 * @interface CommonInputProps
 * @description Defines the common properties shared by all input types (InputMolecule).
 * @property {string} [label] - The label to display above the input field.
 * @property {string} [helperText] - The helper text to display below the input field.
 * @property {string} name - The 'name' attribute of the input field.
 * @property {string | boolean} [value] - The current value of the input field (can be a string or boolean for checkboxes).
 * @property {(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void} [onChange] - The callback function to execute when the input field's value changes.
 * @property {boolean} [disabled] - Indicates whether the input field is disabled.
 * @property {boolean} [readOnly] - Indicates whether the input field is read-only.
 * @property {boolean} [required] - Indicates whether the input field is required.
 * @property {string} [placeholder] - The placeholder text displayed in the input field.
 */
export interface CommonInputProps {
  id?: string;
  label?: string;
  helperText?: string;
  name: string;
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
}
