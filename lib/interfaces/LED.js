/* @flow */
import EE from 'eventemitter3';

import gpio from '../modules/gpio';
import { registerExistTask } from '../helpers/processHelper';

class LED {
  pin: number;
  blinkInterval: number;
  isOn: boolean;
  isReady: boolean;

  constructor(pin: number): LED {
    this.pin = gpio.open(pin, 'input pulldown', function() {
      this.isReady = true;
    }.bind(this));
    this.blinkInterval = 0;
    this.isOn = false;
    this.isReady = false;

    registerExistTask(function() {
      // This is how we clean up after ourselves
      gpio.close(this.pin);
    }.bind(this));

    // Make it chainable
    return this;
  }

  write(value: number): Promise<void> {
    return new Promise(function(resolve, reject) {
      gpio.write(this.pin, value, err => {
        if(err) reject(err);
        resolve();
      });
    });
  }

  blink(delay: number) {
    this.blinkInterval = setInterval(function() {
      if(!this.isReady) return;
      if(this.isOn) {
        gpio.write(this.pin, 1);
        this.isOn = false;
      } else {
        gpio.write(this.pin, 0);
        this.isOn = true;
      }
    }.bind(this), delay)
  }

  destroy() {
    clearInterval(this.blinkInterval)
    gpio.write(this.pin, 0, function() {
      gpio.close(this.pin)
    }.bind(this));
  }
}

export default LED
