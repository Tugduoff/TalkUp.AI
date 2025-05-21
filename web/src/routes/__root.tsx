import { Link, Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/login', label: 'Login' },
  { to: '/signup', label: 'SignUp' },
  { to: '/profile', label: 'Profile' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/simulations', label: 'Simulations' },
  { to: '/cv-analysis', label: 'CV Analysis' },
  { to: '/ai-chat', label: 'AI Chat' },
  { to: '/diary', label: 'Diary' },
  { to: '/notes', label: 'Notes' },
  { to: '/progression', label: 'Progression' },
];

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="flex justify-around gap-2 p-2">
        {links.map(({ to, label }) => (
          <Link key={to} to={to} className="[&.active]:font-bold">
            {label}
          </Link>
        ))}
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
