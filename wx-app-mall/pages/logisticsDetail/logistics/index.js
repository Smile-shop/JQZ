// pages/logisticsDetail/logistics/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    steps:{
      type: Array,
      value: [{time: '10-28 23:55', stepTitle: '已签收', step: '顺丰速运已签收' }, {time: '10-28 23:55', step: '顺丰速运已收取快件' }, {time: '10-28 23:55',  stepTitle: '已发货', step: '包裹正在等待揽收' },]
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

  }
})
