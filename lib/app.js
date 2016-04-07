/* @flow */
import type { Store } from './store';

import { registerProcessHandlers } from './helpers/processHelper';

import {observeStore} from './helpers/stateHelper';

import {getSwitchState } from './reducers/NoNcSwitchStateReducer';

import NoNcSwitch from './interfaces/NoNcSwitch';
import Pin from './interfaces/Pin';

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
    // Register special process handlers (makes things more predictable)
    //registerProcessHandlers();

    const noPin = new Pin(this.getStore(), 17);
    const ncPin = new Pin(this.getStore(), 22);

    const noncSwitch = new NoNcSwitch(this.getStore(), noPin, ncPin);

    // watch for the switch to change state
    observeStore(this.getStore(),
      // select
      (state) => getSwitchState(state, noncSwitch),
      // change handler
      (newState) => {
        console.log('Got new State: ' + newState.toObject());
      }
    );
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
