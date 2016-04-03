import Immutable from 'immutable';

import Poller from '../modules/Poller';

import { observeStore } from '../helpers/stateHelper';

import { getPinState } from '../reducers/pinStateReducer';
import { getSwitchState } from '../reducers/NoNcSwitchStateReducer';

import type { Store } from '../store';

class NoNcSwitch extends Poller {
  noPin: Pin;
  ncPin: Pin;
  store: Store;
  state: Immutable.Map;

  constructor(store: Store, noPin: Pin, ncPin: Pin): NoNcSwitch {
    super();
    this.store = store;
    this.noPin = noPin;
    this.ncPin = ncPin;
    // initialize with an empty map so our onChange
    //  doesn't have to care if it's been run once or not
    this.state = Immutable.Map({});

    observeStore(this.store, function (state) {
      return Immutable.Map({
        noPin: getPinState(state, this.noPin.getPinId()),
        ncPin: getPinState(state, this.ncPin.getPinId()),
        switch: getSwitchState(state, this)
      });
    }.bind(this), this.onChange.bind(this));

    return this;
  }

  onChange(newState) {
    this.state = newState;
  }

  getState(): Immutable.Map {
    return this.state;
  }
}

export default NoNcSwitch;
