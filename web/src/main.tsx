import ToasterConfig from '@/components/atoms/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import '@/styles/loader.css';
import '@/styles/tailwind.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { routeTree } from './routeTree.gen';
import notFoundRoute from './routes/-not-found';

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: notFoundRoute,
});

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToasterConfig />
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}
