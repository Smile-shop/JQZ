// components/confirm/index.js
Component({
  /**
   * 组件的属性列表
   */
  options:{
    multipleSlots: true
  },
  properties: {
    /**
     * 是否显示弹窗
     */
    show:{
      type: Boolean,
      value: false
    },
    /**
     * 标题内容
     */
    title: {
      type: [String, Number],
      value: '提示'
    },
    /**
     * 展示区域内容
     */
    content: {
      type: [String, Number],
      value: '确定删除这两种商品吗？'
    },
    /**
     * 是否使用自定义slot展示区域内容
     */
    slotContent: {
      type: Boolean,
      value: false
    },
    /**
     * 是否异步关闭弹窗，开启后需手动关闭
     */
    asyncClose: {
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
    onConfirm(){
      this.triggerEvent('confirm' || '')
      if(!this.data.asyncClose){
        this.setData({show: false})
      }
    },
    onClose(){
      this.triggerEvent('cancel')
      this.setData({show: false})
    }
  }
})
