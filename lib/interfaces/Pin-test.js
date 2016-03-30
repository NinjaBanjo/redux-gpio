import { expect } from 'chai';
import sinon from 'sinon';

import Immutable from 'immutable';

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
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor', () => {
    it('should observer the store', () => {
      sandbox.stub(Pin.prototype, 'onChange');
      sandbox.stub(stateHelper, 'observeStore');
      const context = new Pin(store, 2);

      expect(stateHelper.observeStore).to.have.been.calledOnce;
      stateHelper.observeStore.firstCall.args[2]();
      expect(Pin.prototype.onChange).to.have.been.called;
      expect(Pin.prototype.onChange).to.have.been.calledOn(context);
    });

    it('should initialize the state on context', () => {
      const context = new Pin(store, 3);
      expect(context.getState()).to.be.an.instanceof(Immutable.Map);
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

  describe('toggle', () => {
    let contextStub;

    beforeEach(() => {
      contextStub = {
        state: Immutable.Map({value: 0}),
        write: sandbox.stub()
      };
    });

    it('should call write on context with `1` if `value` in state falsy', () => {
      Pin.prototype.toggle.call(contextStub);

      expect(contextStub.write).to.have.been.calledWith(1);
    });

    it('should call write on context with `0` if `value` in state is truthy', () => {
      contextStub.state = Immutable.Map({value: 1});

      Pin.prototype.toggle.call(contextStub);

      expect(contextStub.write).to.have.been.calledWith(0);
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

  describe('getPinId', () => {
    it('should return the pinId on context', () => {
      expect(Pin.prototype.getPinId.call({pinId: 44758})).to.equal(44758);
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
