import {
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from '@tanstack/react-router';
import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { Route as CVAnalysisRoute } from './cv-analysis';

const rootRoute = createRouter({
  routeTree: CVAnalysisRoute,
}).routeTree;

const router = createRouter({
  routeTree: rootRoute,
  history: createMemoryHistory(),
});

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
    render(<RouterProvider router={router} />);
    expect(
      await screen.findByRole('heading', { name: /Analyse CV/i }),
    ).toBeInTheDocument();
  });

  it('renders the descriptive paragraph correctly', async () => {
    render(<RouterProvider router={router} />);
    expect(await screen.findByText(/Analyse de CV/i)).toBeInTheDocument();
  });

  it('renders both heading and paragraph in the document', async () => {
    const { container } = render(<RouterProvider router={router} />);
    expect(
      await screen.findByRole('heading', { name: /Analyse CV/i }),
    ).toBeInTheDocument();
    expect(await screen.findByText(/Analyse de CV/i)).toBeInTheDocument();

    expect(container.firstChild).toHaveClass('p-2');
  });
});
