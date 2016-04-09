/* @flow */
import Immutable from 'immutable';

import type { Store } from '../store';

import { observeStore } from '../helpers/stateHelper';

import { getPinState } from '../reducers/pinStateReducer';

import {
  setOptions,
  invalidate,
  write,
  read
} from '../actions/pinActions';

import type { PinOptions } from '../reducers/pinStateReducer';

import Poller from '../modules/Poller';

import wpi from 'wiring-pi';

type Pud = wpi.PID_OFF | wpi.PUD_UP | wpi.PUD_DOWN;

class Pin extends Poller {
  pinId: number;
  store: Store;
  state: Immutable.Map;

  constructor(store: Store, pinId: number): Pin {
    super();
    this.pinId = pinId;
    this.store = store;
    // initialize with an empty map so our onChange
    //  doesn't have to care if it's been run once or not
    this.state = Immutable.Map({});

    observeStore(this.store,
      (state: Immutable.Map) => getPinState(state.get('pinState'), this.getPinId()),
      this.onChange.bind(this)
    );

    return this;
  }

  poll(): number {
    console.log(this.store.getState().toJS());
    this.invalidate();
  }

  onChange(newState: Immutable.Map): void {
    const oldOptions = this.state.get('options');
    const newOptions = newState.get('options');


    if(newState.get('didInvalidate') === true) {
      this.read();
    } else if (this.state.get('didInvalidate') === false && newState.get('value') !== this.state.get('value')) {
      // Write to the gpio pin when the state value changes
      this.write(newState.get('value'));
    }

    // We have to manage options
    if(!Immutable.is(oldOptions, newOptions)) {
      this.mode(newOptions.get('mode'));
      this.pud(newOptions.get('pud'));
    }

    this.state = newState;
  }

  mode(mode: Mode): void {
    wpi.pinMode(this.getPinId(), mode);
  }

  pud(pud: Pud): void {
    wpi.pullUpDnControl(this.getPinId(), pud);
  }

  read(): void {
    const pin = this.getPinId();
    this.store.dispatch(read(this.getPinId(), wpi.digitalRead(pin)));
  }

  write(value: number): void {
    value = value > 0 ? 1 : 0; // only 1 or 0 should be used below
    wpi.digitalWrite(this.getPinId(), value);
    // TODO: this should probably dispatch a write
  }

  toggle(): void {
    const value = !!this.state.get('value') ? 0 : 1;
    this.store.dispatch(write(this.getPinId(), value));
  }

  invalidate(): void {
    this.store.dispatch(invalidate(this.getPinId()));
  }

  setOptions(options: PinOptions): void {
    this.store.dispatch(setOptions(this.getPinId(), options));
  }

  getState(): Immutable.Map {
    return this.state;
  }

  getPinId(): number {
    return this.pinId;
  }

  destroy(): void {
    this.stopPolling();
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

export default Pin;
