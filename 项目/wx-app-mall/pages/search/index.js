const { values } = require('../../utils/filterApi.js')
import log from '../../utils/log'

// pages/search/index.js
let searched = null
let clear = null 
let timer = null
Page({
  mixins: [require('../../mixins/setColor.js')],
  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    show: false,
    historySearchList: [],
    fuzzySearchList: [],
    globalStyle: getApp().globalData.globalStyle,
  },

  onShow: function () {
    this.updateHistorySearchList()
    this.setData({
      globalStyle: getApp().globalData.globalStyle
    })
  },

  onUnload: function () {
    clearTimeout(searched)
    clearTimeout(clear)
  },

  clearInput() {
    ('清空这里的文字')
    clear = setTimeout(() => {
      this.data.inputValue = ''
      this.setData({
        inputValue: ''
      })
      clearTimeout(clear)
    }, 100)
  },

  updateHistorySearchList() {
    const historySearchList = wx.getStorageSync('historySearch')
    if (historySearchList.length > 0) {
      let list = historySearchList.reverse()
      // 历史记录最多保留15个
      if (list.length > 15) {
        list = list.slice(0, 15)
        wx.setStorage({
          key: 'historySearch',
          data: list.reverse()
        })
      }
      this.setData({
        historySearchList: list
      })
    }
  },

  removeConfirm() {
    this.setData({
      show: true
    })
  },

  closeMask() {
    this.setData({
      show: false
    })
  },

  removeSearchHistory() {
    this.closeMask()
    const _this = this;
    wx.removeStorage({
      key: 'historySearch',
      success() {
        _this.setData({
          historySearchList: []
        })
      }
    })
  },

  bindKeyInput(e) {
    log(e.detail)
    const value = e.detail.value ? e.detail.value.trim() : ''
    log('文字', value)
    const inputValue = value.replace(/[\r\n]/g," ")
    this.setData({
      inputValue: inputValue
    })
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      this.fuzzySearch(value)
      clearTimeout(timer)
    }, 500)
  },
  fuzzySearch(value) {
    // serverserver.fuzzySearch(value).then(res => {
    //   const {
    //     replyData
    //   } = res
    //   this.setData({
    //     fuzzySearchList: this.computedfuzzySearchList(replyData, value)
    //   })
    // })
  },
  computedfuzzySearchList(list, name) {
    return list.map(p => {
      const nameSplitList = p.split('')
      return {
        name: p,
        list: nameSplitList
      }
    })
  },
  fuzzySearchMethods(e) {
    if (e.target.dataset.text) {
      this.search(e.target.dataset.text)
    } else {
      log('搜索参数有误')
    }
  },
  searchMethods() {
    searched = setTimeout(() => {
      const searchText = this.data.inputValue
      if (searchText) {
        clearTimeout(searched)
        this.search(searchText)
      } else {
        wx.showToast({
          title: '请输入内容',
          icon: 'none',
          duration: 2000
        })
      }
    }, 60)
  },
  historySearchMethods(e) {
    if (e.target.dataset.history) {
      this.search(e.target.dataset.history.text)
    } else {
      log('搜索参数有误')
    }
  },
  search(value) {
    const historySearchList = wx.getStorageSync('historySearch') || []
    const isHistorySearchInclude = historySearchList.findIndex((element) => element.text == value) > -1
    if (!isHistorySearchInclude) {
      historySearchList.push({
        text: value
      })
    }
    wx.setStorage({
      key: 'historySearch',
      data: historySearchList
    })
    // 页面跳转
    const _this = this
    const params = {
      l: '',
      s: '',
      q: '',
      t: value,
      h: '',
      c: '',
      m: ''
    }
    const pagesList = getCurrentPages()
    const page = pagesList[pagesList.length - 2] && pagesList[pagesList.length - 2].route
    if (page == 'pages/home/index') {
      wx.navigateTo({
        // url: '/pages/goodsList/index?title=' + encodeURIComponent(JSON.stringify(params)),
        url: '/pages/goodsList/index?title=' + encodeURIComponent(value),
        success: function (res) {
          _this.updateHistorySearchList()
        }
      })
    } else {
      wx.redirectTo({
        // url: '/pages/goodsList/index?title=' + encodeURIComponent(JSON.stringify(params)),
        url: '/pages/goodsList/index?title=' + encodeURIComponent(value),
        success: function (res) {
          _this.updateHistorySearchList()
        }
      })
    }
  }
})