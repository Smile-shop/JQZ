// components/order/confirm/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    form: {
      type: String,
      value: '0',
    },
    writeNum: {
      type: Number,
      value: 0,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    formatStyle: {
      '0': 'diamand', // 钻石版
      '1': 'gold', // 黄金版
    },
    noteInfo: '',
    max: 50,
    maxInfo: '最多能输入50个字',
    showMaxInfo: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    wirteInput: function(e) {
      console.log('备注', e.detail.value)
      const len = this.data.noteInfo.length
      const max = this.data.max
      const val = e.detail.value
      this.setData({
        noteInfo: val,
      })
      
      this.triggerEvent('wirteInput', this.data.noteInfo)
    },
    handleCancel: function() {
      console.log('不想取消订单')
      this.triggerEvent('hiddenMask')
    },
    handleConfirm: function() {
      console.log('确定取消订单', this.data.noteInfo)
      this.triggerEvent('cancelOrder', {note: this.data.note})
    }
  }
})
