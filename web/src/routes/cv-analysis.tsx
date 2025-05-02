import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cv-analysis')({
  component: CVAnalysis,
});

function CVAnalysis() {
  return (
    <div className="p-2">
      <h3 className="text-primary">Analyse CV</h3>
      <p>Analyse de CV</p>
    </div>
  );
}
