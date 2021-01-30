// components/local/goodsEvaluate/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dataList: {
      type: Number,
      value: 3
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgList: [
      "http://120.78.133.68/LocalUser/7015/Jewel/FC013[1].jpg",
      "http://120.78.133.68/LocalUser/7015/Jewel/FC013[1].jpg",
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //预览图片，放大预览
    preview(event) {
      console.log(event.currentTarget.dataset.src)
      let currentUrl = event.currentTarget.dataset.src
      wx.previewImage({
        current: currentUrl, // 当前显示图片的http链接
        urls: this.data.imgList // 需要预览的图片http链接列表
      })
    }
  }
})
