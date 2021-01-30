// custom-tab-bar/index.js
Component({
  data: {
    active: 0,
    urls: [
      '/pages/home/index',
      '/pages/goodsCategory/index',
      '/pages/shoppingCart/index',
      '/pages/mine/index'
    ],
    globalStyle: '0'
  },

  methods: {
    onChange(event) {
      wx.switchTab({
        url: this.data.urls[event.detail]
      })
    }
  }
})