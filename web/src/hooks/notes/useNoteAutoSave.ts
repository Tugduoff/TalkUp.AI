import type { SaveStatusType } from '@/components/molecules/save-status';
import { updateNote } from '@/services/notes/notesService';
import type { Note } from '@/services/notes/types';
import type { Editor } from '@tiptap/react';
import { useEffect, useRef, useState } from 'react';

/** Custom hook for managing note auto-save functionality */
export const useNoteAutoSave = (
  noteId: string,
  note: Note | null,
  editor: Editor | null,
  title: string,
) => {
  const [saveStatus, setSaveStatus] = useState<SaveStatusType>('saved');
  const hasUnsavedChanges = useRef(false);
  const autoSaveInterval = useRef<NodeJS.Timeout | null>(null);
  const lastSavedContent = useRef('');

  useEffect(() => {
    if (editor && note?.content) {
      editor.commands.setContent(note.content);
      lastSavedContent.current = note.content;
    }
  }, [editor, note?.content]);

  useEffect(() => {
    const saveNote = async () => {
      if (!note || !hasUnsavedChanges.current || !editor) return;

      try {
        setSaveStatus('saving');
        const content = editor.getHTML();

        const safeTitle = title && title.trim() ? title : 'Untitled Note';

        await updateNote(noteId, {
          title: safeTitle,
          content,
        });

        lastSavedContent.current = content;
        hasUnsavedChanges.current = false;
        setSaveStatus('saved');
      } catch (err) {
        console.error('Error saving note:', err);
        setSaveStatus('error');
      }
    };

    autoSaveInterval.current = setInterval(() => {
      saveNote();
      console.log('Saving');
    }, 1000);

    return () => {
      if (autoSaveInterval.current) {
        clearInterval(autoSaveInterval.current);
      }
    };
  }, [noteId, title, note, editor]);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      const currentContent = editor?.getHTML() || '';
      if (currentContent !== lastSavedContent.current) {
        hasUnsavedChanges.current = true;
        setSaveStatus('unsaved');
      }
    };

    editor.on('update', handleUpdate);

    return () => {
      editor?.off('update', handleUpdate);
    };
  }, [editor]);

  useEffect(() => {
    return () => {
      if (note && editor && hasUnsavedChanges.current) {
        const content = editor.getHTML();
        const safeTitle = title && title.trim() ? title : 'Untitled Note';
        updateNote(noteId, {
          title: safeTitle,
          content,
        }).catch((err) => {
          console.error('Error saving note on unmount:', err);
        });
      }
    };
  }, [note, editor, noteId, title]);

  const saveNow = async () => {
    if (!note || !editor) return;

    try {
      setSaveStatus('saving');
      const content = editor.getHTML();
      const safeTitle = title && title.trim() ? title : 'Untitled Note';
      await updateNote(noteId, {
        title: safeTitle,
        content,
      });
      setSaveStatus('saved');
    } catch (err) {
      console.error('Error saving note before exit:', err);
    }
  };

  return {
    saveStatus,
    hasUnsavedChanges,
    saveNow,
  };
};
