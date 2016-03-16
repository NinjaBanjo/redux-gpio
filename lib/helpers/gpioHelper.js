import gpio from '../modules/gpio';

export function open(pin, options) {
  return new Promise((resolve, reject) => {
    gpio.open(pin, options, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

export function close(pin) {
  return new Promise((resolve, reject) => {
    gpio.close(pin, (err) => {
      if (err) reject(err);
      resolve();
    })
  });
}

export function read(pin) {
  return new new Promise((resolve, reject) => {
    gpio.read(pin, (err, value) => {
      if (err) reject(err);
      resolve(value);
    });
  });
}

export function write(pin, value) {
  return new new Promise((resolve, reject) => {
    gpio.write(pin, value, (err) => {
      if (err) reject(err);
      resolve(value);
    })
  });
}
