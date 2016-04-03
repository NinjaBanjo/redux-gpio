import { expect } from 'chai';

import wpi from 'wiring-pi';

import { makeStore } from '../store';

import * as pinActions from '../actions/pinActions';

import Pin from './Pin';

describe('integration/interfaces/Pin', () => {
  const testPin = 23;
  let store;

  before(() => {
    wpi.setup('gpio');
  });

  beforeEach(() => {
    store = makeStore();

    wpi.pinMode(testPin, wpi.OUTPUT);
    wpi.digitalWrite(testPin, 0); // it won't reset otherwise
  });

  describe('write', () => {
    let pin;

    beforeEach(() => {
      pin = new Pin(store, testPin);

      wpi.pinMode(23, wpi.OUTPUT);
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
