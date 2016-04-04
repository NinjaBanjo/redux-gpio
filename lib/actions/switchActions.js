/* @flow */
import { createAction } from 'redux-actions';

import {
  CONNECT_SWITCH,
  DISCONNECT_SWITCH,
  OPEN_SWITCH,
  CLOSE_SWITCH
} from '../constants/actionTypes';

export const connect = createAction(CONNECT_SWITCH, (inst: NoNcSwitch): SwitchAction => {
  return { inst };
});

export const disconnect = createAction(DISCONNECT_SWITCH, (inst: NoNcSwitch): SwitchAction => {
  return { inst };
});

export const open = createAction(OPEN_SWITCH, (inst: NoNcSwitch): SwitchAction => {
  return { inst };
});

export const close = createAction(CLOSE_SWITCH, (inst: NoNcSwitch): SwitchAction => {
  return { inst };
});
