/* @flow */

// Actions
import {
  invalidate,
  write,
  open,
  close
} from '../actions/pinActions';

import type { Store } from '../store';

class NoNcSwitch {
  store: Store;
  noPin: number;
  ncPin: number;
  isConnected: boolean;

  constructor(store: Store, noPin: number, ncPin: number): NoNcSwitch {
    this.store = store;
    this.noPin = noPin;
    this.ncPin = ncPin;

    // Do hookup logic to both stores so we can update the switchStore and things can consume it

    return this;
  }
}

export default NoNcSwitch;
