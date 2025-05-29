import { configureStore } from '@reduxjs/toolkit';

import counterReducer from './reducers/counterSlice';
import sidebarReducer from './reducers/sidebarSlice';

const store = configureStore({
  reducer: {
    counter: counterReducer,
    sidebar: sidebarReducer,
  },
});

export default store;
