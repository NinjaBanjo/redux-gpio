import wpi from '../modules/wpi';

type Resolve = (e: ?number) => void;
type Reject = (ex: Error) => void;

export function open(pin: number, options: string): Promise {
  return new Promise((resolve: Resolve, reject: Reject): void => {
    wpi.open(pin, options, (err: ?Error): void => {
      if (err) reject(err);
      resolve();
    });
  });
}

export function close(pin: number): Promise {
  return new Promise((resolve: Resolve, reject: Reject): void => {
    wpi.close(pin, (err: ?Error): void => {
      if (err) reject(err);
      resolve();
    });
  });
}

export function read(pin: number): Promise {
  return new Promise((resolve: Resolve, reject: Reject): void => {
    wpi.digitalRead(pin, (err: ?Error, value: number): void => {
      if (err) reject(err);
      resolve(value);
    });
  });
}

export function write(pin: number, value: number): Promise {
  return new Promise((resolve: Resolve, reject: Reject): void => {
    wpi.write(pin, value, (err: ?Error): void => {
      if (err) reject(err);
      resolve(value);
    });
  });
}
