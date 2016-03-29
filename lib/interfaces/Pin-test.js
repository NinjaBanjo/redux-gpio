import { expect } from 'chai';
import sinon from 'sinon';

import { makeStore } from '../store';

import * as pinActions from '../actions/pinActions';

import * as stateHelper from '../helpers/stateHelper';

import Pin from './Pin';

describe('interfaces/Pin', () => {
  let sandbox;
  let store;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();

    store = makeStore();

    sandbox.stub(pinActions, 'read').returns('readAction');
    sandbox.stub(pinActions, 'write').returns('writeAction');
    sandbox.stub(pinActions, 'invalidate').returns('readAction');
    sandbox.stub(pinActions, 'setOptions').returns('setOptionsAction');
    sandbox.stub(store, 'dispatch');
    sandbox.stub(store, 'subscribe');
    sandbox.stub(stateHelper, 'observeStore');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor', () => {
    it('should observer the store', function() {
      sandbox.stub(Pin.prototype, 'onChange');
      const context = new Pin(store, 2);

      expect(stateHelper.observeStore).to.have.been.calledOnce;
      stateHelper.observeStore.firstCall.args[2]();
      expect(Pin.prototype.onChange).to.have.been.called;
      expect(Pin.prototype.onChange).to.have.been.calledOn(context);
    });
  });

  describe('onChange', () => {
    let contextStub;

    beforeEach(() => {
      contextStub = {
        state: {one: 2}
      };
    });

    it('should update state on context', () => {
      const oldState = contextStub.state;

      Pin.prototype.onChange.call(contextStub, {moo: 48});

      expect(contextStub.state).to.not.equal(oldState);
    });
  });

  describe('setOptions', () => {
    let contextStub;

    beforeEach(() => {
      contextStub = {
        getPinId: sandbox.stub().returns('something'),
        store: store
      };
    });

    it('should dispatch a setOptions action with `getPinId` return and options passed', () => {
      const options = {test: 'object'};
      pinActions.setOptions.restore();

      Pin.prototype.setOptions.call(contextStub, options);

      expect(store.dispatch).to.have.been.calledOnce;
      expect(store.dispatch.firstCall.args[0]).to.deep.equal({
        type: 'SET_PIN_OPTIONS',
        payload: {
          pin: 'something',
          options: options
        }
      });
    });
  });

  describe('destroy', () => {
    let contextStub;

    beforeEach(() => {
      contextStub = {
        stopPolling: sandbox.spy()
      };
    });

    it('should call stopPolling on context', () => {
      Pin.prototype.destroy.call(contextStub);

      expect(contextStub.stopPolling).to.have.been.calledOnce;
    });

    it('should call unsubscribe on context if truthy', () => {
      contextStub.unsubscribe = sandbox.spy();

      Pin.prototype.destroy.call(contextStub);

      expect(contextStub.unsubscribe).to.have.been.calledOnce;
    });
  });
});
