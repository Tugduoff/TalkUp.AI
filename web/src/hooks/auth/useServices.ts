import AuthService from '@/services/auth/http';
import { useMutation } from '@tanstack/react-query';

const authService = new AuthService();

export const usePostRegister = () => {
  return useMutation({
    mutationFn: async ({
      username,
      phoneNumber,
      password,
    }: {
      username: string;
      phoneNumber: string;
      password: string;
    }) => {
      const result = await authService.postRegister(
        username,
        phoneNumber,
        password,
      );
      const accessToken = result.accessToken;
      localStorage.setItem('idToken', accessToken);
    },
    onSuccess: () => {
      console.log('Registration successful');
    },
    onError: (error) => {
      console.error('Error during registration:', error);
    },
  });
};
