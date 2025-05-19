import { API_ROUTES } from '../api';
import axiosInstance from '../axiosInstance';

export default class AuthService {
  postRegister = async (
    username: string,
    phoneNumber: string,
    password: string,
  ): Promise<{ access_token: string }> => {
    const response = await axiosInstance.post(`${API_ROUTES.auth}/register`, {
      username,
      phoneNumber,
      password,
    });
    return response.data;
  };
}
