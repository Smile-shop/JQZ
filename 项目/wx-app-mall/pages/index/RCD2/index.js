// pages/index/RCD2/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    rcd2Data: {
      type: Object,
      value: {}
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
    // 商品详情
    goodsDetail(e) {
      const { item } = e.currentTarget.dataset
      wx.navigateTo({
        url: `/pages/goodsDetail/index?skuId=${item.skuId}&spuId=${item.id}`
      })
    },
    // 更多
    getMore(){
      wx.navigateTo({
        url: `/pages/goodsList/index?title=${this.data.rcd2Data.title}`,
      })
    },
  }
})
