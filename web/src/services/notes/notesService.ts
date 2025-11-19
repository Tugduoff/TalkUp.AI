import axiosInstance from '../axiosInstance';
import { CreateNoteDto, Note, UpdateNoteDto } from './types';

const NOTES_API_URL = '/v1/api/notes';

// Suppress unused variable warnings - these will be used when backend is ready
void axiosInstance;
void NOTES_API_URL;

const STORAGE_KEY = 'talkup_mock_notes';

// Initialize mock data from localStorage or use empty array
const getStoredNotes = (): Note[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveNotesToStorage = (notes: Note[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Failed to save notes to localStorage:', error);
  }
};

/**
 * Temporary mock function to simulate fetching notes from backend
 */
const getMockNotes = async (userId: string): Promise<Note[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  const notes = getStoredNotes();
  return notes.filter((note) => note.user_id === userId);
};

/**
 * Temporary mock function to simulate creating a note
 */
const createMockNote = async (
  userId: string,
  dto: CreateNoteDto,
): Promise<Note> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const notes = getStoredNotes();
  const newNote: Note = {
    note_id: `mock-${Date.now()}`,
    user_id: userId,
    title: dto.title,
    content: dto.content || '',
    color: dto.color || 'blue',
    is_favorite: dto.is_favorite || false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  notes.push(newNote);
  saveNotesToStorage(notes);
  return newNote;
};

/**
 * Temporary mock function to simulate updating a note
 */
const updateMockNote = async (
  noteId: string,
  dto: UpdateNoteDto,
): Promise<Note> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const notes = getStoredNotes();
  const noteIndex = notes.findIndex((n) => n.note_id === noteId);
  if (noteIndex === -1) {
    throw new Error('Note not found');
  }

  const updatedNote = {
    ...notes[noteIndex],
    ...dto,
    updated_at: new Date().toISOString(),
  };

  notes[noteIndex] = updatedNote;
  saveNotesToStorage(notes);
  return updatedNote;
};

/**
 * Temporary mock function to simulate deleting a note
 */
const deleteMockNote = async (noteId: string): Promise<void> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const notes = getStoredNotes();
  const noteIndex = notes.findIndex((n) => n.note_id === noteId);
  if (noteIndex === -1) {
    throw new Error('Note not found');
  }

  notes.splice(noteIndex, 1);
  saveNotesToStorage(notes);
};

/**
 * Retrieves all notes for the authenticated user.
 * Currently uses mock data. Will be replaced with real API call.
 */
export const getUserNotes = async (): Promise<Note[]> => {
  try {
    // TODO: Uncomment when backend is ready
    // const response = await axiosInstance.get<Note[]>(NOTES_API_URL);
    // return response.data;

    // TEMPORARY: Using mock data
    // In a real scenario, we'd get the userId from the auth context
    const mockUserId = 'current-user-id';
    return await getMockNotes(mockUserId);
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};

/**
 * Retrieves a single note by ID.
 * Currently uses mock data. Will be replaced with real API call.
 */
export const getNoteById = async (noteId: string): Promise<Note> => {
  try {
    // TODO: Uncomment when backend is ready
    // const response = await axiosInstance.get<Note>(`${NOTES_API_URL}/${noteId}`);
    // return response.data;

    // TEMPORARY: Using mock data
    const notes = getStoredNotes();
    const note = notes.find((n) => n.note_id === noteId);
    if (!note) {
      throw new Error('Note not found');
    }
    return note;
  } catch (error) {
    console.error('Error fetching note:', error);
    throw error;
  }
};

/**
 * Creates a new note.
 * Currently uses mock data. Will be replaced with real API call.
 */
export const createNote = async (dto: CreateNoteDto): Promise<Note> => {
  try {
    // TODO: Uncomment when backend is ready
    // const response = await axiosInstance.post<Note>(NOTES_API_URL, dto);
    // return response.data;

    // TEMPORARY: Using mock data
    const mockUserId = 'current-user-id';
    return await createMockNote(mockUserId, dto);
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

/**
 * Updates an existing note.
 * Currently uses mock data. Will be replaced with real API call.
 */
export const updateNote = async (
  noteId: string,
  dto: UpdateNoteDto,
): Promise<Note> => {
  try {
    // TODO: Uncomment when backend is ready
    // const response = await axiosInstance.put<Note>(`${NOTES_API_URL}/${noteId}`, dto);
    // return response.data;

    // TEMPORARY: Using mock data
    return await updateMockNote(noteId, dto);
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

/**
 * Deletes a note.
 * Currently uses mock data. Will be replaced with real API call.
 */
export const deleteNote = async (noteId: string): Promise<void> => {
  try {
    // TODO: Uncomment when backend is ready
    // await axiosInstance.delete(`${NOTES_API_URL}/${noteId}`);

    // TEMPORARY: Using mock data
    await deleteMockNote(noteId);
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};
