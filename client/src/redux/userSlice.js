import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(window?.localStorage.getItem('user')),
  edit: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLogin(state, action) {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    userLogout(state) {
      state.user = null;
      localStorage?.removeItem('user');
    },
    updateProfile(state, action) {
      state.edit = action.payload;
    },
  },
});

export const { userLogin, userLogout, updateProfile } = userSlice.actions;

export default userSlice.reducer;
