import { createFileRoute } from '@tanstack/react-router';

import { Logo } from '@components/molecules/logo';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <h3 className="text-primary">Home</h3>
      <p>Page vitrine</p>
      <div className="flex items-center justify-around w-full">
        <Logo variant="line" color="accent" />
        <Logo variant="column" color="accent" />
        <Logo variant="no-text" color="accent" />
      </div>
    </div>
  );
}
