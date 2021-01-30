// components/order/content/index.js
const app = getApp()
import { queryShopInfo } from '../../../api/goodDetailandList'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: [],
    },
    fromOrder: {
      type: Boolean,
      value: false,
    },
    info: {
      type: Object,
      value: {}
    }
    // //是否需要 查看评价 按钮
    // seeAssessment: {
    //   type: Boolean,
    //   value: false
    // },
    // //是否需要 立即评价 按钮
    // Assessment: {
    //   type: Boolean,
    //   value: false
    // },
    // //是否需要 我要提货 按钮
    // takeGood: {
    //   type: Boolean,
    //   value: false
    // }
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
    async handleDetail(e) {
      const { item } = e.currentTarget.dataset
      const body = {
        storeId: app.globalData.storeId,
        skuId: item.skuId,
        spuId: item.spuId
      }
      const res = await queryShopInfo(body)
      if(res.code) return
      wx.navigateTo({
        url: `/pages/goodsDetail/index?skuId=${item.skuId}&spuId=${item.spuId}`
      })
    }
  }
})
