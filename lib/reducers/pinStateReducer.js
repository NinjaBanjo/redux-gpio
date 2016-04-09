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

import wpi from 'wiring-pi';

const initialState = Immutable.Map({});
const initialOptions = {
  pud: wpi.PUD_DOWN,
  mode: wpi.INPUT
};
const initialPinState = Immutable.fromJS({
  value: 0,
  isOpen: false,
  isChanging: false,
  didInvalidate: false,
  options: initialOptions
});

export type PinOptions = Immutable.Map

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
            didInvalidate: false
        })
      );
    case WRITE_PIN:
      return state.set(pin,
        getPinState(state, pin).merge({
          value: action.payload.value,
          didInvalidate: false
        })
      );
    case INVALIDATE_PIN:
      return state.set(pin,
        getPinState(state, pin).merge({
          didInvalidate: true
        })
      );
    case SET_PIN_OPTIONS:
      console.log('options payload', action.payload.options);
      let pinState = getPinState(state, pin);
      return state.set(pin, pinState.mergeIn(['options'], action.payload.options));
    default:
      return state;
  }
};

export function getPinState(state: Immutable.Map, pin: number): Immutable.Map {
  return state.has(pin) ? state.get(pin) : initialPinState;
}
