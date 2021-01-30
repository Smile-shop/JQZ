// pages/order/index.js
const app = getApp()
import { queryOrderPage, cancelOrder, deleteOrder, finish, payment } from '../../api/order'
import { getNavbarHeight } from '../../utils/utils'
import { countDownTime } from '../../utils/order'

Page({
  mixins: [require('../../mixins/setColor.js')],
  /**
   * 页面的初始数据
   */
  data: {
    activeItem: '0',
    currentIndex: 'item',
    orderNav: [
      { status: '0', name: '全部', mode: '' },
      { status: '1', name: '待付款', mode: 'NOTPAID' },
      { status: '2', name: '待发货', mode: 'NOTSHIPPED' },
      { status: '3', name: '待收货', mode: 'SHIPPED' },
      { status: '4', name: '已完成', mode: 'FINISHED' },
    ],
    curPage: 1, // 页码
    pageSize: 20, // 条数
    totalPages: 1, // 总页码数
    totalNum: 1, // 总条数
    list: [],
    pullRefresh: false,
    noMore: false,
    loading: true,
    showConfirm: false,
    receiveConfirm: false,
    delConfirm: false,
    navbarData: {
      goback: true,
      gohome: true,
      title: '我的订单',
      style: 1
    },
    navbarHeight: 0,
    status: '',
    orderId: '',
    index: 0,
    showPay: false,
    timer: null
  },
  // 下拉刷新
  refresh() {
    this.setData({curPage: 1})
    this.queryOrderList()
  },
  pay(e){
    this.setData({ orderId: e.target.dataset.id, index: e.target.dataset.index, amount: e.target.dataset.price, showPay: true })
  },
  // 支付
  async payment(e){
    // this.setData({ orderId: e.target.dataset.id, index: e.target.dataset.index })
    const res = await payment(this.data.orderId)
    if(!res.code){
      wx.navigateTo({
        // url: `/pages/pageSuccess/index?amount=${e.target.dataset.price}`,
        url: `/pages/pageSuccess/index?amount=${this.data.amount}`,
      })
    } else{
      wx.showToast({
        title: res.msg || '支付失败',
        icon: 'none'
      })
    }
  },
  // 查看物流
  getLogisticsDetail() {
    wx.navigateTo({
      url: '/pages/logisticsDetail/index',
    })
  },
  // 唤起取消订单弹窗
  showCancel(e) {
    this.setData({ showConfirm: true, orderId: e.target.dataset.id, index: e.target.dataset.index })
  },
  // 确定取消订单
  async confrimCancel() {
    const res = await cancelOrder(this.data.orderId)
    this.setData({ showConfirm: false }) 
    if(!res.code){
      wx.showToast({
        title: '取消成功',
        icon: 'none'
      })
      const list = this.data.list
      list.splice(this.data.index, 1)
      this.setData({ list })
    }
  },
  // 提醒发货
  remind() {
    wx.showToast({
      title: '已提醒卖家发货',
      icon: 'none'
    })
  },
  // 唤起确认收货弹窗
  receiveGoods(e) {
    this.setData({ receiveConfirm: true, orderId: e.target.dataset.id, index: e.target.dataset.index })
  },
  // 确定收货
  async confrimReceived() {
    const data = { orderId: this.data.orderId, remark: '' }
    const res = await finish(data)
    this.setData({ receiveConfirm: false })
    if(!res.code){
      wx.showToast({
        title: '确认成功',
        icon: 'none'
      })
      const list = this.data.list
      list.splice(this.data.index, 1)
      this.setData({ list })
    }
  },
  // 唤起删除订单弹窗
  delOrder(e) {
    this.setData({ delConfirm: true, orderId: e.target.dataset.id, index: e.target.dataset.index })
  },
  // 确定删除订单
  async confirmDel() {
    const res = await deleteOrder(this.data.orderId)
    this.setData({ delConfirm: false })
    if(!res.code){
      const list = this.data.list
      list.splice(this.data.index, 1)
      this.setData({ list })
      wx.showToast({
        title: '删除成功',
        icon: 'none'
      })
    }
  },
  // 加载更多
  handleMore(){
    if(this.data.noMore) return
    let curPage = this.data.curPage
    curPage++
    this.setData({curPage})
    this.queryOrderList()
  },

  // 切换订单状态
  handleItem(e) {
    this.setData({
      activeItem: e.target.id,
      currentIndex: e.target.dataset.item
    })
    const status = e.target.dataset.mode
    if(this.data.timer) clearInterval(this.data.timer)
    this.setData({ status, curPage: 1, list: [], loading: true })
    this.queryOrderList()
  },

  // 查询订单列表
  async queryOrderList() {
    const data = this.data
    if(data.curPage === 1){
      this.setData({loading: true})
    }
    const body = {
      curPage: data.curPage,
      userStatus: data.status,
      pageSize: data.pageSize,
    }
    const res = await queryOrderPage(body)
    const { records } = res.data || []
    records.forEach(item => {
      if(item.countdownTime) {
        item.countdownTime = (item.countdownTime / 1000).toFixed(0)
        item.cdTime = countDownTime(item.countdownTime) || '-'
      }
    })
      if(this.data.curPage === 1){
        this.setData({ list: records })
      }else{
        let list = this.data.list
        list = list.concat(records)
        this.setData({ list })
      }
      if(this.data.timer) clearInterval(this.data.timer)
      this.data.timer = setInterval(() => {
        const list = this.data.list
        list.forEach((item, index) => {
          if(item.countdownTime){
            item.countdownTime--
            item.cdTime = countDownTime(item.countdownTime)
            if(!item.countdownTime && this.data.status === 'NOTPAID') {
              list.splice(index, 1)
            }
            this.setData({ list })
          }
        })
      }, 1000);
      this.setData({noMore: records.length < this.data.pageSize, loading: false, pullRefresh: false})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    const activeItem = options.status || '0'
    const status = this.data.orderNav[activeItem].mode
    this.setData({ activeItem, status, navbarHeight: getNavbarHeight() })
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
    this.queryOrderList()
    this.setData({ showPay: false })
    if(this.data.timer) clearInterval(this.data.timer)
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
    if( this.data.timer ) clearInterval(this.data.timer)
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