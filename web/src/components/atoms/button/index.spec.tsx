import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Button } from './index';
import { ButtonVariant } from './types';

/**
 * Test suite for the Button component (Integration Test).
 * Verifies that the Button component correctly renders the appropriate variant
 * and passes all props down to the chosen sub-component using their real implementations.
 */
describe('Button (Integration Test)', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  /**
   * Test Group: Variant Rendering
   * Ensures the Button component renders the correct underlying button variant based on the 'variant' prop.
   */
  describe('Variant Rendering', () => {
    it('renders ContainedButton by default', () => {
      render(<Button>Click Me</Button>);
      const buttonElement = screen.getByRole('button', { name: 'Click Me' });
      expect(buttonElement).toBeInTheDocument();
    });

    it('renders OutlinedButton when variant is "outlined"', () => {
      render(<Button variant="outlined">Click Me</Button>);
      const buttonElement = screen.getByRole('button', { name: 'Click Me' });
      expect(buttonElement).toBeInTheDocument();
    });

    it('renders TextButton when variant is "text"', () => {
      render(<Button variant="text">Click Me</Button>);
      const buttonElement = screen.getByRole('button', { name: 'Click Me' });
      expect(buttonElement).toBeInTheDocument();
    });
  });

  /**
   * Test Group: Children Prop Handling
   * Verifies that the button correctly displays its children (text content) for all variants.
   */
  describe('Children Prop Handling', () => {
    it('passes children correctly to ContainedButton', () => {
      const buttonText = 'Submit Form';
      render(<Button>{buttonText}</Button>);
      expect(screen.getByText(buttonText)).toBeInTheDocument();
    });

    it('passes children correctly to OutlinedButton', () => {
      const buttonText = 'View Details';
      render(<Button variant="outlined">{buttonText}</Button>);
      expect(screen.getByText(buttonText)).toBeInTheDocument();
    });

    it('passes children correctly to TextButton', () => {
      const buttonText = 'Learn More';
      render(<Button variant="text">{buttonText}</Button>);
      expect(screen.getByText(buttonText)).toBeInTheDocument();
    });
  });

  /**
   * Test Group: Color Prop Application
   * Checks if the 'color' prop is correctly applied to the different button variants.
   */
  describe('Color Prop Application', () => {
    it('passes color prop correctly to ContainedButton', () => {
      render(<Button color="accent">Test Color</Button>);
      const buttonElement = screen.getByRole('button', { name: 'Test Color' });
      expect(buttonElement).toBeInTheDocument();
    });

    it('passes color prop correctly to OutlinedButton', () => {
      render(
        <Button variant="outlined" color="accent">
          Test Color
        </Button>,
      );
      const buttonElement = screen.getByRole('button', { name: 'Test Color' });
      expect(buttonElement).toBeInTheDocument();
    });

    it('passes color prop correctly to TextButton', () => {
      render(
        <Button variant="text" color="accent">
          Test Color
        </Button>,
      );
      const buttonElement = screen.getByRole('button', { name: 'Test Color' });
      expect(buttonElement).toBeInTheDocument();
    });

    /**
     * Test Group: 'white' Color Specific Styling
     * Verifies the specific styling applied when the 'color' prop is set to 'white'.
     */
    describe("'white' Color Specific Styling", () => {
      it('renders ContainedButton with text-black class when color is white', () => {
        render(<Button color="white">White Button</Button>);
        const buttonElement = screen.getByRole('button', {
          name: 'White Button',
        });
        expect(buttonElement).toHaveClass('text-black');
        expect(buttonElement).not.toHaveClass('text-white');
      });

      it('renders OutlinedButton with text-black and border-black when color is white', () => {
        render(
          <Button variant="outlined" color="white">
            White Outlined
          </Button>,
        );
        const buttonElement = screen.getByRole('button', {
          name: 'White Outlined',
        });
        expect(buttonElement).toHaveClass('!text-black');
        expect(buttonElement).toHaveClass('!border-black');
      });

      it('renders TextButton with text-black when color is white', () => {
        render(
          <Button variant="text" color="white">
            White Text
          </Button>,
        );
        const buttonElement = screen.getByRole('button', {
          name: 'White Text',
        });
        expect(buttonElement).toHaveClass('!text-black');
      });
    });
  });

  /**
   * Test Group: State Props Handling (disabled, loading)
   * Ensures that state-related props like 'disabled' and 'loading' are correctly passed and reflected.
   */
  describe('State Props Handling (disabled, loading)', () => {
    it('passes disabled prop correctly to ContainedButton', () => {
      render(<Button disabled>Test Disabled</Button>);
      const buttonElement = screen.getByRole('button', {
        name: 'Test Disabled',
      });
      expect(buttonElement).toBeDisabled();
    });

    it('passes disabled prop correctly to OutlinedButton', () => {
      render(
        <Button variant="outlined" disabled>
          Test Disabled
        </Button>,
      );
      const buttonElement = screen.getByRole('button', {
        name: 'Test Disabled',
      });
      expect(buttonElement).toBeDisabled();
    });

    it('passes disabled prop correctly to TextButton', () => {
      render(
        <Button variant="text" disabled>
          Test Disabled
        </Button>,
      );
      const buttonElement = screen.getByRole('button', {
        name: 'Test Disabled',
      });
      expect(buttonElement).toBeDisabled();
    });

    it('passes loading prop correctly to ContainedButton', () => {
      render(<Button loading>Test Loading</Button>);
      const buttonElement = screen.getByRole('button', {
        name: 'Test Loading',
      });
      expect(buttonElement).toBeInTheDocument();
    });

    it('passes loading prop correctly to OutlinedButton', () => {
      render(
        <Button variant="outlined" loading>
          Test Loading
        </Button>,
      );
      const buttonElement = screen.getByRole('button', {
        name: 'Test Loading',
      });
      expect(buttonElement).toBeInTheDocument();
    });

    it('passes loading prop correctly to TextButton', () => {
      render(
        <Button variant="text" loading>
          Test Loading
        </Button>,
      );
      const buttonElement = screen.getByRole('button', {
        name: 'Test Loading',
      });
      expect(buttonElement).toBeInTheDocument();
    });
  });

  /**
   * Test Group: Event Handling
   * Confirms that the 'onClick' prop is correctly passed and triggered when the button is clicked.
   */
  describe('Event Handling', () => {
    it('passes onClick prop correctly and fires it on ContainedButton click', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Test Click</Button>);
      const buttonElement = screen.getByRole('button', { name: 'Test Click' });
      fireEvent.click(buttonElement);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('passes onClick prop correctly and fires it on OutlinedButton click', () => {
      const handleClick = vi.fn();
      render(
        <Button variant="outlined" onClick={handleClick}>
          Test Click
        </Button>,
      );
      const buttonElement = screen.getByRole('button', { name: 'Test Click' });
      fireEvent.click(buttonElement);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('passes onClick prop correctly and fires it on TextButton click', () => {
      const handleClick = vi.fn();
      render(
        <Button variant="text" onClick={handleClick}>
          Test Click
        </Button>,
      );
      const buttonElement = screen.getByRole('button', { name: 'Test Click' });
      fireEvent.click(buttonElement);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not throw when onClick is not provided and button is clicked', () => {
      render(<Button>No Click Handler</Button>);
      const buttonElement = screen.getByRole('button', {
        name: 'No Click Handler',
      });
      expect(() => {
        fireEvent.click(buttonElement);
      }).not.toThrow();
    });
  });

  /**
   * Test Group: HTML Attribute and ClassName Passing
   * Verifies that additional HTML attributes and custom class names are correctly applied.
   */
  describe('HTML Attribute and ClassName Passing', () => {
    it('passes additional HTML attributes to ContainedButton', () => {
      render(
        <Button aria-label="contained-button-label" id="c-btn">
          Contained Test
        </Button>,
      );
      const buttonElement = screen.getByRole('button', {
        name: 'contained-button-label',
      });
      expect(buttonElement).toHaveAttribute(
        'aria-label',
        'contained-button-label',
      );
      expect(buttonElement).toHaveAttribute('id', 'c-btn');
    });

    it('passes additional HTML attributes to OutlinedButton', () => {
      render(
        <Button
          variant="outlined"
          aria-label="outlined-button-label"
          id="o-btn"
        >
          Outlined Test
        </Button>,
      );
      const buttonElement = screen.getByRole('button', {
        name: 'outlined-button-label',
      });
      expect(buttonElement).toHaveAttribute(
        'aria-label',
        'outlined-button-label',
      );
      expect(buttonElement).toHaveAttribute('id', 'o-btn');
    });

    it('passes additional HTML attributes to TextButton', () => {
      render(
        <Button variant="text" aria-label="text-button-label" id="t-btn">
          Text Test
        </Button>,
      );
      const buttonElement = screen.getByRole('button', {
        name: 'text-button-label',
      });
      expect(buttonElement).toHaveAttribute('aria-label', 'text-button-label');
      expect(buttonElement).toHaveAttribute('id', 't-btn');
    });

    it('applies custom className to ContainedButton', () => {
      render(<Button className="my-custom-class">Custom Class</Button>);
      const buttonElement = screen.getByRole('button', {
        name: 'Custom Class',
      });
      expect(buttonElement).toHaveClass('my-custom-class');
    });

    it('applies custom className to OutlinedButton', () => {
      render(
        <Button variant="outlined" className="my-custom-outlined-class">
          Custom Outlined
        </Button>,
      );
      const buttonElement = screen.getByRole('button', {
        name: 'Custom Outlined',
      });
      expect(buttonElement).toHaveClass('my-custom-outlined-class');
    });

    it('applies custom className to TextButton', () => {
      render(
        <Button variant="text" className="my-custom-text-class">
          Custom Text
        </Button>,
      );
      const buttonElement = screen.getByRole('button', { name: 'Custom Text' });
      expect(buttonElement).toHaveClass('my-custom-text-class');
    });
  });

  /**
   * Test Group: Error Handling
   * Verifies how the component behaves with invalid or missing props.
   */
  describe('Error Handling', () => {
    it('warns and returns null for an unknown variant', () => {
      render(<Button variant={'unknown' as ButtonVariant}>Invalid</Button>);
      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(
        'Unknown button variant: unknown',
      );
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });
});
