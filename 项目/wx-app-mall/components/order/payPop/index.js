// pages/confirmOrder/payPop/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer(){
        this.setData({ passWordArr: [] })
      }
    },
    amount: {
      type: String,
      value: '0.00'
    },
    from: {
      type: String,
      value: 'order'
    },
    orderId: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    passWordArr: [],
    passWord: '',
    isFocus: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClose(){
      if (this.data.from !== 'order') {
        wx.redirectTo({
          url: `/pages/orderDetail/index?orderId=${this.data.orderId}`,
        })
      } else {
        this.setData({ show: false })
      }
    },
    focus(){
      this.setData({ isFocus: true, passWord: '' })
    },
    onChangeInput(e) {
      if (e.detail.value.length > 6) {
        return;
      }
      if(e.detail.value.length  == 6){
        this.triggerEvent('pay')
        this.setData({ isFocus: false })
      }
      if (e.detail.value.length > this.data.passWord.length) {
        this.data.passWordArr.push(true);
      } else if (e.detail.value.length < this.data.passWord.length) {
        this.data.passWordArr.pop();
      }
      this.setData({
        passWord: e.detail.value,
        passWordArr: this.data.passWordArr
      })
    },
  }
})
