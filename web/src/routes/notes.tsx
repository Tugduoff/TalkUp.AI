import { createAuthGuard } from '@/utils/auth.guards';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/notes')({
  beforeLoad: createAuthGuard('/notes'),
  component: Notes,
});

function Notes() {
  return (
    <div className="p-2">
      <h3 className="text-primary">Notes</h3>
      <p>Notes</p>
    </div>
  );
}
