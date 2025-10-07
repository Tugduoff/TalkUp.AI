import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';

import { ActivityBubble } from './index';

/**
 * Test suite for the ActivityBubble component.
 * Ensures correct rendering, props handling, class application, and accessibility.
 */
describe('ActivityBubble', () => {
  /**
   * Test Group: Basic Rendering
   */
  describe('Basic Rendering', () => {
    it('renders with required status prop', () => {
      render(<ActivityBubble status="online" />);
      const bubble = screen.getByTitle('Status: online');
      expect(bubble).toBeInTheDocument();
    });

    it('forwards ref to div element', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<ActivityBubble status="offline" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  /**
   * Test Group: Status Variants
   */
  describe('Status Variants', () => {
    const statusClassMap = {
      online: 'bg-success',
      offline: 'bg-neutral',
      away: 'bg-warning',
      busy: 'bg-error',
    } as const;

    (['online', 'offline', 'away', 'busy'] as const).forEach((status) => {
      it(`applies correct class for status: ${status}`, () => {
        render(<ActivityBubble status={status} />);
        const bubble = screen.getByTitle(`Status: ${status}`);
        expect(bubble).toHaveClass(statusClassMap[status]);
      });
    });
  });

  /**
   * Test Group: Size Variants
   */
  describe('Size Variants', () => {
    const sizeClassMap = {
      sm: ['w-2.5', 'h-2.5'],
      md: ['w-3', 'h-3'],
      lg: ['w-4', 'h-4'],
    } as const;

    (['sm', 'md', 'lg'] as const).forEach((size) => {
      it(`applies correct class for size: ${size}`, () => {
        render(<ActivityBubble status="online" size={size} />);
        const bubble = screen.getByTitle('Status: online');
        sizeClassMap[size].forEach((className) => {
          expect(bubble).toHaveClass(className);
        });
      });
    });

    it('defaults to md size if not provided', () => {
      render(<ActivityBubble status="online" />);
      const bubble = screen.getByTitle('Status: online');
      expect(bubble).toHaveClass('w-3');
      expect(bubble).toHaveClass('h-3');
    });
  });

  /**
   * Test Group: className and props forwarding
   */
  describe('Props and className', () => {
    it('applies custom className', () => {
      render(<ActivityBubble status="online" className="custom-class" />);
      const bubble = screen.getByTitle('Status: online');
      expect(bubble).toHaveClass('custom-class');
    });

    it('forwards additional HTML attributes', () => {
      render(
        <ActivityBubble
          status="online"
          data-testid="bubble-test"
          aria-label="activity-bubble"
        />,
      );
      const bubble = screen.getByTestId('bubble-test');
      expect(bubble).toHaveAttribute('aria-label', 'activity-bubble');
    });
  });

  /**
   * Test Group: Accessibility
   */
  describe('Accessibility', () => {
    it('sets the title attribute for status', () => {
      render(<ActivityBubble status="busy" />);
      const bubble = screen.getByTitle('Status: busy');
      expect(bubble).toBeInTheDocument();
    });
  });
});
