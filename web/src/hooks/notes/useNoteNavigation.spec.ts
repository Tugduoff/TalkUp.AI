import { useRouter } from '@tanstack/react-router';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useNoteNavigation } from './useNoteNavigation';

// Mock dependencies
vi.mock('@tanstack/react-router', () => ({
  useRouter: vi.fn(),
}));

describe('useNoteNavigation', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({
      navigate: mockNavigate,
    });
  });

  it('initializes without errors', () => {
    const { result } = renderHook(() => useNoteNavigation());

    expect(result.current.navigateToNote).toBeDefined();
    expect(result.current.navigateToNotesList).toBeDefined();
  });

  it('navigates to a specific note', () => {
    const { result } = renderHook(() => useNoteNavigation());

    result.current.navigateToNote('note-123');

    expect(mockNavigate).toHaveBeenCalledWith({
      to: '/notes/$noteId',
      params: { noteId: 'note-123' },
    });
  });

  it('navigates to notes list', () => {
    const { result } = renderHook(() => useNoteNavigation());

    result.current.navigateToNotesList();

    expect(mockNavigate).toHaveBeenCalledWith({
      to: '/notes',
    });
  });

  it('handles multiple navigation calls', () => {
    const { result } = renderHook(() => useNoteNavigation());

    result.current.navigateToNote('note-1');
    result.current.navigateToNote('note-2');
    result.current.navigateToNotesList();

    expect(mockNavigate).toHaveBeenCalledTimes(3);
    expect(mockNavigate).toHaveBeenNthCalledWith(1, {
      to: '/notes/$noteId',
      params: { noteId: 'note-1' },
    });
    expect(mockNavigate).toHaveBeenNthCalledWith(2, {
      to: '/notes/$noteId',
      params: { noteId: 'note-2' },
    });
    expect(mockNavigate).toHaveBeenNthCalledWith(3, {
      to: '/notes',
    });
  });

  it('navigates with different note IDs', () => {
    const { result } = renderHook(() => useNoteNavigation());

    const noteIds = ['note-abc', 'note-xyz', 'note-123'];

    noteIds.forEach((noteId) => {
      result.current.navigateToNote(noteId);
    });

    expect(mockNavigate).toHaveBeenCalledTimes(noteIds.length);
    noteIds.forEach((noteId, index) => {
      expect(mockNavigate).toHaveBeenNthCalledWith(index + 1, {
        to: '/notes/$noteId',
        params: { noteId },
      });
    });
  });
});
