// components/order/content/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    context: {
      type: Array,
      value: [],
    },
    form: {
      type: String,
      value: '0',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    productStatus: '', // 0 预订 1 现货 2 下架
    formatStyle: {
      '0': 'diamand', // 钻石版
      '1': 'gold', // 黄金版
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleDetail: function() {
      console.log('产品内容被点击')
      this.triggerEvent('goodsList', {id: 'uuid123'})
    }
  }
})
