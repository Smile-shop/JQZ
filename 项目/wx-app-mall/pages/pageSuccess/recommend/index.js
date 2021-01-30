// pages/pageSuccess/recommend/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    recommendList: {
      type: Array,
      value: [],
      observer(val){
        console.log(val.length)
      }
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
    goodsDetail(e){
      const { item } = e.currentTarget.dataset
      wx.navigateTo({
        url: `/pages/goodsDetail/index?skuId=${item.skuId}&spuId=${item.id}`
      })
    }
  }
})
