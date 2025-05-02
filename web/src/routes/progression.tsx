import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/progression')({
  component: Progression,
});

function Progression() {
  return (
    <div className="p-2">
      <h3 className="text-primary">Progression</h3>
      <p>
        Progression
      </p>
    </div>
  );
}
