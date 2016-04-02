import { expect } from 'chai';
import sinon from 'sinon';

import wpi from 'wiring-pi';

import * as wpiHelper from './wpiHelper';

describe('helpers/wpiHelper', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();

    sandbox.stub(wpi, 'wiringPiSetupGpio');
  });

  describe('setup', () => {
    it('should call `wiringPiSetupGpio` on wpi', () => {
      wpiHelper.setup();

      expect(wpi.wiringPiSetupGpio).to.have.been.calledOnce;
    });
  });
});
