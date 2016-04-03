/* @flow */
import App from './app';

import { makeStore } from './store';

import  { setup } from './helpers/processHelper';

// detemine what env we are supposed to run in
const env = (process.env['NODE_ENV'] === 'production' ? App.ENV_PROD : App.ENV_DEV);

// gets wiring-pi ready
setup();

// Set the store that the app will use
App.setStore(makeStore());

// start the app in that env
App.init(env);
