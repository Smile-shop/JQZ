// components/order/mulitOrder/index.js
Component({

  properties: {
    list: {
      type: Array,
      value: [],
      observer(val){
        this.sumQuantity(val)
      }
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
    },
    storeName: {
      type: String,
      value: '',
    }
  },

  /**
   * 页面的初始数据
   */
  data: {
    titleText: {
      '0': '待确认',
      '1': '已确认',
      '2': '配货中',
      '-1': '已取消',
      '3': '已完成',
      '-2': '已取消',
    },
    showConfirm: false,
    receiveConfirm: false,
    delConfirm: false,
    quantity: 0
  },

  methods: {
    // 页面详情
    handleDetail(e) {
      const orderId = e.currentTarget.dataset.id
      const status = e.currentTarget.dataset.status
      wx.navigateTo({
        url: `/pages/orderDetail/index?orderId=${orderId}&status=${status}`
      })
    },
    handleDetailAll(e) {
      const orderId = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/orderList/index?orderId=${orderId}`
      })
    },
    sumQuantity(val){
      let quantity = 0
      val.forEach(item => {
        quantity += item.quantity
      })
      this.setData({ quantity })
    }
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