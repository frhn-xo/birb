import { combineReducers } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import postSlice from './postSlice';

const rootReducer = combineReducers({
  user: userSlice,
  posts: postSlice,
});

export { rootReducer };
