import axios from 'axios';
import { server } from '../../redux/store';
import {
  PUBLISH_BROADCAST_REQUEST,
  PUBLISH_BROADCAST_SUCCESS,
  PUBLISH_BROADCAST_FAILURE,
  UNPUBLISH_BROADCAST_REQUEST,
  UNPUBLISH_BROADCAST_SUCCESS,
  UNPUBLISH_BROADCAST_FAILURE,
  GET_BROADCAST_HISTORY_REQUEST,
  GET_BROADCAST_HISTORY_SUCCESS,
  GET_BROADCAST_HISTORY_FAILURE
} from '../actiontypes/broadcastTypes';

// Publish broadcast
export const publishBroadcast = (reportId, broadcastData) => async (dispatch) => {
  try {
    dispatch({ type: PUBLISH_BROADCAST_REQUEST });

    const { data } = await axios.post(
      `${server}/report/broadcast/publish/${reportId}`,
      broadcastData,
      { withCredentials: true }
    );

    dispatch({
      type: PUBLISH_BROADCAST_SUCCESS,
      payload: data
    });

    return { success: true, data };
  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: PUBLISH_BROADCAST_FAILURE,
      payload: message
    });
    return { success: false, error: message };
  }
};

// Unpublish broadcast
export const unpublishBroadcast = (reportId, channels) => async (dispatch) => {
  try {
    dispatch({ type: UNPUBLISH_BROADCAST_REQUEST });

    const { data } = await axios.post(
      `${server}/report/broadcast/unpublish/${reportId}`,
      { channels },
      { withCredentials: true }
    );

    dispatch({
      type: UNPUBLISH_BROADCAST_SUCCESS,
      payload: data
    });

    return { success: true, data };
  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: UNPUBLISH_BROADCAST_FAILURE,
      payload: message
    });
    return { success: false, error: message };
  }
};

// Get broadcast history
export const getBroadcastHistory = (reportId) => async (dispatch) => {
  try {
    dispatch({ type: GET_BROADCAST_HISTORY_REQUEST });

    const { data } = await axios.get(
      `${server}/report/broadcast/history/${reportId}`,
      { withCredentials: true }
    );

    dispatch({
      type: GET_BROADCAST_HISTORY_SUCCESS,
      payload: data.data
    });

    return { success: true, data: data.data };
  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: GET_BROADCAST_HISTORY_FAILURE,
      payload: message
    });
    return { success: false, error: message };
  }
};