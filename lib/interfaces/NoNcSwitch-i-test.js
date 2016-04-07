import { expect } from 'chai';
import sinon from 'sinon';

import { makeStore } from '../store';

describe('integration/interfaces/NoNcSwitch', () => {
  let store;

  beforeEach(() => {
    store = makeStore();

    sinon.stub(Pin.prototype, 'startPolling');
  });

  afterEach(() => {
    Pin.prototype.startPolling.restore();
  });

  describe('connect', () => {
    it('should ');
  });
});
