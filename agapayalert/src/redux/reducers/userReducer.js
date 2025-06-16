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
  
      // Request cases
    case GET_USER_LIST_REQUEST:
    case CREATE_USER_REQUEST:
      return {
        ...state,
        loading: true,
        loadingAction: action.type,
        error: null,
        success: false,
      };

    // Success cases
    case GET_USER_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload.currentPage === 1 ? action.payload.users : [...state.users, ...action.payload.users],
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
        hasMore: action.payload.hasMore,
        error: null,
      };

    case CREATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingAction: null,
        users: [...state.users, action.payload.user],
        message: "User created successfully",
        success: true,
        error: null,
      };

    // Failure cases
    case GET_USER_LIST_FAILURE:
    case CREATE_USER_FAILURE:
      return {
        ...state,
        loading: false,
        loadingAction: null,
        error: action.payload.msg,
        success: false,
      };

    // Clear states
    case CLEAR_USER_MESSAGE:
      return {
        ...state,
        message: null,
      };

    case CLEAR_USER_ERROR:
      return {
        ...state,
        error: null,
      };

    case UPDATE_DUTY_REQUEST:
      return {
        ...state,
        loading: true,
        loadingAction: action.type,
        error: null,
        success: false,
      };

    case UPDATE_DUTY_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingAction: null,
        dutyStatus: {
          isOnDuty: action.payload.isOnDuty,
          lastDutyChange: action.payload.lastDutyChange,
          dutyHistory: action.payload.dutyHistory,
        },
        success: true,
        error: null,
      };

    case UPDATE_DUTY_FAILURE:
      return {
        ...state,
        loading: false,
        loadingAction: null,
        error: action.payload,
        success: false,
      };

    // Police Station Officers Cases
    case GET_POLICE_STATION_OFFICERS_REQUEST:
      return {
        ...state,
        loading: true,
        loadingAction: action.type,
        error: null,
      };

      case GET_POLICE_STATION_OFFICERS_SUCCESS:
        return {
          ...state,
          loading: false,
          loadingAction: null,
          policeStation: {
            ...action.payload.policeStation,
            officers: action.payload.officers,
            summary: action.payload.summary,
          },
          error: null,
        };

    case GET_POLICE_STATION_OFFICERS_FAILURE:
      return {
        ...state,
        loading: false,
        loadingAction: null,
        error: action.payload,
        policeStation: {
          ...state.policeStation,
          officers: [],
          summary: null,
        },
      };

    default:
      return state;
  }
};
