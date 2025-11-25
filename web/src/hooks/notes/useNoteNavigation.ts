import { useRouter } from '@tanstack/react-router';

/** Custom hook for note navigation */
export const useNoteNavigation = () => {
  const router = useRouter();

  const navigateToNote = (noteId: string) => {
    router.navigate({ to: '/notes/$noteId', params: { noteId } });
  };

  const navigateToNotesList = () => {
    router.navigate({ to: '/notes' });
  };

  return {
    navigateToNote,
    navigateToNotesList,
  };
};
