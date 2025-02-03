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
  
    
    const initialState = {
      basicAnalytics: null,
      typeDistribution: null,
      statusDistribution: null,
      monthlyTrend: null,
      locationHotspots: null,
      loading: {
        basic: false,
        type: false,
        status: false,
        monthly: false,
        location: false
      },
      error: {
        basic: null,
        type: null,
        status: null,
        monthly: null,
        location: null
      }
    };
    
    export const dashboardReducer = (state = initialState, action) => {
      switch (action.type) {
        // Basic Analytics
        case GET_BASIC_ANALYTICS_REQUEST:
          return {
            ...state,
            loading: { ...state.loading, basic: true },
            error: { ...state.error, basic: null }
          };
        case GET_BASIC_ANALYTICS_SUCCESS:
          return {
            ...state,
            basicAnalytics: action.payload,
            loading: { ...state.loading, basic: false }
          };
        case GET_BASIC_ANALYTICS_FAIL:
          return {
            ...state,
            loading: { ...state.loading, basic: false },
            error: { ...state.error, basic: action.payload }
          };
    
        // Type Distribution
        case GET_TYPE_DISTRIBUTION_REQUEST:
          return {
            ...state,
            loading: { ...state.loading, type: true },
            error: { ...state.error, type: null }
          };
        case GET_TYPE_DISTRIBUTION_SUCCESS:
          return {
            ...state,
            typeDistribution: action.payload,
            loading: { ...state.loading, type: false }
          };
        case GET_TYPE_DISTRIBUTION_FAIL:
          return {
            ...state,
            loading: { ...state.loading, type: false },
            error: { ...state.error, type: action.payload }
          };
    
        // Status Distribution
        case GET_STATUS_DISTRIBUTION_REQUEST:
          return {
            ...state,
            loading: { ...state.loading, status: true },
            error: { ...state.error, status: null }
          };
        case GET_STATUS_DISTRIBUTION_SUCCESS:
          return {
            ...state,
            statusDistribution: action.payload,
            loading: { ...state.loading, status: false }
          };
        case GET_STATUS_DISTRIBUTION_FAIL:
          return {
            ...state,
            loading: { ...state.loading, status: false },
            error: { ...state.error, status: action.payload }
          };
    
        // Monthly Trend
        case GET_MONTHLY_TREND_REQUEST:
          return {
            ...state,
            loading: { ...state.loading, monthly: true },
            error: { ...state.error, monthly: null }
          };
        case GET_MONTHLY_TREND_SUCCESS:
          return {
            ...state,
            monthlyTrend: action.payload,
            loading: { ...state.loading, monthly: false }
          };
        case GET_MONTHLY_TREND_FAIL:
          return {
            ...state,
            loading: { ...state.loading, monthly: false },
            error: { ...state.error, monthly: action.payload }
          };
    
        // Location Hotspots
        case GET_LOCATION_HOTSPOTS_REQUEST:
          return {
            ...state,
            loading: { ...state.loading, location: true },
            error: { ...state.error, location: null }
          };
        case GET_LOCATION_HOTSPOTS_SUCCESS:
          return {
            ...state,
            locationHotspots: action.payload,
            loading: { ...state.loading, location: false }
          };
        case GET_LOCATION_HOTSPOTS_FAIL:
          return {
            ...state,
            loading: { ...state.loading, location: false },
            error: { ...state.error, location: action.payload }
          };
    
        default:
          return state;
      }
    };