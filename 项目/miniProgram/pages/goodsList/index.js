// pages/goodsList/index.js
var app = getApp();

import { Server } from '../../models/server'

let ajax = new Server()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    MainMenus: {
      '002': 'largeCategoryJewelryLabel', // 首饰大类
      'CTYPE': 'smallCategoryJewelryLabel', // 饰品大类
      'JWP': 'categoryLabel', // 首饰类别
      'JRTYPE': 'largeCategoryAccessLabel', // 首饰小类
      'PFT': 'smallCategoryAccessLabel', // 饰品小类
      'GCT': 'qualityLabel',
      'STN': 'mainStoneQualityLabel',
      'STC': 'mainStoneColorLabel',
      'GFN': 'goldQualityLabel',
      'STP': 'mainStoneNameLabel', // 主石名称
      'STS': 'mainStoneColorLabel',
      'STL': 'mainCutLabel',
      'STZ': 'mainClawLabel',
      'GDSR': 'jewelrySeriesLabel', // 首饰系列
      'GDSSR': 'styleSeriesLabel', // 款式系列
      'JLOGO': 'brandLabel',
      'GDSPROC': 'technologyLabel',
      'ZJTYPE': 'hotCategoryLabel',
      'JLOGO': 'brandLabel',
      'SALEPRICE': 'salePrice', // 售价
      'GOLDWET': 'goldWet', // 金重
      'MAINSTNWET': 'mainStonWet', // 主石重
      'HANDSIZE': 'handleSize', // 手寸
      'MAINSTNNUM': 'mainStonNum', // 主石粒数
      'SUBSTNNUM': 'subStonNum', // 副石粒数
      'SUBSTNWET': 'subStonWet', // 副石重量
      'ONUPTIME': 'onUpTime', // 上架时间
    },
    globalStyle: getApp().globalData.globalStyle,
    countInPage: 0, // 进入页面计数器
    freezePage: false, // 滑动中不能点击
    shoppingOnce: new Date().getTime(), 
    shoppingGap: 2000, 
    cache: {},
    path: 'path',
    initSelected: 1,
    sort: true,
    selectedItem: 1,
    isGroup: false,
    mulitName: '',
    mulitId: '',
    show: '',
    mask: '',
    maxNumber: 500, 
    miniNumber: 1,
    checked: false,
    searchText: '',
    cutover: {
      item: 'new',
      status: false,
    }, 
    empty: false,
    message: '添加成功',
    nullTip: '请选中商品后添加',
    childrenText: {
      nodata: '暂无数据～',
      more: '点击加载更多…',
      nomore: '别扯了，没有更多了',
      icon: '../../images/EmptyState.png',
      loading: '加载中'
    },
    priceText: {
      ascending: {
        text: '由低到高',
        checked: true
      },
      descending: {
        text: '由高到低',
        checked: false
      }
    },
    cartName: '加入购物车',
    moreText: '暂无数据',
    mainText: '暂无数据',
    mainPageNum: 0,
    mainTotal: 0,
    childrenPageNum: 0,
    childrenTotal: 0,
    pageSize: 10,
    goodsMore: [],
    goodsList: [],
    selectedCase: {
      new: 1,
      hot: 2,
      select: 4,
    }
  },

  // 正确返回
  requestBack: function(res) {
    let result = false
    const successCode = 0
    const { code } = res 
    if (code === successCode) {
      result = true
    }

    return result
  },

  // 错误返回
  requestError: function(res) {
    // do something
  },

  // 请求
  request: function(params) {
    const {options, name, loading} = params
    return new Promise((resolve) => {
      ajax[name](options, loading).then(res => {
        const result = this.requestBack(res)
        if (result) {
          return resolve(res)
        }
      }).catch(err => {
        this.requestError(err)
      })
    })
  },

  // 方法
  requestApi: function(name) {
    const methods = {}

    methods[name] = (options) => {
      return this.request(options)
    }

    return methods
  },

  // 跳转详情页
  detail: function(e) {
    const detail = JSON.stringify(e.currentTarget.dataset.detail)
    wx.navigateTo({
      url: `/pages/goodsDetail/index?detail=${detail}`,
    })
  },

  // 添加成功提示
  addSuccess: function(message) {
    wx.showToast({
      title: message,
      icon: 'success',
      duration: 2000
    })
  },

  // 未选中提示
  warningTip: function(message) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000,
    })
  },

  // 查询购物车情况
  getShoppingCart: function(options) {
    const {
      id, 
      storageType,
      isQueryOtherSign,
    } = options
    const params = {
      storageType: storageType,
      id: id,
      isQueryOtherSign: isQueryOtherSign,
    }
    const api = 'getGoodsDetail'
    const goodsDetail = this.requestApi(api)
    const combination = {
      options: params, 
      name: api,
    }
    return goodsDetail[api](combination)
  },

  // 跳转详情
  switchDetail: function(options) {
    const {proId, name} = options
    wx.navigateTo({
      url: `/pages/scrollList/index?id=${proId}&name=${name}`,
    })
  },

  // 点击购物车
  callCart: function(e) {
    // 1. 添加购物车 2、查询更多列表
    // isQueryOtherSign 查询单品或多品、必须传 1
    const add = 0 // 0、不查询 1、查询更多
    const {proId, name, storageType} = e.currentTarget.dataset.info
    const params = {
      storageType: storageType,
      id: proId,
      isQueryOtherSign: 1,
    }
    const skip = {
      proId: proId,
      name: name
    }
    this.getShoppingCart(params).then(res => {
      const { isQueryOther } = res.replyData.jewelryParams
      if( isQueryOther === add ) {
        this.postCartAdd(proId)
      } else {
        this.switchDetail(skip)
      }
    })
  },

  // 全选算法
  allAlgorithm: function(state) {
    const list = this.data.goodsMore
    const init = this.data.initSelected
    if(state) {
      const result = list.map(item => {
        item.single = state
        return item 
      })
      this.setData({
        goodsMore: result
      })
    } else {
      const result = list.map(item => {
        item.single = state
        item.selected = init
        return item 
      })
      this.setData({
        goodsMore: result
      })
    }
  },

  // 二级框全选
  selectedAll: function() {
    const checked = this.data.checked
    this.setData({
      checked: !checked
    })
    this.allAlgorithm(!checked)
  },

  // 添加购物车接口
  postCartAddApi: function(params) {
    const api = 'postCartAdd'
    const combination = {
      options: params,
      name: api, 
    }
    const addCart = this.requestApi(api)
    return addCart[api](combination)
  },

  // 二级弹框添加购物车
  handleCart: function() {
    const result = []
    const id = this.data.mulitId
    this.data.goodsMore.map(item => {
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
    if(result.length > 0) {
        this.postCartAddApi(params).then(res => {
        const successMsg = this.data.message
        const successMark = 0
        const { code } = res
        if(code === successMark) {
          this.addSuccess(successMsg)
        }
      })
    } else {
      const message = this.data.nullTip
      this.warningTip(message)
    }
  },

  // 二级价格排序
  handleSort: function(e) {
    const sort = e.currentTarget.dataset.text
    const goodsMore = this.data.goodsMore

    // 排序取反
    const result = goodsMore.reverse()
    this.setData({
      goodsMore: result
    })

   // 文字取反
    sort.ascending.checked = !sort.ascending.checked
    sort.descending.checked = !sort.descending.checked
    this.setData({
      priceText: sort
    })
  },

  // 全选条件
  selectedAllCase: function() {
    const len = this.data.goodsMore.length
    let num = 0
    this.data.goodsMore.map(item => {
      if(item.single) {
        num++
      }
    })

    if(len === num) {
      this.setData({
        checked: true
      })
    } else {
      this.setData({
        checked: false
      })
    }
  },

  // 改变二级数量列表
  handleOnChange: function(e) {
    const count = e.detail
    const {productCodeId, selected} = e.currentTarget.dataset.detail

    const goodsMore = this.data.goodsMore
    const result = goodsMore.map(item => {
      if(item.productCodeId === productCodeId) {
        item.selected = count
        item.single = true
      }
      return item 
    })

    this.setData({
      goodsMore: result
    })
    this.selectedAllCase()
  },

  // 二级添加数量
  handleAdd: function(e) {
    const goodsMore = this.data.goodsMore
    const id = e.currentTarget.dataset.detail.productCodeId
    const maxNumber = this.data.maxNumber
    const result = goodsMore.map(item => {
      if(item.productCodeId === id && item.selected < maxNumber) {
        item.selected ++
        item.single = true
      }
      return item 
    })
    this.setData({
      goodsMore: result
    })
    this.selectedAllCase()
  },

  // 二级减少数量
  handleReduce: function(e) {
    const goodsMore = this.data.goodsMore
    const id = e.currentTarget.dataset.detail.productCodeId
    const miniNumber = this.data.miniNumber
    const flag = 0
    const result = goodsMore.map(item => {
      if(item.productCodeId === id && item.selected > miniNumber) {
        item.selected --
      }
      if(item.selected === flag) {
        item.single = false
      }
      return item 
    })
    this.setData({
      goodsMore: result
    })
    this.selectedAllCase()
  },

  // 选中或取消一个
  handleSingleIcon: function(e) {
    const id = e.currentTarget.dataset.single.productCodeId
    const result = this.data.goodsMore.map(item => {
      if(item.productCodeId === id && item.single === false) {
        item.single = true
      } else if(item.productCodeId === id && item.single === true) {
        item.single = false
        item.selected = 1
      }
      return item 
    })
    this.setData({
      goodsMore: result
    })
    this.selectedAllCase()
  },

  // 初次查看更多类型
  getGoodsMore: function(options) {
    const { id } = options
    const squence = this.data.priceText
    let ascending = 0 //  0、升序 1、 降序
    if(!squence.ascending.checked) {
      ascending = 1
    }
    const childrenPageNum = 1
    const pageSize = this.data.pageSize
    const childrenText = this.data.childrenText
    // loading
    this.setData({
      moreText: childrenText.loading
    })
    const params = {
      data: {
        sort: ascending,
        productId: id
      },
      page: {
        pageNum: childrenPageNum,
        pageSize: pageSize
      }
    }
    const api = 'getGoodsMoreType'
    const initSearch = this.requestApi('api')
    const combination = {
      options: params,
      name: api,
    }
    initSearch[api](combination).then(res => {
      const { replyData } = res
      const { pageNum, total } = replyData
      const initSelected = this.data.initSelected
      const result = replyData.list.map(item => {
        item.selected = initSelected
        item.single = false
        return item 
      })
      if(result.length === total && total > 0) {
        this.setData({
          moreText: childrenText.nomore
        })
      } else {
        this.setData({
          moreText: childrenText.more
        })
      }
      this.setData({
        childrenPageNum: pageNum,
        childrenTotal: total,
        goodsMore: result,
        checked: false,
      })
    })
  },

  // 弹框滚动至底部加载更多
  mulitGetGoods: function(options) {
    const { id } = options
    const squence = this.data.priceText
    let ascending = 0 //  0、升序 1、 降序
    if(!squence.ascending.checked) {
      ascending = 1
    }
    const childrenPageNum = this.data.childrenPageNum + 1
    const pageSize = this.data.pageSize
    const total = this.data.childrenTotal
    const len = this.data.goodsMore.length
    const childrenText = this.data.childrenText
    // 是否需要查询更多
    if(total === len && len > 0) {
      this.setData({
        moreText: childrenText.nomore
      })
      return 
    } 
    this.setData({
      moreText: childrenText.more
    })
    const params = {
      data: {
        sort: ascending,
        productId: id
      },
      page: {
        pageNum: childrenPageNum,
        pageSize: pageSize
      }
    }
    const api = 'getGoodsMoreType'
    const goodsMoreType = this.requestApi(api)
    const combination = {
      options: params,
      name: api,
    }
    goodsMoreType[api](combination).then(res => {
      const { replyData } = res
      const { pageNum, total } = replyData
      const initSelected = this.data.initSelected
      const result = replyData.list.map(item => {
        item.selected = initSelected
        item.single = false
        return item 
      })
      const original = this.data.goodsMore
      const summary = original.concat(result)
      if(summary.length === total && total > 0) {
        this.setData({
          moreText: childrenText.nomore
        })
      }
      this.setData({
        childrenPageNum: pageNum,
        childrenTotal: total,
        goodsMore: summary,
        checked: false,
      })
    })
  },

  // 添加至购物车
  postCartAdd: function(options) {
    const shoppingOnce = this.data.shoppingOnce
    const shoppingGap = this.data.shoppingGap
    const currentTime = new Date().getTime()
    if (currentTime - shoppingOnce < shoppingGap) {
      return 
    }
    const params = {
      productId: options,
      list: []
    }
    this.postCartAddApi(params).then(res => {
      const time = new Date().getTime()
      const message = this.data.message
      const flag = 0
      const { code } = res 
      this.setData({
        shoppingOnce: time,
      })
      if(code === flag) {
        this.addSuccess(message)
      }
    })
  },

  // 手动搜索
  handleSearch: function() {
    wx.redirectTo({
      url: '/pages/search/index'
    })
  },

  // 关闭更多
  backClose: function() {
    this.setData({
      show: '',
      mask: '',
    })
  },

  // 排列
  handleSequence: function() {
   this.setData({
     sort: !this.data.sort
   })
  },

  // 跳转至商品分类
  linkGoodsCategory: function() {
    wx.navigateTo({
      url: '/pages/goodsCategoryNbar/index'
    })
  },


  // 按情况筛选
  handleCase: function(e) {
    const selected = e.target.dataset.case 
    const stack = 'isGroup'
    const group = this.data.isGroup
    const freezePage = this.data.freezePage
    // 限制请求次数
    if(freezePage) {
      return 
    }

    if(selected === 'select') {
      this.linkGoodsCategory()
    } else if (selected == stack) {
      this.setData({
        isGroup: !group
      })
     const data = this.data.cache
     data.isGroup = group == 1 ? 0 : 1
     const page = {
        pageNum: 1,
        pageSize: 10
      }
      const params = {
        data: data,
        page: page
      }
      this.getGoodsList(params)
    } else {
      const result = this.data.selectedCase[selected]
      this.setData({
        selectedItem: result
      })
     const data = this.data.cache
     data.querySign = result || 1
     const page = {
        pageNum: 1,
        pageSize: 10
      }
      const params = {
        data: data,
        page: page
      }
      this.getGoodsList(params)
    }
  },

  // 按条件查询列表
  getGoodsList: function(options) {
    const childrenText = this.data.childrenText
    this.setData({
      goodsList: [],
      mainText: childrenText.loading,
      freezePage: true,
    })
    const api = 'getGoodsList'
    const goodsList = this.requestApi(api)
    const combination = {
      options: options,
      name: api, 
    }
    goodsList[api](combination).then((res) => {
      const { replyData } = res 
      const { pageNum, total } = replyData
      const flag = 0
      const mark = true
      if(total === flag) {
        this.setData({
          empty: mark
        })
      } else {
        this.setData({
          empty: !mark
        })
      }
      this.setData({
        goodsList: replyData.list,
        mainPageNum: pageNum,
        mainTotal: total,
        freezePage: false,
      })
      if(replyData.list.length === total && total > flag) {
        this.setData({
          mainText: childrenText.nomore
        })
      } else if(total === flag) {
        this.setData({
          mainText: childrenText.nodata
        })
      } else { 
        this.setData({
          mainText: childrenText.more
        })
      }
    })
  },

  // 主滚动添加
  mainScrollAdd: function(options) {
    const params = options
    const original = this.data.goodsList
    const childrenText = this.data.childrenText
    const mainTotal = this.data.mainTotal
    const len = this.data.goodsList.length
    const flag = 0
    const freezePage = this.data.freezePage
    if (freezePage) {
      return 
    }

    if(mainTotal === len && len > flag) {
      this.setData({
        mainText: childrenText.nomore
      })
      return 
    } 

    this.setData({
      mainText: childrenText.loading,
      freezePage: true
    })
    const api = 'getGoodsList'
    const goodsList = this.requestApi(api)
    const combination = {
      options: params,
      name: api,
    }
    goodsList[api](combination).then(res => {
      const { replyData } = res 
      const { pageNum, total } = replyData
      const result = original.concat(replyData.list)
      const init = 0
      if(result.length === total) {
        this.setData({
          mainText: childrenText.nomore
        })
      } else {
        this.setData({
          mainText: childrenText.more
        })
      }
      this.setData({
        goodsList: result,
        mainTotal: total,
        mainPageNum: pageNum,
        freezePage: false
      })
    })
  },

  // 二级列表滚动至底部添加更多
  loadMore: function() {
    const id = this.data.mulitId
    this.mulitGetGoods({id: id}) // 查询更多
  },

  // 主列表滚动至底部添加更多
  mainMore: function() {
    const empty = this.data.empty
    if(empty) {
      return 
    }
    const data = this.data.cache
    const pageNum = this.data.mainPageNum + 1
    const options = {
      data: data,
      page: {
        pageNum: pageNum,
        pageSize: 10
      }
    }

    this.mainScrollAdd(options)
  },

  // 获取所有一级名称
  formatMenus: function() {
    const result = {}
    const menus = this.data.MainMenus
    const original = Object.keys(this.data.MainMenus)
    original.map(item => {
      result[menus[item]] = []
    })

    return result
  },

  // 手动输入
  handleInput: function(e) {
    const list = this.data.goodsMore // 数据
    const itemId = e.currentTarget.dataset.detail.productCodeId // 改变项
    const number = Number(e.detail.value) // 改变的数字
    const flag = 0
    const result = list.map(item => {
      if(item.productCodeId == itemId && number > flag) {
        item.selected = number
        item.single = true
      } else if(item.productCodeId == itemId && number == flag) {
        item.selected = number 
        item.single = false
      }
      return item 
    })
    this.setData({
      goodsMore: result
    })
  },

  // 创立一个模板对象
  createObj: function() {
    const result = {}
    const menus = this.data.MainMenus
    const original = Object.keys(this.data.MainMenus)
    original.map(item => {
      result[menus[item]] = {}
    })

    return result
  },

  saveCachePath: function(path) {
    app.globalData.cachepath = path || null
  },

  // 处理不同情况的参数
  mergeArguments: function(obj) {
    const {selected, search} = obj 
    let result  = '' 
    if(selected) {
      result = selected
    } else if(search) {
      result = search
    }
    return result
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const markPage = 'goodsCategoryNbar'
    const firstInPage = 0
    const { id, path, filter, searchText } = options
    this.saveCachePath(path)

    if (path === markPage) {
      let count = this.data.countInPage
      this.setData({
        countInPage: count++
      })
    } else {
      this.setData({
        countInPage: firstInPage
      })
    }

    this.setData({
      path: path ? path : ''
    })
    const args = id ? JSON.parse(decodeURIComponent(id)) : []
    const filterNum = filter ? JSON.parse(filter) : []
    const menus = this.data.MainMenus
    const result = this.formatMenus()
    const flag = Array.isArray(args)
    const mark = Array.isArray(filterNum)
    
    if(flag) {
      args.map(item => {
        item.subclassList.map(childItem => {
          if(childItem.selected) {
            let name = childItem.aliasSubclass || childItem.originalSubclass
            if(menus[item.identification]) {
              result[menus[item.identification]].push(name)
            }
          }
        })
      })
    } else if(args.l && args.s ) {
      const childName = args.s || ''
      const mainType = args.l || ''
      const parentName = this.data.MainMenus[mainType] || []
      result[parentName].push(childName)
    }

    const formatFilter = this.createObj()

    if(mark) {
      filterNum.map(item => {
        let type = menus[item.identification]
        if(type) {
          formatFilter[type].mini = item.mini
          formatFilter[type].max = item.max
        }
      })
    }

    const twoCase = {
      selected: args.t,
      search: searchText,
    }

    const presenterName = args.presenterName || ''
    const text = this.mergeArguments(twoCase)
    const customerInfo = wx.getStorageSync('customerInfo')
    const ratio = customerInfo.ratio
    const group = this.data.isGroup ? 1 : 0
    const data = {
      presenterName: presenterName, // 首月标志位
      querySign: 1, // 1、新品 2、爆款 3、现货
      text: text, // 搜索文字
      priceRate: ratio, // 用户倍率
      isGroup: group, // 0、未选中 1、现货选中 
      largeCategoryJewelryLabel: result.largeCategoryJewelryLabel || [], // 首饰大类
      smallCategoryJewelryLabel: result.smallCategoryJewelryLabel || [], // 首饰小类
      largeCategoryAccessLabel: result.largeCategoryAccessLabel || [], // 饰品大类
      smallCategoryAccessLabel: result.smallCategoryAccessLabel || [], // 饰品小类
      hotCategoryLabel: result.hotCategoryLabel || [],
      categoryLabel: result.categoryLabel || [],
      mainStoneNameLabel: result.mainStoneNameLabel || [],
      mainStoneColorLabel: result.mainStoneColorLabel || [],
      mainStoneQualityLabel: result.mainStoneQualityLabel || [],
      goldQualityLabel: result.goldQualityLabel || [],
      qualityLabel: result.qualityLabel || [],
      jewelrySeriesLabel: result.jewelrySeriesLabel || [],
      styleSeriesLabel: result.styleSeriesLabel || [],
      brandLabel: result.brandLabel || [],
      technologyLabel: result.technologyLabel || [],
      mainShapeLabel: result.mainShapeLabel || [],
      mainCutLabel: result.mainCutLabel || [],
      mainClawLabel: result.mainClawLabel || [],
      startPriceLabel: formatFilter.salePrice.mini || null,
      endPriceLabel: formatFilter.salePrice.max || null,
      largeGoldWeightLabel: formatFilter.goldWet.max || null,
      smallGoldWeightLabel: formatFilter.goldWet.mini || null,
      smallMainStoneWeightLabel: formatFilter.mainStonWet.mini || null,
      largeMainStoneWeightLabel: formatFilter.mainStonWet.max || null,
      smallViceStoneWeightLabel: formatFilter.subStonWet.mini || null,
      largeViceStoneWeightLabel: formatFilter.subStonWet.max || null,
      smallHandInchLabel: formatFilter.handleSize.mini || null,
      largeHandInchLabel: formatFilter.handleSize.max || null,
      smallMainGrainLabel: formatFilter.mainStonNum.mini || null,
      largeMainGrainLabel: formatFilter.mainStonNum.max || null,
      smallViceGrainLabel: formatFilter.subStonNum.mini || null,
      largeViceGrainLabel: formatFilter.subStonNum.max || null,
      startShelvesTimeLabel: formatFilter.onUpTime.mini || '',
      endShelvesTimeLabel: formatFilter.onUpTime.max || '',
    }

    const params = {
      data: data,
      page: {
        pageNum: 1,
        pageSize: 10
      }
    }
    this.setData({
      cache: data,
      searchText: text,
      globalStyle: getApp().globalData.globalStyle
    })
    this.getGoodsList(params)
  },
})