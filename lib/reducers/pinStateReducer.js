/* @flow */
initialState: Immutable.Map;
initialPinState: Immutable.Map;

import Immutable from 'immutable';

import {
  CHANGE_PIN,
  WRITE_PIN,
  INVALIDATE_PIN,
  OPEN_PIN,
  CLOSE_PIN
} from '../constants/actionTypes';
// Import SOME_ACTION here

const initialState = Immutable.Map({});
const initialPinState = Immutable.Map({
  value: 0,
  open: false,
  isChanging: false,
  didInvalidate: false
});

export type Action = {
  type: string,
  pin: number,
  value?: number
}

export default (state: Immutable.Map = initialState, action: Action): Immutable.Map => {
  switch(action.type) {
    case CHANGE_PIN:
      return state.set(action.pin,
        getPinState(state, action.pin).merge({
            value: action.value,
            isChanging: false
        })
      );
    case WRITE_PIN:
      return state.set(action.pin,
        getPinState(state, action.pin).merge({
          isChanging: true
        })
      );
    case INVALIDATE_PIN:
      return state.set(action.pin,
        getPinState(state, action.pin).merge({
          didInvalidate: true
        })
      );
    case OPEN_PIN:
      return state.set(action.pin,
        getPinState(state, action.pin).set('open'), true);
    case CLOSE_PIN:
      return state.set(action.pin,
        getPinState(state, action.pin).set('open', false));
    default:
      return state;
  }
}

function getPinState(state, pin) {
  return state.has(pin) ? state.get(pin) : initialPinState;
}
