import { create } from "zustand";

interface RoomState {
  roomId: string | undefined;
  clearRoomId: () => void;
  setRoomId: (id: string) => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  roomId: undefined,
  clearRoomId: () => {
    set({ roomId: undefined });
  },
  setRoomId: (id) => {
    set({ roomId: id });
  },
}));
