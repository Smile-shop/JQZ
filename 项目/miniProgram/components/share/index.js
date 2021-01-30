// components/share/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showActionsheet: {
      type: Boolean,
      value: false
    },
    globalStyle: {
      type: String,
      value: '0'
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
    actionsheetChange() {
      // 点击“取消” 或 “背景蒙层”
      this.setData({showActionsheet: true});
    },
    onClose() {
      this.setData({showActionsheet: false})
    }, 
    // 点击分享海报
    handleTap: function() {
      // 自定义一个事件，并且传值
      let myEventDetail = {params: true} // detail对象，提供给事件监听函数
      this.triggerEvent('customevent', myEventDetail)
    },
  }
})
