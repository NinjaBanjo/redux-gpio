import store from '../store';

export type ChangeHandler = (newState: Immutable.Map) => void;

export function subscribeToStore(store: Store, changeHandler: ChangeHandler): unsubscribe {
  return store.subscribe(changeHandler);
}
