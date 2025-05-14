import { useForm } from '@tanstack/react-form';

import { validateLogin } from '@/utils/validateLogin';

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
    <div className="flex flex-col gap-4 py-8 px-6 max-w-92 w-full bg-white rounded-md shadow-lg">
      <header className="flex flex-col items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-gray-800">Login</h2>
        <p className="text-gray-500 text-sm font-semibold">
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
        <form.Subscribe
          selector={(state) => state.errors}
          children={(errors) => (
            <span className="text-red-500 text-sm">{errors}</span>
          )}
        />
      </form>
      <button
        className="bg-primary text-white rounded-md p-2 cursor-pointer"
        type="submit"
        onClick={() => form.handleSubmit()}
      >
        Login
      </button>
    </div>
  );
};

export default LoginForm;
