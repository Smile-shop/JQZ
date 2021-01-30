// components/order/info/index.js
import { filterTime } from '../../../utils/utils'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    time: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    copy(){
      wx.setClipboardData({
         data: this.data.info.number,
         success: res => {
           wx.showToast({
             title: '复制成功',
             icon: 'none'
           });
         }
       })
    }
  }
})
