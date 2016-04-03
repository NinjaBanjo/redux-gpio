import { expect } from 'chai';

import wpi from 'wiring-pi';

import { makeStore } from '../store';

import Pin from './Pin';

describe('integration/interfaces/Pin', () => {
  const testPin = 23;
  let store;

  beforeEach(() => {
    store = makeStore();
  });

  describe('write', () => {
    let pin;

    beforeEach(() => {
      pin = new Pin(store, testPin);

      pin.pud(wpi.PUD_DOWN);
      pin.mode(wpi.OUTPUT);
    });

    it('should change the gpio value', () => {
      //pin.write(1);

      wpi.digitalWrite(23, 1);

      expect(wpi.digitalRead(testPin)).to.equal(1);
    });
  });
});
