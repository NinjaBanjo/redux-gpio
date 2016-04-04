import { expect } from 'chai';
import sinon from 'sinon';

import wpi from 'wiring-pi';

import * as wpiHelper from './wpiHelper';

describe('helpers/wpiHelper', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();

    sandbox.stub(wpi, 'setup');
  });

  describe('setup', () => {
    it('should call `setup` on `wpi` with `"gpio"`', () => {
      wpiHelper.setup();

      expect(wpi.setup).to.have.been.calledOnce;
      expect(wpi.setup).to.have.been.calledWith('gpio');
    });
  });
});
