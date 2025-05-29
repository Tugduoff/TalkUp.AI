import React from 'react';

/**
 * @interface SelectorOption
 * @description Defines the structure for an option within the SelectorInput.
 * @property {string} value - The actual value of the option.
 * @property {string} label - The visible label of the option.
 */
interface SelectorOption {
  value: string;
  label: string;
}

/**
 * @interface Props
 * @description Defines the properties (props) for the SelectorInput component.
 * @property {string} name - The 'name' attribute for the select input.
 * @property {string} [value] - The current selected value of the input. Defaults to an empty string.
 * @property {(event: React.ChangeEvent<HTMLSelectElement>) => void} [onChange] - Callback function triggered when the selected value changes.
 * @property {SelectorOption[]} options - An array of options to be displayed in the select dropdown.
 * @property {boolean} [disabled] - If 'true', the select input will be disabled. Defaults to 'false'.
 * @property {boolean} [readOnly] - If 'true', the select input will be read-only (though readOnly has limited browser support for select elements). Defaults to 'false'.
 * @property {boolean} [required] - If 'true', the select input must have a selected value before form submission. Defaults to 'false'.
 * @property {string} [className] - Additional CSS classes to apply to the select input.
 */
interface Props {
  name: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectorOption[];
  disabled?: boolean;
  readOnly?: boolean; // Note: readOnly has limited practical effect on <select> elements in most browsers.
  required?: boolean;
  className?: string; // Added className prop for external styling
}

/**
 * @component SelectorInput
 * @description A customizable select (dropdown) input component.
 * Renders a dropdown menu with provided options, supporting controlled value,
 * disabled, and required states. Allows for additional custom styling via className.
 * @param {Props} props - The properties (props) for the component.
 * @returns {JSX.Element} A React select element with options.
 */
export const SelectorInput: React.FC<Props> = ({
  name,
  value = '',
  onChange = () => {},
  options,
  disabled = false,
  readOnly = false, // Included for consistency, but be aware of its limited effect on <select>
  required = false,
  className = '', // Destructure 'className' and initialize it to an empty string
  ...props // Capture all other props not specifically destructured
}: Props) => {
  return (
    <select
      {...props} // Pass all other props to the native select element
      aria-label={name}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required} // 'required' works as expected for select elements
      // Concatenate default classes with classes passed via the 'className' prop
      className={`px-4 py-2 text-sm font-normal transition-colors duration-200 ease-in-out border rounded-sm border-border-strong font-display focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:cursor-not-allowed disabled:bg-disabled disabled:opacity-50 ${className}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};