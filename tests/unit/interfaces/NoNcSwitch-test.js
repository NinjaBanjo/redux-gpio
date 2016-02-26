import { expect } from 'chai';
import sinon from 'sinon';

import EventEmitter from 'events';

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
    expect(NoNcSwitch.prototype instanceof EventEmitter).to.equal(true);
  });

  describe('startPolling', () => {
    it('should call `setInterval` with `pollingHandler` on context and `interval` passed in')
  });

  describe('stopPolling', () => {
    it('should call `clearInterval` with the `pollingInterval` on context and set it null', () => {
      const contextStub = {
        pollingInterval: 'pollingInterval'
      };
      sandbox.stub(global, 'clearInterval');

      NoNcSwitch.prototype.stopPolling.call(contextStub);

      expect(global.clearInterval.callCount).to.equal(1);
      expect(global.clearInterval.firstCall.args[0]).to.equal('pollingInterval');
      expect(contextStub.pollingInterval).to.be.null;
    });
  });
});