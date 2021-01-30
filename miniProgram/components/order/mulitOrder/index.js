// components/order/mulitOrder/index.js
Component({

  properties: {
    list: {
      type: Array,
      value: [],
    },
    orderId: {
      type: String,
      value: '',
    },
    price: {
      type: Number,
      value: 0,
    },
    count: {
      type: Number,
      value: 0,
    },
    title: {
      type: String,
      value: '',
    },
    form: {
      type: String,
      value: '0',
    },
    status: {
      type: Boolean,
      value: true,
    }
  },

  /**
   * 页面的初始数据
   */
  data: {
    formatStyle: {
      '0': 'diamand', // 钻石版
      '1': 'gold', // 黄金版
    },
    mark: 0, // 待确认有取消按钮
    titleText: {
      '0': '待确认',
      '1': '已确认',
      '2': '配货中',
      '-1': '已取消',
      '3': '已完成',
      '-2': '已取消',
    },
    productStatus: '', // 0 预订 1 现货 2 下架
  },

  methods: {
    handleCancelOrder(e) {
      console.log('取消订单', e.currentTarget.dataset.id)
      const orderId = e.currentTarget.dataset.id
      this.triggerEvent('cancelMulitOrder', {orderId: orderId})
    },
    // 页面详情
    handleDetail(e) {
      console.log('页面详情', e)
      const orderId = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/orderDetail/index?orderId=${orderId}`
      })
    },
    handleDetailAll(e) {
      console.log('查看全部', e)
      const orderId = e.currentTarget.dataset.id
      console.log('查看全部', orderId)
      wx.navigateTo({
        url: `/pages/orderList/index?orderId=${orderId}`
      })
    }, 
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