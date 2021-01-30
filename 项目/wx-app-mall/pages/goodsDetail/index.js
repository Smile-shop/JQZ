// pages/goodsDetail/index.js
var app = getApp();
import {
  queryShopInfo,
  queryshopAttributes,
  querySkuStock,
  addCommdityShopCart,
  buyNow,
  queryShopCart,
  checkSku,
} from '../../api/goodDetailandList'
import { querByStoId } from '../../api/confirmOrder'
import {
  queryAddressById
} from '../../api/shop'
import { getUserInfoLocal, cachePreLoginBack } from '../../utils/userInfo'
import { saveGoods } from '../../utils/order'
import { getNavbarHeight } from '../../utils/utils'
import { shareEntry }  from '../../utils/shareEntry'
import log from '../../utils/log'


Page({
  mixins: [require('../../mixins/setColor.js')],

  /**
   * 页面的初始数据
   */
  data: {
    haveStock: false, // 默认缺货状态
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
    message: '已添加收藏',
    collection: '已取消收藏',
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
    footerText: {
      more: '加载更多…',
      nomore: '别扯了，没有更多了',
      loading: '加载中'
    },
    total: 0,
    mulitName: '',
    mulitId: null,
    cartName: '加入购物车',
    checked: false,
    commdityInfo: {}, // 商品信息
    commdityAttributes: {}, // 商品属性
    skuAndStock: {}, // sku 及库存
    active: 'detail', // 商品详情 tab栏切换
    address: [],
    value: '',
    // tags: ['掌柜推荐', '国庆狂欢'],
    tags: [], 
    productionRichText: {},
    goodsMore: {},
    production: {},
    alias: {},
    tip: 1,
    number: 1, // 购买数量
    multiGoodsShow: false,
    mask: false,
    globalStyle: getApp().globalData.globalStyle,
    showSheet: false,
    showSharePost: false,
    postList: '',
    shareIdentification: '0', // 分享标识 1代表分享进来的
    shareLimit: false, // 是否登录
    evaluateList: 0, // 评价数据,
    showAction: false, // 显示商品规格
    animation: 'popup', // sku动画
    navItem: 1, // 默认第一个导航属性
    navMenu: {
      detail: 1,
      args: 2,
      evalation: 3,
    }, // 商品属性导航
    jewelryParams: {
      isCollec: 0,
    },
    animationMenu: {
      popup: 'popup',
      popdown: 'popdown',
    }, // sku动画状态
    selectedAttribute: {}, // sku 顶部属性
    storeInfo: {}, // 店铺信息
    loginBack: false, // 登录返回
    navbarData: {
      goback: true,
      gohome: true,
      title: '首饰详情',
      style: 1
    }, // 顶部导航
    spuTitle: '', // sku 标题
    shopCount: {
      plus: false,
      num: null,
      style: false,
    }, // 购物车数量
    navbarHeight: 0,
    showLoading: true, // 
    shareSkuId: '', // 分享 skuId 
    shareSpuId: '', // 分享 spuId
    shareStoreId: '', // 分享进入的店铺id
  },
  // 微信授权情况
  wxAuthod() {
    let result = false
    const login = getUserInfoLocal()
    if (login) {
      result = true
    }
    return result
  },
  // 去登录
  detailGotoLogin() {
    cachePreLoginBack()
    wx.showToast({
      title: '您还未登录',
      icon: 'none',
      duration: 3000
    })
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/login/index?mark=login'
      })
    }, 3000)
  },

  // 弹出规格
  arrowshowAction() {
    const { popup } = this.data.animationMenu
    this.setData({
      showAction: true,
      animation: popup,
    })
  },

  // 弹出立即购买弹窗
  onshowAction() {
    // 1. 确定 sku 2. 无 sku 提示 3. 微信授权
    const skuId = this.matchSkuId()
    const login = this.wxAuthod()
    const text = this.getSkuItemToSure()
    const saveInfo = this.getSaveLoginInfo()
    if (skuId) {
      if (login) {
        log('去提交订单')
        this.skuBuyNow()
      } else {
        log('去登录')
        this.beforeLoginSave(saveInfo) // 去登录需保存
        this.detailGotoLogin()
        // 去登录
      }
    } else {
      // this.showSkuTip(text)
      this.arrowshowAction()
    }
  },
  // 关闭立即购买弹窗
  handleCoseSku() {
    const { popdown } = this.data.animationMenu
    this.setData({
      animation: popdown,
    })
  },
  // 提示超库存
  showOverStock() {
    wx.showToast({
      title: '库存不足',
      icon: 'none',
      duration: 2000,
    })
  },
  // 查看选中 sku 库存
  getSkuStock() {
    let result = 0 // 默认值
    const skuId = this.matchSkuId() // 选中的 sku 
    const arr = this.data.skuAndStock.skuStockList // sku 列表
    arr.forEach(item => {
      if (item.skuId === skuId) {
        result = item.stock
      }
    })
    return result
  },
  // 改变加入购买数量
  changeNum(options) {
    log('改变商品数量', options)
    const stock = this.getSkuStock()
    const { number } = options.detail
    const skudId = this.matchSkuId()
    const text = this.getSkuItemToSure()
    log('现在数量', stock)
    if (number <= stock) {
      this.setData({
        number: number,
      })
    } else {
      if (skudId) {
        this.showOverStock()
      } else {
        this.showSkuTip(text)
      }
    }
  },
  // 弹出分享模板
  goShowSheet() {
    this.setData({
      showSheet: true
    })
  },
  // 弹出分享海报
  myEventListener: function (e) {
    log('分享')
    // 去请求数据获取海报商品名称，价格，图片
    // 默认图片
    const bgUrl = 'http://www.jqzjop.com/ftp_images/test01/kfHeadImg/6b109f1a78ce43b3abf01bc7bc73c458_1594281291793.png'
    this.setData({
      // showSharePost: true,
      postList: bgUrl
    })

    return
    const params = {
      productName: this.data.jewelryParams.name,
      // productPrice: this.data.jewelryParams.smallOrderedPrice === this.data.jewelryParams.largeOrderedPrice ? this.data.jewelryParams.smallOrderedPrice : this.data.jewelryParams.smallOrderedPrice + '~' + this.data.jewelryParams.largeOrderedPrice,
      backgroundUrl: this.data.address.length > 0 ? this.data.address[0].url : bgUrl,
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
  changeSwiper: function (e) {
    log('手动轮播')
    const current = e.detail.current + 1
    log(current)
    this.setData({
      current: current,
      autoplay: false,
    })

    setTimeout(() => {
      this.setData({
        autoplay: true,
      })
    }, 500)
  },

  // 跳转购物车
  goCart: function () {
    app.globalData.cachepath = null
    wx.switchTab({
      url: '/pages/shoppingCart/index'
    })
  },

  // 正确返回
  requestBack: function (res) {
    let result = false
    const successCode = 0
    const { code } = res
    if (successCode === code) {
      result = true
    }

    return result
  },

  // 错误返回
  requestError: function (res) {
    // do something
  },

  // 统一请求方法
  request: function (params) {
    const { options, name, loading } = params
    // return new Promise((resolve) => {
    //   ajax[name](options, loading).then(res => {
    //     const result = this.requestBack(res)
    //     if (result) {
    //       resolve(res)
    //     }
    //   }).catch(err => {
    //     this.requestError(err)
    //   })
    // })
  },

  // 方法
  requestApi: function (name) {
    const methods = {}

    methods[name] = (options) => {
      return this.request(options)
    }

    return methods
  },

  // 查询购物车数量
  getCartNumber: function () {
    const api = 'getCartNumber'
    const getCount = this.requestApi(api)
    const options = {
      params: {},
      name: api,
      loading: false
    }
    // getCount[api](options).then((res) => {
    //   const { replyData } = res
    //   const number = replyData.count
    //   this.setData({
    //     initNumber: number
    //   })
    // })
  },

  // 跳转至更多款式列表
  skipMoreType: function (options) {
    const { proId, name } = options
    wx.navigateTo({
      url: `/pages/scrollList/index?id=${proId}&name=${name}`,
    })
  },

  // 查看更多款式
  handlMoreStyle: function () {
    const { proId, name } = this.data.jewelryParams
    const params = { proId, name }
    this.skipMoreType(params)
  },

  // 点击商品详情轮播图
  handleSwiper: function () {
    return
    this.setData({
      showSwiper: true
    })
  },

  // 关闭详情轮播展示
  closeSwiper: function () {
    this.setData({
      showSwiper: false
    })
  },

  // 客服
  goCustomer() {
    log('前往客服')
  },

  // 改变收藏状态
  changeCollection: function (state) {
    const result = this.data.jewelryParams
    result.isCollec = state
    this.setData({
      jewelryParams: result
    })
  },

  // 操作提示
  showTip: function (message) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 500
    })
  },


  // 收藏&取消收藏
  handleCollection: function (e) {
    log('收藏', e)
    const options = {}
    const isCollec = this.data.jewelryParams.isCollec === 1 ? 0 : 1
    if (isCollec === 1) {
      this.collectionTip('收藏成功')
    } else {
      this.collectionTip('取消收藏成功')
    }
    options.isCollec = isCollec
    this.setData({
      jewelryParams: options,
    })
    return
    const timer = this.data.timer
    const current = new Date().getTime()
    const mark = 1500
    const collectionMsg = this.data.collectionMsg
    if ((current - timer) < mark) {
      this.showTip(collectionMsg)
      this.setData({
        timer: current
      })
      return
    }
    this.setData({
      timer: current
    })
    const { collection } = e.currentTarget.dataset
    const { proId } = this.data.jewelryParams
    const params = {
      productId: proId
    }
    const paramsArr = {
      productIdList: []
    }
    paramsArr.productIdList.push(proId)
    const isCollection = this.data.isCollectionStatus
    if (collection === isCollection.deny) {
      this.postCollection(params)
    } else {
      this.cancelColection(paramsArr)
    }
  },

  // 收藏&取消收藏提示
  collectionTip: function (message, time = 2000) {
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
  postCollection: function (options) {
    const api = 'postCollection'
    const addCollection = this.requestApi(api)
    const combination = {
      options: options,
      name: api,
      loading: false,
    }
    addCollection[api](combination).then(() => {
      const message = this.data.isCollection
      const isCollection = this.data.isCollectionStatus
      this.collectionTip(message)
      this.changeCollection(isCollection.correct)
    })
  },

  // 取消收藏
  cancelColection: function (options) {
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

  // 去登录或注册
  gotoLogin() {
    wx.navigateTo({
      url: '/pages/login/index?mark=login',
    })
  },

  // 提交订单
  submitOrder() {
    wx.navigateTo({
      url: '/pages/confirmOrder/index'
    })
  },

  // 匹配出 skuId
  matchSkuId() {
    let result = ''
    const text = this.queryShopSelectedSkuId()
    const skuList = this.data.skuAndStock.skuStockList || []
    skuList.forEach(item => {
      if (item.propMatchValue === text) {
        result = item.skuId
      }
    })
    return result
  },

  // 获取商品选中的 sku 文本
  queryShopSelectedSkuId() {
    let result = ''
    const linkSign = '_'
    const template = []
    // const skuList = this.data.commdityInfo.curSkuPropList || []
    const skuList = this.data.commdityInfo.curSelectedSku || []
    skuList.forEach(item => {
      template.push(item)
      template.push(linkSign)
    })
    template.pop()
    result = template.join('')
    return result
  },

  // 添加购物车成功
  showCartSuc(info, time = 2000, icon = 'none') {
    const text = '添加购物车' + info
    wx.showToast({
      title: text,
      icon: icon,
      duration: time,
    })
  },

  // sku 添加购物车
  skuaddShopCart() {
    this.addShopCart()
  },

  // 获取选中 sku 一条全信息
  getOneSkuInfo() {
    let result = ''
    const text = this.queryShopSelectedSkuId()
    log('已经选中的sku', text)
    const skuList = this.data.skuAndStock.skuStockList || []
    skuList.forEach(item => {
      log('依次', item)
      if (item.propMatchValue == text) {
        log('选中的', item)
        result = item
      }
    })
    return result
  },

  // 去提交订单页面
  gotoOrderPage(options) {
    const { spuId, skuId } = options
    wx.navigateTo({
      url: `/pages/confirmOrder/index?spuId=${spuId}&skuId=${skuId}`
    })
  },

  // sku 立即购买
  async skuBuyNow() {
    log('sku立即购买')
    const shopInfo = this.data.commdityInfo
    const sku = this.getOneSkuInfo()
    const skudId = this.matchSkuId()
    const number = this.data.number
    const text = this.getSkuItemToSure()
    const vSku = {
      "skuId": skudId,
      "storeId": app.globalData.storeId,
    }
    const flag = await this.verificationSku(vSku)
    log('商品信息', shopInfo)
    log('选中sku', sku)
    if (!skudId) {
      this.showSkuTip(text)
      return
    }
    if (flag) {
      return 
    }
    const data = [{
      "id": "",
      "imgUrl": sku.imgUrl,
      "spuId": shopInfo.spuId,
      "skuId": skudId,
      "title": shopInfo.title,
      "attr": "",
      "attrList": shopInfo.curSelectedSku,
      "price": sku.price,
      "quantity": number,
      "amount": '',
      "skuStatus": "",
      "stock": sku.stock,
      "isSelect": '',
      from: "detail",
    }]
    const res = saveGoods(data)
    const { data : JqzLogin} = await this.queryShopStyle()
    if (res && JqzLogin) {
      // 去结算
      const options = {
        spuId: shopInfo.spuId,
        skuId: skudId,
      }
      this.gotoOrderPage(options)
    }
  },

  // 提示必须选中 sku
  showSkuTip(info) {
    const msg = info || ''
    const text = '请选择' + msg
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 2000,
    })
  },

  // 获取具体没有选中的 sku 项
  getSkuItemToSure() {
    let result = null
    const list = this.data.skuAndStock.skuPropList || []
    list.forEach(item => {
      if (!item.selected && !result) {
        result = item.name
      }
    })
    return result
  },

  // 登录保存数据
  getSaveLoginInfo() {
    const goodsInfo = this.data.commdityInfo
    const options = {
      skuId: goodsInfo.skuId,
      selectedSku: goodsInfo.curSelectedSku,
    }
    return options
  },

  // 验证 sku 有效性
  async verificationSku(sku) {
    let result = false
    const valitySku = await checkSku(sku)
    const { code  } = valitySku
    const mark = 0
    log('验证sku', valitySku)
    if (code != mark) {
      log('不能进行下一步')
      result = true
    }
    return result
  },

  // 添加购物车方法
  async addShopCart() {
    const skudId = this.matchSkuId()
    const text = this.getSkuItemToSure()
    const saveInfo = this.getSaveLoginInfo()
    const sku = {
      "skuId": skudId,
      "storeId": app.globalData.storeId,
    }
    if (!skudId) {
      this.showSkuTip(text)
      return 
    }
    const flag = await this.verificationSku(sku)
    log('添加购物车可行么', flag)
    if (skudId) {
      if (flag) {
        return 
      }
      this.handleCoseSku() // 关闭sku
      this.beforeLoginSave(saveInfo) // 去登录需保存
      const body = {
        "quantity": this.data.number,
        "skuId": skudId,
        "storeId": app.globalData.storeId,
      }
      const res = await addCommdityShopCart(body)

      log('提交成功了么购物车', res)
      const { msg } = res
      this.showCartSuc(msg)

      this.queryShopCartNum()
    } else {
      this.showSkuTip(text)
    }
  },

  // 点击添加购物车或立即下单
  handleCart: function (e) {
    log('立即购买')
    log('点击下单', e)
    // 1.检测选中规格 2. 检测登录
    const norm = this.matchSkuId()
    const login = getUserInfoLocal()
    if (!norm) {
      this.onshowAction()
    } else if (!login) {
      this.gotoLogin()
    } else {
      log('去下单购买')
      this.addShopCart()
    }

  },

  // 获取收货方式，为了能不能跳转至购买
  async queryShopStyle() {
    const res = await querByStoId(app.globalData.storeId)
    return res
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
    log('格式化订单参数', arg)
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
  orderNow: function () {
    log('立即下单')
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
  addCart: function () {
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
      productId: proId,
      list: [],
      count: shoppingCount,
    }
    if (isQueryOther === queryMore) {
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
  addSuccess: function (message, time = 2000) {
    const current = new Date().getTime()
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
  stepperOnChange: function (e) {
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
          log('登录时间超过一周')
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
  // 前往优惠券
  handleCoupons() {
    wx.navigateTo({
      url: '/pages/shopCoupons/index',
    })
  },
  // 前往门店
  handleShopping() {
    const storeId = ''
    wx.navigateTo({
      url: `/pages/shopDetails/index?storeId=${storeId}`,
    })
  },

  // 立即购买
  async atNowBuy(budInfo) {
    // 调用本地保存
    const mark = true
    if (mark) {
      const info = budInfo
      const shopId = info
      const skuId = info
      const num = info
      wx.navigateTo({
        url: `/pages/confirmOrder/index?shopId=${shopId}&skuId=${skuId}&num=${num}`
      })
    }
  },
  // 商品导航
  handleVirtue(e) {
    const nav = e.target.dataset.item
    log('商品导航', nav)
    const navMenu = this.data.navMenu
    const mark = navMenu[nav]
    this.setData({
      navItem: mark,
    })
  },

  // 赋值处理页面数据
  empowerPageInfo(data) {
    log('更新页面数据', data)
    if (!data) {
      return
    }
    const info = data
    info.curSelectedSku = []
    this.setData({
      commdityInfo: info,
      swiperTotal: info.imgUrlList.length,
      haveStock: info.haveStock,
    })
    this.closeLoging()
  },

  // 获取商品信息
  async queryCommodityInfo(args) {
    const body = {
      storeId: app.globalData.storeId,
    }
    const options = Object.assign({}, body, args)
    const res = await queryShopInfo(options)
    log('获取产品信息', res.data)
    const { data } = res
    this.empowerPageInfo(data)
  },

  // 赋值商品属性
  empowerAttributes(data) {
    const info = data
    log('出现问题', info.description)
    this.setData({
      commdityAttributes: info,
    })
  },

  // 获取商品附属信息
  async queryCommdityAttributes(args) {
    const body = {
      storeId: app.globalData.storeId,
    }
    const options = Object.assign({}, body, args)
    const res = await queryshopAttributes(options)
    log('获取属性', res.data)
    const { data } = res
    this.empowerAttributes(data)
  },

  // 选中依据库存格式化 sku 数据
  selectedFormatStock(sku) {
    const result = {}
    const mark = '_'
    const info = sku
    const arr = info.skuPropList
    const list = info.skuStockList
    const template = [] // 库存为 0 的模板
    const selectedTmp = [] // 选中模板
    const len = arr.length
    list.forEach(item => {
      if (item.stock > 0) {
        template.push(item.propMatchValue)
      }
    })
    arr.forEach(item => {
      item.propValue.map(ite => {
        if (ite.selected) {
          selectedTmp.push(ite)
        }
      })
    })

    // 获取选中的结果
    const filterResult = []
    arr.map(item => {
      item.propValue.forEach(ite => {
        log('点条', ite.selected)
        if (ite.selected) {
          filterResult.push(ite)
        }
      })
    })

    const createF = []
    for (let i = 0; i < len; i++) {
      createF[i] = '-f-'
    }

    filterResult.map(item => {
      createF[item.site] = item.value
    })

    log('选中的结果', filterResult, createF)

    const temResult = []
    template.map(item => {
      temResult.push(item.split(mark))
    })

    arr.forEach(item => {
      item.propValue.map(ite => {
        if (!ite.initDisabled) {
          ite.disabled = true
        }
      })
    })

    // 选中值多少
    const selectedL = filterResult.length

    // 计算匹配值
    const matchFilter = []
    temResult.forEach(ite => {
      let count = 0
      ite.map((item, index) => {
        log('匹配值', item, createF[index])
        if (item == createF[index]) {
          count++
        }
      })
      if (count >= selectedL && count > 0) {
        matchFilter.push(ite)
      }
    })

    arr.map(item => {
      item.propValue.forEach(ite => {
        matchFilter.map(it => {
          if (it[ite.site] == ite.value) {
            ite.disabled = false
          }
        })
      })
    })



    log('库存模板', temResult, '选中模板', selectedTmp, '匹配的数据', matchFilter)
    if ((template.length > 0) && (selectedTmp.length > 0)) {
      // doSomthing
    } else {
      arr.forEach(item => {
        item.propValue.map(ite => {
          if (!ite.initDisabled) {
            ite.disabled = false
          }
        })
      })
    }

    result.skuPropList = arr
    result.skuStockList = list
    log('设置可选中的项目', result)
    return result
  },

  // 选中 sku 
  handleSku(options) {
    log('选中sku', options)
    const { sku } = options.detail
    const formatSku = this.selectedFormatStock(sku)
    this.setData({
      skuAndStock: formatSku,
    })
    this.mapUponSku()
    this.updateInfoSku()
    this.skuTopAttributes()
  },

  // 当前选中的 sku 
  currentSku() {
    const result = []
    const list = this.data.skuAndStock
    const arr = list.skuPropList
    arr.map(item => {
      item.propValue.forEach(itm => {
        if (itm.selected) {
          result.push(itm.value)
        }
      })
    })
    return result
  },

  // 更新详情 sku 
  updateInfoSku() {
    const list = this.currentSku()
    const whole = this.data.commdityInfo
    // whole.curSkuPropList = list
    whole.curSelectedSku = list
    this.setData({
      commdityInfo: whole
    })
  },

  // 找出选中的 sku 对应的商品属性
  mapUponSku() {
    let result = ''
    const mark = '_'
    const items = []
    const whole = this.data.commdityInfo
    // const attributes = whole.curSkuPropList || []
    const attributes = whole.curSelectedSku || []
    attributes.forEach(item => {
      items.push(item)
      items.push(mark)
    })

    items.pop()
    result = items.join('')
    log('已选中商品属性', result)
    return result
  },

  // 重置已选数量
  resetSelecteNum() {
    this.setData({
      number: 1,
    })
  },

  // 获取商品详情价格
  getShopDetailPrice() {
    const result = this.data.commdityInfo.price
    return result
  },


  // 获取 sku 顶部属性
  skuTopAttributes() {
    let result = {}
    const currentSku = this.mapUponSku()
    const skuAndStock = this.data.skuAndStock
    const arr = skuAndStock.skuStockList
    const shopPrice = this.getShopDetailPrice()
    arr.forEach(item => {
      log(item, item.propMatchValue === currentSku)
      if (item.propMatchValue == currentSku) {
        result.photo = item.imgUrl
        result.price = item.price
        result.stock = item.stock
        result.skuId = item.skuId
      }
    })
    if (!result.price && result.price !== 0) {
      result.price = shopPrice
    }
    if (!result.photo) {
      result.photo = this.data.commdityInfo.imgUrlList ?  this.data.commdityInfo.imgUrlList[0] : ''
    }
    log('设置sku顶部', result)
    this.resetSelecteNum()
    this.setData({
      selectedAttribute: result
    })
  },

  // 查询商品中已选中的 sku
  queryShopSku(sku) {
    let result = false
    // const skuList = this.data.commdityInfo.curSkuPropList || []
    const skuList = this.data.commdityInfo.curSelectedSku || []
    if (skuList.includes(sku)) {
      result = true
    }
    return result
  },

  // 设置 sku 可选情况
  setSkuDisabled(sku) {
    const mark = '_'
    const arr = sku
    const list = []
    arr.skuStockList.map(item => {
      if (item.stock > 0) {
        list.push(item)
      }
    })
    const lenArr = []
    arr.skuPropList.map(item => {
      lenArr.push(item.propValue.length)
    })
    const serial = []
    lenArr.map((item, index) => {
      if (index + 1 <= lenArr.length - 1) {
        const val = item * lenArr[index + 1]
        serial.push(val)
      } else {
        serial.push(item)
      }
    })

    let sequence = []
    sequence = lenArr
    sequence.sort((a, b) => {
      return a - b
    })
    log('获得数据的结果', sequence)
    arr.skuPropList.map(item => {
      item.propValue.forEach(ite => {
        ite.initDisabled = true
      })
    })

    arr.skuPropList.map(item => {
      item.propValue.forEach(ite => {
        list.map(it => {
          const arr = it.propMatchValue.split('_')
          if (arr[ite.site] == ite.value && ite.initDisabled) {
            ite.initDisabled = false
          }
        })
      })
    })

    return arr
  },

  // 复制 sku 名称
  empowerSkuTitle(data) {
    const stock = data
    this.setData({
      spuTitle: stock.spuTitle
    })
  },

  // 复制给 sku 及库存
  empowerStock(data) {
    const stock = data
    const sure = true
    const mark = false
    const tempList = []
    stock.skuPropList.forEach((item, inde) => {
      item.propValue.map((ite, index) => {
        let template = {}
        template.value = ite
        template.id = item.id
        template.site = inde
        template.disabled = false
        template.initDisabled = false
        template.filter = false
        const childItem = this.queryShopSku(ite)
        if (childItem && !item.selected) {
          item.selected = sure
        } else if (!childItem && !item.selected) {
          item.selected = mark
        }
        if (childItem) {
          template.selected = sure
        } else {
          template.selected = mark
        }
        tempList.push(template)
        item.propValue[index] = template
      })
    })

    const forMatStock = this.setSkuDisabled(stock)
    log(forMatStock, '这里是处理后的库存', stock)
    this.setData({
      skuAndStock: forMatStock,
    })
    this.mapUponSku()
    this.skuTopAttributes()
  },

  // 查询规格库存
  async queryStockNorm(args) {
    const body = {
      storeId: app.globalData.storeId,
    }
    const options = Object.assign({}, body, args)
    const res = await querySkuStock(options)
    log('个鬼参数', res.data)
    const { data } = res
    this.empowerStock(data)
    this.empowerSkuTitle(data)
  },

  // 赋值店铺信息
  empowerStoreInfo(data) {
    const info = data
    const result = {}
    result.name = info.name
    result.address = info.address
    result.logo = info.imgs[0].url
    this.setData({
      storeInfo: result,
    })
    // 处理上一次缓存的信息
    const login = this.data.loginBack
    this.loginBackDetail(login)
  },

  // 存储分享的商店 id
  saveShareId(storeId) {
    this.setData({
      shareStoreId: storeId,
    })
  },

  // 查询店铺信息
  async queryStoreInfo(id) {
    const storeId = id || app.globalData.storeId
    const args = {}
    args.id = storeId
    this.saveShareId(storeId)
    if (storeId) {
      const res = await queryAddressById(args)
      const { data } = res
      log('获得店铺信息', res)
      this.empowerStoreInfo(data)
      if (id) {
        log('分享进入')
        shareEntry(data) // 分享存储店铺信息
      }
    }
  },

  // 去登录前存储选中数据
  beforeLoginSave(goodsInfo) {
    const info = goodsInfo
    app.globalData.goodsInfo = info
  },

  // 清除存储商品信息
  clearGoodsInfo() {
    app.globalData.goodsInfo = null
  },

  // 匹配上一次存储
  matchPreGoodsInfo() {
    log('匹配上一次缓存数据')
    const cacheInfo = app.globalData.goodsInfo || {}
    const goodsInfo = this.data.commdityInfo
    goodsInfo.skuId = cacheInfo.skuId || ''
    goodsInfo.curSelectedSku = cacheInfo.selectedSku || []
    this.setData({
      commdityInfo: goodsInfo,
    })
  },

  // 是登录返回
  async loginBackDetail(login) {
    const mark = login
    if (mark) {
      // 匹配上一次存储
      await this.matchPreGoodsInfo()
      // 清除上一次存储
      await this.clearGoodsInfo()
    } else {
      // 清除上一次存储
      await this.clearGoodsInfo()
    }
  },

  // 存储登录返回
  saveLoginBackStatus(login) {
    const status = login
    this.setData({
      loginBack: status,
    })
  },

  // 赋值购买车数量
  empowerShopcartNum(num) {
    const count = Number(num)
    const options = {}
    options.num = count > 99 ? 99 : count // 最大数值
    options.style = count > 9 ? true : false // 改变样式
    options.plus = count > 99 ? true : false // 有添加 +
    this.setData({
      shopCount: options,
    })
  },

  // 查询购物车数量
  async queryShopCartNum() {
    const body = {
      storeId: app.globalData.storeId,
    }
    const res = await queryShopCart(body)
    const { data } = res
    log('购物车数数量', data)
    this.empowerShopcartNum(data)
  },

  // 关闭 loading 
  closeLoging() {
    this.setData({
      showLoading: false,
    })
  },

  // 格式化数据
  formatSkuId(id) {
    let result = ''
    const mark = 'null'
    const flag = String(id)
    if (flag != mark) {
      result = id
    }
    return result
  },

  // 存储分享商品详情搜索 id
  saveShareSearchId(obj) {
    const { skuId, spuId } = obj
    this.setData({
      shareSkuId: skuId,
      shareSpuId: spuId,
    })
  },

    // 获取顶部导航自定义高度
    getDiyHeight() {
      const height = getNavbarHeight()
      this.setData({
        navbarHeight: height,
      })
    },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    this.getDiyHeight()
    const { skuId, spuId, login, storeId } = options
    const formatSkuId =  this.formatSkuId(skuId)
    const formatSpuId = this.formatSkuId(spuId)
    const queryArgs = {
      skuId: formatSkuId,
      spuId: formatSpuId,
    }
    this.saveShareSearchId(queryArgs)
    this.queryShopCartNum()
    this.saveLoginBackStatus(login)
    this.queryCommodityInfo(queryArgs)
    this.queryCommdityAttributes(queryArgs)
    this.queryStockNorm(queryArgs)
    this.queryStoreInfo(storeId)
  },
  // 生命周期函数--页面出现
  onShow: function () {
    this.queryShopCartNum()
    // 游客隐藏home键
    const isVisitor = getApp().globalData.isVisitor
    if (isVisitor) {
      if (wx.canIUse('hideHomeButton')) {
        wx.hideHomeButton()
      }
    }
  },
  onHide: function () {
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
    const skuId = this.data.shareSkuId
    const spuId = this.data.shareSpuId
    const storeId = this.data.shareStoreId
    const title = this.data.commdityInfo.title
    return {
      title: title,
      path: '/pages/goodsDetail/index?skuId=' + skuId + '&spuId=' + spuId + '&storeId=' + storeId,// 好友点击分享之后跳转到的小程序的页面
      imageUrl: this.data.address.length > 0 ? this.data.address[0].url : '',
    }
  },
})