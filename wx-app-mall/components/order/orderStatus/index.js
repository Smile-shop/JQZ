// components/order/orderStatus/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderDetail: {
      type: Object,
      value: {}
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
    statusInfo: {
      'NOTPAID': {
        icon: '/images/order-status0.png', 
        text: '待付款',
        tips: '您的订单尚未付款，请尽快支付'
      },
      'NOTSHIPPED': {
        icon: '/images/order-status1.png', 
        text: '待发货',
        tips: '正在为您准备商品，请耐心等待'
      },
      'SHIPPED': {
        icon: '/images/order-status2.png', 
        text: '待收货',
        tips: '家已发货，请等待收货'
      },
      'FINISHED': {
        icon: '/images/order-status3.png', 
        text: '已完成',
        tips: '订单已完成，感谢您的支持'
      },
      'CANCELED': {
        icon: '/images/order-status4.png', 
        text: '已取消',
        tips: '订单已取消，您可重新选择喜欢的商品'
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
