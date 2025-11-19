import { useNoteCreation } from '@/hooks/notes/useNoteCreation';
import { useNoteFavorite } from '@/hooks/notes/useNoteFavorite';
import { useNoteNavigation } from '@/hooks/notes/useNoteNavigation';
import { useNotesList } from '@/hooks/notes/useNotesList';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Notes } from './index';

// Mock hooks
vi.mock('@/hooks/notes/useNotesList');
vi.mock('@/hooks/notes/useNoteFavorite');
vi.mock('@/hooks/notes/useNoteNavigation');
vi.mock('@/hooks/notes/useNoteCreation');

describe('Notes Route', () => {
  const mockNotes = [
    {
      note_id: '1',
      title: 'Note 1',
      content: 'Content 1',
      color: 'blue',
      is_favorite: false,
      updated_at: new Date().toISOString(),
    },
    {
      note_id: '2',
      title: 'Note 2',
      content: 'Content 2',
      color: 'green',
      is_favorite: true,
      updated_at: new Date().toISOString(),
    },
  ];

  const mockAddNote = vi.fn();
  const mockNavigateToNote = vi.fn();
  const mockCreateNewNote = vi.fn();
  const mockToggleFavorite = vi.fn();
  const mockUpdateNoteInList = vi.fn();
  const mockRevertNoteInList = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useNotesList as any).mockReturnValue({
      notes: mockNotes,
      isLoading: false,
      error: null,
      setError: vi.fn(),
      addNote: mockAddNote,
      updateNoteInList: mockUpdateNoteInList,
      revertNoteInList: mockRevertNoteInList,
    });

    (useNoteFavorite as any).mockReturnValue({
      toggleFavorite: mockToggleFavorite,
    });

    (useNoteNavigation as any).mockReturnValue({
      navigateToNote: mockNavigateToNote,
    });

    (useNoteCreation as any).mockReturnValue({
      createNewNote: mockCreateNewNote,
    });
  });



  it('renders list of notes', () => {
    render(<Notes />);
    expect(screen.getByText('Note 1')).toBeInTheDocument();
    expect(screen.getByText('Note 2')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    (useNotesList as any).mockReturnValue({
      notes: [],
      isLoading: true,
      error: null,
    });
    render(<Notes />);
    expect(screen.getByText('Loading notes...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    (useNotesList as any).mockReturnValue({
      notes: [],
      isLoading: false,
      error: 'Failed to load',
    });
    render(<Notes />);
    expect(screen.getByText('Failed to load')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    (useNotesList as any).mockReturnValue({
      notes: [],
      isLoading: false,
      error: null,
      addNote: mockAddNote,
    });
    render(<Notes />);
    expect(screen.getByText('No notes yet')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /create your first note/i }),
    ).toBeInTheDocument();
  });

  it('handles creating new note', async () => {
    const user = userEvent.setup();
    const newNote = { note_id: '3', title: 'New Note' };
    mockCreateNewNote.mockResolvedValue(newNote);

    render(<Notes />);
    const addBtn = screen.getByTitle('Add new note');
    await user.click(addBtn);

    expect(mockCreateNewNote).toHaveBeenCalled();
    await waitFor(() => {
      expect(mockAddNote).toHaveBeenCalledWith(newNote);
      expect(mockNavigateToNote).toHaveBeenCalledWith('3');
    });
  });

  it('handles clicking a note', async () => {
    const user = userEvent.setup();
    render(<Notes />);
    await user.click(screen.getByText('Note 1'));
    expect(mockNavigateToNote).toHaveBeenCalledWith('1');
  });

  it('handles toggling favorite', async () => {
    const user = userEvent.setup();
    render(<Notes />);

    // Find the favorite button for the first note (not favorite)
    const favoriteBtns = screen.getAllByRole('button', {
      name: /add to favorites/i,
    });
    await user.click(favoriteBtns[0]);

    expect(mockUpdateNoteInList).toHaveBeenCalledWith('1', {
      is_favorite: true,
    });
    expect(mockToggleFavorite).toHaveBeenCalled();
  });
});
