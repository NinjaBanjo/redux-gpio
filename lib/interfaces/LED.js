/* @flow */
import Immutable from 'immutable';

import { observeStore } from '../helpers/stateHelper';

import {
  INPUT,
  PUD_DOWN
} from '../modules/wpi';

import type Pin from './Pin';

// Actions

class LED {
  store: Store;
  pin: Pin;
  blinkInterval: number;

  constructor(store: Store, pin: Pin): LED {
    this.store = store;
    this.pin = pin;
    this.blinkInterval = 0;

    // All LEDs will be a pull down (so they stay off when off) inputs
    this.pin.setOptions({
      mode: INPUT,
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
