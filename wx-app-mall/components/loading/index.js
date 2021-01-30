// components/loading/index.js
import log from '../../utils/log'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    top: {
      type: Number,
      value: 230
    },
    show: {
      type: Boolean,
      value: true,
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

  },

  // 组件生命周期
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      log('组件生命周期', getApp().globalData.loading)
    },
    ready: function () {
      log('另一个生命周期', getApp().globalData.loading)
    }
  },
})
