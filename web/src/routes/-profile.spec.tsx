import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router';

import { Route as ProfileRoute } from './profile';

const rootRoute = createRouter({
  routeTree: ProfileRoute,
}).routeTree;

const router = createRouter({
  routeTree: rootRoute,
  history: createMemoryHistory(),
});

/**
 * Test suite for the Profile component.
 * Verifies that the component renders its content correctly within a TanStack Router context.
 */
describe('Profile', () => {
  beforeEach(async () => {
    router.history.push('/profile');
    
    await act(async () => {
      await router.load();
    });
  });

  it('renders the main heading correctly', async () => {
    render(<RouterProvider router={router} />);
    expect(await screen.findByRole('heading', { name: /Profile/i })).toBeInTheDocument();
  });

  it('renders the descriptive paragraph correctly', async () => {
    render(<RouterProvider router={router} />);
    expect(await screen.findByText(/Profil de l'utilisateur/i)).toBeInTheDocument();
  });

  it('renders both heading and paragraph in the document', async () => {
    const { container } = render(<RouterProvider router={router} />);
    
    expect(await screen.findByRole('heading', { name: /Profile/i })).toBeInTheDocument();
    expect(await screen.findByText(/Profil de l'utilisateur/i)).toBeInTheDocument();

    expect(container.firstChild).toHaveClass('p-2');
  });
});
