import { expect } from 'chai';
import sinon from 'sinon';

import Immutable from 'immutable';

import wpi from 'wiring-pi';

import * as stateHelper from '../helpers/stateHelper';

import * as switchActions from '../actions/switchActions';

import { makeStore } from '../store';

import Pin from './Pin';
import NoNcSwitch from './NoNcSwitch';

describe('interfaces/NoNcSwitch', () => {
  const testNoPin = 23;
  const testNcPin = 24;
  let sandbox;
  let store;
  let contextStub;
  let noPin;
  let ncPin;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();

    store = makeStore();

    contextStub = {
      store: store,
      state: Immutable.fromJS({
        switch: {
          open: false,
          connected: false
        },
        noPin: {
          value: 0
        },
        ncPin: {
          value: 0
        }
      })
    };

    noPin = new Pin(store, testNoPin);
    ncPin = new Pin(store, testNcPin);

    sandbox.stub(switchActions, 'connect').returns('connectAction');
    sandbox.stub(switchActions, 'disconnect').returns('disconnectAction');
    sandbox.stub(switchActions, 'open').returns('openAction');
    sandbox.stub(switchActions, 'close').returns('closeAction');
    sandbox.stub(store, 'dispatch');
    sandbox.stub(store, 'subscribe');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor', () => {
    it('should observer the store', () => {
      sandbox.stub(NoNcSwitch.prototype, 'onChange');
      sandbox.stub(stateHelper, 'observeStore');
      const context = new NoNcSwitch(store, noPin, ncPin);

      expect(stateHelper.observeStore).to.have.been.calledOnce;
      stateHelper.observeStore.firstCall.args[2]();
      expect(NoNcSwitch.prototype.onChange).to.have.been.called;
      expect(NoNcSwitch.prototype.onChange).to.have.been.calledOn(context);
    });

    it('should initialize the state on context', () => {
      const context = new NoNcSwitch(store, noPin, ncPin);
      const theState = context.getState();
      expect(theState).to.be.an.instanceof(Immutable.Map);
      expect(theState.get('noPin').get('value')).to.equal(0);
      expect(theState.get('ncPin').get('value')).to.equal(0);
      expect(theState.get('switch').get('open')).to.equal(false);
      expect(theState.get('switch').get('connected')).to.equal(false);
    });
  });

  describe('onChange', () => {
    let stateStub;

    beforeEach(() => {
      stateStub = Immutable.fromJS({
        switch: {
          open: false,
          connected: false
        },
        noPin: {
          value: 0
        },
        ncPin: {
          value: 0
        }
      });
    });

    it('should update state on context', () => {
      const oldState = contextStub.state;

      NoNcSwitch.prototype.onChange.call(contextStub, stateStub);

      expect(contextStub.state).to.not.equal(oldState);
    });

    it('should dispatch a `connect` action if disconnected and pins have opposite values', () => {
      stateStub = stateStub.setIn(['noPin', 'value'], 1);
      stateStub = stateStub.setIn(['ncPin', 'value'], 0);

      NoNcSwitch.prototype.onChange.call(contextStub, stateStub);

      expect(switchActions.connect).to.have.been.calledOnce;
      expect(switchActions.connect).to.have.been.calledWith(contextStub);
      expect(store.dispatch).to.have.been.calledOnce;
      expect(store.dispatch).to.have.been.calledWith('connectAction');
    });

    it('should dipatch a `disconnect` action if connected and pins have same value', () => {
      contextStub.state = contextStub.state.setIn(['switch', 'connected'], true);

      NoNcSwitch.prototype.onChange.call(contextStub, stateStub);

      expect(switchActions.disconnect).to.have.been.calledOnce;
      expect(switchActions.disconnect).to.have.been.calledWith(contextStub);
      expect(store.dispatch).to.have.been.calledOnce;
      expect(store.dispatch).to.have.been.calledWith('disconnectAction');
    });

    it('should dispatch an `open` action if connected and new ncPinValue is 1 while old ncPinValue is 0', () => {
      contextStub.state = contextStub.state.setIn(['switch', 'connected'], true);
      contextStub.state = contextStub.state.setIn(['ncPin', 'value'], 0);
      stateStub = stateStub.setIn(['ncPin', 'value'], 1);

      NoNcSwitch.prototype.onChange.call(contextStub, stateStub);

      expect(switchActions.open).to.have.been.calledOnce;
      expect(switchActions.open).to.have.been.calledWith(contextStub);
      expect(store.dispatch).to.have.been.calledOnce;
      expect(store.dispatch).to.have.been.calledWith('openAction');
    });

    it('should dispatch a `close` action if connected and new ncPinValue is 0 while old ncPinValue is 1', () => {
      contextStub.state = contextStub.state.setIn(['switch', 'connected'], true);
      contextStub.state = contextStub.state.setIn(['ncPin', 'value'], 1);
      // pin values have to be opposite when connected
      stateStub = stateStub.setIn(['noPin', 'value'], 1);
      stateStub = stateStub.setIn(['ncPin', 'value'], 0);

      NoNcSwitch.prototype.onChange.call(contextStub, stateStub);

      expect(switchActions.open).to.have.not.been.called;
      expect(switchActions.close).to.have.been.calledOnce;
      expect(switchActions.close).to.have.been.calledWith(contextStub);
      expect(store.dispatch).to.have.been.calledOnce;
      expect(store.dispatch).to.have.been.calledWith('closeAction');
    });

    it('should not dispatch `open` or `close` if NOT connected and pin values change', () => {
      // pins must be opposite when connected
      stateStub = stateStub.setIn(['ncPin', 'value'], 0);
      stateStub = stateStub.setIn(['noPin', 'value'], 0);

      NoNcSwitch.prototype.onChange.call(contextStub, stateStub);

      expect(switchActions.open).to.have.not.been.called;
      expect(switchActions.close).to.have.not.been.called;
      expect(store.dispatch).to.have.not.been.called;

      contextStub.state = contextStub.state.setIn(['ncPin', 'value'], 1);
      contextStub.state = contextStub.state.setIn(['noPin', 'value'], 1);
      stateStub = stateStub.setIn(['ncPin', 'value'], 1);
      stateStub = stateStub.setIn(['noPin', 'value'], 1);

      NoNcSwitch.prototype.onChange.call(contextStub, stateStub);

      expect(switchActions.open).to.have.not.been.called;
      expect(switchActions.close).to.have.not.been.called;
      expect(store.dispatch).to.have.not.been.called;
    });
  });
});
