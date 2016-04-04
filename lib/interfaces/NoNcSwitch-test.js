import { expect } from 'chai';
import sinon from 'sinon';

import Immutable from 'immutable';

import wpi from 'wiring-pi';

import * as stateHelper from '../helpers/stateHelper';

import * as pinActions from '../actions/pinActions';

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
      getPinId: sandbox.stub().returns(77)
    };

    noPin = new Pin(store, testNoPin);
    ncPin = new Pin(store, testNcPin);

    sandbox.stub(pinActions, 'read').returns('readAction');
    sandbox.stub(pinActions, 'write').returns('writeAction');
    sandbox.stub(pinActions, 'invalidate').returns('invalidateAction');
    sandbox.stub(pinActions, 'setOptions').returns('setOptionsAction');
    sandbox.stub(store, 'dispatch');
    sandbox.stub(store, 'subscribe');

    sandbox.stub(wpi, 'pinMode');
    sandbox.stub(wpi, 'pullUpDnControl');
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
      contextStub = Object.assign(contextStub, {
        state: Immutable.Map({
          open: false,
          connected: true
        })
      });
      stateStub = Immutable.Map({
        open: false,
        connected: true
      });
    });

    it('should update state on context', () => {
      const oldState = contextStub.state;

      NoNcSwitch.prototype.onChange.call(contextStub, stateStub);

      expect(contextStub.state).to.not.equal(oldState);
    });
  });
});
