import axios from 'axios';
import {server} from "../store";
import {
  GET_BASIC_ANALYTICS_REQUEST,
  GET_BASIC_ANALYTICS_SUCCESS,
  GET_BASIC_ANALYTICS_FAIL,
  GET_TYPE_DISTRIBUTION_REQUEST,
  GET_TYPE_DISTRIBUTION_SUCCESS,
  GET_TYPE_DISTRIBUTION_FAIL,
  GET_STATUS_DISTRIBUTION_REQUEST,
  GET_STATUS_DISTRIBUTION_SUCCESS,
  GET_STATUS_DISTRIBUTION_FAIL,
  GET_MONTHLY_TREND_REQUEST,
  GET_MONTHLY_TREND_SUCCESS,
  GET_MONTHLY_TREND_FAIL,
  GET_LOCATION_HOTSPOTS_REQUEST,
  GET_LOCATION_HOTSPOTS_SUCCESS,
  GET_LOCATION_HOTSPOTS_FAIL
} from '@/redux/actiontypes/dashboardTypes';

// Basic Analytics
export const getBasicAnalytics = () => async (dispatch) => {
  try {
    dispatch({ type: GET_BASIC_ANALYTICS_REQUEST });

    const { data } = await axios.get(
      `${server}/charts/basic-analytics`,
      { withCredentials: true }
    );

    dispatch({
      type: GET_BASIC_ANALYTICS_SUCCESS,
      payload: data.data
    });
    console.log(data.data);

    return { success: true, data: data.data };
  } catch (error) {
    dispatch({
      type: GET_BASIC_ANALYTICS_FAIL,
      payload: error.response?.data?.error || error.message
    });
    return { success: false, error: error.message };
  }
};

// Type Distribution
export const getTypeDistribution = () => async (dispatch) => {
  try {
    dispatch({ type: GET_TYPE_DISTRIBUTION_REQUEST });

    const { data } = await axios.get(
      `${server}/charts/type-distribution`,
      { withCredentials: true }
    );

    dispatch({
      type: GET_TYPE_DISTRIBUTION_SUCCESS,
      payload: data.data
    });

    return { success: true, data: data.data };
  } catch (error) {
    dispatch({
      type: GET_TYPE_DISTRIBUTION_FAIL,
      payload: error.response?.data?.error || error.message
    });
    return { success: false, error: error.message };
  }
};

// Status Distribution
export const getStatusDistribution = () => async (dispatch) => {
  try {
    dispatch({ type: GET_STATUS_DISTRIBUTION_REQUEST });

    const { data } = await axios.get(
      `${server}/charts/status-distribution`,
      { withCredentials: true }
    );

    dispatch({
      type: GET_STATUS_DISTRIBUTION_SUCCESS,
      payload: data.data
    });

    return { success: true, data: data.data };
  } catch (error) {
    dispatch({
      type: GET_STATUS_DISTRIBUTION_FAIL,
      payload: error.response?.data?.error || error.message
    });
    return { success: false, error: error.message };
  }
};

// Monthly Trend
export const getMonthlyTrend = () => async (dispatch) => {
  try {
    dispatch({ type: GET_MONTHLY_TREND_REQUEST });

    const { data } = await axios.get(
      `${server}/charts/monthly-trend`,
      { withCredentials: true }
    );

    dispatch({
      type: GET_MONTHLY_TREND_SUCCESS,
      payload: data.data
    });

    return { success: true, data: data.data };
  } catch (error) {
    dispatch({
      type: GET_MONTHLY_TREND_FAIL,
      payload: error.response?.data?.error || error.message
    });
    return { success: false, error: error.message };
  }
};

// Location Hotspots
export const getLocationHotspots = () => async (dispatch) => {
  try {
    dispatch({ type: GET_LOCATION_HOTSPOTS_REQUEST });

    const { data } = await axios.get(
      `${server}/charts/location-hotspots`,
      { withCredentials: true }
    );

    dispatch({
      type: GET_LOCATION_HOTSPOTS_SUCCESS,
      payload: data.data
    });

    return { success: true, data: data.data };
  } catch (error) {
    dispatch({
      type: GET_LOCATION_HOTSPOTS_FAIL,
      payload: error.response?.data?.error || error.message
    });
    return { success: false, error: error.message };
  }
};