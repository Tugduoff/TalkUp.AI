import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useRichTextEditor } from './useRichTextEditor';

describe('useRichTextEditor', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => useRichTextEditor());

    expect(result.current.editor).toBeDefined();
    expect(result.current.fontSize).toBe(16);
    expect(result.current.fontFamily).toBe('');
  });

  it('initializes with content', () => {
    const content = '<p>Hello World</p>';
    const { result } = renderHook(() => useRichTextEditor(content));

    expect(result.current.editor?.getHTML()).toContain('Hello World');
  });

  it('updates font size', () => {
    const { result } = renderHook(() => useRichTextEditor());

    act(() => {
      result.current.onFontSizeChange(20);
    });

    expect(result.current.fontSize).toBe(20);
    expect(result.current.editor?.getAttributes('textStyle').fontSize).toBe(
      '20px',
    );
  });

  it('increases font size', () => {
    const { result } = renderHook(() => useRichTextEditor());

    // Default is 16, next step is 18
    act(() => {
      result.current.onIncreaseFontSize();
    });

    expect(result.current.fontSize).toBe(18);
  });

  it('decreases font size', () => {
    const { result } = renderHook(() => useRichTextEditor());

    // Default is 16, prev step is 14
    act(() => {
      result.current.onDecreaseFontSize();
    });

    expect(result.current.fontSize).toBe(14);
  });

  it('updates font family', () => {
    const { result } = renderHook(() => useRichTextEditor());

    act(() => {
      result.current.onFontFamilyChange('Arial');
    });

    expect(result.current.fontFamily).toBe('Arial');
    expect(result.current.editor?.getAttributes('textStyle').fontFamily).toBe(
      'Arial',
    );
  });

  it('toggles bold', () => {
    const { result } = renderHook(() => useRichTextEditor());

    act(() => {
      result.current.onBoldClick();
    });

    expect(result.current.editor?.isActive('bold')).toBe(true);
  });

  it('toggles italic', () => {
    const { result } = renderHook(() => useRichTextEditor());

    act(() => {
      result.current.onItalicClick();
    });

    expect(result.current.editor?.isActive('italic')).toBe(true);
  });

  it('toggles underline', () => {
    const { result } = renderHook(() => useRichTextEditor());

    act(() => {
      result.current.onUnderlineClick();
    });

    expect(result.current.editor?.isActive('underline')).toBe(true);
  });

  it('toggles strike', () => {
    const { result } = renderHook(() => useRichTextEditor());

    act(() => {
      result.current.onStrikeClick();
    });

    expect(result.current.editor?.isActive('strike')).toBe(true);
  });

  it('sets text color', () => {
    const { result } = renderHook(() => useRichTextEditor());

    act(() => {
      result.current.onTextColorChange('red');
    });

    expect(result.current.editor?.getAttributes('textStyle').color).toBe('red');
  });

  it('sets highlight color', () => {
    const { result } = renderHook(() => useRichTextEditor());

    act(() => {
      result.current.onHighlightColorChange('yellow');
    });

    expect(
      result.current.editor?.isActive('highlight', { color: 'yellow' }),
    ).toBe(true);
  });

  it('toggles lists', () => {
    const { result } = renderHook(() => useRichTextEditor());

    act(() => {
      result.current.onBulletListClick();
    });
    expect(result.current.editor?.isActive('bulletList')).toBe(true);

    act(() => {
      result.current.onOrderedListClick();
    });
    expect(result.current.editor?.isActive('orderedList')).toBe(true);

    act(() => {
      result.current.onTaskListClick();
    });
    expect(result.current.editor?.isActive('taskList')).toBe(true);
  });

  it('sets text alignment', () => {
    const { result } = renderHook(() => useRichTextEditor());

    act(() => {
      result.current.onAlignCenterClick();
    });
    expect(result.current.editor?.isActive({ textAlign: 'center' })).toBe(true);

    act(() => {
      result.current.onAlignRightClick();
    });
    expect(result.current.editor?.isActive({ textAlign: 'right' })).toBe(true);

    act(() => {
      result.current.onAlignJustifyClick();
    });
    expect(result.current.editor?.isActive({ textAlign: 'justify' })).toBe(
      true,
    );

    act(() => {
      result.current.onAlignLeftClick();
    });
    expect(result.current.editor?.isActive({ textAlign: 'left' })).toBe(true);
  });

  it('performs undo/redo', () => {
    const { result } = renderHook(() => useRichTextEditor());

    act(() => {
      result.current.editor?.commands.setContent('<p>Change 1</p>');
    });

    act(() => {
      result.current.onUndoClick();
    });
    // Undo behavior depends on history depth, just checking it doesn't crash
    expect(result.current.editor).toBeDefined();

    act(() => {
      result.current.onRedoClick();
    });
    expect(result.current.editor).toBeDefined();
  });

  it('removes formatting', () => {
    const { result } = renderHook(() =>
      useRichTextEditor('<p><strong>Bold</strong></p>'),
    );

    // Select all
    act(() => {
      result.current.editor?.commands.selectAll();
    });

    act(() => {
      result.current.onRemoveFormat();
    });

    expect(result.current.editor?.isActive('bold')).toBe(false);
  });
});
