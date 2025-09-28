import { createAuthGuard } from '@/utils/auth.guards';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard')({
  beforeLoad: createAuthGuard('/dashboard'),
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="p-2">
      <h3 className="text-primary">Dashboard</h3>
      <p>Tableau de bord</p>
    </div>
  );
}
