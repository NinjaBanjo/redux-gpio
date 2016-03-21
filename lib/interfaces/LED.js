/* @flow */
import Immutable from 'immutable';

import Poller from '../modules/Poller';

import { registerCleanupTask } from '../helpers/processHelper';

import { getPinState } from '../reducers/pinStateReducer';

import { observeStore } from '../helpers/stateHelper';

// Actions
import {
  invalidate,
  write,
  open,
  close
} from '../actions/pinActions';

import type { Store } from '../store';

class LED {
  store: Store;
  pin: number;
  state: Immutable.Map;
  blinkInterval: number;

  constructor(store: Store, pin: number): LED {
    this.store = store;
    this.pin = pin;
    this.blinkInterval = 0;
    // Make it chainable
    return this;
  }

  onChange(newState: Immutable.Map): void {
    this.state = newState;
  }

  initialize(): Promise<void> {
    observeStore(this.store,
      (state: Immutable.Map) => getPinState(state.get('pinState'), this.pin),
      this.onChange.bind(this)
    );

    registerCleanupTask(this.destroy.bind(this));

    return this.store.dispatch(open(this.pin, 'output'));
  }

  write(value: number): void {
    this.store.dispatch(write(this.pin, value));
  }

  blink(delay: number = 250) {
    this.blinkInterval = setInterval(function() {
      // if the pin isn't open yet, do nothing.
      if(!this.state.get('open')) return;
      if(this.state.get('value') !== 1) {
        this.store.dispatch(write(this.pin, 1));
      } else {
        this.store.dispatch(write(this.pin, 0));
      }
    }.bind(this), delay);
  }

  destroy(): Promise<void> {
    clearInterval(this.blinkInterval);
    return this.store.dispatch(close(this.pin));
    // so we don't leave ghost handlers around
    // TODO: this is wrong, figure out the right way to unsubscribe just it's own listener
    //store.unsubscribe();
  }
}

export default LED;
