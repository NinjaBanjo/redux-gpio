/* @flow */
import LED from './interfaces/LED'
import store from './store';

const App = {
  ENV_PROD: 'production',
  ENV_DEV: 'development',

  init(env: string) {
    this.env = env;
  }
};

export default App;
