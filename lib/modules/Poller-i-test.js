import { expect } from 'chai';
import sinon from 'sinon';

import Poller from '../modules/Poller';

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
      sandbox.stub(global, 'setInterval');
    });

    it('should set `pollingInterval` on context when `interval` defined and greater than or equal to 100, then call `poll` on context', () => {
      Poller.prototype.startPolling.call(contextStub, 100);

      expect(contextStub.pollingInterval).to.equal(100);
    });

    it('should throw when `interval` is defined but but less than 100', () => {
      expect(Poller.prototype.startPolling.bind(contextStub, 1)).to.throw(Error);
    });

    it('should not change `pollingInterval` on context and call `poll` on context if no `interval` defined', () => {
      Poller.prototype.startPolling.call(contextStub);

      expect(contextStub.pollingInterval).to.equal(500);
    });

    it('should start an interval at the `pollingInteval` on context', () => {
      Poller.prototype.startPolling.call(contextStub);

      expect(global.setInterval).to.have.been.calledOnce;
      expect(global.setInterval.firstCall.args[0]).to.be.a('function');
      expect(global.setInterval.firstCall.args[1]).to.equal(contextStub.pollingInteval);
    });

    it('should call poll on context in the interval cb', () => {
      Poller.prototype.startPolling.call(contextStub);

      global.setInterval.firstCall.args[0]();

      expect(contextStub.poll).to.have.been.calledOnce;
    });
  });

  describe('stopPolling', () => {
    it('should call `clearInterval` with the `pollingInterval` on context and set it null', () => {
      const contextStub = {
        pollingTimeout: 64
      };
      sandbox.stub(global, 'clearInterval');

      Poller.prototype.stopPolling.call(contextStub);

      expect(global.clearInterval.callCount).to.equal(1);
      expect(global.clearInterval.firstCall.args[0]).to.equal(64);
      expect(contextStub.pollingTimeout).to.equal(0);
    });
  });
});
