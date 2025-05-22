import React from 'react';

interface Props {
  placeholder?: string;
  name?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  resize?: boolean;
  rows?: number;
  cols?: number;
}

/**
 * A customizable textarea component with various configuration options.
 * 
 * @component
 * @param {Object} props - The component props
 * @param {string} [props.placeholder='Enter text'] - Placeholder text for the textarea
 * @param {string} [props.name='textarea'] - Name attribute for the textarea, also used for id and aria-label
 * @param {string} [props.value=''] - Current value of the textarea
 * @param {function} [props.onChange=() => {}] - Callback function triggered on change events
 * @param {boolean} [props.disabled=false] - Whether the textarea is disabled
 * @param {boolean} [props.readOnly=false] - Whether the textarea is read-only
 * @param {boolean} [props.required=false] - Whether the textarea is required
 * @param {boolean} [props.resize=false] - Whether the textarea can be resized
 * @param {number} [props.rows=4] - Number of visible text lines
 * @param {number} [props.cols=50] - Visible width of the textarea
 * @param {Object} props.props - Additional HTML textarea attributes to be spread to the textarea Element
 * 
 * @returns {JSX.Element} A styled textarea element
 */
export const TextArea: React.FC<Props> = ({
  placeholder = 'Enter text',
  name = 'textarea',
  value = '',
  onChange = () => {},
  disabled = false,
  readOnly = false,
  required = false,
  resize = false,
  rows = 4,
  cols = 50,
  ...props
}: Props) => {
  return (
    <textarea
      {...props}
      aria-label={name}
      id={name}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      rows={rows}
      cols={cols}
      className={`${!resize ? 'resize-none' : 'resize'} disabled:resize-none px-4 py-2 border border-border-strong placeholder:text rounded-sm font-display font-normal text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors duration-200 ease-in-out disabled:cursor-not-allowed disabled:bg-disabled disabled:opacity-50`}
    />
  );
};
