// pages/pullRefresh/index.js
Component({
  options:{
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 下拉背景高度
     */
    height: {
      type: Number,
      value: 50
    },
    /**
     * 下拉背景颜色
     */
    background: {
      type: String,
      value: "#FFF"
    },
    /**
     * 下拉状态
     */
    pullRefresh: {
      type: Boolean,
      value: false
    },
    contentStyle: {
      type: String,
      value: `height: 100vh; height: calc(100vh - constant(safe-area-inset-bottom));height: calc(100vh - env(safe-area-inset-bottom));`
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    style: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 下拉刷新方法
     */
    refresh(){
      this.triggerEvent('pullrefresh')
    },
    /**
     * 上拉刷新方法
     */
    handleMore(){
      this.triggerEvent('handleMore')
    },
    onPulling(evt, instance) {
      const p = Math.min(evt.detail.dy / this.data.height, 1)
      this.setData({style: `;;opacity: ${p}; transform: scale(${p})`})
    }
  }
})
