// pages/confirmOrder/tabs/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
      value: [],
      observer(val){
        if(val.length === 1){
          this.triggerEvent("change", { parmName: this.data.tabs[0].parmName })
          this.setData({ active: 0 })
        }else if(val.length === 2){
          this.triggerEvent("change", { parmName: this.data.tabs[1].parmName })
          this.setData({ active: 1 })
        }
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    active: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 改变收货方式
    onChange(e){
      const { active } = e.target.dataset
      if(!active) {
        return wx.showToast({
          title: '目前仅支持快递配送',
          icon: 'none'
        })
      }
      this.setData({ active })
      this.triggerEvent("change", { parmName: this.data.tabs[active].parmName })
    }
  }
})
