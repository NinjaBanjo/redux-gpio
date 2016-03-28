/* @flow */
import type { Store } from '../store';

import { observeStore } from '../helpers/stateHelper';

import { getPinState } from '../reducers/pinStateReducer';

class Pin {
  pinId: number;
  store: Store;

  constructor(store: Store, pinId: number) {
    this.pinId = pinId;
    this.store = store;

    observeStore(this.store,
      (state: Immutable.Map) => getPinState(state.get('pinState'), this.getPinId()),
      this.onChange.bind(this)
    );
  }

  onChange(newState: Immutable.Map): void {

  }

  setOptions(options: PinOptions): void {
    
  }

  getPinId(): number {
    return this.pinId;
  }
}

export default Pin;
