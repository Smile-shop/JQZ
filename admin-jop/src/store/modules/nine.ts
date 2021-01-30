
const state = {
  singleActiveData: {},
  isJmpGift: 0,
}

const mutations = {
  setsingleActiveData(state: any, obj: any) {
    const OldData = state.singleActiveData;
    state.singleActiveData = Object.assign(OldData, obj);
  },
  setisJmpGift(state: any, val: any) {
    state.isJmpGift = val;
  }
}

export default {
  state,
  mutations,
}