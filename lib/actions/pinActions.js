/* @flow */
import {
  PIN_CHANGE,
  PIN_OPEN,
  PIN_CLOSE
} from '../constants/actionTypes';

export type PinAction = {
  type: string;
  pin: number;
  value?: number;
}

export function change(pin: number, value: number): PinAction {
  return {
    type: PIN_CHANGE,
    pin,
    value
  };
}

export function open(pin: number): PinAction {
  return {
    type: PIN_OPEN,
    pin
  };
}

export function close(pin: number): PinAction {
  return {
    type: PIN_CLOSE,
    pin
  };
}