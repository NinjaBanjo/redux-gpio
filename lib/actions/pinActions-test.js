import { expect } from 'chai';
import sinon from 'sinon';

import {
  CHANGE_PIN,
  OPEN_PIN,
  CLOSE_PIN
} from '../constants/actionTypes';

import {
  change,
  open,
  close
} from '../actions/pinActions';

describe('action/pinActions', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  
});
