/* @flow */
import Immutable from 'immutable';

import type { Store } from '../store';

import { observeStore } from '../helpers/stateHelper';

import { getPinState } from '../reducers/pinStateReducer';

import {
  setOptions,
  invalidate,
  write
} from '../actions/pinActions';

import type { PinOptions } from '../actions/pinActions';

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

  onChange(newState: Immutable.Map): void {
    const oldOptions = this.state.get('options');
    const newOptions = newState.get('options');

    // Write to the gpio pin when the state value changes
    if(newState.get('value') !== this.state.get('value')) {
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

  write(value: number): void {
    value = value > 0 ? 1 : 0; // only 1 or 0 should be used below
    wpi.digitalWrite(this.getPinId(), value);
  }

  toggle(): void {
    this.write(!!this.state.get('value') ? 0 : 1);
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
