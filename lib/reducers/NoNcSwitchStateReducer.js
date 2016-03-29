/* @flow */
initialState: Immutable.Map;
initialSwitchState: Immutable.Map;

import Immutable from 'immutable';

const initialState = Immutable.Map({});
const initialSwitchState = Immutable.Map({
  open: false,
  connected: false
});

export type Action = {
  type: string,
  payload: Payload
}

export default (state: Immutable.Map = initialState, action: Action): Immutable.Map  => {
  const inst = action.payload && action.payload.instance ? action.payload.instance : undefined;
  switch(action.type) {

    default:
      return state;
  }
};

export function getSwitchState(state: Immutable.Map, instance: NoNcSwitch): Immutable.Map {
  return state.has(instance) ? state.get(instance) : initialSwitchState;
};
