import { AuthProvider } from '@/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from '@tanstack/react-router';
import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Route as SimulationsRoute } from './simulations';

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
  routeTree: SimulationsRoute,
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
      <AuthProvider>{component}</AuthProvider>
    </QueryClientProvider>,
  );
};

/**
 * Test suite for the Simulations component.
 * Verifies that the component renders its content correctly within a TanStack Router context.
 */
describe('Simulations', () => {
  beforeEach(async () => {
    router.history.push('/simulations');

    await act(async () => {
      await router.load();
    });
  });

  it('renders the main heading correctly', async () => {
    renderWithProviders(<RouterProvider router={router} />);
    expect(
      await screen.findByRole('heading', { name: /Simulations/i }),
    ).toBeInTheDocument();
  });

  it('renders the descriptive paragraph correctly', async () => {
    renderWithProviders(<RouterProvider router={router} />);
    const simulationsParagraph = (
      await screen.findAllByText(/Simulations/i)
    ).find((el) => el.tagName === 'P');
    expect(simulationsParagraph).toBeInTheDocument();
  });

  it('renders both heading and paragraph in the document', async () => {
    const { container } = renderWithProviders(
      <RouterProvider router={router} />,
    );

    const simulationsTexts = await screen.findAllByText(/Simulations/i);

    expect(simulationsTexts).toHaveLength(2);

    const heading = await screen.findByRole('heading', {
      name: /Simulations/i,
      level: 1,
    });
    expect(heading).toBeInTheDocument();

    const paragraph = simulationsTexts.find((el) => el.tagName === 'P');
    expect(paragraph).toBeInTheDocument();

    expect(container.firstChild).toHaveClass('p-6');
  });
});
