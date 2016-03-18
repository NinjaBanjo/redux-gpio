import gpio from '../modules/gpio';

import {
  change as changeAction,
  invalidate as invalidateAction,
  open as openAction,
  close as closeAction
} from '../actions/pinActions';

type Resolve = (x: any) => void;
type Reject = (x: any) => void;

export function open(dispatch: dispatch, pin: number, options: string): Promise {
  return new Promise((resolve: Resolve, reject: Reject): void => {
    gpio.open(pin, options, (err: Error): void => {
      if (err) reject(err);
      dispatch(openAction(pin));
      resolve();
    });
  });
}

export function close(dispatch: dispatch, pin: number): Promise {
  return new Promise((resolve: Resolve, reject: Reject): void => {
    gpio.close(pin, (err: Error): void => {
      if (err) reject(err);
      dispatch(closeAction(pin));
      resolve();
    });
  });
}

export function read(dispatch: dispatch, pin: number): Promise {
  // Invalidate the pin
  return new Promise((resolve: Resolve, reject: Reject): void => {
    gpio.read(pin, (err, value) => {
      if (err) reject(err);
      dispatch(changeAction(pin, value));
      resolve(value);
    });
  });
}

export function write(dispatch: dispatch, pin: number, value: number): Promise {
  return new Promise((resolve: Resolve, reject: Reject): void => {
    gpio.write(pin, value, (err: Error): void => {
      if (err) reject(err);
      dispatch(changeAction(pin, value));
      resolve(value);
    });
  });
}
