import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/Dashboard')({
  component: Dashboard,
})

function Dashboard() {
  return (
    <div className="p-2">
      <h3 className="text-primary">
        Dashboard
      </h3>
      <p>Welcome to the dashboard of the app, later will be unique for any user, can't login or signup for now...</p>
    </div>
  )
}
