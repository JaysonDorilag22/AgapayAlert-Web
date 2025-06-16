import axios from 'axios';
import {
  GET_USER_REQUEST, GET_USER_SUCCESS, GET_USER_FAILURE,
  UPDATE_USER_REQUEST, UPDATE_USER_SUCCESS, UPDATE_USER_FAILURE,
  CHANGE_PASSWORD_REQUEST, CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAILURE,
  DELETE_USER_REQUEST, DELETE_USER_SUCCESS, DELETE_USER_FAILURE,GET_USER_LIST_REQUEST,
  GET_USER_LIST_SUCCESS,
  GET_USER_LIST_FAILURE,
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE,
  UPDATE_DUTY_REQUEST,
  UPDATE_DUTY_SUCCESS,
  UPDATE_DUTY_FAILURE,
  GET_POLICE_STATION_OFFICERS_REQUEST,
  GET_POLICE_STATION_OFFICERS_SUCCESS,
  GET_POLICE_STATION_OFFICERS_FAILURE,
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
    // Let browser set Content-Type for FormData
    if (userDetails instanceof FormData) {
      for (let pair of userDetails.entries()) {
        console.log(pair[0]+ ':', pair[1]);
      }
    } else {
      console.log("userDetails object:", userDetails);
    }
    const config = {
      withCredentials: true,
    };

    let formData;
    if (userDetails instanceof FormData) {
      formData = userDetails;
    } else {
      formData = new FormData();
      Object.entries(userDetails).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
          Object.entries(value).forEach(([subKey, subValue]) => {
            formData.append(`${key}[${subKey}]`, subValue);
          });
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
    }
    console.log('Updating user with FormData:', formData);

    // Debug: log formData
    // for (let pair of formData.entries()) { console.log(pair[0]+ ': ' + pair[1]); }

    const { data } = await axios.put(
      `${server}/user/${userId}`,
      formData,
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

// In src/redux/actions/userActions.js
export const getUserList = (params = {}) => async (dispatch) => {
  dispatch({ type: GET_USER_LIST_REQUEST });
  try {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 10,
      ...(params.role && { role: params.role }),
      ...(params.search && { search: params.search })
    }).toString();

    const { data } = await axios.get(
      `${server}/user/list?${queryParams}`, 
      { withCredentials: true }
    );

    dispatch({
      type: GET_USER_LIST_SUCCESS,
      payload: data.data
    });

    return { success: true, data: data.data };
  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({ type: GET_USER_LIST_FAILURE, payload: message });
    return { success: false, error: message };
  }
};

// Create user
export const createUser = (userDetails) => async (dispatch) => {
  dispatch({ type: UPDATE_USER_REQUEST });
  try {
    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    };
    const { data } = await axios.post(
      `${server}/user`,
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

// Create user with role
export const createUserWithRole = (userData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_USER_REQUEST });

    const config = {
      headers: { 
        "Content-Type": "multipart/form-data"
      },
      withCredentials: true
    };

    // Create FormData object
    const formData = new FormData();
    
    // Append basic user info
    formData.append('firstName', userData.get('firstName'));
    formData.append('lastName', userData.get('lastName'));
    formData.append('email', userData.get('email'));
    formData.append('password', userData.get('password'));
    formData.append('number', userData.get('number'));
    formData.append('role', userData.get('role'));
    formData.append('rank', userData.get('rank'));

    // Append police station if provided
    if (userData.get('policeStationId')) {
      formData.append('policeStationId', userData.get('policeStationId'));
    }

    // Append address fields
    formData.append('address[streetAddress]', userData.get('address[streetAddress]'));
    formData.append('address[barangay]', userData.get('address[barangay]'));
    formData.append('address[city]', userData.get('address[city]'));
    formData.append('address[zipCode]', userData.get('address[zipCode]'));

    // Append avatar if exists
    const avatar = userData.get('avatar');
    if (avatar) {
      formData.append('avatar', avatar);
    }

    const { data } = await axios.post(
      `${server}/user/create`,
      formData,
      config
    );

    dispatch({
      type: CREATE_USER_SUCCESS,
      payload: data.data
    });

    return { success: true, data: data.data };

  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: CREATE_USER_FAILURE,
      payload: message
    });
    return { success: false, error: message };
  }
};

export const updateDutyStatus = (isOnDuty) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_DUTY_REQUEST });

    const { data } = await axios.put(
      `${server}/user/duty-status/update`,
      { isOnDuty },
      { withCredentials: true }
    );

    dispatch({
      type: UPDATE_DUTY_SUCCESS,
      payload: {
        isOnDuty: data.data.isOnDuty,
        lastDutyChange: data.data.lastDutyChange,
        dutyHistory: data.data.dutyHistory
      }
    });

    return { success: true, data: data.data };

  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: UPDATE_DUTY_FAILURE,
      payload: message
    });
    return { success: false, error: message };
  }
};

// Get police station officers
export const getPoliceStationOfficers = (policeStationId) => async (dispatch) => {
  try {
    dispatch({ type: GET_POLICE_STATION_OFFICERS_REQUEST });
    
    const { data } = await axios.get(
      `${server}/user/police-station/${policeStationId}/officers`,
      { withCredentials: true }
    );

    dispatch({
      type: GET_POLICE_STATION_OFFICERS_SUCCESS,
      payload: {
        policeStation: data.data.policeStation,
        officers: data.data.officers,
        summary: data.data.summary
      }
    });

    console.log('Summary:', data.data.summary);
   
    return { success: true, data: data.data };

  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: GET_POLICE_STATION_OFFICERS_FAILURE, 
      payload: message
    });
    return { success: false, error: message };
  }
};

// Clear states
export const clearUserMessage = () => ({ type: CLEAR_USER_MESSAGE });
export const clearUserError = () => ({ type: CLEAR_USER_ERROR });
