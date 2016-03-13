import { expect } from 'chai';
import sinon from 'sinon';

import EE from 'eventemitter3';

import Gpio from 'pi-gpio';

import LED from '../../../lib/interfaces/LED';

describe('interfaces/LED', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor', () => {

  });
});