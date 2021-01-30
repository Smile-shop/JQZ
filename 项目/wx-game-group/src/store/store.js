export default {
  state: {
    GameActiveData: {},//活动数据
    activeInProducts: [],//活动奖品信息8条
    Winning: {},//中奖列表
    markStatus: false,//中奖展示层
    groupCode: [],//奖品ID
    invalidImg: '',//谢谢参与图片
    winningIndex: '',//设置中奖奖品映射编号
    confirmStatus: false,
    playing: true,//音乐
    playstatus: false,//播放状态
    Pumping: {
      giftId: 3,
      gifUrl: "",
    },
    Marktext: '再来一次',
    imgCount: 0,
    loginInfo: '',
    giftDetail: {},//礼品详情信息
    MarkBtnstatus: true,//此状态用来判断中奖图层按钮状态样式;
    MarkLinkstatus: 0,//判断是否跳转到登录页面 【0，代表不跳转】【1，代表跳转到登录】【2，代表跳转到领取页面】
    productGift: [],
    jggGiftInfo: {}, // 九宫格中奖信息
    jggProductType: '', //九宫格中奖类型
    jggRegister: '', // 九宫格跳转至注册
    jggCoupon: false, // 九宫格优惠券显示所在位置
    jggShareInfo: false, // 九宫格分享情况
    jggOnlyMember: false, // 九宫格游戏是否仅限会员 
    playCardProductType: '1', // 翻牌中奖类型
    flopOnlyMember: false, // 翻牌游戏仅限会员
    flopGiftInfo: {}, // 翻牌中奖信息
    flopRegister: false, // 翻牌显示注册
    flopShareInfo: false, // 翻牌分享
    redEnveShareInfo: false, // 翻红包分享
  },

  getters: {
    getJggProductType: (state) => {
      return String(state.jggProductType)
    },
    getPlayCardProductType: (state) => {
      return String(state.playCardProductType)
    },
    getJggRegister: (state) => {
      return String(state.jggRegister)
    },
    getJggShareInfo: (state) => {
      return Boolean(state.jggShareInfo)
    },
    getJggOnlyMember: (state) => {
      return Boolean(state.jggOnlyMember)
    },
    getJggCoupon: (state) => {
      return state.jggCoupon
    },
    getJggGiftInfo: (state) => {
      return state.jggGiftInfo
    },
    getflopGiftInfo: (state) => {
      return state.flopGiftInfo
    },
    getflopRegister: (state) => {
      return state.flopRegister
    },
    getFlopOnlyMember: (state) => {
      return state.flopOnlyMember
    },
    getflopShareInfo: (state) => {
      return state.flopShareInfo
    },
    getredEnveShareInfo: (state) => {
      return state.redEnveShareInfo
    },
    getLoginInfo: (state) => {
      return state.loginInfo
    }
  },

  mutations: {
    setLoginInfo(state, info) {
      state.loginInfo = info
    },
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
    setconfirmStatus(state, val) {
      state.confirmStatus = val
    },
    setPlaying(state, val) {
      state.playing = val
    },
    setgiftDetail(state, obj) {
      state.giftDetail = Object(obj)
    },
    setMarkBtnstatus(state, val) {
      state.MarkBtnstatus = val
    },
    setMarkLinkstatus(state, val) {
      state.MarkLinkstatus = val
    },
    setplaystatus(state, val) {
      state.playing = val
    },
    setimgCount(state, val) {
      state.imgCount = val
    },
    setproductGift(state, obj) {
      state.productGift = obj;
    },
    setJggProductType(state, type) {
      state.jggProductType = type
    },
    setJggRegister(state, text) {
      state.jggRegister = text
    },
    setJggGiftInfo(state, options) {
      state.jggGiftInfo = options
    },
    setPlayCardProductType(state, type) {
      state.playCardProductType = type
    },
    setJggShareInfo(state, status) {
      state.jggShareInfo = status
    },
    setJggOnlyMember(state, status) {
      state.jggOnlyMember = status
    },
    setFlopOnlyMember(state, status) {
      state.flopOnlyMember = status
    },
    setFlopGiftInfo(state, info) {
      state.flopGiftInfo = info
    },
    setflopRegister(state, status) {
      state.flopRegister = status
    },
    setflopShareInfo(state, status) {
      state.flopShareInfo = status
    },
    setJggCoupon(state, bool) {
      state.jggCoupon = bool
    },
    setredEnveShareInfo(state, status) {
      state.redEnveShareInfo = status
    },
  }
}