// pages/writeOrder/index.js
import {
  Server 
} from '../../models/server'
const ajax = new Server()
const app = getApp()
import { setGlobalGoldStyle } from '../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    formatStyle: {
      '0': 'diamand',
      '1': 'gold',
    },
    footerText: {
      more: '点击加载更多...',
      noMore: '没有更多了'
    },
    footerStatus: null, 
    globalStyle: app.globalData.globalStyle,
    cacheParams: [],
    perOrderList: [],
    perTotal: [],
    note: '',
    totalPrice: 0,
    totalCount: 0,
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    principal: '', // 负责人
    pageNumberr: 20, // 第一次展示页面条数
    messageId: [], // 小程序消息模板 id
    templateArg: ["orderconfirm", "ordercancel", "orderfinish"], // 默认请求小程序模板参数
  },

  // 跳转至待确认订单
  navConfirm() {
    const mark = 'waiting'
    wx.redirectTo({
      url: `/pages/order/index?mark=${mark}`,
    })
  },

  // 允许接收消息调用后台接口
  acceptSubscribeMessage() {
    console.log('允许订阅消息')
  },

  // 处理后台返回模板数据
  formatTemplateMsg(arr) {
    const list = arr
    const result = []
    list.map(item => {
      result.push(item.templateId)
    })
    return result
  },

  // 查询小程序模板 ID
  queryTemplateId() {
    const options = {}
    options.nameList = this.data.templateArg
    ajax.queryTemplate(options).then(res => {
      console.log('查询小程序模板ID', res)
      const { data } = res
      const messageId = this.formatTemplateMsg(data)
      this.setData({
        messageId: messageId,
      })
    })
  },

  // 提示订阅消息
  subscribeMessage(arr) {
    const that = this
    const idList = arr
    wx.getSetting({
      withSubscriptions: true,
      success (res) {
        console.log(res.authSetting)
        // res.authSetting = {
        //   "scope.userInfo": true,
        //   "scope.userLocation": true
        // }
        console.log(res.subscriptionsSetting)
        // res.subscriptionsSetting = {
        //   mainSwitch: true, // 订阅消息总开关
        //   itemSettings: {   // 每一项开关
        //     SYS_MSG_TYPE_INTERACTIVE: 'accept', // 小游戏系统订阅消息
        //     SYS_MSG_TYPE_RANK: 'accept'
        //     zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE: 'reject', // 普通一次性订阅消息
        //     ke_OZC_66gZxALLcsuI7ilCJSP2OJ2vWo2ooUPpkWrw: 'ban',
        //   }
        // }
      }
    })
    wx.requestSubscribeMessage({
      tmplIds: idList,
      success (res) {
        console.log('调用成功。。。。。。。', res)
        that.navConfirm() // 后调成功后跳转
      },
      fail: function() {
        console.log('调用失败！！！！！！')
        that.navConfirm() // 失败也同样跳转
      }
    })
  },

  // 存储传递的参数
  saveArg(list) {
    this.setData({
      cacheParams: list,
    })
  },

  // 填写备注
  handleNote(e) {
    const note = e.detail.value
    this.setData({
      note: note,
    })
  },

  // 计算数量
  computedCount(arr) {
    let result = 0
    const list = arr
    list.map(item => {
      result += Number(item.productCount)
    })
    return result
  },

  // 计算总价格
  computedTotalPrice(arr) {
    let result = 0
    const list = arr
    list.map(item => {
      result += Number(item.productCount) * Number(item.orderedPrice)
    })
    return Math.round(result)
  },

  // 构建提交订单参数
  createdOrderArg() {
    const cached = this.data.cacheParams
    const originData = this.data.perTotal
    const note = this.data.note
    const customer = wx.getStorageSync('customerInfo')
    const params = {}
    params.customerId = customer.customerId
    params.count = this.computedCount(originData)
    params.remark = note
    params.totalAmount = this.computedTotalPrice(originData)
    params.shoppingId = this.createShopId(cached)
    params.orderAddParams = this.createdOrderListArg(originData)
    return params
  },

  // 格式化购物车 ID 
  createShopId(arr) {
    const list = arr
    const result = []
    list.map(item => {
      console.log(item, '这里是出现的id')
      result.push(item.id)
    })
    return result
  },

  // 格式化提交商品列表
  createdOrderListArg(arr) {
    const countList = this.data.cacheParams
    const result = []
    const list = arr || []
    list.map(item => {
      let params = {}
      params.productId = item.productId
      params.productCodeId = item.productCodeId
      params.productStatus = item.productStatus
      params.avgWeight = item.avgWeight
      params.originalPrice = item.originalPrice
      params.discountRate = item.discountRate
      params.actualPrice = item.orderedPrice
      params.stockNum = item.stockNum
      countList.map(ite => {
        console.log('判定数量', ite.code, item.productId)
        if (ite.code == item.productCodeId) {
          params.productCount = ite.count
        }
      })
      result.push(params)
    })
    return result
  },

  // 没有模块就不授权订阅消息直接跳转至全部订单
  subscribeMessageAndSkip() {
    const idList = this.data.messageId
    if (idList.length > 0)  {
      this.subscribeMessage(idList) // 订阅消息
    } else {
      this.navConfirm() // 后调成功后跳转
    }
  },


  // 提交订单接口
  submitOrder() {
    const params = this.createdOrderArg()
    ajax.bookOrder(params).then(res => {
      console.log('提交订单成功')
      this.subscribeMessageAndSkip()
    })
  },

  // 提交订单按钮
  ordernow() {
    console.log('提交订单')
    this.submitOrder()
  },

  // 设置加载更多数据到页面
  pushDataPage(data) {
    const list = this.data.perOrderList
    const result = list.concat(data)
    this.setData({
      perOrderList: result
    })
  },

  // 加载更多
  handleMore() {
    console.log('加载更多')
    const curList = this.data.perOrderList
    const totalList = this.data.perTotal
    const len = this.data.pageNumberr
    const footerText = this.data.footerText
    if (curList.length >= totalList.length) {
      this.settingFooterText(footerText.noMore)
      return 
    } else {
      const currentEnd = curList.length + len >= totalList.length ? totalList.length : curList.length + len
      const result = totalList.slice(curList.length, currentEnd)
      this.pushDataPage(result)
      this.settingFooterText(footerText.more)
    }
  },

  // 加上数量
  pushCountOrder(list) {
    const result = []
    const arr = this.data.cacheParams
    console.log('这里获得', arr)
    const count = list
    count.map(item => {
      console.log('循坏出现', item)
      arr.map(ite => {
        if (item.productCodeId == ite.code) {
          console.log('商品ID相等', )
          item.productCount = ite.count
          item.stockNum = ite.stockNum
        }
      })
      result.push(item)
    })
    return result
  },

  // 计算总数量和价格
  computedCountAndPrice(arr) {
    let price = 0
    let count = 0
    const list = arr
    list.map(item => {
      price += Number(item.productCount) * Number(item.orderedPrice)
      count += Number(item.productCount)
    })
    console.log('计算到的价格和数量', price, count)
    this.setData({
      totalPrice: Math.round(price),
      totalCount: count,
    })
  },

  // 设置底部文案
  settingFooterText(text) {
    this.setData({
      footerStatus: text,
    })
  },

  // 计算首屏条目
  countFirstPage(arr) {
    console.log('计算首屏条目', arr)
    const list = arr
    const len = this.data.pageNumberr
    const footerText = this.data.footerText
    const start = 0
    let result = null
    if (list.length > len) {
      result = list.slice(start, len)
      this.settingFooterText(footerText.more)
    } else {
      result = list
      this.settingFooterText(footerText.noMore)
    }
    console.log('首次加载多少条', result)
    return result
  },

  // 请求接口数据
  requestPerOrder(params) {
    ajax.queryPerOrderSet(params).then(res => {
      console.log('获得数据', res)
      const { data, replyData } = res
      const { customerName, customerPhone, customerAddress, principal } = replyData
      const addCount = this.pushCountOrder(data)
      const curList = this.countFirstPage(addCount)
      this.computedCountAndPrice(addCount)
      this.setData({
        perTotal: addCount,
        perOrderList: curList,
        customerName: customerName,
        customerPhone: customerPhone,
        customerAddress: customerAddress,
        principal: principal,
      })
    })
  },

  // 格式化发送给后台的数据
  formatData(list) {
    const arr = list
    const result = []
    arr.map(item => {
      result.push(item.code)
    })
    return result
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const style = app.globalData.globalStyle
    const { order } = options
    const list = JSON.parse(order)
    console.log('订单列表', list)
    const params = this.formatData(list)
    this.requestPerOrder(params)
    this.saveArg(list)
    this.setData({
      globalStyle: style,
    })
    setGlobalGoldStyle(style)
    this.queryTemplateId()
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