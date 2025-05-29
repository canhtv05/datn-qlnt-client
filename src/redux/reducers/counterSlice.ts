import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    count: 0,
  },
  reducers: {
    setCount(state, action) {
      state.count = action.payload;
    },
  },
});

export const { setCount } = counterSlice.actions;
export default counterSlice.reducer;
