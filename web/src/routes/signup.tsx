import { createFileRoute } from '@tanstack/react-router';

import SignUpForm from '@components/molecules/auth/SignUpForm';

export const Route = createFileRoute('/signup')({
  component: SignUp,
});

function SignUp() {
  return (
    <div className="p-2 flex flex-col items-center w-full gap-4">
      <SignUpForm />
    </div>
  );
}
