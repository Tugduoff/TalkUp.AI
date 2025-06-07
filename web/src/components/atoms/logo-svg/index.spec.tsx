import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import LogoSvg from './index';
import { LogoColor } from './types';

describe('LogoSvg', () => {
  // Test 1: Renders with default props (primary color, size 100)
  it('renders with default primary color and size 100', () => {
    render(<LogoSvg />);

    const svgElement = screen.getByRole('img');

    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveClass('fill-primary');
    expect(svgElement).toHaveAttribute('width', '100');
    expect(svgElement).toHaveAttribute('height', '100');
  });

  // Test 2: Renders with a custom color
  it('renders with a custom accent color', () => {
    const customColor: LogoColor = 'accent';
    render(<LogoSvg color={customColor} />);

    const svgElement = screen.getByRole('img');

    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveClass(`fill-${customColor}`);
    expect(svgElement).not.toHaveClass('fill-primary');
  });

  // Test 3: Renders with a custom size
  it('renders with a custom size of 50', () => {
    render(<LogoSvg size={50} />);

    const svgElement = screen.getByRole('img');

    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveAttribute('width', '50');
    expect(svgElement).toHaveAttribute('height', '50');
  });

  // Test 4: Renders with both custom color and size
  it('renders with custom color and size', () => {
    const customColor: LogoColor = 'accent';
    const customSize = 75;
    render(<LogoSvg color={customColor} size={customSize} />);

    const svgElement = screen.getByRole('img');

    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveClass(`fill-${customColor}`);
    expect(svgElement).toHaveAttribute('width', customSize.toString());
    expect(svgElement).toHaveAttribute('height', customSize.toString());
  });

  // Test 5: Accessibility check - ensuring it has a role
  it('has an appropriate role for accessibility', () => {
    render(<LogoSvg />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});
