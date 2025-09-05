import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';

import { Avatar } from './index';

/**
 * Test suite for the Avatar component.
 * Ensures correct rendering, props handling, class application, fallback behavior, and accessibility.
 */
describe('Avatar', () => {
  /**
   * Test Group: Basic Rendering
   */
  describe('Basic Rendering', () => {
    it('renders without props', () => {
      render(<Avatar />);
      const avatar = screen.getByText('?');
      expect(avatar).toBeInTheDocument();
    });

    it('forwards ref to div element', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Avatar ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('applies default size classes when no size provided', () => {
      render(<Avatar fallback="AB" />);
      const avatar = screen.getByText('AB').parentElement;
      expect(avatar).toHaveClass('w-10');
      expect(avatar).toHaveClass('h-10');
      expect(avatar).toHaveClass('text-base');
    });
  });

  /**
   * Test Group: Image Rendering
   */
  describe('Image Rendering', () => {
    it('renders image when src is provided', () => {
      render(<Avatar src="/test-image.jpg" alt="Test Avatar" />);
      const image = screen.getByRole('img');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/test-image.jpg');
      expect(image).toHaveAttribute('alt', 'Test Avatar');
    });

    it('uses default alt text when alt is not provided', () => {
      render(<Avatar src="/test-image.jpg" />);
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', 'Avatar');
    });

    it('applies correct image classes', () => {
      render(<Avatar src="/test-image.jpg" />);
      const image = screen.getByRole('img');
      expect(image).toHaveClass('w-full', 'h-full', 'object-cover');
    });
  });

  /**
   * Test Group: Fallback Behavior
   */
  describe('Fallback Behavior', () => {
    it('shows fallback text when no src is provided', () => {
      render(<Avatar fallback="JD" />);
      const fallback = screen.getByText('JD');
      expect(fallback).toBeInTheDocument();
      expect(fallback).toHaveClass('select-none');
    });

    it('shows default fallback when no src and no fallback provided', () => {
      render(<Avatar />);
      const fallback = screen.getByText('?');
      expect(fallback).toBeInTheDocument();
    });

    it('shows fallback when image fails to load', () => {
      render(<Avatar src="/invalid-image.jpg" fallback="FB" />);
      const image = screen.getByRole('img');

      fireEvent.error(image);

      const fallback = screen.getByText('FB');
      expect(fallback).toBeInTheDocument();
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('shows default fallback when image fails and no fallback provided', () => {
      render(<Avatar src="/invalid-image.jpg" />);
      const image = screen.getByRole('img');

      fireEvent.error(image);

      const fallback = screen.getByText('?');
      expect(fallback).toBeInTheDocument();
    });
  });

  /**
   * Test Group: Size Variants
   */
  describe('Size Variants', () => {
    const sizeClassMap = {
      xs: { width: 'w-6', height: 'h-6', text: 'text-xs' },
      sm: { width: 'w-8', height: 'h-8', text: 'text-sm' },
      md: { width: 'w-10', height: 'h-10', text: 'text-base' },
      lg: { width: 'w-12', height: 'h-12', text: 'text-lg' },
      xl: { width: 'w-16', height: 'h-16', text: 'text-xl' },
    } as const;

    (['xs', 'sm', 'md', 'lg', 'xl'] as const).forEach((size) => {
      it(`applies correct classes for size: ${size}`, () => {
        render(<Avatar size={size} fallback="T" />);
        const avatar = screen.getByText('T').parentElement;
        const classes = sizeClassMap[size];

        expect(avatar).toHaveClass(classes.width);
        expect(avatar).toHaveClass(classes.height);
        expect(avatar).toHaveClass(classes.text);
      });
    });
  });

  /**
   * Test Group: Base Classes
   */
  describe('Base Classes', () => {
    it('applies base avatar classes', () => {
      render(<Avatar fallback="T" />);
      const avatar = screen.getByText('T').parentElement;

      expect(avatar).toHaveClass('relative');
      expect(avatar).toHaveClass('flex');
      expect(avatar).toHaveClass('items-center');
      expect(avatar).toHaveClass('justify-center');
      expect(avatar).toHaveClass('rounded-full');
      expect(avatar).toHaveClass('bg-accent-weaker');
      expect(avatar).toHaveClass('text-neutral');
      expect(avatar).toHaveClass('font-medium');
      expect(avatar).toHaveClass('overflow-hidden');
    });
  });

  /**
   * Test Group: Props and className
   */
  describe('Props and className', () => {
    it('applies custom className', () => {
      render(<Avatar fallback="T" className="custom-class" />);
      const avatar = screen.getByText('T').parentElement;
      expect(avatar).toHaveClass('custom-class');
    });

    it('forwards additional HTML attributes', () => {
      render(
        <Avatar
          fallback="T"
          data-testid="avatar-test"
          aria-label="user-avatar"
        />,
      );
      const avatar = screen.getByTestId('avatar-test');
      expect(avatar).toHaveAttribute('aria-label', 'user-avatar');
    });

    it('merges custom className with default classes', () => {
      render(<Avatar fallback="T" className="border-2" />);
      const avatar = screen.getByText('T').parentElement;

      expect(avatar).toHaveClass('border-2');
      expect(avatar).toHaveClass('rounded-full');
      expect(avatar).toHaveClass('w-10');
    });
  });

  /**
   * Test Group: Accessibility
   */
  describe('Accessibility', () => {
    it('provides proper alt text for images', () => {
      render(<Avatar src="/test.jpg" alt="John Doe" />);
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', 'John Doe');
    });

    it('fallback text is readable by screen readers', () => {
      render(<Avatar fallback="JD" />);
      const fallback = screen.getByText('JD');
      expect(fallback).toBeInTheDocument();
      expect(fallback).not.toHaveAttribute('aria-hidden');
    });
  });

  /**
   * Test Group: Edge Cases
   */
  describe('Edge Cases', () => {
    it('handles empty string src', () => {
      render(<Avatar src="" fallback="E" />);
      const fallback = screen.getByText('E');
      expect(fallback).toBeInTheDocument();
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('handles empty string fallback', () => {
      render(<Avatar fallback="" />);
      const fallback = screen.getByText('?');
      expect(fallback).toBeInTheDocument();
    });

    it('handles whitespace-only fallback', () => {
      render(<Avatar fallback="   " />);
      const fallback = screen.getByText((_content, element) => {
        return element?.tagName === 'SPAN' && element.textContent === '   ';
      });
      expect(fallback).toBeInTheDocument();
    });
  });
});
