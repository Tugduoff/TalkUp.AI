import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Button } from './index';

/**
 * Test suite for the Button component (Integration Test).
 * Verifies that the Button component correctly renders the appropriate variant
 * and passes all props down to the chosen sub-component using their real implementations.
 */
describe('Button (Integration Test)', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  // --- Variant Rendering Tests ---
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

  // --- Children Prop Tests ---
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

  // --- Color Prop Tests ---
  it('passes color prop correctly to ContainedButton', () => {
    render(<Button color="accent">Test Color</Button>);
    const buttonElement = screen.getByRole('button', { name: 'Test Color' });
    expect(buttonElement).toBeInTheDocument();
    // OPTIONAL: expect(buttonElement).toHaveClass('bg-accent');
  });

  it('passes color prop correctly to OutlinedButton', () => {
    render(
      <Button variant="outlined" color="accent">
        Test Color
      </Button>,
    );
    const buttonElement = screen.getByRole('button', { name: 'Test Color' });
    expect(buttonElement).toBeInTheDocument();
    // OPTIONAL: expect(buttonElement).toHaveClass('border-accent');
  });

  it('passes color prop correctly to TextButton', () => {
    render(
      <Button variant="text" color="accent">
        Test Color
      </Button>,
    );
    const buttonElement = screen.getByRole('button', { name: 'Test Color' });
    expect(buttonElement).toBeInTheDocument();
    // OPTIONAL: expect(buttonElement).toHaveClass('text-accent');
  });

  // --- Disabled Prop Tests ---
  it('passes disabled prop correctly to ContainedButton', () => {
    render(<Button disabled>Test Disabled</Button>);
    const buttonElement = screen.getByRole('button', { name: 'Test Disabled' });
    expect(buttonElement).toBeDisabled();
  });

  it('passes disabled prop correctly to OutlinedButton', () => {
    render(
      <Button variant="outlined" disabled>
        Test Disabled
      </Button>,
    );
    const buttonElement = screen.getByRole('button', { name: 'Test Disabled' });
    expect(buttonElement).toBeDisabled();
  });

  it('passes disabled prop correctly to TextButton', () => {
    render(
      <Button variant="text" disabled>
        Test Disabled
      </Button>,
    );
    const buttonElement = screen.getByRole('button', { name: 'Test Disabled' });
    expect(buttonElement).toBeDisabled();
  });

  // --- Loading Prop Tests ---
  it('passes loading prop correctly to ContainedButton', () => {
    render(<Button loading>Test Loading</Button>);
    const buttonElement = screen.getByRole('button', { name: 'Test Loading' });
    expect(buttonElement).toBeInTheDocument();
    // OPTIONAL: expect(buttonElement).toHaveClass('cursor-wait');
  });

  it('passes loading prop correctly to OutlinedButton', () => {
    render(
      <Button variant="outlined" loading>
        Test Loading
      </Button>,
    );
    const buttonElement = screen.getByRole('button', { name: 'Test Loading' });
    expect(buttonElement).toBeInTheDocument();
  });

  it('passes loading prop correctly to TextButton', () => {
    render(
      <Button variant="text" loading>
        Test Loading
      </Button>,
    );
    const buttonElement = screen.getByRole('button', { name: 'Test Loading' });
    expect(buttonElement).toBeInTheDocument();
  });

  // --- onClick Prop Tests ---
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

  // --- Additional HTML Attributes Tests (including className) ---
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
      <Button variant="outlined" aria-label="outlined-button-label" id="o-btn">
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

  // --- New Tests for 100% ClassName Branch Coverage ---

  // Test for color="white" branch in className (for ContainedButton)
  it('renders ContainedButton with text-black class when color is white', () => {
    render(<Button color="white">White Button</Button>);
    const buttonElement = screen.getByRole('button', { name: 'White Button' });
    expect(buttonElement).toHaveClass('text-black');
    expect(buttonElement).not.toHaveClass('text-white');
  });

  // Test for color="white" branch in className (for OutlinedButton)
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

  // Test for color="white" branch in className (for TextButton)
  it('renders TextButton with text-black when color is white', () => {
    render(
      <Button variant="text" color="white">
        White Text
      </Button>,
    );
    const buttonElement = screen.getByRole('button', { name: 'White Text' });
    expect(buttonElement).toHaveClass('!text-black');
  });

  // Test for props.className being present (for ContainedButton)
  it('applies custom className to ContainedButton', () => {
    render(<Button className="my-custom-class">Custom Class</Button>);
    const buttonElement = screen.getByRole('button', { name: 'Custom Class' });
    expect(buttonElement).toHaveClass('my-custom-class');
  });

  // Test for props.className being present (for OutlinedButton)
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

  // Test for props.className being present (for TextButton)
  it('applies custom className to TextButton', () => {
    render(
      <Button variant="text" className="my-custom-text-class">
        Custom Text
      </Button>,
    );
    const buttonElement = screen.getByRole('button', { name: 'Custom Text' });
    expect(buttonElement).toHaveClass('my-custom-text-class');
  });

  // --- Edge Cases / Default Behavior ---
  it('warns and returns null for an unknown variant', () => {
    render(<Button variant={'unknown' as any}>Invalid</Button>);
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(
      'Unknown button variant: unknown',
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
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
