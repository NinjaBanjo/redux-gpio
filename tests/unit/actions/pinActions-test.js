import { expect } from 'chai';
import sinon from 'sinon';

import {
  CHANGE_PIN,
  OPEN_PIN,
  CLOSE_PIN
} from '../../../lib/constants/actionTypes';

import {
  change,
  open,
  close
} from '../../../lib/actions/pinActions';

describe('action/pinActions', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  
});
