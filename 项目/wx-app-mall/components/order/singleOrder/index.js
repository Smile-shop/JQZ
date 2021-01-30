// components/order/singleOrder/index.js
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
    status: {
      type: String,
      value: '',
    },
    price: {
      type: Number,
      value: 0,
    },
    storeName: {
      type: String,
      value: ''
    }
  },

  /**
   * 页面的初始数据
   */
  data: {
    quantity: 0
  },

  methods: {
    // 页面详情
    handleDetail() {
      wx.navigateTo({
        url: `/pages/orderDetail/index?orderId=${this.data.orderId}`
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