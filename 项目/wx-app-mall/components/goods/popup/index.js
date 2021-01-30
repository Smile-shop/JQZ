// components/popup/index.js
import log from '../../../utils/log'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    animation: {
      type: String,
      value: 'entry',
    },
    filerTerm: {
      type: Object,
      value: {}
    },
    spot: {
      type: Boolean,
      type: false,
    },
    top: {
      type: Number,
      type: 0
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
    handleStock() {
      log('仅看有货')
      this.triggerEvent('handleStock')
    },
    handleMin(e) {
      log('最小', e)
      const min = e.detail.value
      const options = {
        item: 'price',
        flag: 'min',
        min,
      }
      this.triggerEvent('handleChange', options)

    },
    handleMax(e) {
      log('最大值', e)
      const max = e.detail.value
      const options = {
        item: 'price',
        flag: 'max',
        max,
      }
      this.triggerEvent('handleChange', options)
    },
    handleRest() {
      log('重置')
      this.triggerEvent('handleReset')
    },
    handleSure() {
      log('确定')
      this.triggerEvent('filterSure')
    },
    handleClose() {
      log('关闭')
      this.triggerEvent('closePop')
    }
  }
})
