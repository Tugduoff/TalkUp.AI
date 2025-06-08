import { validateLogin } from '@/utils/validateLogin';
import { useForm } from '@tanstack/react-form';

/**
 * A component that renders a login form with username and password fields.
 *
 * This form uses a custom form hook that handles validation and submission.
 * It performs both client-side validation (checking for empty fields) and
 * potentially asynchronous validation through the validateLogin function.
 *
 * The form includes:
 * - Username input field with validation
 * - Password input field with validation
 * - Form-level error messages
 * - Loading indicators during validation
 * - Submit button
 *
 * Visual styling is done with Tailwind CSS, creating a clean, shadowed card
 * with consistent spacing and typography.
 *
 * @returns A login form component with validation and styling
 */
export const LoginForm = () => {
  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    onSubmit: ({ value }) => {
      console.log('Login:', value);
    },
    validators: {
      onSubmit: ({ value }) => {
        if (!value.username && !value.password) {
          return 'Username and password are required';
        }
        if (!value.username) {
          return 'Username is required';
        }
        if (!value.password) {
          return 'Password is required';
        }
      },
      onSubmitAsync: ({ value }) => validateLogin(value),
    },
  });
  return (
    <div className="flex flex-col w-full gap-4 px-6 py-8 bg-white rounded-md shadow-lg max-w-92">
      <header className="flex flex-col items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-gray-800">Login</h2>
        <p className="text-sm font-semibold text-gray-500">
          Login to your account
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
              </div>
              {field.state.meta.errors && (
                <span className="text-sm text-red-500">
                  {field.state.meta.errors}
                </span>
              )}
            </div>
          )}
        />
        <form.Subscribe
          selector={(state) => state.errors}
          children={(errors) => (
            <span className="text-sm text-red-500">{errors}</span>
          )}
        />
      </form>
      <button
        className="p-2 text-white rounded-md cursor-pointer bg-primary"
        type="submit"
        onClick={() => form.handleSubmit()}
      >
        Login
      </button>
    </div>
  );
};

export default LoginForm;
