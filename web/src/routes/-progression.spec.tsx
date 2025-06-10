import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router';

import { Route as ProgressionRoute } from './progression';

const rootRoute = createRouter({
  routeTree: ProgressionRoute,
}).routeTree;

const router = createRouter({
  routeTree: rootRoute,
  history: createMemoryHistory(),
});

/**
 * Test suite for the Progression component.
 * Verifies that the component renders its content correctly within a TanStack Router context.
 */
describe('Progression', () => {
  beforeEach(async () => {
    router.history.push('/progression');
    
    await act(async () => {
      await router.load();
    });
  });

  it('renders the main heading correctly', async () => {
    render(<RouterProvider router={router} />);
    expect(await screen.findByRole('heading', { name: /Progression/i })).toBeInTheDocument();
  });

  it('renders the descriptive paragraph correctly', async () => {
    render(<RouterProvider router={router} />);
    const progressionParagraph = (await screen.findAllByText(/Progression/i)).find(el => el.tagName === 'P');
    expect(progressionParagraph).toBeInTheDocument();
  });

  it('renders both heading and paragraph in the document', async () => {
    const { container } = render(<RouterProvider router={router} />);
    
    const progressionTexts = await screen.findAllByText(/Progression/i);

    expect(progressionTexts).toHaveLength(2);

    expect(progressionTexts[0].tagName).toBe('H3');
    expect(progressionTexts[1].tagName).toBe('P');

    expect(container.firstChild).toHaveClass('p-2');
  });
});
