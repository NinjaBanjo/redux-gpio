/* @flow */
import Immutable from 'immutable';

import Poller from '../modules/Poller';

import { registerExistTask } from '../helpers/processHelper';
import { subscribeToStore } from '../helpers/stateHelper';

import { getPinState } from '../reducers/pinStateReducer';

// Actions
import {
  invalidate,
  write,
  open,
  close
} from '../actions/pinActions';

class LED extends Poller {
  pin: number;
  dispatch: dispatch;
  isReady: boolean;
  blinkInterval: number;
  state: Immutable.Map;

  constructor(pin: number): LED {
    super();
    if(!pin) {
      throw new Error('constructor requires a pin');
    }
    this.pin = pin;
    this.dispatch = dispatch;
    this.blinkInterval = 0;
    this.isReady = false;
    this.state = getPinState(store.getState(), this.pin);

    // do setup for the interface
    this.dispatch(open(pin));
    /* use a helper to subscribe this class to the store
     * The helper assumes a handleStateChange function exists,
     * and passes it newState when state changes
     */
    subscribeToStore(this);

    registerExistTask(function() {
      // This is how we clean up after ourselves
      dispatch(close(this.pin));
    }.bind(this));

    // Make it chainable
    return this;
  }

  write(value: number): void {
    dispatch(write(this.pin, value));
  }

  blink(delay: number) {
    this.blinkInterval = setInterval(function() {
      // if the pin isn't open yet, do nothing.
      if(!this.state.open) return;
      if(this.state.get('value') !== 1) {
        dispatch(write(this.pin, 1));
      } else {
        dispatch(write(this.pin, 0));
      }
    }.bind(this), delay);
  }

  destroy() {
    clearInterval(this.blinkInterval);
    dispatch(close(this.pin));
    // so we don't leave ghost handlers around
    // TODO: this is wrong, figure out the right way to unsubscribe just it's own listener
    //store.unsubscribe();
  }
}

export default LED;
