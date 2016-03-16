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

export type Payload = {
  pin: number,
  value?: number
}

export type Action = {
  type: string,
  payload: Payload,
  error?: boolean
}

export default (state: Immutable.Map = initialState, action: Action): Immutable.Map => {
  switch(action.type) {
    case CHANGE_PIN:
      const pin = action.payload.pin;
      return state.set(pin,
        getPinState(state, pin).merge({
            value: action.payload.value,
            isChanging: false
        })
      );
    case WRITE_PIN:
      return state.set(pin,
        getPinState(state, pin).merge({
          isChanging: true
        })
      );
    case INVALIDATE_PIN:
      return state.set(pin,
        getPinState(state, pin).merge({
          didInvalidate: true
        })
      );
    case OPEN_PIN:
      return state.set(pin,
        getPinState(state, pin).set('open'), true);
    case CLOSE_PIN:
      return state.set(pin,
        getPinState(state, pin).set('open', false));
    default:
      return state;
  }
}

export function getPinState(state, pin) {
  return state.has(pin) ? state.get(pin) : initialPinState;
}
