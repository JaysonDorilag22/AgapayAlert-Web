// store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers/rootReducer'; // Assuming you have a rootReducer
import { authReducer} from './reducers/authReducer';
import { userReducer } from './reducers/userReducer';
import { reportReducer } from './reducers/reportReducer';

const store = configureStore({
  reducer: {
    root: rootReducer,
    auth: authReducer,
    user: userReducer,
    reports: reportReducer
  }

});

//wanel haus
export const server = "http://localhost:3000/api/v1";

export default store;