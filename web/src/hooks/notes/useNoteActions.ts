import type { BubbleProps } from '@/components/atoms/bubble/types';
import { deleteNote, updateNote } from '@/services/notes/notesService';
import type { Note } from '@/services/notes/types';
import { useState } from 'react';

/** Custom hook for managing note actions */
export const useNoteActions = (
  noteId: string,
  note: Note | null,
  setNote: (note: Note) => void,
) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleTitleEdit = () => {
    if (note) {
      setEditedTitle(note.title);
      setIsEditing(true);
    }
  };

  const handleTitleSave = async () => {
    if (!note) return;

    try {
      await updateNote(noteId, { title: editedTitle });
      setNote({ ...note, title: editedTitle });
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating title:', err);
    }
  };

  const handleTitleCancel = () => {
    if (note) {
      setEditedTitle(note.title);
      setIsEditing(false);
    }
  };

  const handleColorChange = async (color: BubbleProps['color']) => {
    if (!note) return;

    try {
      await updateNote(noteId, { color: color as string });
      setNote({ ...note, color: color as string });
      setShowColorPicker(false);
    } catch (err) {
      console.error('Error updating color:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNote(noteId);
      return true;
    } catch (err) {
      console.error('Error deleting note:', err);
      return false;
    }
  };

  return {
    isEditing,
    editedTitle,
    setEditedTitle,
    showDeleteModal,
    setShowDeleteModal,
    showColorPicker,
    setShowColorPicker,
    handleTitleEdit,
    handleTitleSave,
    handleTitleCancel,
    handleColorChange,
    handleDelete,
  };
};
