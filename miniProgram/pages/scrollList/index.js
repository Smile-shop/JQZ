// pages/scrollList/index.js
import { Server } from '../../models/server'

let ajax = new Server()

import Toast from '../../vant-weapp/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    formatStyle: {
      '0': 'diamand', // 钻石版
      '1': 'gold', // 黄金版
    },
    successTip: false, // 添加购物车成功
    successTipText: '', // 添加成功显示文案
    successTipMsg: '添加成功，在购物车等亲～', // 成功文案
    cacheId: null, 
    shoppingTime: new Date().getTime(),
    delayAdd: 2100,
    freezePage: false,
    list: [],
    pageNum: 0,
    pageSize: 10,
    total: null,
    moreText: '',
    emptyMsg: '请选择首饰',
    message: '添加成功',
    checked: false,
    priceText: {
      ascending: {
        text: '',
        checked: true
      },
      descending: {
        text: '',
        checked: false
      }
    },
    footerText : {
      more: '点击加载更多…',
      nomore: '别扯了，没有更多了',
      loading: '加载中'
    },
    initSelected: 1,
    globalStyle: getApp().globalData.globalStyle
  },

  // 正确返回
  requestBack: function(res) {
    let result = false
    const successCode = 0
    const { code } = res 
    
    if (successCode === code) {
      result = true
    }

    return result
  },

  // 错误返回
  requestError: function(res) {
    // 根据需求操作
  },

  // 请求
  request: function(params)  {
    const {options, name, loading} = params
    return new Promise((resolve) => {
      ajax[name](options, loading).then((res) => {
        const result = this.requestBack(res)
        if (result) {
          return resolve(res)
        }
      }).catch(err => {
        this.requestError(err)
      })
    })
  },

  // 统一请求接口
  requestApi: function(name) {
    const methods =  {}

    methods[name] = (options) => {
      return this.request(options)
    }

    return methods
  },

  // 全选算法
  allAlgorithm: function(state) {
    const list = this.data.list
    const initSelected = this.data.initSelected
    if(state) {
      const result = list.map(item => {
        item.single = state
        return item 
      })
      this.setData({
        list: result
      })
    } else {
      const result = list.map(item => {
        item.selected = initSelected
        item.single = state
        return item 
      })
      this.setData({
        list: result
      })
    }
  },

  // 二级全选(选中、取消)
  selectedAll: function() {
    const checked = this.data.checked
    if(checked) {
      this.setData({
        checked: false
      })
      this.allAlgorithm(false)
    } else {
      this.setData({
        checked: true
      })
      this.allAlgorithm(true)
    }
  },

  // 全选情况
  selectedAllCase: function() {
    const len = this.data.list.length 
    const goodsMore = this.data.list
    const result = []
    goodsMore.map(item => {
      if(item.single) {
        result.push(item)
      }
    })
    const selected = result.length
    if(len === selected) {
      this.setData({
        checked: true
      }) 
    } else {
      this.setData({
        checked: false
      })
    }
  },

  // 二级单选
  handleSingleIcon: function(e) {
    const { productCodeId, single } = e.currentTarget.dataset.single
    const goodsMore = this.data.list
    const result = goodsMore.map(item => {
      if( item.productCodeId === productCodeId && single) {
        item.single = false
      } else if(item.productCodeId === productCodeId && !single) {
        item.single = true
      }
      return item 
    })

    this.setData({
      list: result
    })
    this.selectedAllCase()
  },

  // 二级价格排序
  handleSort: function() {
    const sort = this.data.priceText
    const id = this.data.cacheId

    // 文字取反
    sort.ascending.checked = !sort.ascending.checked
    sort.descending.checked = !sort.descending.checked
    this.setData({
      priceText: sort
    })

    //请求排序数据
    this.sortRequest()
  },

  // 滚动加载更多
  getList: function() {
    const freezePage = this.data.freezePage
    // 冻结页面
    if (freezePage) {
      return 
    }

    const sort = this.data.priceText
    const sortNum = sort.ascending.checked ? 1 : 2 // 1 升序 2 降序
    const id = this.data.cacheId
    const pageNum = this.data.pageNum + 1
    const pageSize = this.data.pageSize
    const len = this.data.list.length
    const total = this.data.total
    if(len >= total) {
      return 
    }
    const data = {
      sort: sortNum,
      productId: id,
    }
    const page = {
      pageNum: pageNum,
      pageSize: pageSize,
    }
    const params = {
      data: data,
      page: page,
    }
    this.setData({
      freezePage: true
    })
    const api = 'getGoodsMoreType'
    const moreType = this.requestApi(api)
    const combination = {
      options: params,
      name: api, 
    }
    moreType[api](combination).then(res => {
      const { replyData } = res
      const { list, pageNum, total } = replyData
      const initSelected = this.data.initSelected
      const checked = this.data.checked
      const allChecked = checked ? true : false
      //添加选与不选
      const result = list.map(item => {
        item.selected = initSelected
        item.single = allChecked
        return item 
      })
      const oldList = this.data.list
      const totalList = oldList.concat(result)
      const footerText = this.data.footerText
      this.setData({
        list: totalList,
        pageNum: pageNum,
        freezePage: false,
      })
      const len = oldList.length 
      if(total > (len + result.length)) {
        this.setData({
          moreText: footerText. more
        })
      } else {
        this.setData({
          moreText: footerText.nomore
        })
      }
    })
  },

  // 点击排序请求
  sortRequest: function() {
    const sort = this.data.priceText
    const sortNum = sort.ascending.checked ? 1 : 2 // 1、升序 2、降序
    const pageNum = 1
    const pageSize = 10
    const id = this.data.cacheId
    const data = {
      sort: sortNum,
      productId: id,
    }
    const page = {
      pageNum: pageNum,
      pageSize: pageSize,
    }
    const params = {
      data: data,
      page: page,
    }
    const api = 'getGoodsMoreType'
    const moreTye = this.requestApi(api)
    const combination = {
      options: params,
      name: api, 
    }
    moreTye[api](combination).then(res => {
      const { replyData } = res 
      const { list, pageNum, total } = replyData
      const initSelected = this.data.initSelected
      const result = list.map(item => {
        item.selected = initSelected
        item.single = false
        return item 
      })

      const len = result.length
      const footerText = this.data.footerText
      if(total > len) {
        this.setData({
          moreText: footerText.more
        })
      } else {
        this.setData({
          moreText: footerText.nomore
        })
      }

      this.setData({
        list: result,
        pageNum: pageNum,
        checked: false,
      })

    })
  },

  // 防抖
  delayRunFunc: function(options) {
    const {time, callback} = options
    setTimeout(() => {
      callback()
    }, time)
  },

  // 滚动加载更多
  loadMore: function() {
    const params = {
      time: 50,
      callback: this.getList,
    }
    this.delayRunFunc(params)
  },

  // 计算分页或排序
  calcPageSort: function(id) {
    const obj = {}
    const sort = this.data.priceText
    const sortNum = sort.ascending.checked ? 1 : 2 // 1 升序 2 降序
    const pageNum = this.data.pageNum > 1 ? this.data.pageNum : 1
    const pageSize = this.data.pageSize > 1 ? this.data.pageSize : 20
    const data = {
      sort: sortNum,
      productId: id,
    }
    const page = {
      pageNum: pageNum,
      pageSize: pageSize,
    }
    obj.data = data
    obj.page = page
    return obj 
  },

  // 冻结页面
  freezePageFunc: function(value) {
    this.setData({
      freezePage: value
    })
  },

  // 初次请求
  initRequest: function(id) {
    const freezePage = this.data.freezePage
    if (freezePage) {
      return 
    }
    const { data, page } = this.calcPageSort(id)
    const params = {
      data: data,
      page: page,
    }
    this.freezePageFunc(true)
    const api = 'getGoodsMoreType'
    const moreType = this.requestApi(api)
    const combination = {
      options: params, 
      name: api, 
    }
    moreType[api](combination).then(res => {
      const { replyData } = res
      const { total, list, pageNum, pageSize } = replyData
      const oldList = this.data.list
      const initSelected = this.data.initSelected
      const result = list.map(item => {
        item.selected = initSelected
        item.single = false
        return item 
      })

      const len = result.length
      const footerText = this.data.footerText
      if(total > (len + oldList.length)) {
        this.setData({
          moreText: footerText.more
        })
      } else {
        this.setData({
          moreText: footerText.nomore
        })
      }

      const totalList = oldList.concat(result)
      this.setData({
        list: totalList,
        pageNum: pageNum,
        pageSize: pageSize,
        total: total
      })
      this.freezePageFunc(false)
    })
  },

  // 改变二级数量列表
  handleOnChange: function(e) {
    const count = e.detail
    const {productCodeId, selected} = e.currentTarget.dataset.detail

    const goodsMore = this.data.list
    const result = goodsMore.map(item => {
      if(item.productCodeId === productCodeId) {
        item.selected = count
        item.single = true
      }
      return item 
    })

    this.setData({
      list: result
    })
    this.selectedAllCase()
  },

  // 添加成功提示
  addSuccess: function(message, time = 2000) {
    this.setData({
      successTip: true,
      successTipText: message,
    })

    setTimeout(() => {
      this.setData({
        successTip: false
      })
    }, time)
  },

  // 点击添加购物车或立即下单
  handleCart: function(e) {
    console.log('点击购物按钮', e)
    const region = e.target.id
    const cart = 'shopcart'
    const order = 'order'
    if (region === cart) {
      this.shopCart()
    } else if (region === order) {
      this.orderNow()
    }
  },

  // 立即下单
  orderNow: function() {
    console.log('立即下单按钮')
    // 1. 立即下单至待确认订单
    // 2. 跳转至待确认订单
    this.sendWaitingOrder()
  },

  // 判断是否选中首饰
  judgmentJwerlry() {
    const result = []
    const id = this.data.cacheId
    const shoppingTime = this.data.shoppingTime
    const delayAdd = this.data.delayAdd
    const time = new Date().getTime()
    let outcome = false
    this.data.list.map(item => {
      if(item.single) {
        let snap = {}
        snap.productCodeId = item.productCodeId
        snap.count = item.selected
        result.push(snap)
      }
    })
    if (result.length < 1) {
      outcome = true
    }
    return outcome
  },

  // 格式化提交订单参数
  formatOrderArgs() {
    const list = this.data.list
    console.log('格式化订单参数', list)
    const result = []
    list.map(item => {
      if (item.single) {
        let params = {}
        params.id = null
        params.count = item.selected || 1
        params.code = item.productCodeId
        params.stockNum = item.stockNum
        result.push(params)
      }
    })
    return result
  },

  // 立即下单提交
  sendWaitingOrder() {
    const flag = this.judgmentJwerlry()
    const message = this.data.emptyMsg
    if (flag) {
      this.warningTip(message)
      return 
    }
    const params = this.formatOrderArgs()
    this.skipWaitingOrder(params)
  },

  // 跳转至备注订单
  skipWaitingOrder(list) {
    const order = JSON.stringify(list)
    wx.navigateTo({
      url: `/pages/writeOrder/index?order=${order}`
    })
  },

  // 二级弹框添加购物车
  shopCart: function() {
    const result = []
    const id = this.data.cacheId
    const shoppingTime = this.data.shoppingTime
    const delayAdd = this.data.delayAdd
    const time = new Date().getTime()
    this.data.list.map(item => {
      if(item.single) {
        let snap = {}
        snap.productCodeId = item.productCodeId
        snap.count = item.selected
        result.push(snap)
      }
    })
    const params = {
      productId: id,
      list: result
    }
    const remainder = time - shoppingTime 
    if(result.length > 0) {
      if(remainder < delayAdd) {
        return // 间隔
      }
      const api = 'postCartAdd'
      const addCart = this.requestApi(api)
      const combination = {
        options: params,
        name: api, 
        loading: false,
      }
      addCart[api](combination).then(res => {
        const successMsg = this.data.successTipMsg
        const successMark = 0
        const { code } = res
        if(code === successMark) {
          this.setData({
            shoppingTime: time 
          })
          this.addSuccess(successMsg)
        }
      })
    } else {
      const message = this.data.emptyMsg
      this.warningTip(message)
    }
  },

  // 未选中提示
  warningTip: function (message) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000,
    })
  },

  // 修改头部文字
  changeTitle: function(name) {
    wx.setNavigationBarTitle({
      title: name
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {id, name} = options
    this.initRequest(id)
    this.changeTitle(name)
    this.setData({
      cacheId: id
    })
    this.setData({
      globalStyle: getApp().globalData.globalStyle
    })
  }
})