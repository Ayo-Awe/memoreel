import { create } from "zustand";

interface User {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string;
  token: string;
}

interface AuthStore {
  user: User | null;
  login: (payload: User) => void;
  logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  login: (payload) => set((store) => ({ user: payload })),
  logout: () => set((store) => ({ user: null })),
}));

export default useAuthStore;
