import {
    PUBLISH_BROADCAST_REQUEST,
    PUBLISH_BROADCAST_SUCCESS,
    PUBLISH_BROADCAST_FAILURE,
    UNPUBLISH_BROADCAST_REQUEST,
    UNPUBLISH_BROADCAST_SUCCESS,
    UNPUBLISH_BROADCAST_FAILURE,
    GET_BROADCAST_HISTORY_REQUEST,
    GET_BROADCAST_HISTORY_SUCCESS,
    GET_BROADCAST_HISTORY_FAILURE,
  } from '../actiontypes/broadcastTypes';
  
  const initialState = {
    loading: false,
    error: null,
    broadcastHistory: [],
    currentBroadcast: null,
    stats: null
  };
  
  export const broadcastReducer = (state = initialState, action) => {
    switch (action.type) {
      // Publish Broadcast
      case PUBLISH_BROADCAST_REQUEST:
        return {
          ...state,
          loading: true,
          error: null
        };
      case PUBLISH_BROADCAST_SUCCESS:
        return {
          ...state,
          loading: false,
          currentBroadcast: action.payload,
          stats: action.payload.stats,
          error: null
        };
      case PUBLISH_BROADCAST_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload
        };
  
      // Unpublish Broadcast
      case UNPUBLISH_BROADCAST_REQUEST:
        return {
          ...state,
          loading: true,
          error: null
        };
      case UNPUBLISH_BROADCAST_SUCCESS:
        return {
          ...state,
          loading: false,
          currentBroadcast: null,
          error: null
        };
      case UNPUBLISH_BROADCAST_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload
        };
  
      // Get Broadcast History
      case GET_BROADCAST_HISTORY_REQUEST:
        return {
          ...state,
          loading: true,
          error: null
        };
      case GET_BROADCAST_HISTORY_SUCCESS:
        return {
          ...state,
          loading: false,
          broadcastHistory: action.payload.history,
          error: null
        };
      case GET_BROADCAST_HISTORY_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload
        };
  
      default:
        return state;
    }
  };