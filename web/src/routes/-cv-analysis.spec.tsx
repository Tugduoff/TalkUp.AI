import { AuthProvider } from '@/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from '@tanstack/react-router';
import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Route as CVAnalysisRoute } from './cv-analysis';

const localStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

vi.mock('@/utils/auth.guards', () => ({
  createAuthGuard: vi.fn(() => () => Promise.resolve()),
}));

const rootRoute = createRouter({
  routeTree: CVAnalysisRoute,
}).routeTree;

const router = createRouter({
  routeTree: rootRoute,
  history: createMemoryHistory(),
});

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {component}
      </AuthProvider>
    </QueryClientProvider>,
  );
};

/**
 * Test suite for the CVAnalysis component.
 * Verifies that the component renders its content correctly within a TanStack Router context.
 */
describe('CVAnalysis', () => {
  beforeEach(async () => {
    router.history.push('/cv-analysis');

    await act(async () => {
      await router.load();
    });
  });

  it('renders the main heading correctly', async () => {
    renderWithProviders(<RouterProvider router={router} />);
    expect(
      await screen.findByRole('heading', { name: /Analyse CV/i }),
    ).toBeInTheDocument();
  });

  it('renders the descriptive paragraph correctly', async () => {
    renderWithProviders(<RouterProvider router={router} />);
    expect(await screen.findByText(/Analyse de CV/i)).toBeInTheDocument();
  });

  it('renders both heading and paragraph in the document', async () => {
    const { container } = renderWithProviders(<RouterProvider router={router} />);
    expect(
      await screen.findByRole('heading', { name: /Analyse CV/i }),
    ).toBeInTheDocument();
    expect(await screen.findByText(/Analyse de CV/i)).toBeInTheDocument();

    expect(container.firstChild).toHaveClass('p-2');
  });
});
