import { createFileRoute } from '@tanstack/react-router';

import LoginForm from '@components/molecules/auth/LoginForm';

export const Route = createFileRoute('/login')({
  component: Login,
});

function Login() {
  return (
    <div className="p-2 flex flex-col items-center w-full gap-4">
      <LoginForm />
    </div>
  );
}
