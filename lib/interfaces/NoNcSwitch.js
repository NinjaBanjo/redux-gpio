/* @flow */
import { Gpio } from 'onoff'
import EventEmitter from 'events';

class NoNcSwitch extends EventEmitter {
  static EVENT_CHANGE = 'change';
  static EVENT_OPEN = 'open';
  static EVENT_CLOSE = 'close';
  static EVENT_CONNECT = 'connect';
  static EVENT_DISCONNECT = 'disconnect';
  static EVENT_RECONNECT = 'reconnect';

  constructor (noPin: number, ncPin: number): NoNcSwitch {
    super();

    this.noPin = new Gpio(noPin, 'in', 'both');
    this.ncPin = new Gpio(ncPin, 'in', 'both');
    this.isConnected = false;
    this.isPolling = false;
    this.pollingInterval = null;

    return this;
  }

  startPolling(interval: number): void {
    this.pollingInterval = setInterval(function() {

    }.bind(this), interval)
  }

  stopPolling(): void {
    clearInterval(this.pollingInterval);
    this.pollingInterval = null;
  }
}

export default NoNcSwitch;