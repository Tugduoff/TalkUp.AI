import { createNote } from '@/services/notes/notesService';
import type { Note } from '@/services/notes/types';
import { useRef, useState } from 'react';

/** Custom hook for creating notes */
export const useNoteCreation = () => {
  const [isCreating, setIsCreating] = useState(false);
  const isCreatingRef = useRef(false);

  const createNewNote = async (
    title: string = 'Untitled Note',
    content: string = '',
    color: string = 'blue',
  ): Promise<Note | null> => {
    if (isCreatingRef.current) return null;

    isCreatingRef.current = true;
    setIsCreating(true);

    try {
      const newNote = await createNote({
        title,
        content,
        color,
      });
      return newNote;
    } catch (err) {
      console.error('Error creating note:', err);
      throw err;
    } finally {
      isCreatingRef.current = false;
      setIsCreating(false);
    }
  };

  return {
    createNewNote,
    isCreating,
  };
};
