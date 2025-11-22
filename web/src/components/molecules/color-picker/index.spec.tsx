import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ColorPicker } from './index';

describe('ColorPicker', () => {
  const mockOnColorSelect = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders nothing when isOpen is false', () => {
      const { container } = render(
        <ColorPicker
          currentColor="blue"
          onColorSelect={mockOnColorSelect}
          onClose={mockOnClose}
          isOpen={false}
        />,
      );

      expect(container).toBeEmptyDOMElement();
    });

    it('renders the color picker when isOpen is true', () => {
      render(
        <ColorPicker
          currentColor="blue"
          onColorSelect={mockOnColorSelect}
          onClose={mockOnClose}
          isOpen={true}
        />,
      );

      expect(screen.getByText('Select color')).toBeInTheDocument();
    });

    it('renders all available color options', () => {
      render(
        <ColorPicker
          currentColor="blue"
          onColorSelect={mockOnColorSelect}
          onClose={mockOnClose}
          isOpen={true}
        />,
      );

      const colorButtons = screen.getAllByRole('button');
      expect(colorButtons).toHaveLength(4); // blue, green, red, yellow

      expect(
        screen.getByRole('button', { name: /select blue/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /select green/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /select red/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /select yellow/i }),
      ).toBeInTheDocument();
    });

    it('highlights the current color', () => {
      render(
        <ColorPicker
          currentColor="red"
          onColorSelect={mockOnColorSelect}
          onClose={mockOnClose}
          isOpen={true}
        />,
      );

      const redButton = screen.getByRole('button', { name: /select red/i });
      expect(redButton).toHaveClass('ring-2', 'ring-accent');
    });

    it('does not highlight non-selected colors', () => {
      render(
        <ColorPicker
          currentColor="blue"
          onColorSelect={mockOnColorSelect}
          onClose={mockOnClose}
          isOpen={true}
        />,
      );

      const greenButton = screen.getByRole('button', { name: /select green/i });
      expect(greenButton).not.toHaveClass('ring-2', 'ring-accent');
    });
  });

  describe('Color Selection', () => {
    it('calls onColorSelect when a color is clicked', async () => {
      const user = userEvent.setup();

      render(
        <ColorPicker
          currentColor="blue"
          onColorSelect={mockOnColorSelect}
          onClose={mockOnClose}
          isOpen={true}
        />,
      );

      const greenButton = screen.getByRole('button', { name: /select green/i });
      await user.click(greenButton);

      expect(mockOnColorSelect).toHaveBeenCalledWith('green');
      expect(mockOnColorSelect).toHaveBeenCalledTimes(1);
    });

    it('allows selecting different colors', async () => {
      const user = userEvent.setup();

      render(
        <ColorPicker
          currentColor="blue"
          onColorSelect={mockOnColorSelect}
          onClose={mockOnClose}
          isOpen={true}
        />,
      );

      await user.click(screen.getByRole('button', { name: /select red/i }));
      expect(mockOnColorSelect).toHaveBeenCalledWith('red');

      await user.click(screen.getByRole('button', { name: /select yellow/i }));
      expect(mockOnColorSelect).toHaveBeenCalledWith('yellow');

      expect(mockOnColorSelect).toHaveBeenCalledTimes(2);
    });

    it('allows re-selecting the current color', async () => {
      const user = userEvent.setup();

      render(
        <ColorPicker
          currentColor="blue"
          onColorSelect={mockOnColorSelect}
          onClose={mockOnClose}
          isOpen={true}
        />,
      );

      const blueButton = screen.getByRole('button', { name: /select blue/i });
      await user.click(blueButton);

      expect(mockOnColorSelect).toHaveBeenCalledWith('blue');
    });
  });

  describe('Keyboard Interactions', () => {
    it('calls onClose when Escape key is pressed', async () => {
      const user = userEvent.setup();

      render(
        <ColorPicker
          currentColor="blue"
          onColorSelect={mockOnColorSelect}
          onClose={mockOnClose}
          isOpen={true}
        />,
      );

      await user.keyboard('{Escape}');

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose for other keys', async () => {
      const user = userEvent.setup();

      render(
        <ColorPicker
          currentColor="blue"
          onColorSelect={mockOnColorSelect}
          onClose={mockOnClose}
          isOpen={true}
        />,
      );

      await user.keyboard('{Enter}');
      await user.keyboard('a');
      await user.keyboard('{Space}');

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Click Outside Behavior', () => {
    it('calls onClose when clicking outside the picker', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <div data-testid="outside">Outside</div>
          <ColorPicker
            currentColor="blue"
            onColorSelect={mockOnColorSelect}
            onClose={mockOnClose}
            isOpen={true}
          />
        </div>,
      );

      const outsideElement = screen.getByTestId('outside');
      await user.click(outsideElement);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when clicking inside the picker', async () => {
      const user = userEvent.setup();

      render(
        <ColorPicker
          currentColor="blue"
          onColorSelect={mockOnColorSelect}
          onClose={mockOnClose}
          isOpen={true}
        />,
      );

      const labelText = screen.getByText('Select color');
      await user.click(labelText);

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Event Listener Cleanup', () => {
    it('removes event listeners when component unmounts', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      const { unmount } = render(
        <ColorPicker
          currentColor="blue"
          onColorSelect={mockOnColorSelect}
          onClose={mockOnClose}
          isOpen={true}
        />,
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'mousedown',
        expect.any(Function),
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function),
      );

      removeEventListenerSpy.mockRestore();
    });

    it('removes and re-adds event listeners when isOpen changes', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      const { rerender } = render(
        <ColorPicker
          currentColor="blue"
          onColorSelect={mockOnColorSelect}
          onClose={mockOnClose}
          isOpen={false}
        />,
      );

      // Initially closed, no listeners added
      expect(addEventListenerSpy).not.toHaveBeenCalled();

      // Open the picker
      rerender(
        <ColorPicker
          currentColor="blue"
          onColorSelect={mockOnColorSelect}
          onClose={mockOnClose}
          isOpen={true}
        />,
      );

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'mousedown',
        expect.any(Function),
      );
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function),
      );

      // Close the picker
      rerender(
        <ColorPicker
          currentColor="blue"
          onColorSelect={mockOnColorSelect}
          onClose={mockOnClose}
          isOpen={false}
        />,
      );

      expect(removeEventListenerSpy).toHaveBeenCalled();

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
  });

  describe('Visual State', () => {
    it('applies correct CSS classes for positioning', () => {
      const { container } = render(
        <ColorPicker
          currentColor="blue"
          onColorSelect={mockOnColorSelect}
          onClose={mockOnClose}
          isOpen={true}
        />,
      );

      const picker = container.querySelector('div[class*="absolute"]');
      expect(picker).toHaveClass('absolute', 'top-full', 'left-0', 'mt-2');
    });

    it('applies animation class', () => {
      const { container } = render(
        <ColorPicker
          currentColor="blue"
          onColorSelect={mockOnColorSelect}
          onClose={mockOnClose}
          isOpen={true}
        />,
      );

      const picker = container.querySelector('div[class*="animate-fadeIn"]');
      expect(picker).toBeInTheDocument();
    });
  });
});
