import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useNoteActions } from './useNoteActions';

// Mock dependencies
const mocks = vi.hoisted(() => ({
  updateNoteInList: vi.fn(),
  revertNoteInList: vi.fn(),
  deleteNoteFromList: vi.fn(),
  updateNote: vi.fn(),
  deleteNote: vi.fn(),
}));

vi.mock('@/hooks/notes/useNotesList', () => ({
  useNotesList: () => ({
    updateNoteInList: mocks.updateNoteInList,
    revertNoteInList: mocks.revertNoteInList,
    deleteNoteFromList: mocks.deleteNoteFromList,
  }),
}));

vi.mock('@/services/notes/http', () => ({
  updateNote: mocks.updateNote,
  deleteNote: mocks.deleteNote,
}));

describe('useNoteActions', () => {
  const mockNote = {
    note_id: '1',
    user_id: 'user-1',
    title: 'Test Note',
    content: 'Content',
    color: 'blue',
    is_favorite: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockSetNote = vi.fn();

  it('initializes with default state', () => {
    const { result } = renderHook(() =>
      useNoteActions('1', mockNote, mockSetNote),
    );

    expect(result.current.isEditing).toBe(false);
    expect(result.current.editedTitle).toBe('Test Note');
    expect(result.current.showDeleteModal).toBe(false);
    expect(result.current.showColorPicker).toBe(false);
  });

  it('handles title edit mode', () => {
    const { result } = renderHook(() =>
      useNoteActions('1', mockNote, mockSetNote),
    );

    act(() => {
      result.current.handleTitleEdit();
    });

    expect(result.current.isEditing).toBe(true);
  });

  it('cancels title edit', () => {
    const { result } = renderHook(() =>
      useNoteActions('1', mockNote, mockSetNote),
    );

    act(() => {
      result.current.handleTitleEdit();
      result.current.setEditedTitle('New Title');
      result.current.handleTitleCancel();
    });

    expect(result.current.isEditing).toBe(false);
    expect(result.current.editedTitle).toBe('Test Note');
  });

  it('saves title', async () => {
    const { result } = renderHook(() =>
      useNoteActions('1', mockNote, mockSetNote),
    );

    act(() => {
      result.current.handleTitleEdit();
      result.current.setEditedTitle('New Title');
    });

    await act(async () => {
      await result.current.handleTitleSave();
    });

    expect(mocks.updateNoteInList).toHaveBeenCalledWith('1', {
      title: 'New Title',
    });
    expect(mocks.updateNote).toHaveBeenCalledWith('1', { title: 'New Title' });
    expect(result.current.isEditing).toBe(false);
  });

  it('handles color change', async () => {
    const { result } = renderHook(() =>
      useNoteActions('1', mockNote, mockSetNote),
    );

    await act(async () => {
      await result.current.handleColorChange('green');
    });

    expect(mocks.updateNoteInList).toHaveBeenCalledWith('1', {
      color: 'green',
    });
    expect(mocks.updateNote).toHaveBeenCalledWith('1', { color: 'green' });
    expect(result.current.showColorPicker).toBe(false);
  });

  it('handles delete', async () => {
    const { result } = renderHook(() =>
      useNoteActions('1', mockNote, mockSetNote),
    );

    mocks.deleteNote.mockResolvedValue(undefined);

    let success;
    await act(async () => {
      success = await result.current.handleDelete();
    });

    expect(success).toBe(true);
    expect(mocks.deleteNote).toHaveBeenCalledWith('1');
    expect(mocks.deleteNoteFromList).toHaveBeenCalledWith('1');
  });
});
