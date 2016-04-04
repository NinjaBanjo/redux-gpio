import pinActions from './pinActions';
import switchActions from './switchActions';

export type Action = (...O: mixed) => Promise | void;

export {
  pinActions,
  switchActions
};
