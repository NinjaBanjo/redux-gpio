/* @flow */
import type { Store } from './store';

import { registerProcessHandlers } from './helpers/processHelper';

import {observeStore} from './helpers/stateHelper';

import {getSwitchState } from './reducers/NoNcSwitchStateReducer';

import NoNcSwitch from './interfaces/NoNcSwitch';
import Pin from './interfaces/Pin';
import LED from './interfaces/LED';

import ua from 'universal-analytics';

const App: {
    // CONSTANTS
    ENV_PROD: string,
    ENV_DEV: string,
    // FUNCTIONS
    init: (env: string) => void,
    getStore: () => Store,
    setStore: (store: Store) => void
} = {
  ENV_PROD: 'production',
  ENV_DEV: 'development',

  init(env: string) {
    if(!this.store) {
      throw new Error('App initialize without having a store set first');
    }
    // Store the env
    this.env = env;

    const noPin = new Pin(this.getStore(), 22);
    const ncPin = new Pin(this.getStore(), 17);

    const greenLED = new LED(new Pin(this.getStore(), 23));
    const redLED = new LED(new Pin(this.getStore(), 18));

    const fridgeSwitch = new NoNcSwitch(this.getStore(), noPin, ncPin);
    const that = this;

    const visitor = ua('UA-76175478-1', {https: true});

    observeStore(this.getStore(), (state) => getSwitchState(state.get('switchState'), fridgeSwitch), (newState) => {
      console.log(that.getStore().getState().toJS());
      console.log('top switch observe: ', newState.toJS());

      if(newState.get('open')) {
        visitor.event('Fridge', 'Open').send();
        greenLED.blinkOnce();
      } else {
        visitor.event('Fridge', 'Close').send();
        redLED.blinkOnce();
      }
    });
  },
  getStore(): Store {
    return this.store;
  },
  setStore(store: Store): void {
    if(this.store) {
      throw new Error('Store already set, it can\'t be set again');
    }
    this.store = store;
  }
};

export default App;
