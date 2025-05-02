import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="p-2">
      <h3 className="text-primary">Dashboard</h3>
      <p>
        Tableau de bord
      </p>
    </div>
  );
}
