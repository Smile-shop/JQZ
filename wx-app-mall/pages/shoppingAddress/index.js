// pages/shoppingAddress/index.js
const app = getApp()
import { queryShipAddress } from '../../api/address'
import log from '../../utils/log'

Page({
  mixins: [require('../../mixins/setColor.js')],
  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    fromOrder: false,
    addNewAddress: true, // 添加新地址
    upperLimit: 20,
    overStock: '已达20条地址上限，请删除不常用地址再添加',
    navbarData: {
      goback: true,
      gohome: true,
      title: '收货地址',
      style: 1
    },
    edit: false
  },

  // 赋值收货地址列表
  async empowerAddressList(list) {
    const address = list
    this.setData({
      addressList: address,
    })
  },

  // 查询地址列表
  async queryAddressList() {
    const body = {
      "address": "",
      "city": "",
      "district": "",
      "id": "",
      "isDefault": "",
      "label": "",
      "mid": "",
      "phone": "",
      "province": "",
      "receiver": ""
    }
    const res = await queryShipAddress(body)
    log('地址', res)
    const { code, data } = res
    const mark = 0
    const len = data.length || 0
    if (code === mark) {
      this.empowerAddressList(data)
      this.countUpperLimit(len)
    }
  },

  // 重新加载新列表
  async reloadAddressList() {
    this.queryAddressList()
  },

  // 计算是否达上限
  countUpperLimit(num) {
    const getNum = num
    const count = this.data.upperLimit
    let result = true
    if (Number(getNum) >= Number(count)) {
      result = false
    }
    this.setData({
      addNewAddress: result
    })
  },

  // 是否可以继续增加地址
  canAddress() {
    let result = false
    const mark = this.data.addNewAddress
    if (mark) {
      result = true
    }
    return result
  },

  addAddress() {
    const text = this.data.overStock
    const mark = this.canAddress()
    if (mark) {
      wx.navigateTo({
        url: `/pages/addAddress/index`,
      })
    } else {
      this.showTip(text)
    }
  },

  // 不能增加提示
  showTip(text, icon = 'none', time = 3000) {
    wx.showToast({
      title: text, 
      icon: icon,
      duration: time, 
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryAddressList()
    if (options.order) {
      this.setData({ fromOrder: true })
    }
    if(options.edit){
      this.setData({ edit: true })
    }
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
    this.queryAddressList()
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