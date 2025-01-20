import { combineReducers } from 'redux';
import exampleReducer from './exampleReducer'; // Example reducer

const rootReducer = combineReducers({
  example: exampleReducer,
});

export default rootReducer;