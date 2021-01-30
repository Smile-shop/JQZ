// components/sheet/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    range: {
      type: Array,
      value: [],
    },
    initPage: {
      type: Number,
      value: 1,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    pageNum: 1,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleClose: function() {
      console.log('关闭翻页', this.data.pageNum)
      this.triggerEvent('closePage')
    },
    confirm: function() {
      console.log('点击确定', this.data.pageNum)
      const pageNum = this.data.pageNum
      this.triggerEvent('confirmPage', {pageNum: pageNum})
    },
    onChange: function(e) {
      console.log('改变页码', e.detail.value)
      const page =  e.detail.value
      this.setData({
        pageNum: page,
      })
    },
  }
})
