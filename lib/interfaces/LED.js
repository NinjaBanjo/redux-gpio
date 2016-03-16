/* @flow */
import store from '../store';

import  * as gpioHelper from '../helpers/gpioHelper';
import { registerExistTask } from '../helpers/processHelper';

import { getPinState } from '../reducers/pinStateReducer';

// Actions
import {
  invalidate,
  write,
  open
} from '../actions/pinActions';

const dispatch = store.dispatch;

class LED {
  pin: number;
  blinkInterval: number;
  isReady: boolean;

  constructor(pin: number): LED {
    this.pin = pin;
    this.blinkInterval = 0;
    this.isReady = false;
    this.state = getPinState(store.getState())

    // do setup for the interface
    gpioHelper.open(pin, 'input pulldown');
    /* use a helper to subscribe this class to the store
     * The helper assumes a handleStateChange function exists,
     * and passes it newState when state changes
     */
    stateHelper.subscribeToStore(this, store);
    store.subscribe(this.onStoreChange);

    registerExistTask(function() {
      // This is how we clean up after ourselves
      gpio.close(this.pin);
    }.bind(this));

    // Make it chainable
    return this;
  }

  onStoreChange() {
    var pinState = getPinState(store.getState().get('pinState'))
  }

  handleStateChange() {

  }

  write(value: number): void {
    gpioHelper.write(this.pin, value);
  }

  blink(delay: number) {
    this.blinkInterval = setInterval(function() {
      if(!this.isReady) return;
      if(this.isOn) {
        gpio.write(this.pin, 1);
        this.isOn = false;
      } else {
        gpio.write(this.pin, 0);
        this.isOn = true;
      }
    }.bind(this), delay)
  }

  destroy() {
    clearInterval(this.blinkInterval)
    gpioHelper.close(this.pin);
    // so we don't leave ghost handlers around
    store.unsubscribe();
  }
}

export default LED
