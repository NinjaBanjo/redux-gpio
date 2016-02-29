import { expect } from 'chai';
import sinon from 'sinon';

import EE from 'eventemitter3';

import { Gpio } from 'onoff';

import NoNcSwitch from '../../../lib/interfaces/NoNcSwitch';

describe('shared/lib/interfaces/NoNcSwitch', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should be a function', () => {
    expect(NoNcSwitch).to.be.a('function');
  });

  it('should extend EventEmitter', () => {
    expect(NoNcSwitch.prototype instanceof EE).to.equal(true);
  });

  describe('startPolling', () => {
    let contextStub;

    beforeEach(function () {
      contextStub = {
        pollingInterval: 500,
        poll: sandbox.stub().returns(123)
      };
      sandbox.stub(global, 'setTimeout')
    });

    it('should set `pollingInterval` on context when `interval` defined and greater than or equal to 100, then call `poll` on context', () => {
      NoNcSwitch.prototype.startPolling.call(contextStub, 100);

      expect(contextStub.pollingInterval).to.equal(100);
      expect(contextStub.poll.callCount).to.equal(1);
    });

    it('should throw when `interval` is defined but but less than 100', () => {
      expect(NoNcSwitch.prototype.startPolling.bind(contextStub, 1)).to.throw(Error);
    });

    it('should not change `pollingInterval` on context and call `poll` on context if no `interval` defined', () => {
      NoNcSwitch.prototype.startPolling.call(contextStub);

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

      NoNcSwitch.prototype.stopPolling.call(contextStub);

      expect(global.clearTimeout.callCount).to.equal(1);
      expect(global.clearTimeout.firstCall.args[0]).to.equal(64);
      expect(contextStub.pollingTimeout).to.equal(0);
    });
  });
});