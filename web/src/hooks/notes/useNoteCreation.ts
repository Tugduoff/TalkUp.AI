import { createNote } from '@/services/notes/notesService';
import type { Note } from '@/services/notes/types';
import { useState } from 'react';

/** Custom hook for creating notes */
export const useNoteCreation = () => {
  const [isCreating, setIsCreating] = useState(false);

  const createNewNote = async (
    title: string = 'Untitled Note',
    content: string = '',
    color: string = 'blue',
  ): Promise<Note | null> => {
    if (isCreating) return null;

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
      setIsCreating(false);
    }
  };

  return {
    createNewNote,
    isCreating,
  };
};
