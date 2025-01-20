import axios from "axios";
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
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAILURE,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
  RESEND_VERIFICATION_REQUEST,
  RESEND_VERIFICATION_SUCCESS,
  RESEND_VERIFICATION_FAILURE,
  RESEND_OTP_REQUEST,
  RESEND_OTP_SUCCESS,
  RESEND_OTP_FAILURE,
  CLEAR_AUTH_MESSAGE,
  CLEAR_AUTH_ERROR,
} from "../actiontypes/authTypes";
import {server} from "../store";

// Register user
export const register = (formData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const { data } = await axios.post(
      `${server}/auth/register`,
      formData,
      config
    );
    dispatch({ type: REGISTER_SUCCESS, payload: data });
    return { success: true, data };
  } catch (error) {
    const msg = error.response?.data?.msg || error.msg;
    dispatch({ type: REGISTER_FAILURE, payload: { msg: msg } });
    return { success: false, error: msg };
  }
};

// Verify account
export const verifyAccount = (verificationData) => async (dispatch) => {
  dispatch({ type: VERIFY_ACCOUNT_REQUEST });
  try {
    const { data } = await axios.post(
      `${server}/auth/verify-account`,
      verificationData
    );
    dispatch({ type: VERIFY_ACCOUNT_SUCCESS, payload: data });
    return { success: true, data };
  } catch (error) {
    const msg = error.response?.data?.msg || error.msg;
    dispatch({ type: VERIFY_ACCOUNT_FAILURE, payload: { msg: msg } });
    return { success: false, error: msg };
  }
};

// Login user
export const login = (credentials) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const { data } = await axios.post(
      `${server}/auth/login`,
      credentials
    );
    dispatch({ type: LOGIN_SUCCESS, payload: data });
    return { success: true, data };
  } catch (error) {
    const msg = error.response?.data?.msg || error.msg;
    dispatch({ type: LOGIN_FAILURE, payload: { msg: msg } });
    return { success: false, error: msg };
  }
};

// Logout user
export const logout = () => async (dispatch) => {
  dispatch({ type: LOGOUT_REQUEST });
  try {
    await axios.post(`${server}/auth/logout`);
    dispatch({ type: LOGOUT_SUCCESS });
    return { success: true };
  } catch (error) {
    const msg = error.response?.data?.msg || error.msg;
    dispatch({ type: LOGOUT_FAILURE, payload: { msg: msg } });
    return { success: false, error: msg };
  }
};

// Forgot password
export const forgotPassword = (email) => async (dispatch) => {
  dispatch({ type: FORGOT_PASSWORD_REQUEST });

  try {
    const { data } = await axios.post(
      `${server}/auth/forgot-password`,
      { email }
    );

    dispatch({
      type: FORGOT_PASSWORD_SUCCESS,
      payload: {
        msg: data.msg,
        email,
      },
    });

    return {
      success: true,
      data: {
        msg: data.msg,
        email,
      },
    };
  } catch (error) {
    // Extract error message from backend response
    const msg = error.response?.data?.msg || "Failed to send OTP";
    console.log(msg)
    dispatch({
      type: FORGOT_PASSWORD_FAILURE,
      payload: { msg },
    });

    return {
      success: false,
      error: msg,
    };
  }
};

// Reset password
export const resetPassword = (resetData) => async (dispatch) => {
  dispatch({ type: RESET_PASSWORD_REQUEST });
  try {
    const { data } = await axios.post(
      `${server}/auth/reset-password`,
      resetData
    );
    dispatch({ type: RESET_PASSWORD_SUCCESS, payload: data });
    return { success: true, data };
  } catch (error) {
    const msg = error.response?.data?.msg || error.msg;
    dispatch({ type: RESET_PASSWORD_FAILURE, payload: { msg: msg } });
    return { success: false, error: msg };
  }
};

// Resend verification
export const resendVerification = (email) => async (dispatch) => {
  dispatch({ type: RESEND_VERIFICATION_REQUEST });
  try {
    const { data } = await axios.post(
      `${server}/auth/resend-verification`,
      { email }
    );
    dispatch({ type: RESEND_VERIFICATION_SUCCESS, payload: data });
    return { success: true, data };
  } catch (error) {
    const msg = error.response?.data?.msg || error.msg;
    dispatch({ type: RESEND_VERIFICATION_FAILURE, payload: { msg: msg } });
    return { success: false, error: msg };
  }
};

// Resend OTP
export const resendOtp = (email) => async (dispatch) => {
  dispatch({ type: RESEND_OTP_REQUEST });
  try {
    const { data } = await axios.post(
      `${server}/auth/resend-otp`,
      { email }
    );
    dispatch({ type: RESEND_OTP_SUCCESS, payload: data });
    return { success: true, data };
  } catch (error) {
    const msg = error.response?.data?.msg || error.msg;
    dispatch({ type: RESEND_OTP_FAILURE, payload: { msg: msg } });
    return { success: false, error: msg };
  }
};

// Google Auth
export const googleAuth = (userInfo) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const { email, givenName, familyName, photo } = userInfo?.data?.user || {};
    const { data } = await axios.post(`${server}/auth/google`, {
      email,
      firstName: givenName,
      lastName: familyName,
      avatar: photo,
    });

    const actionType = data.exists ? LOGIN_SUCCESS : REGISTER_SUCCESS;
    dispatch({
      type: actionType,
      payload: {
        user: data.user || data,
        msg: data.exists
          ? "Logged in successfully"
          : "User registered successfully",
      },
    });
    return { success: true, data };
  } catch (error) {
    const msg = error.response?.data?.msg || error.msg;
    dispatch({ type: LOGIN_FAILURE, payload: { msg: msg } });
    return { success: false, error: msg };
  }
};

// Clear states
export const clearAuthMessage = () => ({ type: CLEAR_AUTH_MESSAGE });
export const clearAuthError = () => ({ type: CLEAR_AUTH_ERROR });
