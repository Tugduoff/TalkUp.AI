import LoginForm from '@/components/molecules/auth/login-form';
import { createPublicRouteGuard } from '@/utils/auth.guards';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
  beforeLoad: createPublicRouteGuard('/login'),
  component: Login,
});

function Login() {
  return (
    <div className="flex flex-col items-center w-full gap-4 p-2">
      <LoginForm />
    </div>
  );
}
