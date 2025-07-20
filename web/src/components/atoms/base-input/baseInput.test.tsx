import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { BaseInput } from './index';

describe('BaseInput', () => {
  test('renders with default type, name, placeholder, and empty value', () => {
    render(<BaseInput />);
    const inputElement = screen.getByRole('textbox');

    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('type', 'text');
    expect(inputElement).toHaveAttribute('name', 'input');
    expect(inputElement).toHaveAttribute('id', 'input');
    expect(inputElement).toHaveAttribute('placeholder', 'Enter text');
    expect(inputElement).toHaveValue('');
    expect(inputElement).not.toBeDisabled();
    expect(inputElement).not.toHaveAttribute('readOnly');
    expect(inputElement).not.toHaveAttribute('required');
  });

  test('renders with custom type, name, placeholder, and value', () => {
    render(
      <BaseInput
        type="email"
        name="user-email"
        placeholder="Your email"
        value="test@example.com"
      />,
    );
    const inputElement = screen.getByRole('textbox', { name: /user-email/i });

    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('type', 'email');
    expect(inputElement).toHaveAttribute('name', 'user-email');
    expect(inputElement).toHaveAttribute('id', 'user-email');
    expect(inputElement).toHaveAttribute('placeholder', 'Your email');
    expect(inputElement).toHaveValue('test@example.com');
  });

  test('calls onChange handler when input value changes', () => {
    const handleChange = vi.fn();
    render(<BaseInput name="my-input" onChange={handleChange} />);
    const inputElement = screen.getByRole('textbox', { name: /my-input/i });

    fireEvent.change(inputElement, { target: { value: 'new value' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: 'new value',
        }),
      }),
    );
  });

  test('renders as disabled when disabled prop is true', () => {
    render(<BaseInput disabled />);
    const inputElement = screen.getByRole('textbox');

    expect(inputElement).toBeDisabled();
    expect(inputElement).toHaveAttribute('aria-disabled', 'true');
  });

  test('renders as read-only when readOnly prop is true', () => {
    render(<BaseInput readOnly />);
    const inputElement = screen.getByRole('textbox');

    expect(inputElement).toHaveAttribute('readOnly');
    expect(inputElement).toHaveAttribute('aria-readonly', 'true');
  });

  test('renders as required when required prop is true', () => {
    render(<BaseInput required />);
    const inputElement = screen.getByRole('textbox');

    expect(inputElement).toHaveAttribute('required');
    expect(inputElement).toHaveAttribute('aria-required', 'true');
  });

  test('passes additional HTML attributes to the input element', () => {
    render(<BaseInput data-testid="custom-input" className="extra-class" />);
    const inputElement = screen.getByTestId('custom-input');

    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveClass('extra-class');
    expect(inputElement).toHaveClass('px-4 py-2');
  });

  test('merges provided className with default classes', () => {
    render(<BaseInput className="my-custom-class" />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toHaveClass('my-custom-class');
    expect(inputElement).toHaveClass('px-4 py-2');
  });

  test('renders correctly for type="password"', () => {
    render(<BaseInput type="password" name="password-input" />);
    const inputElement = screen.getByLabelText('password-input');
    expect(inputElement).toHaveAttribute('type', 'password');
    expect(inputElement).toHaveAttribute('role', 'textbox');
  });

  test('renders correctly for type="number"', () => {
    render(<BaseInput type="number" name="age-input" />);
    const inputElement = screen.getByLabelText('age-input');
    expect(inputElement).toHaveAttribute('type', 'number');
  });
});