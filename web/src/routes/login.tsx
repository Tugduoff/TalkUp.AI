import LoginForm from '@/components/molecules/auth/LoginForm';
import { createFileRoute } from '@tanstack/react-router';

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
