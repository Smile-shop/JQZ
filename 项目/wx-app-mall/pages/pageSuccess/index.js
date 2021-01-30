// pages/pageSuccess/index.js
import { queryIndexSpuRecommandList } from '../../api/index'
const app = getApp()
Page({
  mixins: [require('../../mixins/setColor.js')],
  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    amount: 0,
    navbarData: {
      goback: true,
      gohome: true,
      title: '确认订单',
      style: 0
    },
  },

  // 获取推荐位列表
  async getRemList(){
    const data = { rcdKind: 'RCD1', storeId: app.globalData.storeId, curPage: 1, pageSize: 30 }
    const res = await queryIndexSpuRecommandList(data)
    if(!res.code){
      const dataList = res.data.spuList.records
      this.setData({ dataList })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { amount } = options
    this.setData({ amount })
    this.getRemList()
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