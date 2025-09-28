import { createAuthGuard } from '@/utils/auth.guards';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/simulations')({
  beforeLoad: createAuthGuard('/simulations'),
  component: Simulations,
});

function Simulations() {
  return (
    <div className="p-2">
      <h3 className="text-primary">Simulations</h3>
      <p>Simulations</p>
    </div>
  );
}
