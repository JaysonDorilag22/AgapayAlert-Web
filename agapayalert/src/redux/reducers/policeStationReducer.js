import {
  POLICE_STATION_SEARCH_REQUEST,
  POLICE_STATION_SEARCH_SUCCESS,
  POLICE_STATION_SEARCH_FAIL,
  POLICE_STATION_LIST_REQUEST,
  POLICE_STATION_LIST_SUCCESS,
  POLICE_STATION_LIST_FAIL,
  POLICE_STATION_SELECT,
  POLICE_STATION_CLEAR,
  // New action types
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

const initialState = {
  loading: false,
  error: null,
  policeStations: [],
  coordinates: null,
  addressUsed: null,
  searchRadius: null,
  selectedStation: null,
  // New state properties
  policeStationDetails: null,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  searchResults: [],
  searchMethod: null,
  totalFound: 0,
  nearestStation: null,
};

export const policeStationReducer = (state = initialState, action) => {
  switch (action.type) {
    case POLICE_STATION_SEARCH_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case POLICE_STATION_SEARCH_SUCCESS:
      return {
        ...state,
        loading: false,
        searchResults: action.payload.policeStations,
        policeStations: action.payload.policeStations, // Keep for backward compatibility
        coordinates: action.payload.coordinates,
        addressUsed: action.payload.addressUsed,
        searchRadius: action.payload.searchRadius,
        searchMethod: action.payload.searchMethod,
        totalFound: action.payload.totalFound,
        nearestStation: action.payload.nearestStation,
        error: null,
      };

    case POLICE_STATION_SEARCH_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        searchResults: [],
      };

    case POLICE_STATION_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case POLICE_STATION_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        policeStations: action.payload,
        error: null,
      };

    case POLICE_STATION_LIST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case POLICE_STATION_CREATE_REQUEST:
      return {
        ...state,
        createLoading: true,
        error: null,
      };

    case POLICE_STATION_CREATE_SUCCESS:
      return {
        ...state,
        createLoading: false,
        policeStations: [...state.policeStations, action.payload],
        error: null,
      };

    case POLICE_STATION_CREATE_FAIL:
      return {
        ...state,
        createLoading: false,
        error: action.payload,
      };

    case POLICE_STATION_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case POLICE_STATION_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        policeStationDetails: action.payload,
        error: null,
      };

    case POLICE_STATION_DETAILS_FAIL:
      return {
        ...state,
        loading: false,
        policeStationDetails: null,
        error: action.payload,
      };

    case POLICE_STATION_UPDATE_REQUEST:
      return {
        ...state,
        updateLoading: true,
        error: null,
      };

    case POLICE_STATION_UPDATE_SUCCESS:
      return {
        ...state,
        updateLoading: false,
        policeStations: state.policeStations.map(station =>
          station._id === action.payload._id ? action.payload : station
        ),
        policeStationDetails: action.payload,
        error: null,
      };

    case POLICE_STATION_UPDATE_FAIL:
      return {
        ...state,
        updateLoading: false,
        error: action.payload,
      };

    case POLICE_STATION_DELETE_REQUEST:
      return {
        ...state,
        deleteLoading: true,
        error: null,
      };

    case POLICE_STATION_DELETE_SUCCESS:
      return {
        ...state,
        deleteLoading: false,
        policeStations: state.policeStations.filter(
          station => station._id !== action.payload
        ),
        searchResults: state.searchResults.filter(
          station => station._id !== action.payload
        ),
        policeStationDetails: state.policeStationDetails?._id === action.payload 
          ? null 
          : state.policeStationDetails,
        selectedStation: state.selectedStation?._id === action.payload 
          ? null 
          : state.selectedStation,
        error: null,
      };

    case POLICE_STATION_DELETE_FAIL:
      return {
        ...state,
        deleteLoading: false,
        error: action.payload,
      };

    case POLICE_STATION_SELECT:
      return {
        ...state,
        selectedStation: action.payload,
      };

    case POLICE_STATION_CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    case POLICE_STATION_CLEAR_SEARCH:
      return {
        ...state,
        searchResults: [],
        coordinates: null,
        addressUsed: null,
        searchRadius: null,
        searchMethod: null,
        totalFound: 0,
        nearestStation: null,
        error: null,
      };

    case POLICE_STATION_CLEAR:
      return initialState;

    default:
      return state;
  }
};