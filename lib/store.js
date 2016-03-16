import Immutable from 'immutable'
import { createStore } from 'redux';
import { combineReducers } from 'redux-immutable';

import * as reducers from './reducers';

const initialState = Immutable.Map();
const rootReducer = combineReducers(reducers);

export default createStore(rootReducer);
