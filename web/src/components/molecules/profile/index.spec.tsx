import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Profile } from './index';

/**
 * Test suite for the Profile component.
 * Verifies fallback behavior, activity bubble rendering and sizing,
 * conditional display of name/activity, and prop forwarding.
 */
describe('Profile', () => {
  it('renders fallback initial when fallback not provided', () => {
    render(<Profile name="alice" />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('uses provided fallback over generated initial', () => {
    render(<Profile name="alice" fallback="AL" />);
    expect(screen.getByText('AL')).toBeInTheDocument();
  });

  it('shows ActivityBubble when showActivity is true and maps size', () => {
    const { rerender } = render(
      <Profile name="Bob" avatarSize="xs" showActivity={true} />,
    );

    const bubble = screen.getByTitle('Status: offline');
    expect(bubble).toHaveClass('w-2.5');
    rerender(<Profile name="Bob" avatarSize="md" showActivity={true} />);
    const bubbleMd = screen.getByTitle('Status: offline');
    expect(bubbleMd).toHaveClass('w-3');
  });

  it('hides activity bubble when showActivity is false', () => {
    render(<Profile name="Eve" showActivity={false} />);
    expect(screen.queryByTitle(/Status:/)).not.toBeInTheDocument();
  });

  it('hides name when showName is false', () => {
    render(<Profile name="NoName" showName={false} />);
    expect(screen.queryByText('NoName')).not.toBeInTheDocument();
  });

  it('forwards className and alt text to avatar', () => {
    const { container } = render(
      <Profile name="Sam" className="profile-class" alt="Sam avatar" />,
    );

    const root = container.firstElementChild as HTMLElement | null;
    expect(root).toHaveClass('profile-class');

    const { getByRole } = render(
      <Profile name="Sam" src="/img.png" alt="Custom alt" />,
    );
    const img = getByRole('img');
    expect(img).toHaveAttribute('alt', 'Custom alt');
  });
});
