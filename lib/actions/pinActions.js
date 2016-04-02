/* @flow */
import { createAction } from 'redux-actions';

import {
  WRITE_PIN,
  INVALIDATE_PIN,
  READ_PIN,
  SET_PIN_OPTIONS
} from '../constants/actionTypes';

import type { Dispatch } from '../store';

import type { PinOptions, Payload } from '../reducers/pinStateReducer';

export type PinAction = {
  pin: number;
  value?: number;
}

export type Action = {
  type: string,
  payload: Payload
}

export type AsyncPinAction = (dispatch: Dispatch) => Promise<mixed>;

export const read = createAction(READ_PIN, (pin: number, value: number): PinAction => {
  return { pin, value };
});

export const write = createAction(WRITE_PIN, (pin: number, value: number): PinAction => {
  return { pin, value };
});

export const invalidate = createAction(INVALIDATE_PIN, (pin: number): PinAction => {
  return { pin };
});

export const setOptions = createAction(SET_PIN_OPTIONS, (pin: number, options: PinOptions): PinAction => {
  return { pin, options };
});
