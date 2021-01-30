// pages/confirmOrder/remark/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    remark: {
      type: String,
      value: '',
      observer(value){
        this.setData({ value })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    value: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取input值
    change(e){
      this.setData({value: e.detail})
      this.triggerEvent("blur", { remark: e.detail })
    }
  }
})
