/* @flow */

// Actions
import {
  invalidate,
  setOptions
} from '../actions/pinActions';

import Poller from '../modules/Poller';

import type { Store } from '../store';

class NoNcSwitch extends Poller {
  store: Store;
  noPin: number;
  ncPin: number;

  constructor(store: Store, noPin: number, ncPin: number): NoNcSwitch {
    this.store = store;
    this.noPin = noPin;

    this.ncPin = ncPin;
    return this;
  }

  initialize(): Promise<void> {
    observeStore(this.store,
      (state: Immutable.Map) => getPinState(state.get('pinState'), this.pin),
      this.onChange.bind(this)
    )

    return Promise.resolve();
  }
}

export default NoNcSwitch;
