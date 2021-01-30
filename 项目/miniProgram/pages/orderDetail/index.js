// pages/mine/orderDetail/index.js
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
      '0': 'diamand', // 钻石版
      '1': 'gold', // 黄金版
    },
    globalStyle: app.globalData.globalStyle,
    total: 10, // 默认
    more: false,
    cancelBtn: true,
    modal: false,
    noteInfo: '',
    status: 1,
    list: [],
    note: '', // 取消备注信息
    totalAmount: 0, // 合计价格
    merchant: false, // 商家展示
    cacelNote: false, // 取消备注
    confirmRemark: '', // 确认备注
    orderId: '', // 订单号
    principal: '', // 订货人
    customerPhone: '', // 联系电话
    customerRemark: '',// 下单备注
    submitTime: '', // 下单时间
    cancelRemark: '', // 取消原因
  },

  // 查看全部
  handleAll(e) {
    console.log('查看全部', e)
    const orderId = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: `/pages/orderList/index?orderId=${orderId}`
    })
  },

  // 前往已取消订单
  skipCancelOrder() {
    const mark = 'cancel'
    const path = 'waiting'
    wx.navigateTo({
      url: `/pages/order/index?mark=${mark}&path=${path}`
    })
  },

  // 取消订单请求
  sendCancelOrder(params) {
    // this.skipCancelOrder() 
    ajax.cancelOrder(params).then(res => {
      const { code } = res
      const mark = 0
      if (code == mark) {
        this.skipCancelOrder() // 跳转至取消订单
      } 
    })
  },

  // 取消订单对话框
  modalHidden() {
    this.setData({
      modal: false,
    })
  },

  // 弹出对话框
  showModal() {
    this.setData({
      modal: true
    })
  },

  // 取消订单
  handleCancelOrder() {
    console.log('取消订单')
    this.showModal()
    // this.sendCancelOrder()
  },

  // 存储取消订单备注
  wirteInput(note) {
    console.log('取消订单备注', note)
    const info = note.detail
    console.log('设置取消备注', info)
    this.setData({
      note: info,
    })
  },

  // 确定取消订单
  modalCancelOrder(e) {
    console.log('父组件取消订单', e)
    const obj = {}
    const customerInfo = wx.getStorageSync('customerInfo')
    obj.customerId = customerInfo.customerId
    obj.orderId = this.data.orderId
    obj.remark = this.data.note
    this.sendCancelOrder(obj)
  },

  // 查看商品详情
  handleDetail: function(e) {
    console.log('商品详情父组件', e)
  },

  // 备注信息
  writeValue: function(e) {
    console.log('备注信息', e)
  },

  // 处理取消原因
  processCancelText(client, staff) {
    let result = null
    if (client) {
      result = client 
    } else {
      result = staff
    }
    return result
  },

  // 查询订单详情
  queryOrderDetail(params){
    ajax.queryOrderDetail(params).then(res => {
      console.log('获取详情数据', JSON.stringify(res))
      const { data } = res
      const { orderStatus, products, total, customerCancelRemark, customerPhone, principal, orderId, confirmRemark, submitTime, customerRemark, totalAmount, clerkCancelRemark  } = data
      const mark = this.data.total
      const more = total > mark ? true : false
      const merchant= orderStatus == 1 ? true : orderStatus == 2 ? true : orderStatus == 3 ? true: false
      const cacelNote = orderStatus == -1 ? true : orderStatus == -2 ? true : false
      const cancelRemark = this.processCancelText(customerCancelRemark, clerkCancelRemark)
      this.setData({
        status: orderStatus,
        list: products,
        more: more,
        total: total, 
        customerCancelRemark: customerCancelRemark, 
        customerPhone: customerPhone, 
        principal: principal, 
        orderId: orderId, 
        confirmRemark: confirmRemark,
        submitTime: submitTime, 
        customerRemark: customerRemark,
        merchant: merchant, 
        cacelNote: cacelNote, 
        totalAmount: totalAmount, 
        cancelRemark: cancelRemark,
      })
    })
  },

  // 存储订单编号
  saveOrderId(id) {
    this.setData({
      orderId: id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('查询详情参数', options)
    const style = app.globalData.globalStyle
    const { orderId } = options
    this.saveOrderId(orderId)
    this.queryOrderDetail(orderId)
    this.setData({
      globalStyle: style,
    })
    setGlobalGoldStyle(style)
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