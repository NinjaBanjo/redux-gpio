/* @flow */
import { createAction } from 'redux-actions';

import {
  CHANGE_PIN,
  WRITE_PIN,
  WRITE_PIN_SUCCESS,
  WRITE_PIN_FAIL,
  INVALIDATE_PIN,
  OPEN_PIN,
  CLOSE_PIN
} from '../constants/actionTypes';

import * as gpioHelper from '../helpers/gpioHelper';

import type { Dispatch } from '../store';

export type PinAction = {
  pin: number;
  value?: number;
}

export type AsyncPinAction = (dispatch: Dispatch) => Promise

const writeSuccess = createAction(WRITE_PIN_SUCCESS, (pin: number, value: number): PinAction => {
  return { pin, value };
});

const writeFail = createAction(WRITE_PIN_FAIL, (pin: number, ex: Error): PinAction => {
  return { pin, ex };
});

const writePin = createAction(WRITE_PIN, (pin: number): PinAction => {
  return { pin};
});

export function write(pin: number, value: number): AsyncPinAction {
  return (dispatch: Dispatch): Promise => {
    dispatch(writePin);
    return gpioHelper.write(pin, value)
      .then(() => dispatch(writeSuccess(pin, value)))
      .catch((ex: Error) => dispatch(writeFail(pin, ex)));
  };
};

export function invalidate(pin: number): PinAction {
  return {
    type: INVALIDATE_PIN,
    pin
  };
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
