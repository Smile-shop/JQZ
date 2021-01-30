// pages/search/index.js
let timer = null

import {
  Server
} from '../../models/server.js'

let server = new Server()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    historySearchList: [],
    fuzzySearchList: [],
    globalStyle: getApp().globalData.globalStyle
  },

  onShow: function () {
    this.updateHistorySearchList()
    this.setData({
      globalStyle: getApp().globalData.globalStyle
    })
  },

  clearInput() {
    this.setData({
      inputValue: ''
    })
  },

  updateHistorySearchList() {
    const historySearchList = wx.getStorageSync('historySearch')
    if (historySearchList.length > 0) {
      let list = historySearchList.reverse()
      // 历史记录最多保留20个
      if (list.length > 20) {
        list = list.slice(0, 20)
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

  removeSearchHistory() {
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
    const value = e.detail.value.trim()
    this.setData({
      inputValue: value
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
    server.fuzzySearch(value).then(res => {
      const {
        replyData
      } = res
      this.setData({
        fuzzySearchList: this.computedfuzzySearchList(replyData, value)
      })
    })
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
      console.log('搜索参数有误')
    }
  },
  searchMethods() {
    const searchText = this.data.inputValue
    if (searchText) {
      this.search(searchText)    
    } else {
      wx.showToast({
        title: '请输入内容',
        icon: 'none',
        duration: 2000
      })
    }
  },
  historySearchMethods(e) {
    if (e.target.dataset.history) {
      this.search(e.target.dataset.history.text)
    } else {
      console.log('搜索参数有误')
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
        url: '/pages/goodsList/index?id=' + encodeURIComponent(JSON.stringify(params)),
        success: function (res) {
          _this.updateHistorySearchList()
        }
      })
    } else {
      wx.redirectTo({
        url: '/pages/goodsList/index?id=' + encodeURIComponent(JSON.stringify(params)),
        success: function (res) {
          _this.updateHistorySearchList()
        }
      })
    }
  }
})