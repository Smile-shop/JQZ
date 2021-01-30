// pages/confirmOrder/couponsPopup/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 弹窗显示控制
     */
    showCoupon: {
      type: Boolean,
      value: false,
      observer(){
        setTimeout(() => {
          this.selectComponent("#tabs").setLine()
        }, 100)
      }
    },
    /**
     * 优惠券数据
     */
    itemList: {
      type: Array,
      value: [],
      observer(n){
        // console.log(n)
      }
    },
    emptyTop: {
      type: String,
      value: '0'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    active: 0,
    tabs: [{name: '可用优惠券'}, {name: '不可用优惠券'}],
    selectedCoupon: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 关闭优惠券弹窗
    onClose(){
      this.setData({showCoupon: false})
    },
    // 切换tabs
    onChange(val){
      const { index } = val.detail
    },
    // 勾选优惠券
    changeCheckBox(e){
      this.setData({selectedCoupon: e.detail.item})
    },
    // 确定选择优惠券
    save(){
      this.setData({showCoupon: false})
      this.triggerEvent('seleted', {item: this.data.selectedCoupon})
    }
  }
})
