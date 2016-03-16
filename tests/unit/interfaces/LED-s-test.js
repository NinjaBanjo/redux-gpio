import { expect } from 'chai';
import sinon from 'sinon';

import EE from 'eventemitter3';

import gpio from '../../../lib/modules/gpio';
import LED from '../../../lib/interfaces/LED';

import gpioStub from '../../stubs/gpio';

describe('interfaces/LED', () => {
  let sandbox;
  let oldGpio;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    // reload gpio stubs
    oldGpio = gpio;
    gpio = Object.assign({}, gpioStub());
    sandbox.stub()
  });

  afterEach(() => {
    sandbox.restore();
    gpio = oldGpio;
  });

  describe('constructor', () => {
    it('should open the gpio pin provided in arguments', () => {

    });

    it('should throw when it doesn\'t get a pin', () => {
      expect(function() {new LED()}).to.throw(Error);
    });

    it('should return itself', () => {
      expect(new LED(1)).to.have.property()
    });
  });

  describe('blink', () => {
    it('should start an interval at the given delay', () => {

    });

    it('should have the correct context in the interval callback', () => {

    });
  });
});
