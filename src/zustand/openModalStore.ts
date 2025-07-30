// useRoomAssetDrawerStore.ts
import { create } from "zustand"
import { RoomAssetAllResponse } from "@/types"

interface RoomAssetDrawerState {
  open: boolean
  room: RoomAssetAllResponse | null
  openDrawer: (room: RoomAssetAllResponse) => void
  closeDrawer: () => void
}

export const useRoomAssetDrawerStore = create<RoomAssetDrawerState>((set) => ({
  open: false,
  room: null,
  openDrawer: (room) => {
    console.log("OPEN DRAWER WITH ROOM:", room)
    set({ open: true, room })
  },
  closeDrawer: () => set({ open: false, room: null }),
}))
