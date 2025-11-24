import { getNoteById } from '@/services/notes/http';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useNoteData } from './useNoteData';

// Mock dependencies
vi.mock('@/services/notes/http', () => ({
  getNoteById: vi.fn(),
}));

describe('useNoteData', () => {
  const mockNote = {
    note_id: 'note-1',
    user_id: 'user-1',
    title: 'Test Note',
    content: '<p>Test content</p>',
    color: 'blue' as const,
    is_favorite: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with null note and loading state', () => {
    const { result } = renderHook(() => useNoteData('note-1', false));

    expect(result.current.note).toBeNull();
    expect(result.current.isLoading).toBe(true);
  });

  it('fetches note when editor is ready', async () => {
    (getNoteById as any).mockResolvedValue(mockNote);

    const { result } = renderHook(() => useNoteData('note-1', true));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.note).toEqual(mockNote);
      expect(result.current.isLoading).toBe(false);
    });

    expect(getNoteById).toHaveBeenCalledWith('note-1');
  });

  it('does not fetch note when editor is not ready', async () => {
    (getNoteById as any).mockResolvedValue(mockNote);

    const { result } = renderHook(() => useNoteData('note-1', false));

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(getNoteById).not.toHaveBeenCalled();
    expect(result.current.note).toBeNull();
  });

  it('refetches note when noteId changes', async () => {
    const mockNote2 = { ...mockNote, note_id: 'note-2', title: 'Note 2' };
    (getNoteById as any).mockResolvedValue(mockNote);

    const { result, rerender } = renderHook(
      ({ noteId, editorReady }) => useNoteData(noteId, editorReady),
      {
        initialProps: { noteId: 'note-1', editorReady: true },
      },
    );

    await waitFor(() => {
      expect(result.current.note).toEqual(mockNote);
    });

    (getNoteById as any).mockResolvedValue(mockNote2);
    rerender({ noteId: 'note-2', editorReady: true });

    await waitFor(() => {
      expect(result.current.note).toEqual(mockNote2);
    });

    expect(getNoteById).toHaveBeenCalledWith('note-2');
    expect(getNoteById).toHaveBeenCalledTimes(2);
  });

  it('fetches note when editor becomes ready', async () => {
    (getNoteById as any).mockResolvedValue(mockNote);

    const { result, rerender } = renderHook(
      ({ noteId, editorReady }) => useNoteData(noteId, editorReady),
      {
        initialProps: { noteId: 'note-1', editorReady: false },
      },
    );

    expect(getNoteById).not.toHaveBeenCalled();

    rerender({ noteId: 'note-1', editorReady: true });

    await waitFor(() => {
      expect(result.current.note).toEqual(mockNote);
      expect(result.current.isLoading).toBe(false);
    });

    expect(getNoteById).toHaveBeenCalledWith('note-1');
  });

  it('handles fetch errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (getNoteById as any).mockRejectedValue(new Error('Fetch failed'));

    const { result } = renderHook(() => useNoteData('note-1', true));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.note).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching note:',
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });

  it('allows setting note manually via setNote', async () => {
    (getNoteById as any).mockResolvedValue(mockNote);

    const { result } = renderHook(() => useNoteData('note-1', true));

    await waitFor(() => {
      expect(result.current.note).toEqual(mockNote);
    });

    const updatedNote = { ...mockNote, title: 'Updated Title' };
    act(() => {
      result.current.setNote(updatedNote);
    });

    expect(result.current.note).toEqual(updatedNote);
  });
});
