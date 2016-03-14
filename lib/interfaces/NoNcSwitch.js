/* @flow */
import gpio from '../modules/gpio';
import EE from 'eventemitter3';

class NoNcSwitch extends EE {
  noPin: Gpio;
  ncPin: Gpio;
  isConnected: boolean;
  isPolling: boolean;
  pollingTimeout: number;
  pollingInterval: number;

  static EVENT_CHANGE = 'change';
  static EVENT_OPEN = 'open';
  static EVENT_CLOSE = 'close';
  static EVENT_CONNECT = 'connect';
  static EVENT_DISCONNECT = 'disconnect';
  static EVENT_RECONNECT = 'reconnect';

  constructor(noPin: number, ncPin: number): NoNcSwitch {
    super();

    this.noPin = gpio.open(noPin, 'input pullup');
    this.ncPin = gpio.open(ncPin, 'input pullup');
    this.isConnected = false;
    this.isPolling = false;
    this.pollingInterval = 100;
    this.pollingTimeout = 0;

    return this;
  }

    poll(): number {
    return setTimeout(function() {

      this.poll();
    }.bind(this), this.pollingInterval)
  }

    startPolling(interval: number = 0): void {
    if (interval >= 100) {
      this.pollingInterval = interval;
    } else if (interval !== 0 && interval < 100) {
      throw new Error('Interval must be equal to or greater than 100');
    }
    this.pollingTimeout = this.poll();
    this.isPolling = true;
  }

    stopPolling(): void {
    clearTimeout(this.pollingTimeout);
    this.pollingTimeout = 0;
    this.isPolling = false;
  }
}

export default NoNcSwitch;
