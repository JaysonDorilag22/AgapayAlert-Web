// store.js
import axios from 'axios';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers/rootReducer'; // Assuming you have a rootReducer
import { authReducer} from './reducers/authReducer';
import { userReducer } from './reducers/userReducer';
import { reportReducer } from './reducers/reportReducer';
import { dashboardReducer } from './reducers/dashboardReducer';
import { broadcastReducer } from './reducers/broadcastReducer';
import { finderReducer } from './reducers/finderReducer';
import { notificationReducer } from './reducers/notificationReducer';

const token = localStorage.getItem('token');
console.log("token: ", token);
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const store = configureStore({
  reducer: {
    root: rootReducer,
    auth: authReducer,
    user: userReducer,
    reports: reportReducer,
    dashboard: dashboardReducer,
    broadcast: broadcastReducer,
    finder: finderReducer,
    notification: notificationReducer, 
  }

});

//wanel haus
export const server = "http://localhost:3000/api/v1";

// export const server = "https://agapayalert-server.onrender.com/api/v1";

export default store;