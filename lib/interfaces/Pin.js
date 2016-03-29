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

class Pin {
  pinId: number;
  store: Store;
  state: ?Immutable.Map;

  constructor(store: Store, pinId: number): Pin {
    this.pinId = pinId;
    this.store = store;

    observeStore(this.store,
      (state: Immutable.Map) => getPinState(state.get('pinState'), this.getPinId()),
      this.onChange.bind(this)
    );

    return this;
  }

  onChange(newState: Immutable.Map): void {

  }

  setOptions(options: PinOptions): void {
    this.store.dispatch(setOptions(this.getPinId(), options));
  }

  getPinId(): number {
    return this.pinId;
  }
}

export default Pin;
