import {
    GET_USER_REQUEST, GET_USER_SUCCESS, GET_USER_FAILURE,
    UPDATE_USER_REQUEST, UPDATE_USER_SUCCESS, UPDATE_USER_FAILURE,
    CHANGE_PASSWORD_REQUEST, CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAILURE,
    DELETE_USER_REQUEST, DELETE_USER_SUCCESS, DELETE_USER_FAILURE,
    CLEAR_USER_MESSAGE, CLEAR_USER_ERROR,
  } from '../actiontypes/userTypes';
  
  const initialState = {
    loading: false,
    loadingAction: null,
    user: null,
    error: null,
    message: null,
    success: false
  };
  
  export const userReducer = (state = initialState, action) => {
    switch (action.type) {
      // Request cases
      case GET_USER_REQUEST:
      case UPDATE_USER_REQUEST:
      case CHANGE_PASSWORD_REQUEST:
      case DELETE_USER_REQUEST:
        return {
          ...state,
          loading: true,
          loadingAction: action.type,
          error: null,
          success: false
        };
  
      // Success cases for user data
      case GET_USER_SUCCESS:
      case UPDATE_USER_SUCCESS:
        return {
          ...state,
          loading: false,
          loadingAction: null,
          user: action.payload.user || action.payload,
          message: action.type === UPDATE_USER_SUCCESS 
            ? 'User updated successfully' 
            : null,
          success: true,
          error: null
        };
  
      // Password change success
      case CHANGE_PASSWORD_SUCCESS:
        return {
          ...state,
          loading: false,
          loadingAction: null,
          message: action.payload.msg || 'Password changed successfully',
          success: true,
          error: null
        };
  
      // Delete success
      case DELETE_USER_SUCCESS:
        return {
          ...initialState,
          message: 'User deleted successfully',
          success: true
        };
  
      // Failure cases
      case GET_USER_FAILURE:
      case UPDATE_USER_FAILURE:
      case CHANGE_PASSWORD_FAILURE:
      case DELETE_USER_FAILURE:
        return {
          ...state,
          loading: false,
          loadingAction: null,
          error: action.payload.msg,
          success: false
        };
  
      // Clear states
      case CLEAR_USER_MESSAGE:
        return {
          ...state,
          message: null
        };
  
      case CLEAR_USER_ERROR:
        return {
          ...state,
          error: null
        };
  
      default:
        return state;
    }
  };