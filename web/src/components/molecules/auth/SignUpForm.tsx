import { validateUsername } from '@/utils/validateUsername';
import { useForm } from '@tanstack/react-form';

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
