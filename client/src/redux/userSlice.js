import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(window?.localStorage.getItem('user')),
  edit: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userRegister(state, action) {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
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
    updateFriend(state, action) {
      state.user.friends.push(action.payload);
    },
    updateOutList(state, action) {
      state.user.outRequest.push(action.payload);
    },
    updateInRequest(state, action) {
      state.user.inRequest = state.user.inRequest.filter(
        (request) => request._id !== action.payload
      );
    },
  },
});

export const {
  userRegister,
  userLogin,
  userLogout,
  updateProfile,
  updateFriend,
  updateOutList,
  updateInRequest,
} = userSlice.actions;

export default userSlice.reducer;
