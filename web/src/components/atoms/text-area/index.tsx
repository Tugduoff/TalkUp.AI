import { cn } from '@/utils/cn';
import React from 'react';

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Whether the textarea is resizable vertically. Defaults to `true`.
   * If `false`, resizing is disabled.
   */
  resize?: boolean;
}

/**
 * A customizable textarea component with optional resize control.
 *
 * @component
 * @example
 * ```tsx
 * <TextArea
 *   name="description"
 *   placeholder="Write your message..."
 *   rows={5}
 *   resize={false}
 *   onChange={(e) => console.log(e.target.value)}
 * />
 * ```
 *
 * @param {Props} props - The props for the TextArea component.
 * @param {string} [props.id] - The id of the textarea element.
 * @param {string} [props.value=''] - The current value of the textarea.
 * @param {string} [props.name='textarea'] - The name attribute of the textarea.
 * @param {string} [props.placeholder='Enter text'] - Placeholder text for the textarea.
 * @param {number} [props.rows=3] - Number of visible text lines.
 * @param {number} [props.cols] - Number of visible columns.
 * @param {boolean} [props.resize=true] - Whether the textarea can be resized vertically.
 * @param {boolean} [props.disabled=false] - Whether the textarea is disabled.
 * @param {boolean} [props.readOnly=false] - Whether the textarea is read-only.
 * @param {boolean} [props.required=false] - Whether the textarea is required for form submission.
 * @param {(e: React.ChangeEvent<HTMLTextAreaElement>) => void} [props.onChange] - Handler for value change.
 * @param {string} [props.className] - Additional CSS classes to apply.
 * @param {any} [props.rest] - Additional props passed to the textarea element.
 *
 * @returns {JSX.Element} A styled textarea component.
 */
export const TextArea: React.FC<Props> = ({
  id,
  value = '',
  name = 'textarea',
  placeholder = 'Enter text',
  rows = 3,
  cols,
  resize = true,
  disabled = false,
  readOnly = false,
  required = false,
  onChange = () => {},
  className,
  ...rest
}) => {
  const resizeClass = disabled
    ? 'resize-none'
    : resize
      ? 'resize-y'
      : 'resize-none';

  return (
    <textarea
      {...rest}
      id={id}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      rows={rows}
      cols={cols}
      aria-label={name}
      role="textbox"
      aria-multiline="true"
      aria-disabled={disabled}
      aria-readonly={readOnly}
      aria-required={required}
      className={cn('px-4 py-2 text-sm font-normal transition-colors duration-200 ease-in-out border rounded-sm font-display focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:cursor-not-allowed disabled:bg-disabled disabled:opacity-50 border-border-strong',
        resizeClass,
        className,
      )}
    />
  );
};
