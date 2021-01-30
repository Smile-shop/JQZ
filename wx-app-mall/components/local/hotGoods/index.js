// components/local/hotGoods/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hotGoodsInfo: {
      type: Object,
      value: {}
    },
    type: {
      type: Boolean,
      value: true
    }
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
    addCart(e) {
      console.log(e.target.dataset.goods)
    },
    goodsDetail() {
      const params = {
        storageType: this.data.hotGoodsInfo.storageType,
        proId: this.data.hotGoodsInfo.id
      }
      this.triggerEvent('goodsDetail', params)
    }
  }
})
