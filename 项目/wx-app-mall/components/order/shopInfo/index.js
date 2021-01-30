// components/order/shopInfo/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    message:{
      type: Object,
      value: {
        shopName: "金千枝翠竹店",
        tel: "0755-88888888",
        address: '深圳市罗湖区文锦广场A座17层',
        distance: "569"
      }
    },
    /**
     * showType 是否为门店自提
     * true: 门店 false: 快递
     */
    showType: {
      type: Boolean,
      value: false
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
