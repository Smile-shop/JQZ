// pages/goodsCategory/category/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cateItems: {
      type: Object,
      value: {}
    },
    title: {
      type: String,
      value: null,
    },
    curNav: {
      type: String,
      value: null,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // cateItems,
    curIndex: 0,
    scrollTop: 0,
    scorllViewHeight: 0,
  },

  lifetimes: {
    ready() {
      this.createSelectorQuery().select('.nav_top').boundingClientRect(res => {
        this.setData({ scorllViewHeight: res.height })
      }).exec()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    toGoodsList(e) {
      const { detail } = e.currentTarget.dataset
      wx.navigateTo({
        url: `/pages/goodsList/index?cateIdLevel1=${detail.parentId}&cateIdLevel2=${detail.id}`,
      })
    },
    switchRightTab(e) {
      const offsetTop = e.target.offsetTop
      const scrollTop = offsetTop - this.data.scorllViewHeight / 2 + 50
      const { id, index, title } = e.target.dataset
      this.setData({
        curNav: id,
        curIndex: index
      })
      this.setData({ scrollTop, title })
    }
  }
})
