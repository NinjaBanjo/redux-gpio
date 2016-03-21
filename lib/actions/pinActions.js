/* @flow */
import { createAction } from 'redux-actions';

import {
  WRITE_PIN,
  INVALIDATE_PIN,
  READ_PIN,
  OPEN_PIN,
  CLOSE_PIN,
} from '../constants/actionTypes';

import * as gpioHelper from '../helpers/gpioHelper';

import type { Dispatch } from '../store';

export type PinAction = {
  pin: number;
  value?: number;
}

export type AsyncPinAction = (dispatch: Dispatch) => Promise<mixed>;

export const write = createAction(WRITE_PIN, (pin: number, value: number): PinAction => {
  return { pin, value };
});

const invalidatePin = createAction(INVALIDATE_PIN, (pin: number): PinAction => {
  return { pin };
});

export const read = createAction(READ_PIN, (pin: number, value: number): PinAction => {
  return { pin, value };
});

export function invalidate  (pin: number): AsyncPinAction {
  return (dispatch: Dispatch): Promise<number> => {
    const value = gpioHelper.read(pin);
    dispatch(invalidatePin(pin));
    dispatch(read(pin, value));
    return Promise.resolve(value);
  };
}

export const open = createAction(OPEN_PIN, (pin: number): PinAction => {
  return { pin };
});

export const close = createAction(CLOSE_PIN, (pin: number): PinAction => {
  return { pin };
});
