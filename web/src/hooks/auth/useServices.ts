import { useAuth } from '@/contexts/AuthContext';
import AuthService from '@/services/auth/http';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
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
  const { login } = useAuth();
  const router = useRouter();

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
      const result = await authService.postRegister(username, email, password);
      return result.accessToken;
    },
    onSuccess: (accessToken) => {
      login(accessToken);
      toast.success('Registration successful');
      router.navigate({ to: '/dashboard' });
    },
    onError: (error) => {
      toast.error('Registration failed');
      console.error('Error during registration:', error);
    },
  });
};

/**
 * Custom hook for user login functionality.
 *
 * This hook uses the React Query's useMutation to handle the login process.
 * It takes email and password as inputs, sends them to the authentication service,
 * and stores the returned access token in localStorage.
 *
 * @returns A mutation object that can be used to trigger the login process
 * and monitor its state.
 *
 * @example
 * const loginMutation = usePostLogin();
 *
 * // Later in a component:
 * const handleLogin = () => {
 *   loginMutation.mutate({
 *     email: "admin.admin@admin.com",
 *     password: "securePassword"
 *   });
 * };
 */
export const usePostLogin = () => {
  const { login } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const result = await authService.postLogin(email, password);
      return result.accessToken;
    },
    onSuccess: (accessToken) => {
      login(accessToken);
      toast.success('Login successful');

      const search = new URLSearchParams(window.location.search);
      const redirectTo = search.get('redirect') || '/dashboard';
      router.navigate({ to: redirectTo });
    },
    onError: (error) => {
      toast.error('Login failed');
      console.error('Error during login:', error);
    },
  });
};
