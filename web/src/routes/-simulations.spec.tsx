import { AuthProvider } from '@/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from '@tanstack/react-router';
import { act, render, screen } from '@testing-library/react';
import { ReadyState } from 'react-use-websocket';
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

vi.mock('react-use-websocket', () => ({
  default: vi.fn(() => ({
    sendMessage: vi.fn(),
    sendJsonMessage: vi.fn(),
    lastMessage: null,
    lastJsonMessage: null,
    readyState: ReadyState.CLOSED,
    getWebSocket: vi.fn(() => ({ close: vi.fn() })),
  })),
  ReadyState: {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3,
    UNINSTANTIATED: -1,
  },
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
 * Verifies that the WebSocket simulations interface renders correctly.
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
      await screen.findByRole('heading', { name: /WebSocket Simulations/i }),
    ).toBeInTheDocument();
  });

  it('renders the connection settings section', async () => {
    renderWithProviders(<RouterProvider router={router} />);
    expect(
      await screen.findByRole('heading', { name: /Connection Settings/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Socket URL/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Connect/i }),
    ).toBeInTheDocument();
  });

  it('renders the actions section with WebSocket controls', async () => {
    renderWithProviders(<RouterProvider router={router} />);
    expect(
      await screen.findByRole('heading', { name: /Actions/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Send Message/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Send JSON Message/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Close WebSocket/i }),
    ).toBeInTheDocument();
  });

  it('renders the messages section', async () => {
    renderWithProviders(<RouterProvider router={router} />);
    expect(
      await screen.findByRole('heading', { name: /Messages/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/No messages received yet/i)).toBeInTheDocument();
  });

  it('displays connection status as Closed by default', async () => {
    renderWithProviders(<RouterProvider router={router} />);
    expect(await screen.findByText(/Status:/i)).toBeInTheDocument();
    expect(screen.getByText(/Closed/i)).toBeInTheDocument();
  });
});
