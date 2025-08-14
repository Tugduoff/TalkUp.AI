import AuthService from '@/services/auth/http';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const authService = new AuthService();

/**
 * Custom hook for user registration functionality.
 *
 * This hook uses the React Query's useMutation to handle the registration process.
 * It takes username, email, and password as inputs, sends them to the authentication service,
 * and stores the returned access token in localStorage.
 *
 * @returns A mutation object that can be used to trigger the registration process
 * and monitor its state.
 *
 * @example
 * const registerMutation = usePostRegister();
 *
 * // Later in a component:
 * const handleRegister = () => {
 *   registerMutation.mutate({
 *     username: "user123",
 *     email: "admin.admin@admin.com",
 *     password: "securePassword"
 *   });
 * };
 */
export const usePostRegister = () => {
  return useMutation({
    mutationFn: async ({
      username,
      email,
      password,
    }: {
      username: string;
      email: string;
      password: string;
    }) => {
      const result = await authService.postRegister(
        username,
        email,
        password,
      );
      const accessToken = result.accessToken;
      localStorage.setItem('idToken', accessToken);
    },
    onSuccess: () => {
      toast.success('Registration successful');
      console.log('Registration successful');
    },
    onError: (error) => {
      toast.error('Registration failed');
      console.error('Error during registration:', error);
    },
  });
};
