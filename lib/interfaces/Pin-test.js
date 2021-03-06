import { expect } from 'chai';
import sinon from 'sinon';

import Immutable from 'immutable';

import wpi from 'wiring-pi';

import { makeStore } from '../store';

import * as pinActions from '../actions/pinActions';

import * as stateHelper from '../helpers/stateHelper';

import Pin from './Pin';

describe('interfaces/Pin', () => {
  let sandbox;
  let store;
  let contextStub;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();

    store = makeStore();

    contextStub = {
      store: store,
      getPinId: sandbox.stub().returns(77)
    };

    sandbox.stub(pinActions, 'read').returns('readAction');
    sandbox.stub(pinActions, 'write').returns('writeAction');
    sandbox.stub(pinActions, 'invalidate').returns('invalidateAction');
    sandbox.stub(pinActions, 'setOptions').returns('setOptionsAction');
    sandbox.stub(store, 'dispatch');
    sandbox.stub(store, 'subscribe');

    sandbox.stub(Pin.prototype, 'startPolling');

    sandbox.stub(wpi, 'pinMode');
    sandbox.stub(wpi, 'pullUpDnControl');
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

  afterEach(() => {
    sandbox.restore();
  });

  describe('onChange', () => {
    let stateStub;

    beforeEach(() => {
      contextStub = Object.assign(contextStub, {
        state: Immutable.Map({
          value: 0,
          options: Immutable.Map({
            pud: wpi.PUD_DOWN,
            mode: wpi.INPUT
          }),
          didInvalidate: false
        }),
        pud: sandbox.stub(),
        write: sandbox.stub(),
        mode: sandbox.stub()
      });
      stateStub = Immutable.Map({
        value: 0,
        options: Immutable.Map({
          pud: wpi.PUD_DOWN,
          mode: wpi.INPUT
        })
      });
    });

    it('should update state on context', () => {
      const oldState = contextStub.state;

      Pin.prototype.onChange.call(contextStub, stateStub);

      expect(contextStub.state).to.not.equal(oldState);
    });

    it('should call `write` on context with the newState value if changed',  () => {
      Pin.prototype.onChange.call(contextStub, stateStub.set('value', 1));

      expect(contextStub.write).to.have.been.calledOnce;
      expect(contextStub.write).to.have.been.calledWith(1);
    });

    it('should call `mode` on context with new mode if changed on options', () => {
      const newState = stateStub.set('options', stateStub.get('options').set('mode', 'newMode'));
      Pin.prototype.onChange.call(contextStub, newState);

      expect(contextStub.mode).to.have.been.calledOnce;
      expect(contextStub.mode).to.have.been.calledWith('newMode');
    });

    it('should call `mode` on context with new mode if changed on options', () => {
      const newState = stateStub.set('options', stateStub.get('options').set('pud', 'newPud'));
      Pin.prototype.onChange.call(contextStub, newState);

      expect(contextStub.pud).to.have.been.calledOnce;
      expect(contextStub.pud).to.have.been.calledWith('newPud');
    });
  });

  describe('mode', () => {
    it('should call `pinMode` on `wpi` with pinId and mode passed', () => {
      Pin.prototype.mode.call(contextStub, 'mode');

      expect(wpi.pinMode).to.have.been.calledOnce;
      expect(wpi.pinMode).to.have.been.calledWith(77, 'mode');
    });
  });

  describe('pud', () => {
    it('should call `pullUpDnControl` on wpi with pinId and pud passed', () => {
      Pin.prototype.pud.call(contextStub, 'something');

      expect(wpi.pullUpDnControl).to.have.been.calledOnce;
      expect(wpi.pullUpDnControl).to.have.been.calledWith(77, 'something');
    });
  });

  describe('read', () => {
    it('should dispatch a `read` action with wpi `digitalRead` value of pinId', () => {
      Pin.prototype.read.call(contextStub);

      expect(store.dispatch).to.have.been.calledOnce;
      expect(store.dispatch).to.have.been.calledWith('readAction');
      expect(pinActions.read).to.have.been.calledOnce;
      expect(pinActions.read).to.have.been.calledWith(77);
    });
  });

  describe('write', () => {
    beforeEach(() => {
      contextStub = Object.assign(contextStub, {
        getPinId: sandbox.stub().returns(82),
        store: store
      });
      sandbox.stub(wpi, 'digitalWrite');
    });

    it('should call digitalWrite on `wpi` with pinId and value', () => {
      Pin.prototype.write.call(contextStub, 0);

      expect(wpi.digitalWrite).to.have.been.calledOnce;
      expect(wpi.digitalWrite).to.have.been.calledWith(82, 0);
    });

    it('should only use a 0 or 1 value in calls', () => {
      Pin.prototype.write.call(contextStub, 0);
      expect(wpi.digitalWrite).to.have.been.calledWith(82, 0);

      Pin.prototype.write.call(contextStub, 1);
      expect(wpi.digitalWrite).to.have.been.calledWith(82, 1);

      Pin.prototype.write.call(contextStub, 5949);
      expect(wpi.digitalWrite).to.have.been.calledWith(82, 1);

      Pin.prototype.write.call(contextStub, -14);
      expect(wpi.digitalWrite).to.have.been.calledWith(82, 0);
    });
  });

  describe('toggle', () => {
    beforeEach(() => {
      contextStub = Object.assign(contextStub, {
        state: Immutable.Map({value: 0}),
        write: sandbox.stub()
      });
    });

    it('should dispatch a write with `1` if `value` in state falsy', () => {
      Pin.prototype.toggle.call(contextStub);

      expect(store.dispatch).to.have.been.calledWith('writeAction');
      expect(pinActions.write).to.have.been.calledWith(77, 1);
    });

    it('should dispatch a write with `0` if `value` in state is truthy', () => {
      contextStub.state = Immutable.Map({value: 1});

      Pin.prototype.toggle.call(contextStub);

      expect(store.dispatch).to.have.been.calledWith('writeAction');
      expect(pinActions.write).to.have.been.calledWith(77, 0);
    });
  });

  describe('invalidate', () => {
    it('should dispatch an invalidate action', () => {
      Pin.prototype.invalidate.call(contextStub);

      expect(store.dispatch).to.have.been.calledOnce;
      expect(store.dispatch).to.have.been.calledWith('invalidateAction');
      expect(pinActions.invalidate).to.have.been.calledWith(77);
    });
  });

  describe('setOptions', () => {
    beforeEach(() => {
      contextStub = Object.assign(contextStub, {
        getPinId: sandbox.stub().returns('something'),
        store: store
      });
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
    beforeEach(() => {
      contextStub = Object.assign(contextStub, {
        stopPolling: sandbox.spy()
      });
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
