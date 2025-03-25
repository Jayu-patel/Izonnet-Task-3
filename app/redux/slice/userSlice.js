import { nextLocalStorage } from '@/app/lib/nextLocalStorage';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: nextLocalStorage()?.getItem("user")
    ? JSON.parse(nextLocalStorage()?.getItem("user"))
    : null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      nextLocalStorage()?.setItem("user", JSON.stringify(action.payload));

      const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days
      nextLocalStorage()?.setItem("expirationTime", expirationTime);
    },
    logout: (state) => {
      state.userInfo = null;
      nextLocalStorage()?.removeItem("user")
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
