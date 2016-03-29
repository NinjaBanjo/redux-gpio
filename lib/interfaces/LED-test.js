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
  let PinStub;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();

    store = makeStore();

    PinStub = sinon.spy(function() {
      return sinon.createStubInstance(Pin);
    });

    sandbox.stub(pinActions, 'read').returns('readAction');
    sandbox.stub(pinActions, 'setOptions').returns('setOptionsAction');
    sandbox.stub(pinActions, 'invalidate').returns('readAction');
    sandbox.stub(pinActions, 'write').returns('writeAction');
    sandbox.stub(store, 'dispatch');
    sandbox.stub(store, 'subscribe');
    sandbox.stub(LED, 'constructor');
    sandbox.stub(stateHelper, 'observeStore');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor', () => {
    beforeEach(function(){
      LED.constructor.restore();
    });

    it('should observer the store', function() {
      sandbox.stub(LED.prototype, 'onChange');
      const context = new LED(store, new PinStub(store, 1));

      expect(stateHelper.observeStore).to.have.been.calledOnce;
      stateHelper.observeStore.firstCall.args[2]();
      expect(LED.prototype.onChange).to.have.been.called;
      expect(LED.prototype.onChange).to.have.been.calledOn(context);
    });

    it('should dispatch a setOptions call with INPUT mode and PUD_DOWN pud', function() {
      new LED(store, new Pin(store, 1));

      expect(pinActions.setOptions.firstCall.args[1]).to.deep.equal({mode: wpi.INPUT, pud: wpi.PUD_DOWN});
    });
  });

  describe('blink', () => {
    it('should start an interval at the given delay', () => {

    });

    it('should have the correct context in the interval callback', () => {

    });
  });
});
