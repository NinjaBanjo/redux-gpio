import { expect } from 'chai';
import sinon from 'sinon';

import { makeStore } from '../store';

import { write } from '../actions/pinActions';

import { observeStore } from './stateHelper';

import { getPinState } from '../reducers/pinStateReducer';

describe('integration/helpers/stateHelper', () => {
  let store;

  beforeEach(() => {
    store = makeStore();
  });

  describe('observeStore', () =>{
    it('should NOT call onChange arg when store changes and states are the same', () => {
      const changeStub = sinon.stub();
      // this pre-populates the store so it won't send a change when getPinState is used
      store.dispatch(write(23, 0));
      observeStore(store, e => e, changeStub);
      expect(changeStub).to.have.been.calledOnce;
      store.dispatch(write(23, 0));
      expect(changeStub).to.have.been.calledOnce;
    });

    it('should call onChange arg when store changes and states are different', () => {
      const changeStub = sinon.stub();
      store.dispatch(write(23, 0));
      observeStore(store, e => e, changeStub);
      expect(changeStub).to.have.been.calledOnce;
      store.dispatch(write(23, 1));
      expect(changeStub).to.have.been.calledTwice;
    });
  });
});
