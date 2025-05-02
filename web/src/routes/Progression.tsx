import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/Progression')({
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
