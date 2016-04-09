/* @flow */
initialState: Immutable.Map;
initialSwitchState: Immutable.Map;

import Immutable from 'immutable';

import {
  CONNECT_SWITCH,
  DISCONNECT_SWITCH,
  OPEN_SWITCH,
  CLOSE_SWITCH
} from '../constants/actionTypes';

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
  if(!inst) return state; // can't do anything without an instance
  console.log('SWITCH ACTION: ', action.type);
  switch(action.type) {
    case CONNECT_SWITCH:
      return state.set(inst,
        getSwitchState(state, inst).set('connected', true)
      );
    case DISCONNECT_SWITCH:
      return state.set(inst,
        getSwitchState(state, inst).set('connected', false)
      );
    case OPEN_SWITCH:
      return state.set(inst,
        getSwitchState(state, inst).set('open', true)
      );
    case CLOSE_SWITCH:
      return state.set(inst,
        getSwitchState(state, inst).set('open', false)
      );
    default:
      return state;
  }
};

export function getSwitchState(state: Immutable.Map, instance: NoNcSwitch): Immutable.Map {
  return state.has(instance) ? state.get(instance) : initialSwitchState;
};
