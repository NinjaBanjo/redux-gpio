/* @flow */
import Immutable from 'immutable';
import { createStore, applyMiddleware } from 'redux';
import { combineReducers } from 'redux-immutable';
import thunk from 'redux-thunk';

import * as reducers from './reducers';

const rootReducer = combineReducers(reducers);

export default createStore(rootReducer, applyMiddleware(thunk));
