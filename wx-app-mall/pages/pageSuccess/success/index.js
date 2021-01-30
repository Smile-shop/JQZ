// pages/pageSuccess/success/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    amount: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    goHome(){
      wx.switchTab({
        url: '/pages/index/index',
      })
    },
    lookOrder(){
      wx.navigateTo({
        url: '/pages/order/index',
      })
    }
  }
})
