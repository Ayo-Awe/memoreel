import { StateCreator, create } from "zustand";
import { PersistOptions, persist } from "zustand/middleware";

export interface User {
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
  updateProfile: (payload: { firstName?: string; lastName?: string }) => void;
}

type AuthPersist = (
  config: StateCreator<AuthStore>,
  options: PersistOptions<AuthStore>
) => StateCreator<AuthStore>;

const useAuthStore = create<AuthStore>(
  (persist as AuthPersist)(
    (set) => ({
      user: null,
      login: (payload) => set((store) => ({ user: payload })),
      logout: () => set((store) => ({ user: null })),
      updateProfile: (payload) =>
        set((store) => {
          if (store.user) {
            return { user: { ...store.user, ...payload } };
          }
          return {};
        }),
    }),
    { name: "auth-storage", getStorage: () => sessionStorage }
  )
);

export default useAuthStore;
