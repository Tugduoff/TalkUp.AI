import { API_ROUTES } from '../api';
import axiosInstance from '../axiosInstance';

/**
 * @class AuthService
 * Handles authentication-related operations such as user registration.
 */
export default class AuthService {
  /**
   * Registers a new user with the provided credentials.
   *
   * @param username - The username for the new account
   * @param phoneNumber - The phone number associated with the new account
   * @param password - The password for the new account
   *
   * @returns A promise that resolves to an object containing the access token for the registered user
   * @throws Will throw an error if the registration fails (e.g., if the username or phone number already exists)
   */
  postRegister = async (
    username: string,
    phoneNumber: string,
    password: string,
  ): Promise<{ accessToken: string }> => {
    const response = await axiosInstance.post(`${API_ROUTES.auth}/register`, {
      username,
      phoneNumber,
      password,
    });
    return response.data;
  };
}
