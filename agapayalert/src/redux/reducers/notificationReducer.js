import {
  GET_NOTIFICATIONS,
  GET_NOTIFICATIONS_SUCCESS,
  GET_NOTIFICATIONS_FAIL,
  GET_NOTIFICATION_DETAILS,
  GET_NOTIFICATION_DETAILS_SUCCESS,
  GET_NOTIFICATION_DETAILS_FAIL,
  MARK_NOTIFICATION_READ,
  MARK_NOTIFICATION_READ_SUCCESS,
  MARK_NOTIFICATION_READ_FAIL,
  CREATE_BROADCAST_NOTIFICATION,
  CREATE_BROADCAST_NOTIFICATION_SUCCESS,
  CREATE_BROADCAST_NOTIFICATION_FAIL,
  SET_NOTIFICATION_FILTER,
  CLEAR_NOTIFICATION_FILTER
} from "../actiontypes/notificationTypes";

const initialState = {
  notifications: [],
  currentNotification: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    hasMore: false,
  },
  filter: null,
};

export const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    // Request cases
    case GET_NOTIFICATIONS:
    case GET_NOTIFICATION_DETAILS:
    case MARK_NOTIFICATION_READ:
    case CREATE_BROADCAST_NOTIFICATION:
      return {
        ...state,
        loading: true,
        error: null,
      };

    // Success cases
    case GET_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications: action.payload.isNewSearch
          ? action.payload.notifications
          : [...state.notifications, ...action.payload.notifications],
        pagination: {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
          hasMore: action.payload.hasMore,
        },
      };

    case GET_NOTIFICATION_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        currentNotification: action.payload,
      };

    case MARK_NOTIFICATION_READ_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications: state.notifications.map((notification) =>
          notification._id === action.payload._id
            ? { ...notification, isRead: true }
            : notification
        ),
      };

    case CREATE_BROADCAST_NOTIFICATION_SUCCESS:
      return {
        ...state,
        loading: false,
        // Optionally add the new broadcast notification to the list
        notifications: [action.payload, ...state.notifications],
      };

    // Failure cases
    case GET_NOTIFICATIONS_FAIL:
    case GET_NOTIFICATION_DETAILS_FAIL:
    case MARK_NOTIFICATION_READ_FAIL:
    case CREATE_BROADCAST_NOTIFICATION_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Filter utility
    case SET_NOTIFICATION_FILTER:
      return {
        ...state,
        filter: action.payload,
      };
    case CLEAR_NOTIFICATION_FILTER:
      return {
        ...state,
        filter: null,
      };

    default:
      return state;
  }
};