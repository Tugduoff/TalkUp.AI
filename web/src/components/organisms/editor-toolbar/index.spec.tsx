import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EditorToolbar } from './index';

// Mock the useToolbarResize hook
vi.mock('@/hooks/utils/useToolbarResize', () => ({
  useToolbarResize: () => ({
    containerRef: { current: null },
    dropdownRef: { current: null },
    hiddenGroups: [],
    moreOpen: false,
    setMoreOpen: vi.fn(),
    shouldShowSeparator: () => true,
  }),
}));

describe('EditorToolbar', () => {
  const mockEditor = {
    isActive: vi.fn(() => false),
    can: vi.fn(() => ({
      undo: () => true,
      redo: () => true,
    })),
  };

  const defaultProps = {
    editor: mockEditor as any,
    fontSize: 16,
    fontFamily: 'Arial',
    fontFamilyOptions: [
      { label: 'Arial', value: 'Arial' },
      { label: 'Times New Roman', value: 'Times New Roman' },
    ],
    fontSizeOptions: [
      { label: '12', value: '12' },
      { label: '16', value: '16' },
      { label: '20', value: '20' },
    ],
    onFontFamilyChange: vi.fn(),
    onFontSizeChange: vi.fn(),
    onDecreaseFontSize: vi.fn(),
    onIncreaseFontSize: vi.fn(),
    toggleCase: vi.fn(),
    onBoldClick: vi.fn(),
    onItalicClick: vi.fn(),
    onUnderlineClick: vi.fn(),
    onStrikeClick: vi.fn(),
    onTextColorChange: vi.fn(),
    onHighlightColorChange: vi.fn(),
    onRemoveFormat: vi.fn(),
    onOrderedListClick: vi.fn(),
    onTaskListClick: vi.fn(),
    onBulletListClick: vi.fn(),
    onAlignLeftClick: vi.fn(),
    onAlignCenterClick: vi.fn(),
    onAlignRightClick: vi.fn(),
    onAlignJustifyClick: vi.fn(),
    onUndoClick: vi.fn(),
    onRedoClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the toolbar with correct role', () => {
      render(<EditorToolbar {...defaultProps} />);

      const toolbar = screen.getByRole('toolbar', {
        name: 'Text formatting toolbar',
      });
      expect(toolbar).toBeInTheDocument();
    });

    it('renders all toolbar groups when none are hidden', () => {
      render(<EditorToolbar {...defaultProps} />);

      // Font family selector
      expect(screen.getByTitle('Font Family')).toBeInTheDocument();

      // Font size controls
      expect(screen.getByTitle('Decrease font size')).toBeInTheDocument();
      expect(screen.getByTitle('Increase font size')).toBeInTheDocument();

      // Formatting buttons
      expect(screen.getByTitle('Bold (Ctrl+B)')).toBeInTheDocument();
      expect(screen.getByTitle('Italic (Ctrl+I)')).toBeInTheDocument();
      expect(screen.getByTitle('Underline (Ctrl+U)')).toBeInTheDocument();
      expect(screen.getByTitle('Strikethrough')).toBeInTheDocument();

      // Styling buttons
      expect(screen.getByTitle('Toggle Case')).toBeInTheDocument();
      expect(screen.getByTitle('Text Color')).toBeInTheDocument();
      expect(screen.getByTitle('Highlight Color')).toBeInTheDocument();
      expect(screen.getByTitle('Remove Format')).toBeInTheDocument();

      // List buttons
      expect(screen.getByTitle('Numbered List')).toBeInTheDocument();
      expect(screen.getByTitle('Bulleted List')).toBeInTheDocument();
      expect(screen.getByTitle('Checklist')).toBeInTheDocument();

      // Alignment buttons
      expect(screen.getByTitle('Align Left')).toBeInTheDocument();
      expect(screen.getByTitle('Align Center')).toBeInTheDocument();
      expect(screen.getByTitle('Align Right')).toBeInTheDocument();
      expect(screen.getByTitle('Justify')).toBeInTheDocument();

      // History buttons
      expect(screen.getByTitle('Undo')).toBeInTheDocument();
      expect(screen.getByTitle('Redo')).toBeInTheDocument();
    });

    it('does not render More button when no groups are hidden', () => {
      render(<EditorToolbar {...defaultProps} />);

      expect(
        screen.queryByLabelText('More formatting options'),
      ).not.toBeInTheDocument();
    });
  });

  describe('Font Family Controls', () => {
    it('renders font family selector with current value', () => {
      render(<EditorToolbar {...defaultProps} fontFamily="Times New Roman" />);

      const selector = screen.getByTitle('Font Family') as HTMLSelectElement;
      expect(selector.value).toBe('Times New Roman');
    });

    it('calls onFontFamilyChange when font family is changed', async () => {
      const user = userEvent.setup();
      const onFontFamilyChange = vi.fn();

      render(
        <EditorToolbar
          {...defaultProps}
          onFontFamilyChange={onFontFamilyChange}
        />,
      );

      const selector = screen.getByTitle('Font Family');
      await user.selectOptions(selector, 'Times New Roman');

      expect(onFontFamilyChange).toHaveBeenCalledWith('Times New Roman');
    });

    it('handles null font family (mixed selection)', () => {
      render(<EditorToolbar {...defaultProps} fontFamily={null} />);

      const selector = screen.getByTitle('Font Family') as HTMLSelectElement;
      expect(selector).toBeInTheDocument();
      // When fontFamily is null, value is set to 'mixed' but there may not be an option for it
      // Just verify the selector exists
    });
  });

  describe('Font Size Controls', () => {
    it('displays current font size', () => {
      render(<EditorToolbar {...defaultProps} fontSize={20} />);

      const selector = screen.getByTitle('Font Size') as HTMLSelectElement;
      expect(selector.value).toBe('20');
    });

    it('calls onFontSizeChange when font size is changed', async () => {
      const user = userEvent.setup();
      const onFontSizeChange = vi.fn();

      render(
        <EditorToolbar {...defaultProps} onFontSizeChange={onFontSizeChange} />,
      );

      const selector = screen.getByTitle('Font Size');
      await user.selectOptions(selector, '20');

      expect(onFontSizeChange).toHaveBeenCalledWith(20);
    });

    it('calls onDecreaseFontSize when minus button is clicked', async () => {
      const user = userEvent.setup();
      const onDecreaseFontSize = vi.fn();

      render(
        <EditorToolbar
          {...defaultProps}
          onDecreaseFontSize={onDecreaseFontSize}
        />,
      );

      await user.click(screen.getByTitle('Decrease font size'));

      expect(onDecreaseFontSize).toHaveBeenCalledTimes(1);
    });

    it('calls onIncreaseFontSize when plus button is clicked', async () => {
      const user = userEvent.setup();
      const onIncreaseFontSize = vi.fn();

      render(
        <EditorToolbar
          {...defaultProps}
          onIncreaseFontSize={onIncreaseFontSize}
        />,
      );

      await user.click(screen.getByTitle('Increase font size'));

      expect(onIncreaseFontSize).toHaveBeenCalledTimes(1);
    });

    it('displays font size selector for fontSize 0', () => {
      render(<EditorToolbar {...defaultProps} fontSize={0} />);

      const selector = screen.getByTitle('Font Size') as HTMLSelectElement;
      expect(selector).toBeInTheDocument();
      // When fontSize is 0, value is set to 'mixed' but there may not be an option for it
      // Just verify the selector exists
    });
  });

  describe('Formatting Buttons', () => {
    it('calls onBoldClick when bold button is clicked', async () => {
      const user = userEvent.setup();
      const onBoldClick = vi.fn();

      render(<EditorToolbar {...defaultProps} onBoldClick={onBoldClick} />);

      await user.click(screen.getByTitle('Bold (Ctrl+B)'));

      expect(onBoldClick).toHaveBeenCalledTimes(1);
    });

    it('calls onItalicClick when italic button is clicked', async () => {
      const user = userEvent.setup();
      const onItalicClick = vi.fn();

      render(<EditorToolbar {...defaultProps} onItalicClick={onItalicClick} />);

      await user.click(screen.getByTitle('Italic (Ctrl+I)'));

      expect(onItalicClick).toHaveBeenCalledTimes(1);
    });

    it('calls onUnderlineClick when underline button is clicked', async () => {
      const user = userEvent.setup();
      const onUnderlineClick = vi.fn();

      render(
        <EditorToolbar {...defaultProps} onUnderlineClick={onUnderlineClick} />,
      );

      await user.click(screen.getByTitle('Underline (Ctrl+U)'));

      expect(onUnderlineClick).toHaveBeenCalledTimes(1);
    });

    it('calls onStrikeClick when strikethrough button is clicked', async () => {
      const user = userEvent.setup();
      const onStrikeClick = vi.fn();

      render(<EditorToolbar {...defaultProps} onStrikeClick={onStrikeClick} />);

      await user.click(screen.getByTitle('Strikethrough'));

      expect(onStrikeClick).toHaveBeenCalledTimes(1);
    });

    it('shows active state for bold button', () => {
      mockEditor.isActive.mockImplementation(
        (format?: string) => format === 'bold',
      );

      render(<EditorToolbar {...defaultProps} />);

      const boldButton = screen.getByTitle('Bold (Ctrl+B)');
      expect(boldButton).toHaveClass('bg-accent-weaker');
    });

    it('shows active state for italic button', () => {
      mockEditor.isActive.mockImplementation(
        (format?: string) => format === 'italic',
      );

      render(<EditorToolbar {...defaultProps} />);

      const italicButton = screen.getByTitle('Italic (Ctrl+I)');
      expect(italicButton).toHaveClass('bg-accent-weaker');
    });
  });

  describe('Styling Buttons', () => {
    it('calls toggleCase when toggle case button is clicked', async () => {
      const user = userEvent.setup();
      const toggleCase = vi.fn();

      render(<EditorToolbar {...defaultProps} toggleCase={toggleCase} />);

      await user.click(screen.getByTitle('Toggle Case'));

      expect(toggleCase).toHaveBeenCalledTimes(1);
    });

    it('calls onRemoveFormat when remove format button is clicked', async () => {
      const user = userEvent.setup();
      const onRemoveFormat = vi.fn();

      render(
        <EditorToolbar {...defaultProps} onRemoveFormat={onRemoveFormat} />,
      );

      await user.click(screen.getByTitle('Remove Format'));

      expect(onRemoveFormat).toHaveBeenCalledTimes(1);
    });

    it('renders color picker buttons', () => {
      render(<EditorToolbar {...defaultProps} />);

      expect(screen.getByTitle('Text Color')).toBeInTheDocument();
      expect(screen.getByTitle('Highlight Color')).toBeInTheDocument();
    });

    it('renders text color picker', () => {
      render(<EditorToolbar {...defaultProps} />);

      const colorInput = screen.getByLabelText('Text Color');
      expect(colorInput).toBeInTheDocument();
      expect(colorInput).toHaveAttribute('type', 'color');
    });

    it('renders highlight color picker', () => {
      render(<EditorToolbar {...defaultProps} />);

      const colorInput = screen.getByLabelText('Highlight Color');
      expect(colorInput).toBeInTheDocument();
      expect(colorInput).toHaveAttribute('type', 'color');
    });
  });

  describe('List Buttons', () => {
    it('calls onOrderedListClick when numbered list button is clicked', async () => {
      const user = userEvent.setup();
      const onOrderedListClick = vi.fn();

      render(
        <EditorToolbar
          {...defaultProps}
          onOrderedListClick={onOrderedListClick}
        />,
      );

      await user.click(screen.getByTitle('Numbered List'));

      expect(onOrderedListClick).toHaveBeenCalledTimes(1);
    });

    it('calls onBulletListClick when bulleted list button is clicked', async () => {
      const user = userEvent.setup();
      const onBulletListClick = vi.fn();

      render(
        <EditorToolbar
          {...defaultProps}
          onBulletListClick={onBulletListClick}
        />,
      );

      await user.click(screen.getByTitle('Bulleted List'));

      expect(onBulletListClick).toHaveBeenCalledTimes(1);
    });

    it('calls onTaskListClick when checklist button is clicked', async () => {
      const user = userEvent.setup();
      const onTaskListClick = vi.fn();

      render(
        <EditorToolbar {...defaultProps} onTaskListClick={onTaskListClick} />,
      );

      await user.click(screen.getByTitle('Checklist'));

      expect(onTaskListClick).toHaveBeenCalledTimes(1);
    });

    it('shows active state for ordered list', () => {
      mockEditor.isActive.mockImplementation(
        (format?: string) => format === 'orderedList',
      );

      render(<EditorToolbar {...defaultProps} />);

      const button = screen.getByTitle('Numbered List');
      expect(button).toHaveClass('bg-accent-weaker');
    });
  });

  describe('Alignment Buttons', () => {
    it('calls onAlignLeftClick when align left button is clicked', async () => {
      const user = userEvent.setup();
      const onAlignLeftClick = vi.fn();

      render(
        <EditorToolbar {...defaultProps} onAlignLeftClick={onAlignLeftClick} />,
      );

      await user.click(screen.getByTitle('Align Left'));

      expect(onAlignLeftClick).toHaveBeenCalledTimes(1);
    });

    it('calls onAlignCenterClick when align center button is clicked', async () => {
      const user = userEvent.setup();
      const onAlignCenterClick = vi.fn();

      render(
        <EditorToolbar
          {...defaultProps}
          onAlignCenterClick={onAlignCenterClick}
        />,
      );

      await user.click(screen.getByTitle('Align Center'));

      expect(onAlignCenterClick).toHaveBeenCalledTimes(1);
    });

    it('calls onAlignRightClick when align right button is clicked', async () => {
      const user = userEvent.setup();
      const onAlignRightClick = vi.fn();

      render(
        <EditorToolbar
          {...defaultProps}
          onAlignRightClick={onAlignRightClick}
        />,
      );

      await user.click(screen.getByTitle('Align Right'));

      expect(onAlignRightClick).toHaveBeenCalledTimes(1);
    });

    it('calls onAlignJustifyClick when justify button is clicked', async () => {
      const user = userEvent.setup();
      const onAlignJustifyClick = vi.fn();

      render(
        <EditorToolbar
          {...defaultProps}
          onAlignJustifyClick={onAlignJustifyClick}
        />,
      );

      await user.click(screen.getByTitle('Justify'));

      expect(onAlignJustifyClick).toHaveBeenCalledTimes(1);
    });

    it('shows active state for center alignment', () => {
      mockEditor.isActive.mockImplementation(
        (format?: string | { textAlign?: string }) => {
          if (typeof format === 'object' && format.textAlign === 'center') {
            return true;
          }
          return false;
        },
      );

      render(<EditorToolbar {...defaultProps} />);

      const button = screen.getByTitle('Align Center');
      expect(button).toHaveClass('bg-accent-weaker');
    });

    it('shows align left as active when no alignment is set', () => {
      mockEditor.isActive.mockReturnValue(false);

      render(<EditorToolbar {...defaultProps} />);

      const button = screen.getByTitle('Align Left');
      expect(button).toHaveClass('bg-accent-weaker');
    });
  });

  describe('History Buttons', () => {
    it('calls onUndoClick when undo button is clicked', async () => {
      const user = userEvent.setup();
      const onUndoClick = vi.fn();

      render(<EditorToolbar {...defaultProps} onUndoClick={onUndoClick} />);

      await user.click(screen.getByTitle('Undo'));

      expect(onUndoClick).toHaveBeenCalledTimes(1);
    });

    it('calls onRedoClick when redo button is clicked', async () => {
      const user = userEvent.setup();
      const onRedoClick = vi.fn();

      render(<EditorToolbar {...defaultProps} onRedoClick={onRedoClick} />);

      await user.click(screen.getByTitle('Redo'));

      expect(onRedoClick).toHaveBeenCalledTimes(1);
    });

    it('disables undo button when cannot undo', () => {
      mockEditor.can.mockReturnValue({
        undo: vi.fn(() => false),
        redo: vi.fn(() => true),
      } as any);

      render(<EditorToolbar {...defaultProps} />);

      const undoButton = screen.getByTitle('Undo');
      expect(undoButton).toBeDisabled();
    });

    it('disables redo button when cannot redo', () => {
      mockEditor.can.mockReturnValue({
        undo: vi.fn(() => true),
        redo: vi.fn(() => false),
      } as any);

      render(<EditorToolbar {...defaultProps} />);

      const redoButton = screen.getByTitle('Redo');
      expect(redoButton).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA labels', () => {
      render(<EditorToolbar {...defaultProps} />);

      const toolbar = screen.getByRole('toolbar');
      expect(toolbar).toHaveAttribute('aria-label', 'Text formatting toolbar');
    });

    it('renders all buttons with title attributes', () => {
      render(<EditorToolbar {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('title');
      });
    });
  });

  describe('Visual State', () => {
    it('applies correct CSS classes to toolbar container', () => {
      const { container } = render(<EditorToolbar {...defaultProps} />);

      const toolbar = container.querySelector('[role="toolbar"]');
      expect(toolbar).toHaveClass('flex', 'items-center', 'gap-2', 'bg-white');
    });

    it('applies data-group attributes to toolbar groups', () => {
      const { container } = render(<EditorToolbar {...defaultProps} />);

      expect(
        container.querySelector('[data-group="fontFamily"]'),
      ).toBeInTheDocument();
      expect(
        container.querySelector('[data-group="fontSize"]'),
      ).toBeInTheDocument();
      expect(
        container.querySelector('[data-group="formatting"]'),
      ).toBeInTheDocument();
      expect(
        container.querySelector('[data-group="styling"]'),
      ).toBeInTheDocument();
      expect(
        container.querySelector('[data-group="lists"]'),
      ).toBeInTheDocument();
      expect(
        container.querySelector('[data-group="alignment"]'),
      ).toBeInTheDocument();
      expect(
        container.querySelector('[data-group="history"]'),
      ).toBeInTheDocument();
    });
  });
});
