// pages/shoppingCart/index.js
// import {
//   Server
// } from '../../models/server.js'
import log from '../../../utils/log'
import { pageList } from './data'
const app = getApp();
// const server = new Server()
// var gs = require('../../utils/util.js');
Page({
  mixins: [require('../../../mixins/setColor.js')],
  /**
   * 页面的初始数据
   */
  data: {
    // 开始
    hasShoppingGoods: false,
    // hasShoppingGoods: pageList.length,
    isEditting: false,
    // shopppingCartList: [],
    pageList: pageList,
    dataLoading: true,
    modal: {
      show: false,
      content: '点击确认自动复制购物车清单链接，发送给批发商',
      data: null
    },
    shopppingCartListSort: '0',
    navbarData: {
      goback: true,
      gohome: true,
      title: '收藏夹',
      style: 1
    }
  },
  // 购物车编辑按钮
  editShopppingCart() {
    const isEditting = !this.data.isEditting
    this.setData({
      isEditting
    })
    if(!isEditting) {
      this.updateShoppingNumber()
    }
  },
  // 处理购物车商品后，更新购物车列表
  updateList() {
    this.getShoppingCartList(this.data.shopppingCartListSort)
    this.setData({
      isEditting: false
    })
  },
  // 获取购物车信息
  getShoppingCartList(sort) {
    const params = {
      sort,
      pageNum: 1,
      pageSize: 500
    }
    // server.getShoppingCartList(params).then(res => {
    //   const {
    //     list
    //   } = res.replyData
    //   const pageList = list.map(p => {
    //     return {
    //       id: p.id,
    //       count: p.count,
    //       code: p.code,
    //       stockNum: p.stockNum,
    //       name: p.name,
    //       goldWeight: p.goldWeight,
    //       mainStoneWeight: p.mainStoneWeight,
    //       mainStoneColor: p.mainStoneColor,
    //       mainStoneQuality: p.mainStoneQuality,
    //       handInch: p.handInch,
    //       credentials: p.credentials,
    //       orderedPrice: p.orderedPrice,
    //       photo: p.photo,
    //       largeCategory: p.largeCategory,
    //       productCodeId: p.productCodeId,
    //       productId: p.productId,
    //       isNullStock: p.isNullStock,
    //       valid: p.valid,
    //       proId: p.proId,
    //       storageType: p.storageType
    //     }
    //   })
    //   this.setData({
    //     hasShoppingGoods: list.length > 0,
    //     pageList
    //   })
    // })
  },
  // 购物车排序方式
  shopppingCartSort(e) {
    if (e.target.dataset.sort != this.data.shopppingCartListSort) {
      this.setData({
        shopppingCartListSort: e.target.dataset.sort,
        isEditting: false
      })
      this.getShoppingCartList(this.data.shopppingCartListSort)
    }
  },
  // 购物车价格排序
  shopppingCartSortPrice() {
    const sort = this.data.shopppingCartListSort === '2' ? '3' : '2'
    this.setData({
      shopppingCartListSort: sort,
      isEditting: false
    })
    this.getShoppingCartList(this.data.shopppingCartListSort)
  },

  onShow: function () {
    
    this.getShoppingCartList(this.data.shopppingCartListSort)
    this.setTabBarStyleAndsetNavigationBarColor(false, 2) 
  },

  shoppping() {
    wx.switchTab({
      url: '/pages/goodsCategory/index'
    })
  },
  // 分享
  shareLink(e) {
    // log('分享的数据', e.detail.length)
    const list = e.detail
    this.skipOrderNow(list)
    // const text = '点击确认自动复制购物车清单链接，发送给批发商'
    // this.setData({
    //   modal: {
    //     // show: true,
    //     show: false,
    //     content: '点击确认自动复制购物车清单链接，发送给批发商',
    //     data: e.detail
    //   }
    // })
    // wx.showModal({
    //   title: '',
    //   content: text,
    //   success: (res) => {
    //     if(res.confirm) {
    //       const options = {}
    //       options.detail = {}
    //       options.detail.type = true
    //       options.detail.data = this.data.modal.data
    //       this.modalbtnClick(options)
    //     }
    //   }
    // })
  },
  // 跳转至下单页
  skipOrderNow(list) {
    // log('被传递的数据', list)
    const order = JSON.stringify(list)
    wx.navigateTo({
      url: `/pages/confirmOrder/index?order=${order}`
    })
  },
  // 复制链接
  modalbtnClick(e) {
    // if (e.detail.type) {
    //   server.getDownloadUrl(e.detail.data).then(res => {
    //     wx.setClipboardData({
    //       data: res.data,
    //       success(res) {
    //         log('应该需要跳转至订单页面')
    //         wx.navigateTo({
    //           url: '/pages/mine/order/index'
    //         })
    //         wx.showToast({
    //           title: '链接已复制至剪切板',
    //           icon: 'none',
    //           duration: 2000
    //         })
    //       }
    //     })
    //   }).catch(err => {
    //     log(err)
    //   })
    // }
  },
  updateShoppingNumber() {
    let list = []
    if (this.data.shopppingCartListSort == '0') {
      if (this.selectComponent('#classify')) {
        list = this.selectComponent('#classify').computedShopppingCartCount()
      }
    } else {
      if (this.selectComponent('#irclassify')) {
        list = this.selectComponent('#irclassify').computedShopppingCartCount()
      }
    }
    // if (list.length > 0) {
    //   server.updateShoppingCart(list).then(res => {
    //     log(res)
    //   })
    // }
  },
  onLoad: function() {
    this.setData({
      globalStyle: getApp().globalData.globalStyle
    })
  },
  onHide: function() {
    this.updateShoppingNumber()
  }
})