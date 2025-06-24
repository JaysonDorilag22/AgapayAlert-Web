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
    GET_LOCATION_HOTSPOTS_FAIL,
    GET_USER_DEMOGRAPHICS_REQUEST,
    GET_USER_DEMOGRAPHICS_SUCCESS,
    GET_USER_DEMOGRAPHICS_FAIL,
    GET_OFFICER_RANKINGS_REQUEST,
    GET_OFFICER_RANKINGS_SUCCESS,
    GET_OFFICER_RANKINGS_FAIL
  } from '@/redux/actiontypes/dashboardTypes';
  
    
    const initialState = {
      basicAnalytics: null,
      typeDistribution: null,
      statusDistribution: null,
      monthlyTrend: null,
      locationHotspots: null,
      userDemographics: null,
      officerRankings: null,
      loading: {
        basic: false,
        type: false,
        status: false,
        monthly: false,
        location: false,
        demographics: false,
        rankings: false
      },
      error: {
        basic: null,
        type: null,
        status: null,
        monthly: null,
        location: null,
        demographics: null,
        rankings: null
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
    
        // User Demographics
    case GET_USER_DEMOGRAPHICS_REQUEST:
      return {
        ...state,
        loading: { ...state.loading, demographics: true },
        error: { ...state.error, demographics: null }
      };
    case GET_USER_DEMOGRAPHICS_SUCCESS:
      return {
        ...state,
        userDemographics: action.payload,
        loading: { ...state.loading, demographics: false }
      };
    case GET_USER_DEMOGRAPHICS_FAIL:
      return {
        ...state,
        loading: { ...state.loading, demographics: false },
        error: { ...state.error, demographics: action.payload }
      };

    // Officer Rankings
    case GET_OFFICER_RANKINGS_REQUEST:
      return {
        ...state,
        loading: { ...state.loading, rankings: true },
        error: { ...state.error, rankings: null }
      };
    case GET_OFFICER_RANKINGS_SUCCESS:
      return {
        ...state,
        officerRankings: action.payload,
        loading: { ...state.loading, rankings: false }
      };
    case GET_OFFICER_RANKINGS_FAIL:
      return {
        ...state,
        loading: { ...state.loading, rankings: false },
        error: { ...state.error, rankings: action.payload }
      };

    default:
      return state;
  }
};