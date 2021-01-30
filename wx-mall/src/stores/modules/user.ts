import {Module} from 'vuex';

interface State {
  addressChecked: any;
}

export const userModule: Module<State, any> = {
  namespaced: true,
  state: {
    addressChecked: null,
  },
  mutations: {
    setAddressChecked(state, address) {
      state.addressChecked = address;
    },
  },
};
