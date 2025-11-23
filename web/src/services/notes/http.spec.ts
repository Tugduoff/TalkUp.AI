import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createNote,
  deleteNote,
  getNoteById,
  getUserNotes,
  updateNote,
} from './http';

describe('notesService', () => {
  const STORAGE_KEY = 'talkup_mock_notes';

  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('creates a new note', async () => {
    const promise = createNote({
      title: 'New Note',
      content: 'Content',
      color: 'blue',
    });

    vi.runAllTimers();
    const note = await promise;

    expect(note).toMatchObject({
      title: 'New Note',
      content: 'Content',
      color: 'blue',
    });
    expect(note.note_id).toBeDefined();

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject(note);
  });

  it('gets user notes', async () => {
    const mockNotes = [
      {
        note_id: '1',
        user_id: 'current-user-id',
        title: 'Note 1',
        content: '',
        color: 'blue',
        is_favorite: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockNotes));

    const promise = getUserNotes();
    vi.runAllTimers();
    const notes = await promise;

    expect(notes).toHaveLength(1);
    expect(notes[0].title).toBe('Note 1');
  });

  it('gets note by id', async () => {
    const mockNotes = [
      {
        note_id: '1',
        user_id: 'current-user-id',
        title: 'Note 1',
        content: '',
        color: 'blue',
        is_favorite: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockNotes));

    const promise = getNoteById('1');
    vi.runAllTimers();
    const note = await promise;

    expect(note.title).toBe('Note 1');
  });

  it('updates a note', async () => {
    const mockNotes = [
      {
        note_id: '1',
        user_id: 'current-user-id',
        title: 'Note 1',
        content: '',
        color: 'blue',
        is_favorite: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockNotes));

    const promise = updateNote('1', { title: 'Updated Title' });
    vi.runAllTimers();
    const updated = await promise;

    expect(updated.title).toBe('Updated Title');

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    expect(stored[0].title).toBe('Updated Title');
  });

  it('deletes a note', async () => {
    const mockNotes = [
      {
        note_id: '1',
        user_id: 'current-user-id',
        title: 'Note 1',
        content: '',
        color: 'blue',
        is_favorite: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockNotes));

    const promise = deleteNote('1');
    vi.runAllTimers();
    await promise;

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    expect(stored).toHaveLength(0);
  });

  it('throws error when note not found', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const promise = getNoteById('non-existent');
    vi.runAllTimers();
    await expect(promise).rejects.toThrow('Note not found');
    consoleSpy.mockRestore();
  });
});
