import {
  NotFoundRoute,
  RouterProvider,
  createRouter,
} from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import '@/styles/tailwind.css';

import { routeTree } from './routeTree.gen';
import { Route } from './routes/__root';

const notFoundRoute = new NotFoundRoute({
  getParentRoute: () => Route,
  component: () => '404 Not Found',
});

const router = createRouter({ routeTree, notFoundRoute });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
}
