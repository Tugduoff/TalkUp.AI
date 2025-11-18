import NavBar from '@/components/organisms/navbar';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRoute({
  component: () => (
    <div className="grid grid-cols-[256px_1fr] h-screen w-full">
      <NavBar />
      <main className="overflow-auto w-full">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </div>
  ),
});
