import { expect } from 'chai';
import sinon from 'sinon';

import { makeStore } from '../store';

import * as gpioHelper from '../helpers/gpioHelper';
import LED from './LED';

import gpioStub from '../../tests/stubs/gpio';

describe('interfaces/LED', () => {
  let sandbox;
  let thenSpy;
  let store;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();

    store = makeStore();

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

    it('should return itself', () => {
      expect(new LED(store, 42)).to.have.property('write');
    });
  });

  describe('blink', () => {
    it('should start an interval at the given delay', () => {

    });

    it('should have the correct context in the interval callback', () => {

    });
  });
});
