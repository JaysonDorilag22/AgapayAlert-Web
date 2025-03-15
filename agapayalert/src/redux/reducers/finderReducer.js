import * as types from '../actiontypes/finderTypes';

const initialState = {
    reports: [],
    currentReport: null,
    loading: false,
    error: null,
    success: false,
    count: 0,
    finderReports: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      total: 0,
      hasMore: false
    },
  };

  export const finderReducer = (state = initialState, action) => {
    console.log('ACTION reducer: ', action);
    switch (action.type) {
        // Request cases
        case types.CREATE_FINDER_REPORT_REQUEST:
        case types.GET_FINDER_REPORTS_REQUEST:
        case types.GET_FINDER_REPORT_DETAILS_REQUEST:
        case types.UPDATE_FINDER_REPORT_REQUEST:
        case types.GET_FINDER_REPORTS_ID_REQUEST:
          return {
            ...state,
            loading: true,
            error: null,
            success: false
          };
    
        // Success cases
        case types.CREATE_FINDER_REPORT_SUCCESS:
          return {
            ...state,
            loading: false,
            reports: [action.payload, ...state.reports],
            success: true,
            error: null
          };
    
        case types.GET_FINDER_REPORTS_SUCCESS:
          return {
            ...state,
            loading: false,
            reports: action.payload.isNewSearch 
              ? action.payload.reports 
              : [...state.reports, ...action.payload.reports],
            pagination: {
              currentPage: parseInt(action.payload.currentPage),
              totalPages: parseInt(action.payload.totalPages),
              total: parseInt(action.payload.total),
              hasMore: action.payload.hasMore
            },
            error: null
          };

        case types.GET_FINDER_REPORTS_ID_SUCCESS:
        return {
            ...state,
            loading: false,
            reports: [action.payload, ...state.reports],
            count: action.payload.count,
            finderReports: action.payload.finderReports,
            success: true,
            error: null
            };
    
        case types.GET_FINDER_REPORT_DETAILS_SUCCESS:
          return {
            ...state,
            loading: false,
            currentReport: action.payload,
            error: null
          };
    
        case types.UPDATE_FINDER_REPORT_SUCCESS:
          return {
            ...state,
            loading: false,
            reports: state.reports.map(report => 
              report._id === action.payload._id ? action.payload : report
            ),
            currentReport: action.payload,
            success: true,
            error: null
          };
    
        // Failure cases
        case types.CREATE_FINDER_REPORT_FAIL:
        case types.GET_FINDER_REPORTS_FAIL:
        case types.GET_FINDER_REPORT_DETAILS_FAIL:
        case types.GET_FINDER_REPORTS_ID_FAIL:
        case types.UPDATE_FINDER_REPORT_FAIL:
          return {
            ...state,
            loading: false,
            error: action.payload,
            success: false
          };
    
        default:
          return state;
      }
    };
    
    export default finderReducer;