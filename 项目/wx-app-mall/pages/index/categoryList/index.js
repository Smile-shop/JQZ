// pages/index/categoryList/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    categoryList: {
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
    // 跳转到轮分类导航绑定的相应商品或者分类列表
    getClassifyDetail(e){
      const { item } = e.currentTarget.dataset
      if (item && item.redirectKind === 'URL' && item.url){
        if(item.url.indexOf('https') != -1){
          wx.navigateTo({
            url: `/pages/webView/index?url=${item.url}`,
          })
        }else{
          wx.navigateTo({
            url: item.url,
          })
        }
      }else if (item && item.redirectKind === 'CATE'){
        wx.navigateTo({
          url: `/pages/goodsList/index?cateIdLevel1=${item.cateIdLevel1}&cateIdLevel2=${item.cateIdLevel2}`,
        })
      }
    }
  }
})
