export interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}
