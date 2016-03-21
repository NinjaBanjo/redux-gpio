/* @flow */
import Immutable from 'immutable';
import { createStore, applyMiddleware } from 'redux';
import { combineReducers } from 'redux-immutable';
import thunk from 'redux-thunk';

import * as reducers from './reducers';

import type { Action } from './actions';

const rootReducer = combineReducers(reducers);

export type Dispatch = (action: Action) => Promise | void;

export type Unsubscribe = () => void;

export type Store = {
  getStore: () => Immutable.Map,
  dispatch: Dispatch,
  subscribe: (fn: (newState: Immutable.Map) => void) => Unsubscribe;
};

export function makeStore(): Store {
  const store: Store = createStore(rootReducer, applyMiddleware(thunk));
  return store;
}
