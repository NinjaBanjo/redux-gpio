import { expect } from 'chai';
import sinon from 'sinon';

import { makeStore } from '../store';

import * as pinActions from '../actions/pinActions';

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

    sandbox.stub(pinActions, 'open').returns('openAction');
    sandbox.stub(pinActions, 'close').returns('closeAction');
    sandbox.stub(pinActions, 'invalidate').returns('readAction');
    sandbox.stub(pinActions, 'write').returns('writeAction');
    sandbox.stub(store, 'dispatch');
    sandbox.stub(store, 'subscribe');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor', () => {
    it('should dispatch an open action for given pin', () => {
      new LED(store, 32);
      expect(pinActions.open).to.have.been.calledWith(32)
      expect(store.dispatch).to.have.been.calledWith('openAction');
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
