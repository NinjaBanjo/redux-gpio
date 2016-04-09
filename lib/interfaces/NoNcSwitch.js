import Immutable from 'immutable';
import wpi from 'wiring-pi';

import { observeStore } from '../helpers/stateHelper';

import { getPinState } from '../reducers/pinStateReducer';
import { getSwitchState } from '../reducers/NoNcSwitchStateReducer';

import {
  connect,
  disconnect,
  open,
  close
} from '../actions/switchActions';

import type { Store } from '../store';

class NoNcSwitch {
  noPin: Pin;
  ncPin: Pin;
  store: Store;
  state: Immutable.Map;

  constructor(store: Store, noPin: Pin, ncPin: Pin): NoNcSwitch {
    this.store = store;
    this.noPin = noPin;
    this.ncPin = ncPin;
    // initialize with an empty map so our onChange
    //  doesn't have to care if it's been run once or not
    this.state = Immutable.Map({});

    observeStore(this.store, function (state) {
      return Immutable.Map({
        noPin: getPinState(state.get('pinState'), this.noPin.getPinId()),
        ncPin: getPinState(state.get('pinState'), this.ncPin.getPinId()),
        switch: getSwitchState(state.get('switchState'), this)
      });
    }.bind(this), this.onChange.bind(this));

    const pinOptions = Immutable.Map({
      pud: wpi.PUD_UP,
      mode: wpi.INPUT
    });

    this.noPin.setOptions(pinOptions);
    this.ncPin.setOptions(pinOptions);

    this.ncPin.startPolling(250);
    this.noPin.startPolling(250);

    return this;
  }

  onChange(newState) {
    const newNcPinValue = newState.getIn(['ncPin', 'value']);
    const newNoPinValue = newState.getIn(['noPin', 'value']);

    // if current state disconnected
    if (this.state.getIn(['switch', 'connected'])) {
      // if new ncPinValue is `1` and current ncPinValue is `0` then the switch just opened
      if (newNcPinValue === 1 && this.state.getIn(['ncPin', 'value']) === 0) {
        this.store.dispatch(open(this));
      }
      // if new ncPinValue is `0` and current ncPinValue is `1` then the switch just closed
      else if (newNcPinValue === 0 && this.state.getIn(['ncPin', 'value']) === 1) {
        this.store.dispatch(close(this));
      }
      // if not a value change, maybe we disconnected
      else {
        // and new state pins read equal values
        if(newNoPinValue === newNcPinValue) {
          this.store.dispatch(disconnect(this));
        }
      }
    } else {
      // and new state pins read opposite values
      // TODO: make actual opposite instead of not equals
      if (newNoPinValue !== newNcPinValue) {
        this.store.dispatch(connect(this));
      }
    }

    this.state = newState;
  }

  getState(): Immutable.Map {
    return this.state;
  }
}

export default NoNcSwitch;
