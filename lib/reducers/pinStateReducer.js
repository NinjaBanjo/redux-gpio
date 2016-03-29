/* @flow */
initialState: Immutable.Map;
initialPinState: Immutable.Map;

import Immutable from 'immutable';

import {
  WRITE_PIN,
  READ_PIN,
  INVALIDATE_PIN,
  SET_PIN_OPTIONS
} from '../constants/actionTypes';

import type { Action } from '../store';

import type { Mode, PUD } from '../modules/wpi';

const initialState = Immutable.Map({});
const initialPinState = Immutable.Map({
  value: 0,
  isOpen: false,
  isChanging: false,
  didInvalidate: false
});

export type PinOptions = {
  mode: MODE,
  pud: PUD
}

export type Payload = {
  pin: number,
  value?: number,
  options?: PinOptions
}

export default (state: Immutable.Map = initialState, action: Action): Immutable.Map => {
  const pin = action.payload && action.payload.pin ? action.payload.pin : undefined;
  if(!pin) return state; // if we don't get a pin, we can't do anything
  switch(action.type) {
    case READ_PIN:
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
    case SET_PIN_OPTIONS:
      return state.set(pin,
        getPinState(state, pin).merge({
          options: action.payload.options
        })
      );
    default:
      return state;
  }
};

export function getPinState(state: Immutable.Map, pin: number): Immutable.Map {
  return state.has(pin) ? state.get(pin) : initialPinState;
}
