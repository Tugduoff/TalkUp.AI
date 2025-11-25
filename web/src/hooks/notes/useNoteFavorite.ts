import { updateNote } from '@/services/notes/http';
import type { Note } from '@/services/notes/types';
import { useState } from 'react';

/** Custom hook for managing note favorite status */
export const useNoteFavorite = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleFavorite = async (
    noteId: string,
    currentFavoriteStatus: boolean,
    onSuccess?: (newStatus: boolean) => void,
    onError?: (error: unknown) => void,
  ) => {
    if (isUpdating) return;

    setIsUpdating(true);
    const newStatus = !currentFavoriteStatus;

    try {
      await updateNote(noteId, { is_favorite: newStatus });
      onSuccess?.(newStatus);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      onError?.(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleFavoriteOptimistic = async (
    noteId: string,
    currentFavoriteStatus: boolean,
    _notes: Note[],
    setNotes: (notes: Note[] | ((prev: Note[]) => Note[])) => void,
  ) => {
    if (isUpdating) return;

    const newStatus = !currentFavoriteStatus;

    setNotes((prevNotes) => {
      const updatedNotes = prevNotes.map((n) =>
        n.note_id === noteId ? { ...n, is_favorite: newStatus } : n,
      );

      return updatedNotes.sort((a, b) => {
        if (a.is_favorite && !b.is_favorite) return -1;
        if (!a.is_favorite && b.is_favorite) return 1;
        return (
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      });
    });

    setIsUpdating(true);

    try {
      await updateNote(noteId, { is_favorite: newStatus });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setNotes((prevNotes) => {
        const revertedNotes = prevNotes.map((n) =>
          n.note_id === noteId
            ? { ...n, is_favorite: currentFavoriteStatus }
            : n,
        );

        return revertedNotes.sort((a, b) => {
          if (a.is_favorite && !b.is_favorite) return -1;
          if (!a.is_favorite && b.is_favorite) return 1;
          return (
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
        });
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    toggleFavorite,
    toggleFavoriteOptimistic,
    isUpdating,
  };
};
