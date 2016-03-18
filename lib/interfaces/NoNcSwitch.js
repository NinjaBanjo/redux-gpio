/* @flow */
import store from '../store';

import gpioHelper from '../modules/gpio';

// Actions
import {
  invalidate,
  write,
  open,
  close
} from '../actions/pinActions';

const dispatch = store.dispatch;

class NoNcSwitch {
  noPin: Gpio
  ncPin: Gpio
  isConnected: boolean

  constructor(noPin: number, ncPin: number): NoNcSwitch {
    super();
    this.noPin = dispatch(openAction(noPin, 'input pullup'));
    this.ncPin = dispatch(openAction(ncPin, 'input pullup'));
    this.isConnected = false;

    return this;
  }
}

export default NoNcSwitch;
