export default {
  state: {
    GameActiveData: {},//活动数据
    activeInProducts: [],//活动奖品信息8条
    Winning: {},//中奖列表
    markStatus: false,//中奖展示层
    groupCode: [],//奖品ID
    invalidImg: '',//谢谢参与图片
    winningIndex: '',//设置中奖奖品映射编号
    productType: '', //中奖类型
    Pumping: {
      giftId: 3,
      gifUrl: "https://www.baidu.com/img/baidu_jgylogo3.gif",
    },
    Marktext: '再来一次',
  },

  actions: {
    queryGameActiveData(context) {
      context.commit('setGameActiveData')
    }
  },

  getters: {
    getactiveInProducts: (state) => {
      state.activeInProducts
    },
    getGameActiveData: (state) => {
      state.queryGameActiveData
    },
    getmarkStatus: (state) => {
      state.markStatus
    },
    getWinning: (state) => {
      state.Winning
    },
    getgroupCode: (state) => {
      state.groupCode
    },
    getinvalidImg: (state) => {
      state.invalidImg
    },
    getPumping: (state) => {
      state.Pumping
    },
    getwinningIndex: (state) => {
      state.winningIndex
    },
    getMarktext: (state) => {
      state.Marktext
    },
    getProductType: (state) => {
      state.productType
    }
  },

  mutations: {
    setactiveInProducts(state, Ary) {
      state.activeInProducts = Ary
    },
    setGameActiveData(state, data) {
      state.GameActiveData = Object.assign(data);
    },
    setmarkStatus(state, val) {
      state.markStatus = val
    },
    setWinning(state, Ary) {
      state.Winning = Ary
    },
    setgroupCode(state, Ary) {
      state.groupCode = Ary
    },
    setinvalidImg(state, url) {
      state.invalidImg = url
    },
    setPumping(state, obj) {
      state.Pumping = {};
      state.Pumping = Object.assign(obj)
    },
    setwinningIndex(state, str) {
      state.winningIndex = str
      state.winningIndex = String(state.winningIndex)
    },
    setMarktext(state, text) {
      state.Marktext = text
    },
  }
}