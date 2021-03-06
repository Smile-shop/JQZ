// components/columList/index.js
import log from '../../../utils/log'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    colum: {
      type: Object,
      value: {},
    },
    tags: {
      type: Array,
      value: []
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
    handleDetail(e) {
      log('商品详情', e)
      const options = e.currentTarget.dataset.colum
      this.triggerEvent('gotoDetail', options)
    }
  }
})
