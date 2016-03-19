import { expect } from 'chai';
import sinon from 'sinon';

import store from '../../../lib/store';

import * as gpioHelper from '../../../lib/helpers/gpioHelper';
import LED from '../../../lib/interfaces/LED';

import gpioStub from '../../stubs/gpio';

describe('interfaces/LED', () => {
  let sandbox;
  let thenSpy;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();

    sandbox.stub(gpioHelper, 'open');
    sandbox.stub(gpioHelper, 'close');
    sandbox.stub(gpioHelper, 'read');
    sandbox.stub(gpioHelper, 'write');
    sandbox.stub(store, 'dispatch');
    sandbox.stub(store, 'subscribe');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor', () => {
    it('should open the gpio pin provided in arguments', () => {

    });

    it('should throw when it doesn\'t get a pin', () => {
      expect(function() {new LED();}).to.throw(Error);
    });

    it('should return itself', () => {
      expect(new LED(1)).to.have.property('write');
    });
  });

  describe('blink', () => {
    it('should start an interval at the given delay', () => {

    });

    it('should have the correct context in the interval callback', () => {

    });
  });
});
