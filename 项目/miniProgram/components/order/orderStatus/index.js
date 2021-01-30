// components/order/orderStatus/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    mark: {
      type: Number,
      value: 0,
    },
    format: {
      type: Number,
      value: 0,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    gold: 1,
    statusImg: {
      '0': 'waiting', 
      '1': 'confirm', 
      '2': 'distributing', 
      '-1': 'cancel', 
      '3': 'finish',
      '-2': 'cancel',
    },
    titleText: {
      '0': '待确认',
      '1': '已确认',
      '2': '配货中',
      '-1': '已取消',
      '3': '已完成',
      '-2': '已取消',
    },
    orderTip: {
      '0': '您已提交订单，请耐心等待审核',
      '1': '您的订单已确认，我们将安排配货',
      '2': '您下单的商品正在配货哦，请耐心等待',
      '-1': '订单已取消，您可重新选择喜欢的商品',
      '3': '您的订单已完成',
      '-2': '订单已取消，您可重新选择喜欢的商品',
    },
    goldImg: {
      '0': 'waiting-gold', 
      '1': 'confirm-gold', 
      '2': 'distributing-gold', 
      '-1': 'cancel-gold', 
      '3': 'finish-gold',
      '-2': 'cancel-gold',
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
