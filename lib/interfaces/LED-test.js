import { expect } from 'chai';
import sinon from 'sinon';

import { makeStore } from '../store';

import wpi from '../modules/wpi';

import * as pinActions from '../actions/pinActions';

import * as processHelper from '../helpers/processHelper';

import * as stateHelper from '../helpers/stateHelper';

import Pin from './Pin';
import LED from './LED';

describe('interfaces/LED', () => {
  let sandbox;
  let thenSpy;
  let store;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();

    store = makeStore();

    sandbox.stub(pinActions, 'setOptions');
    sandbox.stub(store, 'dispatch');
    sandbox.stub(LED, 'constructor');
    sandbox.stub(stateHelper, 'observeStore');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor', () => {
    beforeEach(() => {
      LED.constructor.restore();
    });

    it('should dispatch a setOptions call with INPUT mode and PUD_DOWN pud', () => {
      new LED(new Pin(store, 1));

      expect(pinActions.setOptions.firstCall.args[1]).to.deep.equal({mode: wpi.INPUT, pud: wpi.PUD_DOWN});
    });
  });

  describe('blink', () => {
    let clock;
    let contextStub;

    beforeEach(() => {
      clock = sandbox.useFakeTimers();
      contextStub = {
        pin: {
          toggle: sandbox.spy()
        }
      };
    });

    it('should have a default delay of 250', () => {
      sandbox.stub(global, 'setInterval');

      LED.prototype.blink.call(contextStub);

      expect(global.setInterval.firstCall.args[1]).to.equal(250);
    });

    it('should accept a custom delay as the first argument', () => {
      sandbox.stub(global, 'setInterval');

      LED.prototype.blink.call(contextStub, 900);

      expect(global.setInterval.firstCall.args[1]).to.equal(900);
    });

    it('should call toggle on pin property on context at the given interval', () => {
      const toggleFn = contextStub.pin.toggle;

      LED.prototype.blink.call(contextStub, 50);

      expect(toggleFn).to.not.have.been.called;
      clock.tick(40);
      expect(toggleFn).to.not.have.been.called;
      clock.tick(10);
      expect(toggleFn).to.have.been.calledOnce;
      clock.tick(50);
      expect(toggleFn).to.have.been.calledTwice;
    });

    it('should have the correct context in the interval callback', () => {
      sandbox.stub(global, 'setInterval');

      LED.prototype.blink.call(contextStub);
      global.setInterval.firstCall.args[0]();

      expect(contextStub.pin.toggle).to.have.been.calledOnce;
    });
  });

  describe('destroy', () => {
    let contextStub;

    beforeEach(() => {
      sandbox.stub(global, 'clearInterval');
      contextStub = {
        blinkInterval: 3
      };
    });

    it('should call clearInterval with the `blinkInterval` on context', () => {
      LED.prototype.destroy.call(contextStub);

      expect(global.clearInterval).to.have.been.calledWith(contextStub.blinkInterval);
    });
  });
});
