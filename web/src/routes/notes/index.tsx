import { BubbleProps } from '@/components/atoms/bubble/types';
import { Button } from '@/components/atoms/button';
import { Icon } from '@/components/atoms/icon';
import { AddNoteCard } from '@/components/molecules/add-note-card';
import { EmptyState } from '@/components/molecules/empty-state';
import { NoteCard } from '@/components/organisms/note-card';
import { useNoteCreation } from '@/hooks/notes/useNoteCreation';
import { useNoteFavorite } from '@/hooks/notes/useNoteFavorite';
import { useNoteNavigation } from '@/hooks/notes/useNoteNavigation';
import { useNotesList } from '@/hooks/notes/useNotesList';
import { createAuthGuard } from '@/utils/auth.guards';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/notes/')({
  beforeLoad: createAuthGuard('/notes'),
  component: Notes,
});

export function Notes() {
  const {
    notes,
    isLoading,
    error,
    setError,
    addNote,
    updateNoteInList,
    revertNoteInList,
  } = useNotesList();

  const { toggleFavorite } = useNoteFavorite();
  const { navigateToNote } = useNoteNavigation();
  const { createNewNote } = useNoteCreation();

  const handleToggleFavorite = async (id: string) => {
    const note = notes.find((n) => n.note_id === id);
    if (!note) return;

    updateNoteInList(id, { is_favorite: !note.is_favorite });

    await toggleFavorite(id, note.is_favorite, undefined, () => {
      revertNoteInList(id, note);
    });
  };

  const handleAddNewNote = async () => {
    try {
      const newNote = await createNewNote();
      if (newNote) {
        addNote(newNote);
        navigateToNote(newNote.note_id);
      }
    } catch {
      setError('Failed to create note. Please try again.');
    }
  };

  return (
    <div className="grid grid-rows-[96px_1fr] px-4 sm:px-8 md:px-16 pt-11 gap-11 h-screen w-full min-w-0">
      <div className="w-full min-w-0 flex flex-col justify-center">
        <div className="flex justify-between items-center w-full min-w-0 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-h1 text-text-idle">My Notes</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="text"
              color="black"
              title="Add new note"
              onClick={handleAddNewNote}
            >
              <Icon icon="plus" />
              <span className="hidden sm:inline">Add new note</span>
            </Button>
          </div>
        </div>
        <p className="text-text-idle mt-2">
          Add Notes, Share them and Access them during Practice !
        </p>
      </div>
      <div className="w-full min-w-0 h-full overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-text-weaker">Loading notes...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-error mb-4">{error}</p>
            <Button
              variant="contained"
              color="accent"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        ) : notes.length === 0 ? (
          <EmptyState
            icon="notes"
            title="No notes yet"
            description="Create your first note to get started. Notes help you organize your thoughts and prepare for practice sessions."
            actionLabel="Create your first note"
            onAction={handleAddNewNote}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-min pb-6">
            {notes.map((note) => (
              <NoteCard
                key={note.note_id}
                id={note.note_id}
                title={note.title}
                preview={note.content}
                color={note.color as BubbleProps['color']}
                lastUpdatedAt={new Date(note.updated_at)}
                isFavorite={note.is_favorite}
                onToggleFavorite={handleToggleFavorite}
                onClick={navigateToNote}
              />
            ))}
            <AddNoteCard onClick={handleAddNewNote} />
          </div>
        )}
      </div>
    </div>
  );
}
