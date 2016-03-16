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

  describe('change', () => {
    it('should return action with `CHANGE_PIN` type and pin + value passed', () => {
      var action = change(6, 1);
      expect(action).to.dee.equal({
        type: CHANGE_PIN,
        pin: 6,
        value: 1
      });
    });
  });
});
