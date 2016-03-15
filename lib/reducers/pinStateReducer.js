/* @flow */
initialState: Immutable.Map;
initialPinState: Immutable.Map;

import Immutable from 'immutable';

import {
  PIN_CHANGE,
  PIN_OPEN,
  PIN_CLOSE
} from '../constants/actionTypes';
// Import SOME_ACTION here

const initialState = Immutable.Map({});
const initialPinState = Immutable.Map({
  value: 0,
  open: false
});

export default (state: Immutable.Map = initialState, action: Object): Immutable.Map => {
  switch(action.type) {
    case PIN_CHANGE:
      return state.set(action.pin,
        getPinState(state, action.pin).set('value', action.value));
    case PIN_OPEN:
      return state.set(action.pin,
        getPinState(state, action.pin).set('open'), true);
    case PIN_CLOSE:
      return state.set(action.pin,
        getPinState(state, action.pin).set('open', false));
    default:
      return state;
  }
}

function getPinState(state, pin) {
  return state.has(pin) ? state.get(pin) : initialPinState;
}