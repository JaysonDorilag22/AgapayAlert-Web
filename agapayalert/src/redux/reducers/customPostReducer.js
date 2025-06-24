import {
  GET_PUBLIC_CUSTOM_POSTS_REQUEST,
  GET_PUBLIC_CUSTOM_POSTS_SUCCESS,
  GET_PUBLIC_CUSTOM_POSTS_FAIL,
} from '../actiontypes/customPostTypes';

const initialState = {
  posts: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  total: 0,
};

export const customPostReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PUBLIC_CUSTOM_POSTS_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_PUBLIC_CUSTOM_POSTS_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: action.payload.posts,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
        total: action.payload.total,
      };
    case GET_PUBLIC_CUSTOM_POSTS_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};