// components/order/shopInfo/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list:{
      type: Array,
      value: []
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
    // 查看地图
    lookMap(e){
      const { latitude, longitude, shopName, address } = e.target.dataset.item
      if ( !latitude || !longitude){
        wx.showToast({
          title: '抱歉，商家未配置地图信息',
          icon: 'none'
        })
        return 
      }
      wx.openLocation({
        latitude,
        longitude,
        name: shopName,
        address,
        scale: 18
      })
    },
    // 进店看看
    look(e){
      const { data } = e.target.dataset
      app.globalData.storeId = data.id
      const userInfoAndStore = Object.assign({}, app.globalData.userInfoAndStore, { store: data })
      app.globalData.userInfoAndStore = userInfoAndStore
      // try { wx.setStorageSync('userInfoAndStore', userInfoAndStore) } catch (e) { }
      wx.reLaunch({
        url: '/pages/index/index?from=shop',
      })
    },
    // 店铺详情
    goDetail(e){
      console.log(e)
      const { id } = e.currentTarget.dataset.item
      wx.navigateTo({
        url: `/pages/shopDetails/index?storeId=${id}`,
      })
    },
    stop(){}
  }
})
