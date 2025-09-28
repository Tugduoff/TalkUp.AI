import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from '@tanstack/react-router';
import toast from 'react-hot-toast';

/**
 * Custom hook that provides a logout handler for user authentication.
 *
 * When invoked, the returned `logout` function will:
 * - Call the `logout` method from the authentication context to log out the user.
 * - Display a success toast notification indicating the user has logged out.
 * - Navigate the user to the login page.
 *
 * @returns An object containing the `logout` function to trigger the logout process.
 */
export const useLogout = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.navigate({ to: '/login' });
  };

  return { logout: handleLogout };
};
