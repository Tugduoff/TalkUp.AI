import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Menu } from './index';

/**
 * Test suite for the `Menu` component.
 *
 * This suite verifies the following behaviors:
 * - The root container applies the provided `className`.
 * - The component renders various item types: text, spacer, divider, and icon.
 * - Buttons are rendered with correct enabled/disabled states.
 * - Clicking an enabled button triggers both its own handler and the global `onItemClick` handler.
 * - Clicking a disabled button does not trigger its handler.
 *
 * Mocks are created for button click handlers and item click events to assert correct invocation.
 */
describe('Menu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMocks = () => {
    const onClickMock = vi.fn();
    const onClickDisabled = vi.fn();
    const onItemClick = vi.fn();

    const items = [
      {
        type: 'button',
        label: 'Edit',
        onClick: onClickMock,
        icon: 'edit',
      },
      { type: 'text', label: 'Details' },
      { type: 'text', label: 'Muted', variant: 'muted' },
      { type: 'spacer' },
      { type: 'divider' },
      {
        type: 'button',
        label: 'Disabled',
        onClick: onClickDisabled,
        disabled: true,
      },
    ] as any;

    return { items, onClickMock, onClickDisabled, onItemClick };
  };

  it('applies className to root container', () => {
    const { items, onItemClick } = createMocks();
    const { container } = render(
      <Menu items={items} className="my-menu" onItemClick={onItemClick} />,
    );

    const root = container.firstElementChild as HTMLElement | null;
    expect(root).toHaveClass('my-menu');
  });

  it('renders text, spacer, divider and icon', () => {
    const { items, onItemClick } = createMocks();
    const { container } = render(
      <Menu items={items} onItemClick={onItemClick} />,
    );

    expect(screen.getByText('Details')).toBeInTheDocument();
    expect(screen.getByText('Muted')).toBeInTheDocument();
    const root = container.firstElementChild as HTMLElement | null;
    expect(root?.querySelector('.h-3')).toBeInTheDocument();
    expect(root?.querySelector('hr')).toBeInTheDocument();
    expect(root?.querySelector('svg')).toBeInTheDocument();
  });

  it('renders enabled and disabled buttons', () => {
    const { items } = createMocks();
    render(<Menu items={items} />);

    const editButton = screen.getByRole('button', { name: 'Edit' });
    const disabledButton = screen.getByRole('button', { name: 'Disabled' });

    expect(editButton).toBeEnabled();
    expect(disabledButton).toBeDisabled();
  });

  it('clicking enabled button triggers handlers', () => {
    const { items, onClickMock, onItemClick } = createMocks();
    render(<Menu items={items} onItemClick={onItemClick} />);

    const editButton = screen.getByRole('button', { name: 'Edit' });
    fireEvent.click(editButton);

    expect(onClickMock).toHaveBeenCalledTimes(1);
    expect(onItemClick).toHaveBeenCalledTimes(1);
  });

  it('clicking disabled button does not call its handler', () => {
    const { items, onClickDisabled } = createMocks();
    render(<Menu items={items} />);

    const disabledButton = screen.getByRole('button', { name: 'Disabled' });
    fireEvent.click(disabledButton);

    expect(onClickDisabled).not.toHaveBeenCalled();
  });
});
