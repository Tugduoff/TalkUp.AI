import { createFileRoute } from '@tanstack/react-router';
import { FaC, FaCircleInfo } from 'react-icons/fa6';

import { Button } from '@components/atoms/button';

export const Route = createFileRoute('/about')({
  component: About,
});

function About() {
  return (
    <div className="p-2">
      <div className="flex items-center gap-2">
        <h3 className="text-primary">About</h3>
        <FaCircleInfo size={24} className="fill-primary" />
      </div>
      <p className="mb-4">A propos</p>
      <Button
        variant="contained"
        color="primary"
        roundiness="rounded-full"
        className="flex gap-4 items-center justify-between"
        onClick={() => {
          alert('You clicked the button!');
        }}
      >
        <FaCircleInfo size={24} color="white" />
        <span className="text-white font-display font-semibold">Click me</span>
      </Button>
    </div>
  );
}
