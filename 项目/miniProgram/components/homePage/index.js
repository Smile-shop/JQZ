// components/homePage/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pageData: {
      type: Object,
      value: null,
      observer: function(val) {
        this.computedData(val)
      }
    },
    type: {
      type: Boolean,
      value: true
    },
    globalStyle: {
      type: String,
      value: '0'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 轮播图
    showPicturesS: [],
    // 爆款
    hotGoods: null,
    // 推荐款
    recommendGoods: null,
    // 今日金价
    goldPriceList: [],
    // 骨架屏展示
    hasData: false,
    // globalStyle: getApp().globalData.globalStyle
    safeArea: getApp().globalData.safeArea
  },

  /**
   * 组件的方法列表
   */
  methods: {
    computedData(data) {
      const {
        goldPriceListVO,
        showPicturesS,
        recommendS,
        recommendProductVO1,
        recommendProductVO2,
        wholeSalePageSet
      } = data;
      wx.setNavigationBarTitle({
        title: (wholeSalePageSet && wholeSalePageSet.title) || '云展厅'
      })
      this.setData({
        goldPriceList: goldPriceListVO,
        showPicturesS,
        classifyImgList: recommendS.slice(0, 10),
        hotGoods: recommendProductVO1,
        recommendGoods: recommendProductVO2,
        hasData: true,
        globalStyle: getApp().globalData.globalStyle
      })
    },
    // 检查是否登录
    checkIsLogined() {
      return new Promise((resolve, reject) => {
        const customerInfo = wx.getStorageSync('customerInfo')
        if (customerInfo) {
          if (customerInfo.loginTime + 7 * 24 * 60 * 60 * 1000 < Date.now()) {
            console.log('登录时间超过一周')
            wx.removeStorageSync('customerInfo')
            reject()
          } else {
            resolve()
          }
        } else {
          reject()
        }
      })
    },

    isGoPageLogin(cb) {
      this.checkIsLogined().then(() => {
        cb()
      }).catch(() => {
        this.triggerEvent('toLogin')
      })
    },
    // 分类
    getClassifyDetail(e) {
      this.isGoPageLogin(() => {
        const classify = e.currentTarget.dataset.classify
        this.goPage({ l: classify.classIdentification, s: classify.subclassName })
      })
    },
    // 搜索框
    searchGoods() {
      this.isGoPageLogin(() => {
        wx.navigateTo({
          url: `/pages/search/index`
        })
      })
    },
    // 更多
    getMore(e) {
      this.isGoPageLogin(() => {
        this.goPage({ presenterName: e.target.dataset.name })
      })
    },
    // 轮播图详情
    getGoodsDetail(e) {
      this.isGoPageLogin(() => {
        const goods = e.target.dataset.swiper
        const url = goods.rederectUrl
        if (url) {
          if (goods.isNoJump != 1) {
            const paramsList = url.split(',')
            const params = {
              storageType: paramsList[1] || '',
              proId: paramsList[0] || ''
            }
            console.log(params)
            wx.navigateTo({
              url: '/pages/goodsDetail/index?detail=' + encodeURIComponent(JSON.stringify(params)),
              success: function(res) {
                console.log(res)
              }
            })
          }
        }
      })
    },
    // 商品详情
    goodsDetail(params) {
      this.isGoPageLogin(() => {
        wx.navigateTo({
          url: '/pages/goodsDetail/index?detail=' + encodeURIComponent(JSON.stringify(params.detail)),
          success: function (res) {
            console.log(res)
          }
        })
      })
    },

    // 进入商品列表页
    goPage(data) {
      const params = {
        presenterName: data.presenterName || '',
        l: data.l || '',
        s: data.s || '',
        q: data.q || '',
        t: data.t || '',
        h: data.h || '',
        c: data.c || '',
        m: data.m || ''
      }
      wx.navigateTo({
        url: '/pages/goodsList/index?id=' + encodeURIComponent(JSON.stringify(params))
      })
    }

  }
})