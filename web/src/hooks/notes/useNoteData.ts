import { getNoteById } from '@/services/notes/notesService';
import type { Note } from '@/services/notes/types';
import { useEffect, useState } from 'react';

/** Custom hook for managing note data */
export const useNoteData = (noteId: string, editorReady: boolean) => {
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setIsLoading(true);
        const fetchedNote = await getNoteById(noteId);
        setNote(fetchedNote);
      } catch (err) {
        console.error('Error fetching note:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (editorReady) {
      fetchNote();
    }
  }, [noteId, editorReady]);

  return {
    note,
    setNote,
    isLoading,
  };
};
