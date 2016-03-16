/* @flow */
import { createAction } from 'redux-actions';

import {
  CHANGE_PIN,
  WRITE_PIN,
  INVALIDATE_PIN,
  OPEN_PIN,
  CLOSE_PIN
} from '../constants/actionTypes';

export type PinAction = {
  type: string;
  pin: number;
  value?: number;
}

export const change = createAction(CHANGE_PIN, (pin: number, value: number): PinAction => {
  return { pin, value };
});

export function write(pin: number, value: number): PinAction {
  return {
    type: WRITE_PIN,
    pin,
    value
  }
}

export function invalidate(pin: number): PinAction {
  return {
    type: INVALIDATE_PIN,
    pin
  }
}

export function open(pin: number): PinAction {
  return {
    type: OPEN_PIN,
    pin
  };
}

export function close(pin: number): PinAction {
  return {
    type: CLOSE_PIN,
    pin
  };
}
