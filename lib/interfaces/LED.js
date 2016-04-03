/* @flow */
import { OUTPUT, PUD_DOWN } from 'wiring-pi';

import type { Store } from '../store';

import type Pin from './Pin';

class LED {
  store: Store;
  pin: Pin;
  blinkInterval: number;

  constructor(pin: Pin): LED {
    this.pin = pin;
    this.blinkInterval = 0;

    // All LEDs will be a pull down (so they stay off when off) inputs
    this.pin.setOptions({
      mode: OUTPUT,
      pud: PUD_DOWN
    });

    return this;
  }

  blink(delay: number = 250) {
    this.blinkInterval = setInterval(function() {
      this.pin.toggle();
    }.bind(this), delay);
  }

  destroy(): void {
    clearInterval(this.blinkInterval);
  }
}

export default LED;
