/* @flow */
import Immutable from 'immutable';

import type { Store } from '../store';

import { observeStore } from '../helpers/stateHelper';

import { getPinState } from '../reducers/pinStateReducer';

import {
  setOptions,
  invalidate,
  write
} from '../actions/pinActions';

import type { PinOptions } from '../actions/pinActions';

import Poller from '../modules/Poller';

class Pin extends Poller {
  pinId: number;
  store: Store;
  state: Immutable.Map;

  constructor(store: Store, pinId: number): Pin {
    super();
    this.pinId = pinId;
    this.store = store;

    observeStore(this.store,
      (state: Immutable.Map) => getPinState(state.get('pinState'), this.getPinId()),
      this.onChange.bind(this)
    );

    return this;
  }

  onChange(newState: Immutable.Map): void {
    this.state = newState;
  }

  toggle(): void {
    this.write(!!this.state.get('value') ? 0 : 1);
  }

  setOptions(options: PinOptions): void {
    this.store.dispatch(setOptions(this.getPinId(), options));
  }

  getState(): Immutable.Map {
    return this.state;
  }

  getPinId(): number {
    return this.pinId;
  }

  destroy(): void {
    this.stopPolling();
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

export default Pin;
