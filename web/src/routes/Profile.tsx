import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/Profile')({
  component: Profile,
})

function Profile() {
  return (
    <div className="p-2">
      <h3 className="text-primary">
        Profile
      </h3>
      <p>Login and Signup not working for now, profile can't be retrieved</p>
    </div>
  )
}
