import { usePostRegister } from '@/hooks/auth/useServices';
import { validateUsername } from '@/utils/validateUsername';
import { useForm } from '@tanstack/react-form';

import { Country, PhoneNumberInputProps } from './phone-number/type';

/**
 * A form component for user registration.
 *
 * The SignUpForm component provides a user interface for new account registration with the following features:
 * - Username input with validation (minimum 3 characters, maximum 20 characters, alphanumeric only)
 * - Phone number input with international format validation
 * - Password input with complex validation rules (length, case, numbers)
 * - Password confirmation input that ensures it matches the password
 * - Asynchronous validation for username
 * - Real-time validation feedback with loading indicators
 * - Form submission handling
 *
 * The component uses a custom form hook for managing form state and validation.
 * When submitted, it calls the `postRegister` mutation with the user's registration details.
 *
 * @returns A signup form component with validation and styling
 */
export const SignUpForm = () => {
  const { mutate: postRegister } = usePostRegister();

  const form = useForm({
    defaultValues: {
      username: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: ({ value }) => {
      postRegister({
        username: value.username,
        phoneNumber: value.phoneNumber,
        password: value.password,
      });
    },
  });

  return (
    <div className="flex flex-col w-full gap-4 px-6 py-8 bg-white rounded-md shadow-lg max-w-92">
      <header className="flex flex-col items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-gray-800">Sign Up</h2>
        <p className="text-sm font-semibold text-gray-500">
          Create a new account
        </p>
      </header>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <form.Field
          name="username"
          validators={{
            onChangeAsyncDebounceMs: 500,
            onChangeAsync: ({ value }) => validateUsername(value),
            onChange: ({ value }) => {
              if (value.length < 3) {
                return 'Username must be at least 3 characters long';
              }
              if (value.length > 20) {
                return 'Username must be at most 20 characters long';
              }
              if (!/^[a-zA-Z0-9]+$/.test(value)) {
                return 'Username must contain only letters and numbers';
              }
            },
          }}
          children={(field) => (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="username"
                className="text-sm font-semibold text-gray-500"
              >
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  value={field.state.value}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Your username"
                />
                {field.state.meta.isValidating && (
                  <div className="absolute w-4 h-4 -translate-y-1/2 border-2 rounded-full right-4 top-1/2 animate-spin border-t-transparent border-primary" />
                )}
              </div>
              {field.state.meta.errors && (
                <span className="text-sm text-red-500">
                  {field.state.meta.errors}
                </span>
              )}
            </div>
          )}
        />
        <form.Field
          name="phoneNumber"
          validators={{
            onChange: ({ value }) => {
              if (!/^(\+\d{1,3})?\d{9,15}$/.test(value)) {
                return 'Phone number must be in international format (e.g., +1234567890)';
              }
            },
          }}
          children={(field) => (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="phoneNumber"
                className="text-sm font-semibold text-gray-500"
              >
                Phone Number
              </label>
              <div className="relative">
                <input
                  id="phoneNumber"
                  type="tel"
                  value={field.state.value}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Your phone number"
                />
                {field.state.meta.isValidating && (
                  <div className="absolute w-4 h-4 -translate-y-1/2 border-2 rounded-full right-4 top-1/2 animate-spin border-t-transparent border-primary" />
                )}
              </div>
              {field.state.meta.errors && (
                <span className="text-sm text-red-500">
                  {field.state.meta.errors}
                </span>
              )}
            </div>
          )}
        />
        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) => {
              if (value.length < 8) {
                return 'Password must be at least 8 characters long';
              }
              if (value.length > 20) {
                return 'Password must be at most 20 characters long';
              }
              if (!/[a-z]/.test(value)) {
                return 'Password must contain at least one lowercase letter';
              }
              if (!/[A-Z]/.test(value)) {
                return 'Password must contain at least one uppercase letter';
              }
              if (!/[0-9]/.test(value)) {
                return 'Password must contain at least one number';
              }
            },
          }}
          children={(field) => (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-gray-500"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={field.state.value}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Your password"
                />
                {field.state.meta.isValidating && (
                  <div className="absolute w-4 h-4 -translate-y-1/2 border-2 rounded-full right-4 top-1/2 animate-spin border-t-transparent border-primary" />
                )}
              </div>
              {field.state.meta.errors && (
                <span className="text-sm text-red-500">
                  {field.state.meta.errors}
                </span>
              )}
            </div>
          )}
        />
        <form.Field
          name="confirmPassword"
          validators={{
            onChangeListenTo: ['password'],
            onChange: ({ value, fieldApi }) => {
              if (value !== fieldApi.form.getFieldValue('password')) {
                return 'Passwords do not match';
              }
            },
          }}
          children={(field) => (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-semibold text-gray-500"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type="password"
                  value={field.state.value}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Your password"
                />
                {field.state.meta.isValidating && (
                  <div className="absolute w-4 h-4 -translate-y-1/2 border-2 rounded-full right-4 top-1/2 animate-spin border-t-transparent border-primary" />
                )}
              </div>
              {field.state.meta.errors && (
                <span className="text-sm text-red-500">
                  {field.state.meta.errors}
                </span>
              )}
            </div>
          )}
        />
      </form>
      <button
        className="p-2 text-white rounded-md cursor-pointer bg-primary"
        type="submit"
        onClick={() => form.handleSubmit()}
      >
        Sign Up
      </button>
    </div>
  );
};

export default SignUpForm;
