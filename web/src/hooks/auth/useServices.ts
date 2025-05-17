import { useMutation } from "@tanstack/react-query";
import AuthService from "@/services/auth/http";

const authService = new AuthService();

export const usePostRegister = () => {
  return useMutation({
    mutationFn: async ({ username, phoneNumber, password }: { username: string, phoneNumber: string, password: string }) => {
      const result = await authService.postRegister(username, phoneNumber, password);
      const accessToken = result.access_token;
      localStorage.setItem("idToken", accessToken);
    },
    onSuccess: () => {
      console.log("Registration successful");
    },
    onError: (error) => {
      console.error("Error during registration:", error);
    }
  })
}
