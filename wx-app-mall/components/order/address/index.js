// components/order/address/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 物流信息
     */
    logistics:{
      type: Array,
      value: {},
      observer(val){
        if(val.length){
          this.setData({logisticsIsEmpty: false})
        }else{
          this.setData({logisticsIsEmpty: true})
        }
      }
    },
    /**
     * 地址信息
     */
    address: {
      type: Object,
      type: {},
      observer(val){
        if(Object.keys(val).length){
          this.setData({addressIsEmty: false})
        }else{
          this.setData({addressIsEmty: true})
        }
      }
    },
    /**
     * 是否从订单确认页面过来
     */
    fromOrder: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    logisticsIsEmpty: true,
    addressIsEmty: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getLogisticsDetail(){
      wx.navigateTo({
        url: '/pages/logisticsDetail/index',
      })
    },
    chooseAddress(){
      if(this.data.fromOrder){
        this.triggerEvent('saveMessage')
        wx.navigateTo({
          url: '/pages/shoppingAddress/index?order=0',
        })
      }
    }
  }
})
