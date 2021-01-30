// pages/logisticsDetail/goodsInfo/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

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
    copy(){
      wx.setClipboardData({
         data: '46546',
         success: res => {
           wx.showToast({
             title: '复制成功',
             icon: 'none'
           });
         }
       });
      }
  }
})
