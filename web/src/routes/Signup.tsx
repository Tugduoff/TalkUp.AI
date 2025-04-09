import { createFileRoute } from '@tanstack/react-router';
import SignupForm from '../components/molecules/auth/SignupForm';

export const Route = createFileRoute('/Signup')({
  component: Signup,
})

function Signup() {
  return (
    <div className="p-2 flex flex-col items-center w-full gap-4">
      <h3 className="text-primary">
        Signup
      </h3>
      <SignupForm />
    </div>
  )
}
