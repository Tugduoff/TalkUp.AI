/**
 * @interface SelectorOption
 * @description Defines the structure of an option for the SelectorInput component.
 * This type is shared across multiple components that work with selector options.
 * @property {string} value - The value of the option.
 * @property {string} label - The displayed label of the option.
 */
export interface SelectorOption {
  value: string;
  label: string;
}
