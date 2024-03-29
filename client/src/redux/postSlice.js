import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
  loading: false,
  error: null,
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    getPostsStart(state) {
      state.loading = true;
      state.error = null;
    },
    getPostsSuccess(state, action) {
      state.loading = false;
      state.posts = action.payload;
    },
    getPostsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    addPost(state, action) {
      const newPost = action.payload;
      state.posts.unshift(action.payload);
    },
    deletePostById(state, action) {
      const postIdToDelete = action.payload;
      state.posts = state.posts.filter((post) => post._id !== postIdToDelete);
    },
  },
});

export const {
  getPostsStart,
  getPostsSuccess,
  getPostsFailure,
  addPost,
  deletePostById,
} = postSlice.actions;

export default postSlice.reducer;
