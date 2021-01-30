// pages/goodsDetail/index.js
var app = getApp();

import { Server } from '../../models/server'

const ajax = new Server()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    successTip: false, // 添加购物车成功
    successTipText: '', // 添加成功显示文案
    successTipMsg: '添加成功，在购物车等亲～', // 成功文案
    autoplay: true,
    current: 1,
    swiperTotal: 8,
    initSelected: 1,
    showSwiper: false, // 轮播图展示大图
    maxNumber: 500,
    miniNumber: 1,
    initChild: '',
    pageNum: 0,
    pageSize: 10,
    initNumber: null,
    once: 0,
    showTip: false,
    collectionTip: null,
    timer: new Date().getTime(),
    shoppingGap: 2000,
    shoppingOnce: new Date().getTime(),
    isCollectionStatus: {
      correct: 1, // 收藏成功
      deny: 0, // 取消收藏
    },
    collectionMsg: '请休息一下',
    message: '添加成功',
    collection: '取消收藏成功',
    isCollection: '已收藏',
    nullTip: '请选中商品后添加',
    bottomText: '暂无数据',
    priceText: {
      ascending: {
        sortText: '由低到高',
        checked: true
      },
      descending: {
        sortText: '由高到低',
        checked: false,
      },
    },
    footerText : {
      more: '加载更多…',
      nomore: '别扯了，没有更多了',
      loading: '加载中'
    },
    total: 0,
    mulitName: '',
    mulitId: null,
    cartName: '加入购物车',
    checked: false,
    address: [],
    jewelryParams: {},
    productionRichText: {},
    goodsMore: {},
    production: {},
    alias: {},
    tip: 1,
    number: 1,
    multiGoodsShow: false,
    mask: false,
    globalStyle: getApp().globalData.globalStyle,
    showSheet: false,
    showSharePost: false,
    postList: '',
    shareIdentification: '0', // 分享标识 1代表分享进来的
    shareLimit: false // 是否登录
  },
  // 弹出分享模板
  goShowSheet() {
    this.setData({
      showSheet: true
    })
  },
  // 弹出分享海报
  myEventListener: function(e) {
    // 去请求数据获取海报商品名称，价格，图片
    // 默认图片
    const bgUrl = 'http://www.jqzjop.com/ftp_images/test01/kfHeadImg/6b109f1a78ce43b3abf01bc7bc73c458_1594281291793.png'
    const params = {
      productName: this.data.jewelryParams.name,
      // productPrice: this.data.jewelryParams.smallOrderedPrice === this.data.jewelryParams.largeOrderedPrice ? this.data.jewelryParams.smallOrderedPrice : this.data.jewelryParams.smallOrderedPrice + '~' + this.data.jewelryParams.largeOrderedPrice,
      backgroundUrl: this.data.address.length > 0 ? this.data.address[0].url :  bgUrl,
    }
    // 这里是接口请求数据
    ajax.getPoster(params).then(res => {
      let base64 = res.data.replace(/[\r\n]/g, '')
      let url = 'data:image/jpg;base64,' + base64
      this.setData({
        showSharePost: e.detail.params,
        showSheet: false,
        postList: url
      })
    }).catch(err => {
      wx.showToast({
        title: '请求出错，请稍后再试',
        icon: 'none'
      })
    })
  },

  // 切换轮播图
  changeSwiper: function(e) {
    const current = e.detail.current + 1
    this.setData({
      current: current
    })
  },

  // 跳转购物车
  goCart: function() {
    app.globalData.cachepath = null
    wx.switchTab({
      url: '/pages/shoppingCart/index'
    })
  },

  // 正确返回
  requestBack: function(res) {
    let result = false
    const successCode = 0
    const { code } = res
    if(successCode === code)  {
      result = true
    }

    return result
  },

  // 错误返回
  requestError: function(res) {
    // do something
  },

  // 统一请求方法
  request: function(params) {
    const {options, name, loading } = params
    return new Promise((resolve) => {
      ajax[name](options, loading).then(res => {
        const result = this.requestBack(res)
        if (result) {
          resolve(res)
        }
      }).catch(err => {
        this.requestError(err)
      })
    })
  },

  // 方法
  requestApi: function(name) {
    const methods =  {}

    methods[name] = (options) => {
      return this.request(options)
    }

    return methods
  },

  // 查询购物车数量
  getCartNumber: function() {
    const api = 'getCartNumber'
    const getCount = this.requestApi(api)
    const options = {
      params: {},
      name: api,
      loading: false
    }
    getCount[api](options).then((res) => {
      const { replyData } = res
      const number = replyData.count
      this.setData({
        initNumber: number
      })
    })
  },

  // 跳转至更多款式列表
  skipMoreType: function(options) {
    const { proId, name } = options
    wx.navigateTo({
      url: `/pages/scrollList/index?id=${proId}&name=${name}`,
    })
  },

  // 查看更多款式
  handlMoreStyle: function() {
    const { proId, name } = this.data.jewelryParams
    const params = { proId, name}
    this.skipMoreType(params)
  },

  // 点击商品详情轮播图
  handleSwiper: function() {
    this.setData({
      showSwiper: true
    })
  },

  // 关闭详情轮播展示
  closeSwiper: function() {
    this.setData({
      showSwiper: false
    })
  },

  // 查询商品详情
  getGoodsDetail: function(options) {
    const api = 'getGoodsDetail'
    const detail = this.requestApi(api)
    const combination = {
      options: options,
      name: api,
    }
    detail[api](combination).then((res) => {
      const { replyData } = res
      let { proPhotos , jewelryParams, text } = replyData
      const number = Array.isArray(proPhotos) ? proPhotos.length : 0
      jewelryParams.selected = 1
      const shoppingNum = jewelryParams.getGoodsDetail || 1
      jewelryParams.shoppingCount = shoppingNum

      let miniProgrameText = text

      const phase = new RegExp('<div>', 'gi')
      const content = new RegExp('<p', 'gi')
      const regex = new RegExp('<img', 'gi')
      miniProgrameText = miniProgrameText.includes('<div>') ? miniProgrameText.replace(phase, `<div style='width: 100%; margin:0 auto; text-align: center;'>`) : miniProgrameText
      miniProgrameText = miniProgrameText.includes('<p') ? miniProgrameText.replace(content, `<p style="width: 100%; margin:0 auto; text-align: center;"`) : miniProgrameText
      miniProgrameText = miniProgrameText.includes('<img') ? miniProgrameText.replace(regex, `<img style="width: 100%; margin:0 auto;"`) : miniProgrameText

      this.setData({
        address: proPhotos,
        jewelryParams: jewelryParams,
        swiperTotal: number,
        productionRichText: miniProgrameText,
      })
    }).then(() => {
      this.getAlias()
    })
  },

  // 查询别名
  getAlias: function() {
    const api = 'getAlias'
    const alias = this.requestApi(api)
    const combination = {
      options: {},
      name: api,
    }
    alias[api](combination).then(res => {
      const { replyData } = res
      this.setData({
        alias: replyData
      })
    }).then(() => {
      this.createTable()
    })
  },

  // 匹配产品和别名
  createTable: function() {
    const value = Object.keys(this.data.jewelryParams) // 值
    const keys = Object.keys(this.data.alias) // 别名
    const miniTalb = {}

    keys.map(item => {
      if(value.includes(item)) {
        miniTalb[item] = {}
        miniTalb[item]['name'] = this.data.alias[item]
        miniTalb[item]['value'] = this.data.jewelryParams[item]
      }
    })

    miniTalb.code = {}
    miniTalb.code.name = '首饰编号'
    miniTalb.code.value = this.data.jewelryParams.code

    miniTalb['mainStoneWeight'] = {}
    miniTalb['mainStoneWeight']['name'] = this.data.alias['mainStoneWeight']
    miniTalb['mainStoneWeight']['value'] = {}
    miniTalb['mainStoneWeight']['value']['smallMainStoneWeight'] = this.data.jewelryParams.smallMainStoneWeight
    miniTalb['mainStoneWeight']['value']['largeMainStoneWeight'] = this.data.jewelryParams.largeMainStoneWeight

    miniTalb['goldWeight'] = {}
    miniTalb['goldWeight']['name'] = this.data.alias['goldWeight']
    miniTalb['goldWeight']['value'] = {}
    miniTalb['goldWeight']['value']['smallGoldWeight'] = this.data.jewelryParams.smallGoldWeight
    miniTalb['goldWeight']['value']['largeGoldWeight'] = this.data.jewelryParams.largeGoldWeight

    this.setData({
      production: miniTalb
    })
  },

  // 改变收藏状态
  changeCollection: function(state) {
    const result = this.data.jewelryParams
    result.isCollec = state
    this.setData({
      jewelryParams: result
    })
  },

  // 操作提示
  showTip: function(message) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 500
    })
  },


  // 收藏&取消收藏
  handleCollection: function(e) {
    const timer = this.data.timer
    const current = new Date().getTime()
    const mark = 1500
    const collectionMsg = this.data.collectionMsg
    if((current - timer) < mark) {
      this.showTip(collectionMsg)
      this.setData({
        timer: current
      })
      return
    }
    this.setData({
      timer: current
    })
    const { collection }  = e.currentTarget.dataset
    const { proId } = this.data.jewelryParams
    const params = {
      productId: proId
    }
    const paramsArr = {
      productIdList: []
    }
    paramsArr.productIdList.push(proId)
    const isCollection = this.data.isCollectionStatus
    if(collection === isCollection.deny) {
      this.postCollection(params)
    } else {
     this.cancelColection(paramsArr)
    }
  },

  // 收藏&取消收藏提示
  collectionTip: function(message, time = 2000) {
    this.setData({
      showTip: true,
      collectionTip: message
    })
    setTimeout(() => {
      this.setData({
        showTip: false
      })
    }, time)
  },

  // 添加收藏
  postCollection: function(options) {
    const api = 'postCollection'
    const addCollection = this.requestApi(api)
    const combination = {
      options: options,
      name: api,
      loading: false,
    }
    addCollection[api](combination).then(()=> {
      const message = this.data.isCollection
      const isCollection = this.data.isCollectionStatus
      this.collectionTip(message)
      this.changeCollection(isCollection.correct)
    })
  },

  // 取消收藏
  cancelColection: function(options) {
    const api = 'updateCollection'
    const collection = this.requestApi(api)
    const combination = {
      options: options,
      name: api,
      loading: false,
    }
    collection[api](combination).then(() => {
      const message = this.data.collection
      const isCollection = this.data.isCollectionStatus
      this.collectionTip(message)
      this.changeCollection(isCollection.deny)
    })
  },

  // 点击添加购物车或立即下单
  handleCart: function(e) {
    console.log('点击下单', e)
    const region = e.target.id
    const cart = 'cart'
    const order = 'order'
    if (region === cart) {
      this.addCart()
    } else if (region === order) {
      this.orderNow()
    }
  },

  // 格式化订单参数
  formatOrderArg() {
    const params = {}
    return params
  },

  // 提交订单
  addOrder() {
    const params = this.formatOrderArg()
    ajax.bookOrder(params).then(res => {
      const { code } = res
      const flag = 0
      if (code == flag) {
        const message = this.data.successTipMsg
        this.addSuccess(message)
      }
    })
  },

  // 格式化提交订单参数
  formatOrderArgs(obj) {
    const arg = obj
    console.log('格式化订单参数', arg)
    const result = []
    let params = {}
    params.id = null
    params.count = arg.shoppingCount || 1
    params.code = arg.proCodeId,
    params.stockNum = arg.stockNum
    result.push(params)
    return result
  },

  // 立即下单
  orderNow: function() {
    console.log('立即下单')
    // 1. 进入多品
    // 2. 添加到订单
    // 3. 进入待确认订单
    const queryMore = 1
    const { proId, selected, code, isQueryOther, shoppingCount } = this.data.jewelryParams
    if (isQueryOther === queryMore) {
          this.handlMoreStyle()
    } else {
      const obj = this.data.jewelryParams
      const params = this.formatOrderArgs(obj)
      this.skipWaitingOder(params)
    }
  },

  // 跳转到待确认订单
  skipWaitingOder(list) {
    const order = JSON.stringify(list)
    wx.navigateTo({
      url: `/pages/writeOrder/index?order=${order}`
    })
  },

  // 加入购物车
  addCart: function() {
    const currentTime = new Date().getTime()
    const shoppingOnce = this.data.shoppingOnce
    const shoppingGap = this.data.shoppingGap
    // 降低请求频次
    if (currentTime - shoppingOnce < shoppingGap) {
      return
    }
    const queryMore = 1
    const result = []
    const { proId, selected, code, isQueryOther, shoppingCount } = this.data.jewelryParams
    const snap = {}
    snap.productCodeId = code
    snap.count = selected
    result.push(snap)
    const params = {
      productId : proId,
      list: [],
      count: shoppingCount,
    }
    if(isQueryOther === queryMore) {
      this.handlMoreStyle()
    } else {
      const api = 'postCartAdd'
      const combination = {
        options: params,
        name: api,
        loading: false,
      }
      const addShoppingCart = this.requestApi(api)
      addShoppingCart[api](combination).then(() => {
        const message = this.data.successTipMsg
        this.addSuccess(message)
      })
    }
  },

  // 添加成功提示
  addSuccess: function(message, time = 2000) {
    const current  = new Date().getTime()
    this.setData({
      successTip: true,
      successTipText: message,
      shoppingOnce: current,
    })

    setTimeout(() => {
      this.setData({
        successTip: false
      })
    }, time)

    this.getCartNumber()
  },

  // 改变添加购物车数量
  stepperOnChange: function(e) {
    const count = e.detail
    const jewelryParams = e.currentTarget.dataset.detail
    jewelryParams.shoppingCount = count
    this.setData({
      jewelryParams: jewelryParams
    })
  },
  // 判断是否登录
  checkIsLogined() {
    return new Promise((resolve, reject) => {
      const customerInfo = wx.getStorageSync('customerInfo')
      if (customerInfo) {
        if (customerInfo.loginTime + 7 * 24 * 60 * 60 * 1000 < Date.now()) {
          console.log('登录时间超过一周')
          wx.removeStorageSync('customerInfo')
          reject()
        } else {
          resolve()
        }
      } else {
        reject()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    // 判断是否登录
    this.checkIsLogined().then((res) => {
      this.setData({
        shareLimit: true
      })
    }).catch(err => {
      this.setData({
        shareLimit: false
      })
    })
    // options.origin为分享进来的
      getApp().globalData.globalParams = options
      getApp().globalData.shareTicket = options.shareTicket;
      const detail = JSON.parse(decodeURIComponent(options.detail))
      const { storageType, proId } = detail
      const params = {
        storageType: storageType,
        id: proId
      }
      this.getGoodsDetail(params)
      this.getCartNumber()
      this.setData({
        globalStyle: getApp().globalData.globalStyle,
        shareIdentification: options.origin || '0',
      })
      // 设置全局分享的值
      getApp().globalData.globalShare = options.origin || '0'
    this.setData({
      globalStyle: getApp().globalData.globalStyle
    })
  },
  // 生命周期函数--页面出现
  onShow: function() {
    this.getCartNumber()
    // 游客隐藏home键
    const isVisitor = getApp().globalData.isVisitor
    if (isVisitor) {
      if (wx.canIUse('hideHomeButton')) {
        wx.hideHomeButton()
      }
    }
  },
  onHide: function() {
    getApp().globalData.isVisitor = false
  },
  // 分享
  onShareAppMessage(e) {
    const storageType = this.data.jewelryParams.storageType;
    const proId = this.data.jewelryParams.proId;
    const shareTicket = wx.getStorageSync('customerInfo').ticket;
    const param = {
      storageType,
      proId
    }
    const params = encodeURIComponent(JSON.stringify(param));
    return {
      title: this.data.jewelryParams.name,
      path: '/pages/goodsDetail/index?detail=' + params + '&origin=1' + '&shareTicket=' + shareTicket ,// 好友点击分享之后跳转到的小程序的页面
      imageUrl: this.data.address.length > 0 ? this.data.address[0].url : '',
    }
  },
})