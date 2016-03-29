/* @flow */
import type { Store } from './store';

import { registerProcessHandlers } from './helpers/processHelper';

import LED from './interfaces/LED';
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
    registerProcessHandlers();

    var greenLED = new LED(this.getStore(), new Pin(this.getStore(), 1));

    greenLED.blink();
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
