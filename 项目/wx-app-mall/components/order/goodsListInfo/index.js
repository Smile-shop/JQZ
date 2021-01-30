// components/order/goodsList/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list:{
      type: Array,
      value: [],
      observer(val){
        // console.log(val)
      }
    },
    fromOrder: {
      type: Boolean,
      value: false
    },
    info: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    storeName: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleDetail(){
      this.triggerEvent('handleDetail')
      console.log(app.globalData)
    }
  }
})
