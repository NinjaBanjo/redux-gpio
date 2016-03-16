import { expect } from 'chai';
import sinon from 'sinon';

import gpioHelper from '../../../lib/helpers/gpioHelper';
import LED from '../../../lib/interfaces/LED';

import gpioStub from '../../stubs/gpio';

describe('interfaces/LED', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(gpioHelper)
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor', () => {
    it('should open the gpio pin provided in arguments', () => {
      
    });

    it('should throw when it doesn\'t get a pin', () => {
      expect(function() {new LED()}).to.throw(Error);
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
