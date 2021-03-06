import Immutable from 'immutable';

import type { Store } from '../store';

type Select = (state: Immutable.Map) => Immutable.Map;
type OnChange = (state: Immutable.Map) => void;

export function observeStore(store: Store, select: Select, onChange: OnChange): unsubscribe {
  let currentState;

  function handleChange() {
    let nextState = select(store.getState());
    // always run if just called but not if currentState and nextState are equal
    if(!currentState || !Immutable.is(nextState, currentState)) {
      currentState = nextState;
      onChange(currentState);
    }
  }

  const unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
}
