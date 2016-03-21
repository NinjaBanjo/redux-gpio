import pinActions from './pinActions';

export type Action = (...O: mixed) => Promise | void;

export {
  pinActions
};
