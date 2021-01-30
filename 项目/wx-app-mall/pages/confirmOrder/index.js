// pages/mine/orderDetail/index.js
import log from '../../utils/log'
import { queryDefaultAddress, addOrderByCart, querByStoId, addOrder } from '../../api/confirmOrder'
import { payment } from '../../api/order'
const app = getApp()
Page({
  mixins: [require('../../mixins/setColor.js')],
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [],
    list: [],
    info: {},
    active: 0,
    remark: '',
    address: '',
    showCoupon: false,
    quantity: 0,
    amount: 0,
    navbarData: {
      goback: true,
      gohome: true,
      title: '确认订单',
      style: 0
    },
    fromCart: false,
    skuId: '',
    parmName: '',
    couponId: '',
    showPay: false,
    orderId: ''
  },
  // 获取收货方式
  async getRecType(){
    const res = await querByStoId(app.globalData.storeId)
    const tabs = res.data.filter(val => val.value == 'Y')
    this.setData({ tabs })
  },
  // 获取默认地址
  async getDefaultAddress(){
    const res = await queryDefaultAddress()
    if(res.data){
      const address = res.data
      address.address = `${address.province}${address.city}${address.district}${address.address}`
      this.setData({ address })
    }else{
      this.setData({ address: {} })
    }
  },
  // 提交订单
  async submitOrder(){
    if(this.data.orderId){
      this.setData({ showPay: true })
      return
    }
    const data = this.data
    if(!data.address){
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
      return
    }
    const body = {
      "addressId": data.address.id,
      "amount": data.amount,
      "amtDelivery": 0,
      "amtDiscount": 0,
      "amtPayment": data.amount,
      "amtPoint": 0,
      "point": 0,
      "pointUsed": 0,
      "receipt": "N",
      "recvManner": data.parmName == 'STORE_EXPRESS' ? 'EXP' : 'DIY',
      "remark": data.remark,
      "shoppingCartId": data.fromCart ? data.list.map(item => item.id) : undefined,
      "skuId": data.fromCart ? undefined : data.skuId,
      "quantity": data.fromCart ? undefined : data.quantity,
      "storeId": app.globalData.storeId
    }
    const res = data.fromCart ? await addOrderByCart(body) : await addOrder(body)
    if(!res.code){
      this.setData({ orderId: res.data, showPay: true })
      // this.payment(res.data)
    }
  },
  // 确定选择优惠券
  seleted(e){
    log(e)
    this.setData({ couponId: e.detail.id })
  },
  // 唤起优惠券弹窗
  selete(){
    this.setData({showCoupon: true})
  },
  // 支付
  async payment(id){
    const res = await payment(this.data.orderId)
    // 支付成功
    if(!res.code){
      wx.redirectTo({
        url: `/pages/pageSuccess/index?amount=${this.data.amount}`,
      })
      wx.removeStorage({
        key: 'address'
      })
    }else{
       // 取消支付或者支付失败
       this.setData({ showPay: false })
      // wx.navigateTo({
      //   url: `/pages/order/index?status=1`,
      // })
    }
  },
  // 获取留言
  changeRamark(e){
    const { remark } = e.detail
    this.setData({ remark })
  },
  saveMessage(){
    try {
      const value = wx.getStorageSync('orderDetail')
      if (value) {
        const orderDetail = Object.assign({}, value, { remark: this.data.remark, couponId: this.data.couponId })
        wx.setStorage({
          key: "orderDetail",
          data: orderDetail
        })
      }
    } catch (e) {}
  },
  // 改变收货方式
  onChangeTabs(e){
    const { parmName } = e.detail
    this.setData({ parmName })
  },

  // 查看商品详情
  handleDetail: function(e) {
    log('商品详情父组件', e)
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRecType()
    this.setTabBarStyleAndsetNavigationBarColor(true)
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
    wx.getStorage({
      key: 'orderDetail',
      success: res => {
        const info = { storeName: app.globalData.userInfoAndStore && app.globalData.userInfoAndStore.store && app.globalData.userInfoAndStore.store.name }
        const list = res.data.goodsList
        const fromCart = !list[0].from
        const { skuId } = list[0]
        const { remark, couponId } = res.data
        const address = res.data.address
        if(!address){
          this.getDefaultAddress()
        }else{
          address.address = `${address.province}${address.city}${address.district}${address.address}`
          this.setData({ address })
        }
        let quantity = 0
        let amount = 0
        list.forEach(item => {
          quantity += item.quantity
          amount += item.price * item.quantity
        })
        this.setData({ list, info, quantity, amount, fromCart, skuId, remark, couponId })
      }
    })
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
    wx.removeStorage({
      key: 'orderDetail'
    })
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