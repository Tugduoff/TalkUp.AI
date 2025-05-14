import { useForm } from '@tanstack/react-form';

import { validateUsername } from '@/utils/validateUsername';

export const SignUpForm = () => {
  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: ({ value }) => {
      console.log('SignUp:', value);
    },
  });
  return (
    <div className="flex flex-col gap-4 py-8 px-6 max-w-92 w-full bg-white rounded-md shadow-lg">
      <header className="flex flex-col items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-gray-800">Sign Up</h2>
        <p className="text-gray-500 text-sm font-semibold">
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
                className="text-gray-500 text-sm font-semibold"
              >
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  value={field.state.value}
                  className="w-full p-2 rounded-md border border-gray-300"
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Your username"
                />
                {field.state.meta.isValidating && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-t-transparent border-primary w-4 h-4" />
                )}
              </div>
              {field.state.meta.errors && (
                <span className="text-red-500 text-sm">
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
                className="text-gray-500 text-sm font-semibold"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={field.state.value}
                  className="w-full p-2 rounded-md border border-gray-300"
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Your password"
                />
                {field.state.meta.isValidating && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-t-transparent border-primary w-4 h-4" />
                )}
              </div>
              {field.state.meta.errors && (
                <span className="text-red-500 text-sm">
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
                className="text-gray-500 text-sm font-semibold"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type="password"
                  value={field.state.value}
                  className="w-full p-2 rounded-md border border-gray-300"
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Your password"
                />
                {field.state.meta.isValidating && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-t-transparent border-primary w-4 h-4" />
                )}
              </div>
              {field.state.meta.errors && (
                <span className="text-red-500 text-sm">
                  {field.state.meta.errors}
                </span>
              )}
            </div>
          )}
        />
      </form>
      <button
        className="bg-primary text-white rounded-md p-2 cursor-pointer"
        type="submit"
        onClick={() => form.handleSubmit()}
      >
        Sign Up
      </button>
    </div>
  );
};

export default SignUpForm;
