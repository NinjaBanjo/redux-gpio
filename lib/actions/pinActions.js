/* @flow */
import { createAction } from 'redux-actions';

import {
  WRITE_PIN,
  WRITE_PIN_SUCCESS,
  WRITE_PIN_FAIL,
  INVALIDATE_PIN,
  READ_PIN_SUCCESS,
  READ_PIN_FAIL,
  OPEN_PIN,
  OPEN_PIN_SUCCESS,
  OPEN_PIN_FAIL,
  CLOSE_PIN,
  CLOSE_PIN_SUCCESS,
  CLOSE_PIN_FAIL
} from '../constants/actionTypes';

import * as gpioHelper from '../helpers/gpioHelper';

import type { Dispatch } from '../store';

export type PinAction = {
  pin: number;
  value?: number;
}

export type AsyncPinAction = (dispatch: Dispatch) => Promise<mixed>;

const writePin = createAction(WRITE_PIN, (pin: number): PinAction => {
  return { pin };
});

const writeSuccess = createAction(WRITE_PIN_SUCCESS, (pin: number, value: number): PinAction => {
  return { pin, value };
});

const writeFail = createAction(WRITE_PIN_FAIL, (pin: number, ex: Error): PinAction => {
  return { pin, ex };
});

export function write(pin: number, value: number): AsyncPinAction {
  return (dispatch: Dispatch): Promise<void> => {
    dispatch(writePin(pin));
    return gpioHelper.write(pin, value)
      .then(() => dispatch(writeSuccess(pin, value)))
      .catch((ex: Error) => dispatch(writeFail(pin, ex)));
  };
};

const invalidatePin = createAction(INVALIDATE_PIN, (pin: number): PinAction => {
  return { pin };
});

const readSuccess = createAction(READ_PIN_SUCCESS, (pin: number, value: number): PinAction => {
  return { pin };
});

const readFail = createAction(READ_PIN_FAIL, (pin: number, ex: Error): PinAction => {
  return { pin, ex };
});

export function invalidate(pin: number): AsyncPinAction {
  return (dispatch: Dispatch): Promise<number> => {
    dispatch(invalidatePin(pin));
    return gpioHelper.read(pin)
      .then((value: number) => dispatch(readSuccess(pin, value)))
      .catch((ex: Error) => dispatch(readFail(pin, ex)));
  };
}

const openPin = createAction(OPEN_PIN, (pin: number): PinAction => {
  return { pin };
});

const openSuccess = createAction(OPEN_PIN_SUCCESS, (pin: number): PinAction => {
  return { pin };
});

const openFail = createAction(OPEN_PIN_FAIL, (pin: number, ex: Error): PinAction => {
  return { pin, ex };
});

export function open(pin: number): AsyncPinAction {
  return (dispatch: Dispatch): Promise<void> => {
    dispatch(openPin(pin));
    return gpioHelper.open(pin)
      .then(() => dispatch(openSuccess(pin)))
      .catch((ex: Error) => dispatch(openFail(pin, ex)));
  };
}

const closePin = createAction(CLOSE_PIN, (pin: number): PinAction => {
  return { pin };
});

const closeSuccess = createAction(CLOSE_PIN_SUCCESS, (pin: number): PinAction => {
  return { pin };
});

const closeFail = createAction(CLOSE_PIN_FAIL, (pin: number): PinAction => {
  return { pin };
});

export function close(pin: number): AsyncPinAction {
  return (dispatch: Dispatch): Promise<void> => {
    dispatch(closePin(pin));
    return gpioHelper.close(pin)
      .then(() => dispatch(closeSuccess(pin)))
      .catch((ex: Error) => dispatch(closeFail(pin, ex)));
  };
}
