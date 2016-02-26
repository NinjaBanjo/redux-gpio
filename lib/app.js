/* @flow */
import LED from './interfaces/LED'

const App = {
  ENV_PROD: 'production',
  ENV_DEV: 'development',

  init(env: string) {
    this.env = env;
  }
};

export default App;
