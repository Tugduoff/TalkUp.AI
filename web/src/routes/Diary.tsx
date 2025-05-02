import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/Diary')({
  component: Diary,
});

function Diary() {
  return (
    <div className="p-2">
      <h3 className="text-primary">Diary</h3>
      <p>
        Agenda
      </p>
    </div>
  );
}
