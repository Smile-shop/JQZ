// pages/shopDetails/index.js
const app = getApp()
import { queryAddressById } from '../../api/shop'
Page({
  mixins: [require('../../mixins/setColor.js')],
  /**
   * 页面的初始数据
   */
  data: {
    message: {
      longitude: 114.132021,
      latitude: 22.563851,
      name: '金千枝翠竹店',
      address: '深圳市罗湖区文锦广场A座17层'
    },
    storeInfo: {}, // 门店信息
    navbarData: {
      goback: true,
      gohome: true,
      title: '店铺详情',
      style: 2,
    }, // 顶部导航
  },

  // 赋值给页面
  empowerStorePage(data) {
    const info = data
    const coordTx = data.coordTx && data.coordTx.split(',')
    info.logo = data.imgs[0].url
    const message = {
      longitude: Number(coordTx[0]) || 114.12542,
      latitude: Number(coordTx[1]) || 22.55821,
      name: data.name || '',
      address: data.address || ''
    }
    this.setData({
      storeInfo: info, message
    })
  },

  // 查询绑定当前门店
  async queryBindStore(id) {
    const storeId = id || app.globalData.storeId
    const args = {}
    args.id = storeId
    if (storeId) {
      const res = await queryAddressById(args)
      const { data } = res
      this.empowerStorePage(data)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { storeId } = options
    this.queryBindStore(storeId)
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
    this.setTabBarStyleAndsetNavigationBarColor(true)
  },

  call(e) {
    wx.makePhoneCall({ phoneNumber: e.currentTarget.dataset.tel })
  },
  lookMap() {
    const { latitude, longitude, name, address } = this.data.message
    wx.openLocation({ latitude, longitude, name, address, scale: 18 })
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