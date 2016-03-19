import gpio from '../modules/gpio';

type Resolve = (x: any) => void;
type Reject = (x: any) => void;

export function open(pin: number, options: string): Promise {
  return new Promise((resolve: Resolve, reject: Reject): void => {
    gpio.open(pin, options, (err: ?Error): void => {
      if (err) reject(err);
      resolve();
    });
  });
}

export function close(pin: number): Promise {
  return new Promise((resolve: Resolve, reject: Reject): void => {
    gpio.close(pin, (err: ?Error): void => {
      if (err) reject(err);
      resolve();
    });
  });
}

export function read(pin: number): Promise {
  return new Promise((resolve: Resolve, reject: Reject): void => {
    gpio.read(pin, (err: ?Error, value: number): void => {
      if (err) reject(err);
      resolve(value);
    });
  });
}

export function write(pin: number, value: number): Promise {
  return new Promise((resolve: Resolve, reject: Reject): void => {
    gpio.write(pin, value, (err: ?Error): void => {
      if (err) reject(err);
      resolve(value);
    });
  });
}
