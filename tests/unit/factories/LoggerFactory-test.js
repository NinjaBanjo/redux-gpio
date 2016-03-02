import { expect } from 'chai';
import sinon from 'sinon';

import LoggerFactory from '../../../lib/factories/LoggerFactory';

describe('LoggerFactory', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should be an object', () => {
    expect(LoggerFactory).to.be.an('object');
  });
});
