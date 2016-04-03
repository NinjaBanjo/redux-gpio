import { expect } from 'chai';
import sinon from 'sinon';

import { makeStore } from '../store';

import { write } from '../actions/pinActions';

import { observeStore } from './stateHelper';

describe('integration/helpers/stateHelper', () => {
  let store;

  beforeEach(() => {
    store = makeStore();
  });

  describe('observeStore', () =>{
    it('should call onChange arg when store changes and states are different', () => {
      const changeStub = sinon.stub();
      observeStore(store, e => e, changeStub);
      store.dispatch(write(23, 1));
      expect(changeStub).to.have.been.calledTwice;
      expect(store.getState().get('pinState').get(23).get('value')).to.equal(1);
    });
  });
});
