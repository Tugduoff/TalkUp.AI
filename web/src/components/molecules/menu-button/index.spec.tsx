import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MenuButton } from './index';

/**
 * Test suite for the `MenuButton` component.
 *
 * This suite verifies the following behaviors:
 * - The default trigger renders and toggles menu visibility.
 * - The menu closes when clicking outside of it.
 * - Custom triggers are supported and reflect the `aria-expanded` attribute.
 * - Position classes are correctly applied to the menu container.
 * - Clicking a menu item closes the menu.
 *
 * Mocks are cleared before each test to ensure isolation.
 */
describe('MenuButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const items = [
    {
      type: 'button',
      label: 'Edit',
      onClick: vi.fn(),
      icon: 'edit',
    },
  ] as any;

  it('renders default trigger and toggles menu visibility', () => {
    render(<MenuButton items={items} />);

    expect(screen.queryByText('Edit')).not.toBeInTheDocument();

    const trigger = screen.getAllByRole('button')[0];
    fireEvent.click(trigger);

    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('closes the menu when clicking outside', () => {
    render(<MenuButton items={items} />);
    const trigger = screen.getAllByRole('button')[0];
    fireEvent.click(trigger);
    expect(screen.getByText('Edit')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });

  it('supports a custom trigger and reflects aria-expanded', () => {
    const custom = <span>Open</span>;
    render(<MenuButton items={items} trigger={custom} />);

    const triggerButton = screen.getByRole('button', { name: 'Open' });
    expect(triggerButton).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(triggerButton);
    expect(triggerButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('applies position classes to the menu container', () => {
    render(<MenuButton items={items} position="top" />);
    const trigger = screen.getAllByRole('button')[0];
    fireEvent.click(trigger);

    const item = screen.getByText('Edit');

    const menuWrapper = item.closest('.absolute');
    expect(menuWrapper).toHaveClass('bottom-full');
  });

  it('clicking a menu item closes the menu', () => {
    render(<MenuButton items={items} />);
    const trigger = screen.getAllByRole('button')[0];
    fireEvent.click(trigger);
    const item = screen.getByText('Edit');

    fireEvent.click(item);
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });
});
