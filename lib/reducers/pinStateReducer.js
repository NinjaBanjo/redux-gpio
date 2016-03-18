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

import gpioHelper from '../helpers/gpioHelper';

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
  let pin;
  switch(action.type) {
    case CHANGE_PIN:
      pin = action.payload.pin;
      return state.set(pin,
        getPinState(state, pin).merge({
            value: action.payload.value,
            isChanging: false
        })
      );
    case WRITE_PIN:
      pin = action.payload.pin;
      if(!getPinState(state, pin).get('isChanging')) {
        gpioHelper.write(pin, action.payload.value);
        return state.set(pin,
          getPinState(state, pin).merge({
            isChanging: true
          })
        );
      }
      return state;
    case INVALIDATE_PIN:
      pin = action.payload.pin;
      if(getPinState(state, pin).get('didInvalidate') !== true) {
        // Kick off the read that will result in a change dispatch
        gpioHelper.read(pin);
        // Mark the state invalid so we don't try to read while we are reading
        return state.set(pin,
          getPinState(state, pin).merge({
            didInvalidate: true
          })
        );;
      }
      return state;
    case OPEN_PIN:
      pin = action.payload.pin;
      if(!getPinState(state, pin).get('isChanging')) {
        gpioHelper.open(pin);
        return state.set(pin, getPinState(state, pin).set('isChanging', true));
      }
      return state;
    case OPEN_PIN_SUCCESS:
      pin = action.payload.pin;
      return state.set(pin,
        getPinState(state, pin).merge({
          isOpen: true,
          isChanging: false
        })
      );
    case CLOSE_PIN:
      pin = action.payload.pin;
      if(getPinState(state, pin).get('isChanging') !== true) {
        gpioHelper.close(pin);
        return state.set(pin, getPinState(state, pin).set('isChanging', true));
      }
      return state;
    case CLOSE_PIN_SUCCESS:
      pin = action.payload.pin;
      return state.set(pin,
        getPinState(state, pin).merge({
          value: 0,
          isOpen: false,
          isChanging: false,
        })
      );
    default:
      return state;
  }
};

export function getPinState(state: Immutable.Map, pin: number): Immutable.Map {
  return state.has(pin) ? state.get(pin) : initialPinState;
}
