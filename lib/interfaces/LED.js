/* @flow */
import Immutable from 'immutable';

import Poller from '../modules/Poller';

import Pin from './Pin';

import { registerCleanupTask } from '../helpers/processHelper';

import { getPinState } from '../reducers/pinStateReducer';

import { observeStore } from '../helpers/stateHelper';

import {
  INPUT,
  PUD_DOWN
} from '../modules/wpi';

// Actions
import {
  invalidate,
  write,
  setOptions
} from '../actions/pinActions';

import type { Store } from '../store';

class LED {
  store: Store;
  pin: Pin;
  state: Immutable.Map;
  blinkInterval: number;
  unsubscribe: ?() => void;

  constructor(store: Store, pin: Pin): LED {
    this.store = store;
    this.pin = pin;
    this.blinkInterval = 0;

    observeStore(this.store,
      (state: Immutable.Map) => getPinState(state.get('pinState'), this.pin.getPinId()),
      this.onChange.bind(this)
    );

    // All LEDs will be a pull down (so they stay off when off) inputs
    this.pin.setOptions({
      mode: INPUT,
      pud: PUD_DOWN
    });

    return this;
  }

  onChange(newState: Immutable.Map): void {
    this.state = newState;
  }

  write(value: number): void {
    this.store.dispatch(write(this.pin, value));
  }

  blink(delay: number = 250) {
    console.log('blinking');
    this.blinkInterval = setInterval(function() {
      this.pin
    }.bind(this), delay);
  }

  destroy(): void {
    clearInterval(this.blinkInterval);
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

export default LED;
