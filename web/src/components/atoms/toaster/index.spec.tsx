import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import type { ToasterProps } from 'react-hot-toast'; 

/**
 * Mocks the `Toaster` component from 'react-hot-toast'.
 * The `Toaster` component is replaced with a Vitest spy function, allowing tests
 * to assert on its calls and props without rendering actual toast UI.
 */
vi.mock('react-hot-toast', () => {
  const MockToasterComponent = vi.fn(() => null);
  return {
    Toaster: MockToasterComponent,
  };
});

import ToasterConfig from './index';
import { Toaster as ToasterComponentFromHotToast } from 'react-hot-toast';
import { JSX } from 'react';

const MockedToasterComponent = ToasterComponentFromHotToast as Mock<(props: ToasterProps) => JSX.Element>;

/**
 * Test suite for the ToasterConfig component.
 * Verifies that the ToasterConfig component correctly configures and renders
 * the react-hot-toast Toaster component with the specified options.
 */
describe('ToasterConfig', () => {
  beforeEach(() => {
    MockedToasterComponent.mockClear();
  });

  it('renders the Toaster component with correct default configurations', () => {
    render(<ToasterConfig />);

    expect(MockedToasterComponent).toHaveBeenCalledTimes(1);

    expect(MockedToasterComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        position: 'top-center',
        toastOptions: expect.objectContaining({
          duration: 5000,
          style: {
            background: '#fff',
            color: '#24242d',
          },
          iconTheme: {
            primary: '#29457a',
            secondary: '#fff',
          },
          className: 'font-display p-4',
          success: expect.objectContaining({
            style: { color: '#24242d' },
            iconTheme: { primary: '#0f7b16', secondary: '#fff' },
          }),
          error: expect.objectContaining({
            style: { color: '#24242d' },
            iconTheme: { primary: '#a32a15', secondary: '#fff' },
          }),
          loading: expect.objectContaining({
            style: { color: '#24242d' },
            iconTheme: { primary: '#383850', secondary: '#fff' },
          }),
        }),
      }),
      undefined
    );
  });
});
