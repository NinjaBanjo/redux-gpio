import Immutable from 'immutable'
import { createStore } from 'redux';
import { combineReducers } from 'redux-immutable';

import * as reducers from './reducers';

const initialState = Immutable.Map();
rootReducer = combineReducers(reducers);