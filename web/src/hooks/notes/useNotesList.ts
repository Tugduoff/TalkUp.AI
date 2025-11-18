import { getUserNotes } from '@/services/notes/notesService';
import type { Note } from '@/services/notes/types';
import { useEffect, useState } from 'react';

const sortNotes = (notes: Note[]) => {
  return notes.sort((a, b) => {
    if (a.is_favorite && !b.is_favorite) return -1;
    if (!a.is_favorite && b.is_favorite) return 1;
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });
};

/** Custom hook for managing the notes list */
export const useNotesList = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedNotes = await getUserNotes();
        const sortedNotes = sortNotes(fetchedNotes);
        setNotes(sortedNotes);
      } catch (err) {
        console.error('Error fetching notes:', err);
        setError('Failed to load notes. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const addNote = (note: Note) => {
    setNotes((prevNotes) => [note, ...prevNotes]);
  };

  const updateNoteInList = (noteId: string, updates: Partial<Note>) => {
    setNotes((prevNotes) => {
      const updatedNotes = prevNotes.map((n) =>
        n.note_id === noteId ? { ...n, ...updates } : n,
      );
      return sortNotes(updatedNotes);
    });
  };

  const revertNoteInList = (noteId: string, originalNote: Note) => {
    setNotes((prevNotes) => {
      const revertedNotes = prevNotes.map((n) =>
        n.note_id === noteId ? originalNote : n,
      );
      return sortNotes(revertedNotes);
    });
  };

  return {
    notes,
    isLoading,
    error,
    setError,
    addNote,
    updateNoteInList,
    revertNoteInList,
  };
};
