import { createSlice } from '@reduxjs/toolkit';

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: {
    isOpen: false,
  },
  reducers: {
    setOpen(state, action) {
      state.isOpen = action.payload;
    },
  },
});

export const { setOpen } = sidebarSlice.actions;
export default sidebarSlice.reducer;
