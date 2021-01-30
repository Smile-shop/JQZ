// custom-tab-bar/index.js
const app = getApp()
Component({
  data: {
    active: 0,
    urls: [
      '/pages/index/index',
      '/pages/goodsCategory/index',
      '/pages/shoppingCart/index',
      '/pages/shop/index',
      '/pages/my/index',
    ],
    globalStyle: '0'
  },
  lifetimes: {
    created(){
      const globalStyle = app.globalData.globalStyle
      this.setData({ globalStyle })
    }
  },
  methods: {
    onChange(event) {
      wx.switchTab({
        url: this.data.urls[event.detail]
      })
    }
  }
})