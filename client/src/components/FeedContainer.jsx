import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  getPostsStart,
  getPostsSuccess,
  getPostsFailure,
} from '../redux/postSlice';
import PostCard from './PostCard';
import { apiRequest } from '../utils';

const FeedContainer = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.user);
  const [didDelete, setDidDelete] = useState(true);

  useEffect(() => {
    // console.log('inside rerender');
    const fetchData = async () => {
      try {
        dispatch(getPostsStart());
        let response;

        if (id) {
          console.log('Fetching user posts for user id:', id);
          response = await apiRequest({
            url: `/posts/get-user-post/${id}`,
            method: 'get',
            token: user.token,
          });
        } else {
          console.log('Fetching all posts');
          response = await apiRequest({
            url: '/posts',
            method: 'get',
            token: user.token,
          });
        }

        if (response.status === 'failed') {
          dispatch(getPostsFailure(response.message));
        } else {
          dispatch(getPostsSuccess(response.data.data));
        }
      } catch (error) {
        dispatch(getPostsFailure(error.message));
        console.error(error);
      }
    };
    fetchData();
  }, [id]);
  useEffect(() => {
    return () => {
      setDidDelete(false);
    };
  }, [didDelete]);

  return (
    <div className="pb-3">
      {loading ? (
        <p className="text-amber-500 text-sm px-5">
          {'....hold on, loading yo posts'}
        </p>
      ) : error ? (
        <p className="text-red-500 text-sm px-5">
          {'Error loading posts: ' + error}
        </p>
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            user={user}
            setDidDelete={setDidDelete}
          />
        ))
      ) : (
        <p className="text-amber-500 text-sm px-5">
          {'....No posts available'}
        </p>
      )}
    </div>
  );
};

export default FeedContainer;
