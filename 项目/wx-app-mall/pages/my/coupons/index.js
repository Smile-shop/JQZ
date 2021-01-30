// pages/coupons/index.js
Page({
  mixins: [require('../../../mixins/setColor.js')],
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{title: '未使用', status: 0}, {title: '已使用', status: 1}, {title: '已过期', status: 2}, {title: '已转赠', status: 0}],
    // tabData: [{couponType: 1, status: 0},{couponType: 2, status: 0}],
    tabData: [],
    navbarData: {
      goback: true,
      gohome: true,
      title: '优惠券',
      style: 1
    }
  },
  changeTabs(e){
    const { index } = e.detail
    let { tabData } = this.data
    function changeStatus(status){
      tabData.forEach(item => item.status = status)
    }
    changeStatus(index)
    this.setData({ tabData })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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