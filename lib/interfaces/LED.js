/* @flow */
import gpio from '../modules/Gpio';

import EE from 'eventemitter3';

class LED extends EE {
  pin: number;
  
  constructor(pin: number): LED {
    super();
    this.pin = gpio.open(pin, 'input pulldown');

    return this;
  }

}

export default LED
