import { expect } from 'chai';
import sinon from 'sinon';

import Poller from '../../../lib/modules/Poller';

describe('modules/Poller', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should be a function', () => {
    expect(Poller).to.be.a('function');
  });

  describe('startPolling', () => {
    let contextStub;

    beforeEach(function() {
      contextStub = {
        pollingInterval: 500,
        poll: sandbox.stub().returns(123)
      };
      sandbox.stub(global, 'setTimeout');
    });

    it('should set `pollingInterval` on context when `interval` defined and greater than or equal to 100, then call `poll` on context', () => {
      Poller.prototype.startPolling.call(contextStub, 100);

      expect(contextStub.pollingInterval).to.equal(100);
      expect(contextStub.poll.callCount).to.equal(1);
    });

    it('should throw when `interval` is defined but but less than 100', () => {
      expect(Poller.prototype.startPolling.bind(contextStub, 1)).to.throw(Error);
    });

    it('should not change `pollingInterval` on context and call `poll` on context if no `interval` defined', () => {
      Poller.prototype.startPolling.call(contextStub);

      expect(contextStub.pollingInterval).to.equal(500);
      expect(contextStub.poll.callCount).to.equal(1);
    });
  });

  describe('stopPolling', () => {
    it('should call `clearInterval` with the `pollingInterval` on context and set it null', () => {
      const contextStub = {
        pollingTimeout: 64
      };
      sandbox.stub(global, 'clearTimeout');

      Poller.prototype.stopPolling.call(contextStub);

      expect(global.clearTimeout.callCount).to.equal(1);
      expect(global.clearTimeout.firstCall.args[0]).to.equal(64);
      expect(contextStub.pollingTimeout).to.equal(0);
    });
  });
});
