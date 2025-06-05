import { UserResponse } from "@/types";
import { create } from "zustand";

interface AuthState {
  user: UserResponse | null;
  isAuth: boolean;
  isLoading: boolean;
  setUser: (user: UserResponse, isAuth: boolean) => void;
  setIsLoading: (value: boolean) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuth: true,
  isLoading: false,
  setUser: (user, isAuth) => {
    set({ user, isAuth });
  },
  setIsLoading: (value) => {
    set({ isLoading: value });
  },
  clearUser: () => {
    set({ user: null, isAuth: false });
  },
}));
