import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/login', label: 'Login' },
  { to: '/signup', label: 'SignUp' },
  { to: '/profile', label: 'Profile' },
  { to: '/dashboard', label: 'Dashboard' },
]

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2 justify-around">
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
})
