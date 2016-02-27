import { expect } from 'chai';
import sinon from 'sinon';

import EE from 'eventemitter3';

import { Gpio } from 'onoff';

import NoNcSwitch from '../../../lib/interfaces/NoNcSwitch';

describe('lib/interfaces/NoNcSwitch', () => {
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
    it('should call `setInterval` with `pollingHandler` on context and `interval` passed in')
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