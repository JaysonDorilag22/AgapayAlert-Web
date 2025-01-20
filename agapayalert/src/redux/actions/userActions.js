import axios from 'axios';
import {
  GET_USER_REQUEST, GET_USER_SUCCESS, GET_USER_FAILURE,
  UPDATE_USER_REQUEST, UPDATE_USER_SUCCESS, UPDATE_USER_FAILURE,
  CHANGE_PASSWORD_REQUEST, CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAILURE,
  DELETE_USER_REQUEST, DELETE_USER_SUCCESS, DELETE_USER_FAILURE,
  CLEAR_USER_MESSAGE, CLEAR_USER_ERROR,
} from '../actiontypes/userTypes';
import {server} from "../store";

// Get user details
export const getUserDetails = (userId) => async (dispatch) => {
  dispatch({ type: GET_USER_REQUEST });
  try {
    const { data } = await axios.get(`${server}/user/${userId}`, {
      withCredentials: true,
    });
    dispatch({ type: GET_USER_SUCCESS, payload: data });
    return { success: true, data };
  } catch (error) {
    const msg = error.response?.data?.msg || error.message;
    dispatch({ type: GET_USER_FAILURE, payload: { msg } });
    return { success: false, error: msg };
  }
};

// Update user details
export const updateUserDetails = (userId, userDetails) => async (dispatch) => {
  dispatch({ type: UPDATE_USER_REQUEST });
  try {
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    };
    const { data } = await axios.put(
      `${server}/user/${userId}`, 
      userDetails, 
      config
    );
    dispatch({ type: UPDATE_USER_SUCCESS, payload: data });
    return { success: true, data };
  } catch (error) {
    const msg = error.response?.data?.msg || error.message;
    dispatch({ type: UPDATE_USER_FAILURE, payload: { msg } });
    return { success: false, error: msg };
  }
};

// Change user password
export const changePassword = (userId, passwords) => async (dispatch, getState) => {
  dispatch({ type: CHANGE_PASSWORD_REQUEST });
  try {
    const { auth: { token } } = getState();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };
    const { data } = await axios.put(
      `${server}/user/change-password/${userId}`, 
      passwords, 
      config
    );
    dispatch({ type: CHANGE_PASSWORD_SUCCESS, payload: data });
    return { success: true, data };
  } catch (error) {
    const msg = error.response?.data?.msg || error.message;
    dispatch({ type: CHANGE_PASSWORD_FAILURE, payload: { msg } });
    return { success: false, error: msg };
  }
};

// Delete user
export const deleteUser = (userId) => async (dispatch) => {
  dispatch({ type: DELETE_USER_REQUEST });
  try {
    await axios.delete(`${server}/user/${userId}`, {
      withCredentials: true,
    });
    dispatch({ type: DELETE_USER_SUCCESS });
    return { success: true };
  } catch (error) {
    const msg = error.response?.data?.msg || error.message;
    dispatch({ type: DELETE_USER_FAILURE, payload: { msg } });
    return { success: false, error: msg };
  }
};

// Clear states
export const clearUserMessage = () => ({ type: CLEAR_USER_MESSAGE });
export const clearUserError = () => ({ type: CLEAR_USER_ERROR });