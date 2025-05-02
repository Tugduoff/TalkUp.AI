import { createFileRoute } from '@tanstack/react-router';
import { FaCircleInfo } from 'react-icons/fa6';

export const Route = createFileRoute('/about')({
  component: About,
});

function About() {
  return (
    <div className="p-2">
      <h3 className="text-primary">About</h3>
      <FaCircleInfo size={24} color="blue" />
      <p>A propos</p>
    </div>
  );
}
