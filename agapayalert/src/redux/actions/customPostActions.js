import axios from 'axios';
import { server } from '../store';
import {
  GET_PUBLIC_CUSTOM_POSTS_REQUEST,
  GET_PUBLIC_CUSTOM_POSTS_SUCCESS,
  GET_PUBLIC_CUSTOM_POSTS_FAIL,
} from '../actiontypes/customPostTypes';

export const getPublicCustomPosts = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: GET_PUBLIC_CUSTOM_POSTS_REQUEST });
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 10,
    }).toString();
    const { data } = await axios.get(`${server}/custom-posts/public?${queryParams}`);
    dispatch({
      type: GET_PUBLIC_CUSTOM_POSTS_SUCCESS,
      payload: data.data,
    });
    return { success: true, data: data.data };
  } catch (error) {
    dispatch({
      type: GET_PUBLIC_CUSTOM_POSTS_FAIL,
      payload: error.response?.data?.msg || error.message,
    });
    return { success: false, error: error.response?.data?.msg || error.message };
  }
};