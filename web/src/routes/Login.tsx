import { createFileRoute } from '@tanstack/react-router';
import LoginForm from '../components/molecules/auth/LoginForm';

export const Route = createFileRoute('/Login')({
  component: Login,
})

function Login() {
  return (
    <div className="p-2 flex flex-col items-center w-full gap-4">
      <h3 className="text-primary">
        Login
      </h3>
      <LoginForm />
    </div>
  )
}
