import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slice/userSlice';
import cartSlice from './slice/cartSlice'

const store = configureStore({
  reducer: {
    auth: authSlice,
    cart: cartSlice,
  },
});

export default store;
