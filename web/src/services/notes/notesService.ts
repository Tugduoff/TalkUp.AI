import axiosInstance from '../axiosInstance';
import { CreateNoteDto, Note, UpdateNoteDto } from './types';

const NOTES_API_URL = '/v1/api/notes';

// Suppress unused variable warnings - these will be used when backend is ready
void axiosInstance;
void NOTES_API_URL;

// TEMPORARY MOCK DATA - This will be replaced with real API calls
const MOCK_NOTES: Note[] = [];
let mockIdCounter = 1;

/**
 * Temporary mock function to simulate fetching notes from backend
 * TODO: Replace with actual API call once backend is deployed
 */
const getMockNotes = async (userId: string): Promise<Note[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_NOTES.filter((note) => note.user_id === userId);
};

/**
 * Temporary mock function to simulate creating a note
 * TODO: Replace with actual API call once backend is deployed
 */
const createMockNote = async (
  userId: string,
  dto: CreateNoteDto,
): Promise<Note> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const newNote: Note = {
    note_id: `mock-${mockIdCounter++}`,
    user_id: userId,
    title: dto.title,
    content: dto.content || '',
    color: dto.color || 'blue',
    is_favorite: dto.is_favorite || false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  MOCK_NOTES.push(newNote);
  return newNote;
};

/**
 * Temporary mock function to simulate updating a note
 * TODO: Replace with actual API call once backend is deployed
 */
const updateMockNote = async (
  noteId: string,
  dto: UpdateNoteDto,
): Promise<Note> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const noteIndex = MOCK_NOTES.findIndex((n) => n.note_id === noteId);
  if (noteIndex === -1) {
    throw new Error('Note not found');
  }

  const updatedNote = {
    ...MOCK_NOTES[noteIndex],
    ...dto,
    updated_at: new Date().toISOString(),
  };

  MOCK_NOTES[noteIndex] = updatedNote;
  return updatedNote;
};

/**
 * Temporary mock function to simulate deleting a note
 * TODO: Replace with actual API call once backend is deployed
 */
const deleteMockNote = async (noteId: string): Promise<void> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const noteIndex = MOCK_NOTES.findIndex((n) => n.note_id === noteId);
  if (noteIndex === -1) {
    throw new Error('Note not found');
  }

  MOCK_NOTES.splice(noteIndex, 1);
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
    const note = MOCK_NOTES.find((n) => n.note_id === noteId);
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
