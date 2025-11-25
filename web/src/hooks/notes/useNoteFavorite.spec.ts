import { updateNote } from '@/services/notes/http';
import type { Note } from '@/services/notes/types';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useNoteFavorite } from './useNoteFavorite';

// Mock dependencies
vi.mock('@/services/notes/http', () => ({
  updateNote: vi.fn(),
}));

describe('useNoteFavorite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('toggleFavorite', () => {
    it('initializes with isUpdating false', () => {
      const { result } = renderHook(() => useNoteFavorite());
      expect(result.current.isUpdating).toBe(false);
    });

    it('toggles favorite status from false to true', async () => {
      (updateNote as any).mockResolvedValue({});
      const onSuccess = vi.fn();

      const { result } = renderHook(() => useNoteFavorite());

      await act(async () => {
        await result.current.toggleFavorite('note-1', false, onSuccess);
      });

      expect(updateNote).toHaveBeenCalledWith('note-1', { is_favorite: true });
      expect(onSuccess).toHaveBeenCalledWith(true);
      expect(result.current.isUpdating).toBe(false);
    });

    it('toggles favorite status from true to false', async () => {
      (updateNote as any).mockResolvedValue({});
      const onSuccess = vi.fn();

      const { result } = renderHook(() => useNoteFavorite());

      await act(async () => {
        await result.current.toggleFavorite('note-1', true, onSuccess);
      });

      expect(updateNote).toHaveBeenCalledWith('note-1', { is_favorite: false });
      expect(onSuccess).toHaveBeenCalledWith(false);
      expect(result.current.isUpdating).toBe(false);
    });

    it('handles errors and calls onError callback', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const error = new Error('Update failed');
      (updateNote as any).mockRejectedValue(error);
      const onError = vi.fn();

      const { result } = renderHook(() => useNoteFavorite());

      await act(async () => {
        await result.current.toggleFavorite(
          'note-1',
          false,
          undefined,
          onError,
        );
      });

      expect(onError).toHaveBeenCalledWith(error);
      expect(result.current.isUpdating).toBe(false);

      consoleSpy.mockRestore();
    });

    it('prevents multiple simultaneous updates', async () => {
      (updateNote as any).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      const { result } = renderHook(() => useNoteFavorite());

      act(() => {
        void result.current.toggleFavorite('note-1', false);
      });

      await waitFor(() => {
        expect(result.current.isUpdating).toBe(true);
      });

      // Try to toggle again while updating
      await act(async () => {
        await result.current.toggleFavorite('note-1', false);
      });

      // Should only have been called once
      expect(updateNote).toHaveBeenCalledTimes(1);
    });

    it('works without callbacks', async () => {
      (updateNote as any).mockResolvedValue({});

      const { result } = renderHook(() => useNoteFavorite());

      await act(async () => {
        await result.current.toggleFavorite('note-1', false);
      });

      expect(updateNote).toHaveBeenCalledWith('note-1', { is_favorite: true });
      expect(result.current.isUpdating).toBe(false);
    });
  });

  describe('toggleFavoriteOptimistic', () => {
    const mockNotes: Note[] = [
      {
        note_id: 'note-1',
        user_id: 'user-1',
        title: 'Note 1',
        content: '<p>Content 1</p>',
        color: 'blue',
        is_favorite: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        note_id: 'note-2',
        user_id: 'user-1',
        title: 'Note 2',
        content: '<p>Content 2</p>',
        color: 'red',
        is_favorite: true,
        created_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
      },
    ];

    it('optimistically updates note and sorts favorites first', async () => {
      (updateNote as any).mockResolvedValue({});
      const setNotes = vi.fn();

      const { result } = renderHook(() => useNoteFavorite());

      await act(async () => {
        await result.current.toggleFavoriteOptimistic(
          'note-1',
          false,
          mockNotes,
          setNotes,
        );
      });

      // Check that setNotes was called to update optimistically
      expect(setNotes).toHaveBeenCalledWith(expect.any(Function));

      // Get the updater function and test it
      const updaterFn = setNotes.mock.calls[0][0];
      const updatedNotes = updaterFn(mockNotes);

      // Note 1 should now be favorite
      const note1 = updatedNotes.find((n: Note) => n.note_id === 'note-1');
      expect(note1?.is_favorite).toBe(true);

      // Favorites should be sorted first
      expect(updatedNotes[0].is_favorite).toBe(true);
      expect(updatedNotes[1].is_favorite).toBe(true);

      expect(updateNote).toHaveBeenCalledWith('note-1', { is_favorite: true });
      expect(result.current.isUpdating).toBe(false);
    });

    it('reverts optimistic update on error', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      (updateNote as any).mockRejectedValue(new Error('Update failed'));
      const setNotes = vi.fn();

      const { result } = renderHook(() => useNoteFavorite());

      await act(async () => {
        await result.current.toggleFavoriteOptimistic(
          'note-1',
          false,
          mockNotes,
          setNotes,
        );
      });

      // Should have been called twice: once for optimistic update, once for revert
      expect(setNotes).toHaveBeenCalledTimes(2);

      // Check the revert function
      const revertFn = setNotes.mock.calls[1][0];
      const revertedNotes = revertFn([
        { ...mockNotes[0], is_favorite: true },
        mockNotes[1],
      ]);

      const note1 = revertedNotes.find((n: Note) => n.note_id === 'note-1');
      expect(note1?.is_favorite).toBe(false);

      expect(result.current.isUpdating).toBe(false);

      consoleSpy.mockRestore();
    });

    it('prevents multiple simultaneous optimistic updates', async () => {
      (updateNote as any).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );
      const setNotes = vi.fn();

      const { result } = renderHook(() => useNoteFavorite());

      let promise1: Promise<void>;
      act(() => {
        promise1 = result.current.toggleFavoriteOptimistic(
          'note-1',
          false,
          mockNotes,
          setNotes,
        );
      });

      await waitFor(() => {
        expect(result.current.isUpdating).toBe(true);
      });

      // Try to toggle again while updating
      await act(async () => {
        await result.current.toggleFavoriteOptimistic(
          'note-1',
          false,
          mockNotes,
          setNotes,
        );
      });

      // Should only have been called once for optimistic update
      expect(setNotes).toHaveBeenCalledTimes(1);

      // Wait for the first promise to complete
      await act(async () => {
        await promise1!;
      });
    });

    it('sorts notes correctly after toggling favorite', async () => {
      (updateNote as any).mockResolvedValue({});
      const setNotes = vi.fn();

      const notesWithDates: Note[] = [
        {
          ...mockNotes[0],
          is_favorite: false,
          updated_at: '2024-01-03T00:00:00Z', // Most recent
        },
        {
          ...mockNotes[1],
          is_favorite: true,
          updated_at: '2024-01-02T00:00:00Z',
        },
      ];

      const { result } = renderHook(() => useNoteFavorite());

      await act(async () => {
        await result.current.toggleFavoriteOptimistic(
          'note-1',
          false,
          notesWithDates,
          setNotes,
        );
      });

      const updaterFn = setNotes.mock.calls[0][0];
      const updatedNotes = updaterFn(notesWithDates);

      // Both are favorites, so should be sorted by updated_at (most recent first)
      expect(updatedNotes[0].note_id).toBe('note-1'); // Most recent update
      expect(updatedNotes[1].note_id).toBe('note-2');
    });
  });
});
