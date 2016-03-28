/* @flow */
initialState: Immutable.Map;
initialPinState: Immutable.Map;

import Immutable from 'immutable';

import {
  CHANGE_PIN,
  WRITE_PIN,
  INVALIDATE_PIN,
  OPEN_PIN,
  OPEN_PIN_SUCCESS,
  CLOSE_PIN,
  CLOSE_PIN_SUCCESS
} from '../constants/actionTypes';

const initialState = Immutable.Map({});
const initialPinState = Immutable.Map({
  value: 0,
  isOpen: false,
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
  const pin = action.payload && action.payload.pin ? action.payload.pin : undefined;
  if(!pin) return state; // if we don't get a pin, we can't do anything
  switch(action.type) {
    case CHANGE_PIN:
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
      return state.set(pin, getPinState(state, pin).set('isChanging', true));
    case CLOSE_PIN:
      return state.set(pin, getPinState(state, pin).set('isChanging', true));
    default:
      return state;
  }
};

export function getPinState(state: Immutable.Map, pin: number): Immutable.Map {
  return state.has(pin) ? state.get(pin) : initialPinState;
}
