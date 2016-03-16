import { expect } from 'chai';
import sinon from 'sinon';

import {
  PIN_CHANGE,
  PIN_OPEN,
  PIN_CLOSE
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

  describe('change', () => {
    it('should return action with `PIN_CHANGE` type and pin + value passed', () => {
      var action = change(6, 1);
      expect(action).to.dee.equal({
        type: PIN_CHANGE,
        pin: 6,
        value: 1
      });
    });
  });
});
