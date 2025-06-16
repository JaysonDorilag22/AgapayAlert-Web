import axios from "axios";
import {server} from "../store";
import {
  POLICE_STATION_SEARCH_REQUEST,
  POLICE_STATION_SEARCH_SUCCESS,
  POLICE_STATION_SEARCH_FAIL,
  POLICE_STATION_LIST_REQUEST,
  POLICE_STATION_LIST_SUCCESS,
  POLICE_STATION_LIST_FAIL,
  // Add these new types to your policeStationType.js file
  POLICE_STATION_CREATE_REQUEST,
  POLICE_STATION_CREATE_SUCCESS,
  POLICE_STATION_CREATE_FAIL,
  POLICE_STATION_DETAILS_REQUEST,
  POLICE_STATION_DETAILS_SUCCESS,
  POLICE_STATION_DETAILS_FAIL,
  POLICE_STATION_UPDATE_REQUEST,
  POLICE_STATION_UPDATE_SUCCESS,
  POLICE_STATION_UPDATE_FAIL,
  POLICE_STATION_DELETE_REQUEST,
  POLICE_STATION_DELETE_SUCCESS,
  POLICE_STATION_DELETE_FAIL,
  POLICE_STATION_CLEAR_ERRORS,
  POLICE_STATION_CLEAR_SEARCH,
} from "../actiontypes/policeStationTypes";

// Search Police Stations (existing - keeping your implementation)
export const searchPoliceStations = (searchData) => async (dispatch) => {
  try {
    dispatch({ type: POLICE_STATION_SEARCH_REQUEST });
console.log(searchData)
    // Validate search data has either coordinates or address
    if (!searchData?.coordinates && !searchData?.address) {
      throw new Error("Missing location data");
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    // Make API request with search data
    const { data } = await axios.post(`${server}/police-station/search`, searchData, config);

    // Map the data including both distance fields
    const mappedStations = data.policeStations.map((station) => ({
      ...station,
      estimatedRoadDistance: station.estimatedRoadDistance || null,
      directDistance: station.directDistance || null,
    }));

    // Dispatch success with response data
    dispatch({
      type: POLICE_STATION_SEARCH_SUCCESS,
      payload: {
        policeStations: mappedStations,
        coordinates: data.searchCoordinates,
        addressUsed: data.addressUsed,
        searchRadius: data.searchRadius || 5,
        searchMethod: data.searchMethod,
        totalFound: data.totalFound,
        nearestStation: data.nearestStation,
      },
    });

    return {
      success: true,
      data: mappedStations,
    };
  } catch (error) {
    const errorMessage = error.response?.data?.msg || error.message;
    dispatch({
      type: POLICE_STATION_SEARCH_FAIL,
      payload: errorMessage,
    });
    return { success: false, error: errorMessage };
  }
};

// Get Police Stations (existing - keeping your implementation)
export const getPoliceStations = () => async (dispatch) => {
  try {
    dispatch({ type: POLICE_STATION_LIST_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    const { data } = await axios.get(
      `${server}/police-station`,
      config
    );

    dispatch({
      type: POLICE_STATION_LIST_SUCCESS,
      payload: data
    });

    return { success: true, data };

  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: POLICE_STATION_LIST_FAIL,
      payload: message
    });
    return { success: false, error: message };
  }
};

// Create Police Station
export const createPoliceStation = (policeStationData) => async (dispatch) => {
  try {
    dispatch({ type: POLICE_STATION_CREATE_REQUEST });

    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    };
    console.log("Creating Police Station with data:", policeStationData);
    // Validate required fields
    
    const { data } = await axios.post(
      `${server}/police-station`,
      policeStationData,
      config
    );

    dispatch({
      type: POLICE_STATION_CREATE_SUCCESS,
      payload: data,
    });

    return { success: true, data };
  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: POLICE_STATION_CREATE_FAIL,
      payload: message,
    });
    return { success: false, error: message };
  }
};

// Get Police Station by ID
export const getPoliceStationById = (policeStationId) => async (dispatch) => {
  try {
    dispatch({ type: POLICE_STATION_DETAILS_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    const { data } = await axios.get(
      `${server}/police-station/${policeStationId}`,
      config
    );

    dispatch({
      type: POLICE_STATION_DETAILS_SUCCESS,
      payload: data
    });

    return { success: true, data };

  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: POLICE_STATION_DETAILS_FAIL,
      payload: message
    });
    return { success: false, error: message };
  }
};

// Update Police Station
export const updatePoliceStation = (policeStationId, updateData) => async (dispatch) => {
  try {
    dispatch({ type: POLICE_STATION_UPDATE_REQUEST });

    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    };

    const { data } = await axios.put(
      `${server}/police-station/${policeStationId}`,
      updateData,
      config
    );

    dispatch({
      type: POLICE_STATION_UPDATE_SUCCESS,
      payload: data
    });

    return { success: true, data };
  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: POLICE_STATION_UPDATE_FAIL,
      payload: message
    });
    return { success: false, error: message };
  }
};

// Delete Police Station
export const deletePoliceStation = (policeStationId) => async (dispatch) => {
  try {
    dispatch({ type: POLICE_STATION_DELETE_REQUEST });

    const { data } = await axios.delete(
      `${server}/police-station/${policeStationId}`,
      { withCredentials: true }
    );

    dispatch({
      type: POLICE_STATION_DELETE_SUCCESS,
      payload: policeStationId,
    });

    return { success: true, data };
  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    console.log("Delete Error:", message);
    dispatch({
      type: POLICE_STATION_DELETE_FAIL,
      payload: message,
    });
    return { success: false, error: message };
  }
};

// Clear Police Station Errors
export const clearPoliceStationErrors = () => (dispatch) => {
  dispatch({ type: POLICE_STATION_CLEAR_ERRORS });
};

// Clear Search Results
export const clearSearchResults = () => (dispatch) => {
  dispatch({ type: POLICE_STATION_CLEAR_SEARCH });
};

// Get User's Police Station (for police officers/admins)
export const getUserPoliceStation = () => async (dispatch) => {
  try {
    const user = await AsyncStorage.getItem('user');
    if (!user) {
      return { success: false, error: 'No user found' };
    }

    const userData = JSON.parse(user);
    if (!userData.policeStation) {
      return { success: false, error: 'User not assigned to a police station' };
    }

    // Get the police station details
    return await dispatch(getPoliceStationById(userData.policeStation));
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get Police Stations by City
export const getPoliceStationsByCity = (cityId) => async (dispatch) => {
  try {
    dispatch({ type: POLICE_STATION_LIST_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    const { data } = await axios.get(
      `${server}/police-station?city=${cityId}`,
      config
    );

    dispatch({
      type: POLICE_STATION_LIST_SUCCESS,
      payload: data
    });

    return { success: true, data };

  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: POLICE_STATION_LIST_FAIL,
      payload: message
    });
    return { success: false, error: message };
  }
};

// Search with Current Location
export const searchPoliceStationsNearMe = (currentLocation) => async (dispatch) => {
  if (!currentLocation || !currentLocation.latitude || !currentLocation.longitude) {
    return { success: false, error: 'Current location is required' };
  }

  const searchData = {
    coordinates: [currentLocation.longitude, currentLocation.latitude]
  };

  return await dispatch(searchPoliceStations(searchData));
};

// Search with Address
export const searchPoliceStationsByAddress = (address) => async (dispatch) => {
  if (!address || !address.trim()) {
    return { success: false, error: 'Address is required' };
  }

  const searchData = {
    address: address.trim()
  };

  return await dispatch(searchPoliceStations(searchData));
};

// Bulk Actions for Admin Management
export const bulkDeletePoliceStations = (stationIds) => async (dispatch) => {
  try {
    const results = [];
    
    for (const stationId of stationIds) {
      const result = await dispatch(deletePoliceStation(stationId));
      results.push({ stationId, ...result });
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    return {
      success: failed === 0,
      results,
      summary: {
        total: stationIds.length,
        successful,
        failed
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};