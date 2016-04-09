/* @flow */
import { createAction } from 'redux-actions';

import {
  CONNECT_SWITCH,
  DISCONNECT_SWITCH,
  OPEN_SWITCH,
  CLOSE_SWITCH
} from '../constants/actionTypes';

export const connect = createAction(CONNECT_SWITCH, (instance: NoNcSwitch): SwitchAction => {
  return { instance };
});

export const disconnect = createAction(DISCONNECT_SWITCH, (instance: NoNcSwitch): SwitchAction => {
  return { instance };
});

export const open = createAction(OPEN_SWITCH, (instance: NoNcSwitch): SwitchAction => {
  return { instance };
});

export const close = createAction(CLOSE_SWITCH, (instance: NoNcSwitch): SwitchAction => {
  return { instance };
});
