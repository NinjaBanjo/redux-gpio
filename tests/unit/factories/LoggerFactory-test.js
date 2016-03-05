import {
  expect
} from 'chai';
import sinon from 'sinon';

import winston from 'winston';

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

  it('should be in instanceof winston.Container', () => {
    expect(LoggerFactory).to.be.an.instanceof(winston.Container);
  });

  it('should have the default transports', () => {
    expect(LoggerFactory.default.transports[0]).to.be.an.instanceof(winston.transports.File)
  });
});
