/* @flow */
import App from './app';

// detemine what env we are supposed to run in
const env = (process.env === 'production' ? App.ENV_PROD : App.ENV_DEV);

// start the app in that env
App.init(env);
