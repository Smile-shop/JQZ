// pages/mine/orderDetail/index.js

const app = getApp()
import { queryOrderDetail, cancelOrder, deleteOrder, finish, payment } from '../../api/order'
import { countDownTime } from '../../utils/order'
Page({
  mixins: [require('../../mixins/setColor.js')],
  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    showConfirm: false,
    receiveConfirm: false,
    delConfirm: false,
    info: {
      address: {receiver: "张珊", address: '广东省深圳市罗湖区文锦广场A座17层', phone: '13588889999'},
      logistics: []
    },
    navbarData: {
      goback: true,
      gohome: true,
      title: '订单详情',
      style: 2
    },
    orderDetail: {},
    orderRspVo: {},
    quantity: 0,
    showPay: false,
    timer: null
  },
  pay(){
    this.setData({ showPay: true })
  },
  // 支付
  async payment(){
    const res = await payment(this.data.orderId)
    if(!res.code){
      wx.redirectTo({
        url: `/pages/pageSuccess/index?amount=${this.data.orderRspVo.amtPayment}`,
      })
    } else{
      wx.showToast({
        title: res.msg || '支付失败',
        icon: 'none'
      })
    }
  },
  // 唤起取消订单弹窗
  showCancel(e) {
    this.setData({ showConfirm: true })
  },
  // 确认取消订单
  async confrimCancel() {
    const res = await cancelOrder(this.data.orderId)
    this.setData({ showConfirm: false })
    if(!res.code){
      wx.showToast({
        title: '取消成功',
        icon: 'none'
      })
      this.queryOrderDetail(this.data.orderId)
      // const userStatus = `orderRspVo.userStatus`
      // this.setData({ showConfirm: false, [userStatus]: 'CANCELED' })
    }
  },
  // 提醒发货
  remind(){
    wx.showToast({
      title: '已提醒卖家发货',
      icon: 'none'
    })
  },
  // 唤起确认收货弹窗
  receiveGoods(){
    this.setData({receiveConfirm: true})
  },
  // 确认收货
  async confrimReceived(){
    const data = {orderId: this.data.orderId, remark: ''}
    const res = await finish(data)
    this.setData({ receiveConfirm: false })
    if(!res.code){
      wx.showToast({
        title: '确认成功',
        icon: 'none'
      })
      this.queryOrderDetail(this.data.orderId)
      // const userStatus = `orderRspVo.userStatus`
      // const userStatusDesc = `orderRspVo.userStatusDesc`
      // this.setData({ receiveConfirm: false, [userStatus]: 'FINISHED', [userStatusDesc]: '订单已完成，感谢您的支持' })
    }
  },
  // 唤起删除订单弹窗
  delOrder(e) {
    this.setData({ delConfirm: true })
  },
  // 确认删除订单
  async confirmDel() {
    const res = await deleteOrder(this.data.orderId)
    if(!res.code){
      wx.showToast({
        title: '删除成功',
        icon: 'none',
        success(){
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        }
      })
      this.setData({ delConfirm: false })
    }
  },

  // 查看商品详情
  handleDetail: function(e) {
    console.log('商品详情父组件', e)
  },

  // 查询订单详情
  async queryOrderDetail(id){
    const res = await queryOrderDetail(id)
    const orderDetail = res.data
    let quantity = 0
    if(orderDetail && Array.isArray(orderDetail.orderDetailRspVoList)){
      orderDetail.orderDetailRspVoList.forEach(item => {
        quantity += item.quantity
      })
      this.setData({ quantity })
    }
    const addressName = `info.address`
    const orderRspVo = orderDetail.orderRspVo || {}
    if (orderRspVo.userStatus == 'NOTPAID') {
      orderRspVo.cdTime = countDownTime((orderRspVo.countdownTime / 1000).toFixed(0))
    } else if (orderRspVo.userStatus == 'SHIPPED'){
      orderRspVo.cdTime = countDownTime((orderRspVo.countdownTime / 1000).toFixed(0), 2)
    }
    const address = {receiver: orderRspVo.receiver || '', phone: orderRspVo.phone || '', address: `${orderRspVo.province || ''}${orderRspVo.city || ''}${orderRspVo.district || ''}${orderRspVo.street || ''}${orderRspVo.address || ''}`}
    this.setData({ orderDetail, orderRspVo, [addressName]: address })
    if(orderRspVo.countdownTime){
      let countdownTime = (orderRspVo.countdownTime / 1000).toFixed(0)
      this.data.timer = setInterval(() => {
        countdownTime --
        let cdTime
        if (orderRspVo.userStatus == 'NOTPAID') {
          cdTime = countDownTime(countdownTime)
        } else if (orderRspVo.userStatus == 'SHIPPED'){
          cdTime = countDownTime(countdownTime, 2)
        }
        this.setData({ ['orderRspVo.cdTime']: cdTime })
        if (!countdownTime){
          clearInterval(this.data.timer)
          setTimeout(() => {
            this.queryOrderDetail(id)
          }, 1500)
        }
      }, 1000);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setTabBarStyleAndsetNavigationBarColor(true)
    const { orderId } = options
    this.setData({ orderId })
    this.queryOrderDetail(orderId)
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
    if(this.data.timer) clearInterval(this.data.timer)
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