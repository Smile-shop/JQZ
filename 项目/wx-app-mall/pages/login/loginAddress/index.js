// pages/login/loginAddress/index.js
const app = getApp()
import { queryStore, bindMemberInfo } from '../../../api/register'
import log from '../../../utils/log'
import { saveUserInfoAndStore, saveLoginUserInfo, saveJqzToken } from '../../../utils/userInfo'
let timer = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    show: false,
    msg: '请选择门店',
    modal: false, // 注册成功提示
    FLAG: [
      '/pages/index/index',
      '/pages/goodsCategory/index',
      '/pages/shoppingCart/index',
      '/pages/shop/index',
      '/pages/my/index'], // tabbar
    GOODDETAIL: ['/pages/goodsDetail/index']
  },

  // 选中或取消门店
  handleShop(e) {
    log(e)
    const mark = e.currentTarget.dataset.shop
    log('点击的店', mark)
    const list = this.data.addressList

    list.map(item => {
      if ((item.name === mark.name)) {
        item.selected = 1
      } else {
        item.selected = 0
      }
    })

    this.setData({
      addressList: list,
    })
  },

  // 遍历地址是否有选中
  mapAddress() {
    let result = false
    const list = this.data.addressList
    list.forEach((item) => {
      if (item.selected) {
        result = true
      }
    })
    return result
  },

  // 无选中提交提示
  showMessage() {
    if (timer) {
      clearTimeout(timer)
    }
    this.setData({
      show: true,
    })
    timer = setTimeout(() => {
      log('之后执行')
      this.setData({
        show: false,
      })
    }, 500)
  },

  // 提示注册成功
  registerSuc() {
    this.setData({
      modal: true,
    })
  },

  // 判断页面是否是 tabbar
  tabbarPage(url) {
    let result = false
    const list = this.data.FLAG
    if (list.includes(url)) {
      result = true
    }
    return result
  },

  // 调到商品详情
  skipGoodsDetail(url) {
    let result = false
    const datail = this.data.GOODDETAIL
    if (datail.includes(url)) {
      result = true
    }
    return result
  },

  // 跳转到进入登录绑定页面
  gotoMy() {
    let url = app.globalData.toLoginUrl
    let page = app.globalData.toLoginUrl
    const query = app.globalData.queryGoods
    const result = this.tabbarPage(page)
    const detail = this.skipGoodsDetail(page)
    if (timer) {
      clearTimeout(timer)
    }
    this.registerSuc()
    timer = setTimeout(() => {
      if (result) {
        log('需要去往的页面', page)
        wx.reLaunch({
          url: page,
        })
      } else if (detail) {
        const spuId = query.spuId || ''
        const skuId = query.skuId || ''
        const login = true
        page = `${url}?spuId=${spuId}&skuId=${skuId}&login=${login}`
        wx.redirectTo({
          url: page,
        })
      } else {
        wx.redirectTo({
          url: page,
        })
      }
    }, 2000)
  },

  // 直接跳转回
  gotoBackPreUserInfo() {
    let url = app.globalData.toLoginUrl
    let page = app.globalData.toLoginUrl
    const query = app.globalData.queryGoods
    const result = this.tabbarPage(page)
    const detail = this.skipGoodsDetail(page)
    log('直接手动跳回的状态', url, page)
    if (result) {
      wx.reLaunch({
        url: page,
      })
    } else if (detail) {
      const spuId = query.spuId || ''
      const skuId = query.skuId || ''
      const login = true
      page = `${url}?spuId=${spuId}&skuId=${skuId}&login=${login}`
      wx.redirectTo({
        url: page,
      })
    } else {
      wx.redirectTo({
        url: page,
      })
    }
  },

  // 手动跳转至我的页面
  handleMy() {
    log('手动跳转至我的')
    // wx.switchTab({
    //   url: '/pages/my/index',
    // })
    this.gotoBackPreUserInfo() // 根据实际情况
  },

  // 存储金千枝 token
  cacheJqzToken(jqzToken) {
    const token = jqzToken
    app.globalData.jqzToken = token
    saveJqzToken(token)
  },

  updateCecheUserInfo(info) {
    const { userInfoAndStore } = app.globalData
    log('开始', userInfoAndStore)
    const userInfo = Object.assign({}, info, userInfoAndStore)
    // log('继续', userInfo)
  },

  // 绑定门店及手机号
  async suerMemberInfo(id) {
    const storeId = id
    const phone = app.globalData.phone
    const body = {
      "encryptedData": phone.encryptedData,
      "iv": phone.iv,
      "storeId": storeId,
    }
    const res = await bindMemberInfo(body)
    log('绑定用户信息成功', res)
    const mark = 0
    const { data, code } = res
    // 更新绑定存储信息
    this.updateCecheUserInfo()

    if (code === mark) {
      const curInfo = app.globalData.userInfoAndStore
      const jqzToken = data.token
      this.cacheJqzToken(jqzToken)
      const info = Object.assign({}, data)
      log('哪里间隔这些', data)
      saveUserInfoAndStore(data, curInfo)
      saveLoginUserInfo(info)
      this.gotoMy()
    }
  },

  // 获取选中门店
  selectedStore() {
    let result = null
    const list = this.data.addressList
    list.forEach((item) => {
      if (item.selected) {
        result = item.id
      }
    })
    return result
  },

  // 确定选中
  selectedAddress() {
    log('确定提交')
    const result = this.mapAddress()
    const selectedStore = this.selectedStore()
    if (result) {
      log('可以提交')
      // 绑定用户信息
      this.suerMemberInfo(selectedStore)
    } else {
      this.showMessage()
    }
  },

  // 处理门店数据
  processStore(data) {
    const list = data
    const smallUnit = 'm'
    const middleUnit = 'km'
    const standard = 1000
    list.forEach(item => {
      item.selected = 0
      if (Number(item.distance) > 1000) {
        const dis = (Number(item.distance) / standard).toFixed(2)
        item.distance = dis + middleUnit
      }
    })
    this.setData({
      addressList: list,
    })
    log('门店数据', list)
  },

  // 获取门店
  async getStore(distance = '22.549343,114.130096') {
    const body = {
      "address": "",
      "appId": "",
      "city": "",
      "coordCur": distance,
      "coordTx": "",
      "curPage": 0,
      "description": "",
      "distId": "",
      "district": "",
      "id": "",
      "name": "",
      "pageSize": 0,
      "province": "",
      "status": "",
      "tel": ""
    }
    const res = await queryStore(body)
    log('获得门店数据', res)
    const mark = 0
    const { data, code } = res
    if (code === mark) {
      this.processStore(data.records)
    }
  },

  // 获取用户定位
  getUserLocation() {
    const mark = 'getLocation:ok'
    const that = this
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        log('或者本地定位', res)
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        const errMsg = res.errMsg
        const options = latitude + ',' + longitude
        if (mark === errMsg) {
          log('获取用户定位后发送')
          that.getStore(options)
        }
      },
      fail(err) {
        log('出现错误或拒绝', err)
        // 拒绝或错误也能获取商户的门店
        that.getStore()
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserLocation()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (timer) {
      clearTimeout(timer)
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})