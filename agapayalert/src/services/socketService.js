import { io } from 'socket.io-client';
import serverConfig from '@/config/serverConfig';
import { SOCKET_EVENTS } from '@/config/constants';

let socket = null;
const SOCKET_URL = serverConfig.socketURL;

// Helper function to extract token from cookie
const extractTokenFromCookie = (cookieString) => {
  if (!cookieString) return null;
  const tokenMatch = cookieString.match(/token=([^;]+)/);
  return tokenMatch ? tokenMatch[1] : null;
};

// Initialize socket connection
export const initializeSocket = async (token) => {
  try {
    if (socket?.connected) {
      return socket;
    }
    if (!token) {
      return null;
    }
    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      withCredentials: true
    });

    // Socket event listeners
    socket.on('connect', () => {
      console.log('Socket connected successfully');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socket.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        socket.connect();
      }
    });

    // Listen for new reports and updates
    socket.on(SOCKET_EVENTS.NEW_REPORT, (data) => {
      console.log('New report received:', data);
    });

    socket.on(SOCKET_EVENTS.REPORT_UPDATED, (data) => {
      console.log('Report updated:', data);
    });

    return socket;
  } catch (error) {
    console.error('Socket initialization error:', error);
    return null;
  }
};

// Join room (for police station or city)
export const joinRoom = (roomId) => {
  if (!socket?.connected || !roomId) {
    console.log('Socket not connected or invalid room');
    return;
  }
  socket.emit(SOCKET_EVENTS.JOIN_ROOM, roomId);
  console.log(`Joining room: ${roomId}`);
};

// Leave room
export const leaveRoom = (roomId) => {
  if (!socket?.connected || !roomId) return;
  socket.emit(SOCKET_EVENTS.LEAVE_ROOM, roomId);
  console.log(`Leaving room: ${roomId}`);
};

// Subscribe to new report events
export const subscribeToNewReports = (callback) => {
  if (!socket?.connected) return;
  socket.on(SOCKET_EVENTS.NEW_REPORT, callback);
};

// Subscribe to report update events
export const subscribeToReportUpdates = (callback) => {
  if (!socket?.connected) return;
  socket.on(SOCKET_EVENTS.REPORT_UPDATED, callback);
};

// Unsubscribe from events
export const unsubscribeFromReports = () => {
  if (!socket?.connected) return;
  socket.off(SOCKET_EVENTS.NEW_REPORT);
  socket.off(SOCKET_EVENTS.REPORT_UPDATED);
};

export const subscribeToOfficerUpdates = (callback) => {
  if (!socket?.connected) return;
  socket.on(SOCKET_EVENTS.OFFICER_UPDATED, callback);
  socket.on(SOCKET_EVENTS.DUTY_STATUS_CHANGED, callback);
};

export const unsubscribeFromUpdates = () => {
  if (!socket?.connected) return;
  socket.off(SOCKET_EVENTS.NEW_REPORT);
  socket.off(SOCKET_EVENTS.REPORT_UPDATED);
  socket.off(SOCKET_EVENTS.OFFICER_UPDATED);
  socket.off(SOCKET_EVENTS.DUTY_STATUS_CHANGED);
};

// Get socket instance
export const getSocket = () => socket;

// Disconnect socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default {
  initializeSocket,
  joinRoom,
  leaveRoom,
  subscribeToNewReports,
  subscribeToReportUpdates,
  unsubscribeFromReports,
  getSocket,
  disconnectSocket
};