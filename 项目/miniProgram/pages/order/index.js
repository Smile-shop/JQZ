// pages/order/index.js
import {
  Server 
} from '../../models/server'
const ajax = new Server()
const app = getApp()
// import { globalGoldStyle } from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeItem: 'all',
    content: '内容区域',
    loadMore: '点击加载更多...', // 默认底部文字
    selectedStatus: 4, // 当前选中订单状态
    options: {
      more: '点击加载更多...',
      noMore: '没有更多了',
      loading: '加载中...'
    },
    globalStyle: app.globalData.globalStyle,
    modal: false,
    orderNav: {
      all: 'all',
      waiting: 'waiting',
      confirm: 'confirm',
      increase: 'increase',
      cancel: 'cancel',
      finish: 'finish',
    },
    orderStatus: {
      waiting: 0,
      confirm: 1,
      increase: 2,
      cancel: -1,
      finish: 3,
      all: 4,
    },
    writeNum: 0, // 输入备注的数量
    pageNum: 1, // 页码
    pageSize: 10, // 条数
    totalPages: 1, // 总页码数
    totalNum: 1, // 总条数
    orderInfo: {}, // 取消订单数据
    note: '', // 取消订单备注
    list: [],
    productStatus: '', // 0 预订 1 现货 2 下架
    currentIndex: 'all', // 滚动至特定标签
  },

  // 更新页面数据
  updatePageData(res) {
    const { data } = res
    const { list } = data
    this.handlePayload(list)
    this.listText(data)
  },

  // 滚动至特定标签
  scrollToIndex(label) {
    this.setData({
      currentIndex: label
    })
  },

  // 加载更多
  handleMore() {
    console.log('去加载更多')
    const customer = wx.getStorageSync('customerInfo')
    const customerId = customer.customerId
    const status = this.data.selectedStatus
    const pageNum = this.data.pageNum + 1
    const pageSize = this.data.pageSize
    const totalPages = this.data.totalPages
    console.log('当前页码和总页面', pageNum, totalPages)
    if (pageNum > totalPages) {
      return 
    }
    const options = {}
    options.data = {
      customerId: customerId,
      orderStatus: status,
    }
    options.page = {
      pageNum: pageNum,
      pageSize: pageSize,
    }
    ajax.queryOrder(options).then(res => {
      console.log('加载到更多', res.data)
      this.updatePageData(res)
    })
  },

    // 取消订单重新请求数据
    cancelRequest() {
      console.log('去加载更多')
      const customer = wx.getStorageSync('customerInfo')
      const customerId = customer.customerId
      const status = this.data.selectedStatus
      const pageNum = 1
      const pageSize = this.data.pageSize
      const options = {}
      options.data = {
        customerId: customerId,
        orderStatus: status,
      }
      options.page = {
        pageNum: pageNum,
        pageSize: pageSize,
      }
      ajax.queryOrder(options).then(res => {
        console.log('加载到更多', res.data)
        this.emptyList()
        this.updatePageData(res)
      })
    },

  // 存储当前选中状态
  saveCurrentStatus(num) {
    this.setData({
      selectedStatus: num,
    })
  },

  // 取消多品订单
  handleMulit(e) {
    console.log('取消多品', e.detail.orderId)
    const arg = e.detail.orderId
    const customer = wx.getStorageSync('customerInfo')
    const customerId = customer.customerId
    const options = {}
    // {
    //   "remark":"客户取消备注",
    //   "orderId":"订单编号",
    //   "customerId":"客户id int"
    //   }
    options.orderId = arg
    options.customerId = customerId
    console.log('删除是备注', this.data.note)
    this.saveOrderInfo(options)
    this.modifyConfirm()
  },

  // 取消单品订单
  handleSingle(e) {
    console.log('取消单品', e.detail.orderId)
    const arg = e.detail.orderId
    const customer = wx.getStorageSync('customerInfo')
    const customerId = customer.customerId
    const options = {}
    // {
    //   "remark":"客户取消备注",
    //   "orderId":"订单编号",
    //   "customerId":"客户id int"
    //   }
    options.orderId = arg
    options.customerId = customerId
    console.log('删除是备注', this.data.note)
    this.saveOrderInfo(options)
    this.modifyConfirm()
  },

  // 存储取消订单备注
  wirteInput(note) {
    console.log('取消订单备注', note)
    const info = note.detail
    console.log('设置取消备注', info)
    const len = info.length
    this.setData({
      note: info,
      writeNum: len, 
    })
  },

  // 存储要删除的订单数据
  saveOrderInfo(obj) {
    this.setData({
      orderInfo: obj
    })
  },

  // 关闭弹框
  modalHidden() {
    this.modifyConfirm(false)
  },

  // 确定取消订单
  modalCancelOrder() {
    console.log('取消订单的对话框')
    const obj = this.data.orderInfo
    obj.remark = this.data.note
    this.setCancelOrder(obj)
  },

  // 发送取消请求接口
  setCancelOrder(options) {
    ajax.cancelOrder(options).then(res => {
      console.log('取消成功')
      const { code } = res
      const mark = 0
      if (mark === code) {
      this.modalHidden()
      // 重新请求刷新页面数据
      this.cancelRequest()
      }
    })
  },

  // 弹出或关闭取消订单确认框
  modifyConfirm(status = true) {
    this.setData({
      modal: status
    })
  },

  // 列表底部文字
  listText(data) {
    const { pages, pageNum, total } = data
    const mark = this.data.options
    let result = mark.more
    if (pages > pageNum) {
      result = mark.more
    } else {
      result = mark.noMore
    }
    this.setData({
      loadMore: result,
      totalPages: pages,
      pageNum: pageNum,
      totalNum: total,
    })
  },

  // 处理返回结果
  handlePayload(data) {
    console.log('处理返回数据', data)
    const list = this.data.list
    const arr = list.concat(data)
    this.setData({
      list: arr,
    })
  },

  // 清空数据
  emptyList() {
    this.setData({
      list: []
    })
  },

  // 切换状态
  handlItem: function(e) {
    console.log('切换标题', e.target)
    const mark = this.data.activeItem
    const id = e.target.id 
    const url = this.data.orderNav[id]
    const status = this.data.orderStatus[url]
    if (url == mark) {
      return
    }
    this.emptyList()
    this.saveCurrentStatus(status)
    this.navLink(url)
    this.handleActiveItem(id)
  },

  navLink: function(url = this.data.orderNav.all) {
    console.log('参数', url)
    const customerInfo =  wx.getStorageSync('customerInfo')
    const customerId = customerInfo.customerId || null
    const status = this.data.orderStatus[url]
    const pageSize = this.data.pageSize
    const pageNum = 1
    const options = {
      data: {
        customerId: customerId,
        orderStatus: status,
      },
      page: {
        pageNum: pageNum,
        pageSize: pageSize,
      }
    }
    this.saveCurrentStatus(status)
    ajax.queryOrder(options).then(res => {
      console.log('正常返回', res.data)
      this.updatePageData(res)
    }).catch(err => {
      console.log('错误', err)
    })
  },

  handleActiveItem(name) {
    this.setData({
      activeItem: name
    })
    this.scrollToIndex(name)
  },

  removeCurryListItem(val) {
    this.list = this.list.splice(val, 1)
  },

  // 返回我的
  backMine() {
    wx.switchTab({
      url: '/pages/mine/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const style = app.globalData.globalStyle
    const { mark } = options
    this.handleActiveItem(mark)
    this.navLink(mark)
    this.setData({
      globalStyle: style,
    })
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
    this.backMine()
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