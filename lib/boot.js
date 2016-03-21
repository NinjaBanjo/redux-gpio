/* @flow */
import App from './app';

import { makeStore } from './store';

// detemine what env we are supposed to run in
const env = (process.env === 'production' ? App.ENV_PROD : App.ENV_DEV);

// Set the store that the app will use
App.setStore(makeStore());

// start the app in that env
App.init(env);
