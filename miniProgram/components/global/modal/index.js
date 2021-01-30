// components/global/modal/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content: {
      type: String,
      value: '内容'
    },
    show: {
      type: Boolean,
      value: false
    },
    hasCancelBtn: {
      type: Boolean,
      value: true
    },
    globalStyle: {
      type: String,
      value: '0'
    },
    data: null
  },

  /**
   * 组件的初始数据
   */
  data: {
    // globalStyle: getApp().globalData.globalStyle
  },

  /**
   * 组件的方法列表
   */
  methods: {
    modalButtonClick(e) {
      this.setData({ show: false })
      this.triggerEvent('btnClick', {
        type: Boolean(e.target.dataset.type),
        data: this.data.data
      })
    }
  }
})
