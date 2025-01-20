import {
    REGISTER_REQUEST, 
    REGISTER_SUCCESS, 
    REGISTER_FAILURE,
    VERIFY_ACCOUNT_REQUEST, 
    VERIFY_ACCOUNT_SUCCESS, 
    VERIFY_ACCOUNT_FAILURE,
    LOGIN_REQUEST, 
    LOGIN_SUCCESS, 
    LOGIN_FAILURE,
    LOGOUT_REQUEST, 
    LOGOUT_SUCCESS, 
    LOGOUT_FAILURE,
    FORGOT_PASSWORD_REQUEST, FORGOT_PASSWORD_SUCCESS, FORGOT_PASSWORD_FAILURE,
    RESET_PASSWORD_REQUEST, RESET_PASSWORD_SUCCESS, 
    RESET_PASSWORD_FAILURE,
    RESEND_VERIFICATION_REQUEST, RESEND_VERIFICATION_SUCCESS, RESEND_VERIFICATION_FAILURE,
    RESEND_OTP_REQUEST, 
    RESEND_OTP_SUCCESS, RESEND_OTP_FAILURE,
    CLEAR_AUTH_MESSAGE, CLEAR_AUTH_ERROR,
  } from '../actiontypes/authTypes';
  
  const initialState = {
    loading: false,
    loadingAction: null,
    user: null,
    token: null,
    error: null,
    msg: null,
    isAuthenticated: false,
    success: false
  };
  
  export const authReducer = (state = initialState, action) => {
    switch (action.type) {
      // Request cases
      case REGISTER_REQUEST:
      case VERIFY_ACCOUNT_REQUEST:
      case LOGIN_REQUEST:
      case LOGOUT_REQUEST:
      case FORGOT_PASSWORD_REQUEST:
      case RESET_PASSWORD_REQUEST:
      case RESEND_VERIFICATION_REQUEST:
      case RESEND_OTP_REQUEST:
        return {
          ...state,
          loading: true,
          loadingAction: action.type,
          error: null,
          success: false
        };
  
      // Authentication success cases
      case REGISTER_SUCCESS:
      case LOGIN_SUCCESS:
        return {
          ...state,
          loading: false,
          loadingAction: null,
          user: action.payload.user,
          token: action.payload.token,
          msg: action.payload.msg,
          isAuthenticated: true,
          success: true,
          error: null
        };
  
      // Verification success case
      case VERIFY_ACCOUNT_SUCCESS:
        return {
          ...state,
          loading: false,
          loadingAction: null,
          msg: action.payload.msg,
          user: {
            ...state.user,
            isVerified: true
          },
          success: true,
          error: null
        };
  
      // Logout success
      case LOGOUT_SUCCESS:
        return {
          ...initialState,
          msg: 'Logged out successfully',
          success: true
        };
  
      // Other success cases
      case FORGOT_PASSWORD_SUCCESS:
      case RESET_PASSWORD_SUCCESS:
      case RESEND_VERIFICATION_SUCCESS:
      case RESEND_OTP_SUCCESS:
        return {
          ...state,
          loading: false,
          loadingAction: null,
          msg: action.payload.msg,
          success: true,
          error: null
        };
  
      // Failure cases
      case REGISTER_FAILURE:
      case VERIFY_ACCOUNT_FAILURE:
      case LOGIN_FAILURE:
      case LOGOUT_FAILURE:
      case FORGOT_PASSWORD_FAILURE:
      case RESET_PASSWORD_FAILURE:
      case RESEND_VERIFICATION_FAILURE:
      case RESEND_OTP_FAILURE:
        return {
          ...state,
          loading: false,
          loadingAction: null,
          error: action.payload.msg,
          success: false
        };
  
      // Clear states
      case CLEAR_AUTH_MESSAGE:
        return {
          ...state,
          msg: null
        };
  
      case CLEAR_AUTH_ERROR:
        return {
          ...state,
          error: null
        };
  
      default:
        return state;
    }
  };