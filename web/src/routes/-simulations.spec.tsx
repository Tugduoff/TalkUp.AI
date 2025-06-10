import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router';

import { Route as SimulationsRoute } from './simulations';

const rootRoute = createRouter({
  routeTree: SimulationsRoute,
}).routeTree;

const router = createRouter({
  routeTree: rootRoute,
  history: createMemoryHistory(),
});

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
    render(<RouterProvider router={router} />);
    expect(await screen.findByRole('heading', { name: /Simulations/i })).toBeInTheDocument();
  });

  it('renders the descriptive paragraph correctly', async () => {
    render(<RouterProvider router={router} />);
    // Use findAllByText and then filter by tag name to specifically find the paragraph
    const simulationsParagraph = (await screen.findAllByText(/Simulations/i)).find(el => el.tagName === 'P');
    expect(simulationsParagraph).toBeInTheDocument();
  });

  it('renders both heading and paragraph in the document', async () => {
    const { container } = render(<RouterProvider router={router} />);
    
    // Use findAllByText to get all elements with the text "Simulations"
    const simulationsTexts = await screen.findAllByText(/Simulations/i);

    // Assert that there are exactly two elements found
    expect(simulationsTexts).toHaveLength(2);

    // Assert that the first one is an H3 (heading) and the second is a P (paragraph)
    expect(simulationsTexts[0].tagName).toBe('H3');
    expect(simulationsTexts[1].tagName).toBe('P');

    expect(container.firstChild).toHaveClass('p-2');
  });
});
