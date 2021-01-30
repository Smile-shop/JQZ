// pages/index/RCD1/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    rcd1Data: {
      type: Object,
      value: {},
      observer(val){
        if(val && val.spuList && val.spuList.records && Array.isArray(val.spuList.records)){
          this.setData({
            list: val.spuList.records,
            moreThen20: val.spuList.totalRecord > 20
          })
        } else {
          this.setData({
            list: [],
            moreThen20: false
          })
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [],
    moreThen20: false
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
        url: `/pages/goodsList/index?title=${this.data.rcd1Data.title}`,
      })
    },
  }
})
