import { create } from "zustand";
import { Gender } from "@/enums";

export interface AuthUser {
  id: string;
  fullName: string;
  gender: typeof Gender;
  dob: string;
  email: string;
  phoneNumber: string;
  profilePicture: string | undefined;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
