import { expect } from 'chai';
import sinon from 'sinon';

import wpi from 'wiring-pi';

import { makeStore } from '../store';

import * as pinActions from '../actions/pinActions';

import { observeStore } from '../helpers/stateHelper';

import Pin from './Pin';

describe('integration/interfaces/Pin', () => {
  let testPin = 23;
  let sandbox;
  let store;
  let pin;

  before(() => {
    wpi.setup('gpio');
  });

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    store = makeStore();

    pin = new Pin(store, testPin);
    wpi.pinMode(testPin, wpi.OUTPUT);
    wpi.digitalWrite(testPin, 0); // it won't reset otherwise

    sandbox.stub(Pin.prototype, 'startPolling');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('invalidate', () => {
    it('should cause a read on the gpio value and an update of state', () => {
        wpi.digitalWrite(testPin, 1);
        pin.invalidate();
        expect(store.getState().getIn(['pinState', testPin, 'value'])).to.equal(1);
    });
  });

  describe('read', () => {
    it('should read with gpio value', () => {
      wpi.digitalWrite(testPin, 1);
      pin.read();
      expect(store.getState().getIn(['pinState', testPin, 'value'])).to.equal(1);

      wpi.digitalWrite(testPin, 0);
      pin.read();
      expect(store.getState().getIn(['pinState', testPin, 'value'])).to.equal(0);
    });
  });

  describe('polling', () => {
    it('startPolling should update state when pin changes', (done) => {
      Pin.prototype.startPolling.restore();
      pin.read();
      expect(store.getState().getIn(['pinState', testPin, 'value'])).to.equal(0);
      wpi.digitalWrite(testPin, 1);
      pin.startPolling();
      observeStore(store, state => state.getIn(['pinState', testPin, 'value']), (value) => {
        pin.stopPolling();
        expect(value).to.equal(1);
        done();
      });
    });
  });

  describe('write', () => {
    beforeEach(() => {
      wpi.pinMode(testPin, wpi.OUTPUT);
    });

    it('should change the gpio value', () => {
      expect(wpi.digitalRead(testPin)).to.equal(0);
      pin.write(1);
      expect(wpi.digitalRead(testPin)).to.equal(1);
    });

    it('should write with a store change', () => {
      new Pin(store, testPin);

      expect(wpi.digitalRead(testPin)).to.equal(0);
      store.dispatch(pinActions.write(testPin, 1));
      let unsubscribe = store.subscribe(() => {
        unsubscribe(); // dirty but otherwise we leave a listener bound
        expect(wpi.digitalRead(testPin)).to.equal(1);
      });
    });
  });
});
