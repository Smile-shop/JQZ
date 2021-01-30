// pages/goodsList/index.js
var app = getApp();
// import { Server } from '../../models/server'
// let ajax = new Server()
import { queryShopList, levelFirst, queryShopCart } from "../../api/goodDetailandList";
import log from '../../utils/log'
import { getNavbarHeight } from '../../utils/utils'

Page({
  mixins: [require('../../mixins/setColor.js')],
  /**
   * 页面的初始数据
   */
  data: {
    MainMenus: {},
    firstTitle: [],
    showLoading: true,
    miniLoading: false,
    noMoreGoods: false,
    pageWidth: 0, // 屏幕宽度
    leftAway: 0, // 距左边距离
    firstItem: '', // 选中一级分类
    show: false,
    animation: 'entry', // 筛选动画
    animationMenu: {
      entry: 'entry',
      output: 'output',
    }, // 动画状态
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
    mainPageNum: 0, // 当前页码
    mainTotal: 0,
    childrenPageNum: 0,
    childrenTotal: 0,
    pageSize: 10,
    goodsMore: [],
    goodsList: [],
    goodsItems: '',
    spot: false, // 仅看现货
    filterItem: false, // 有筛选条件
    // tags: ['掌柜推荐', '国庆狂欢'], // 标签
    tags: [],
    filerTerm: {
      price: {
        min: null,
        max: null,
      },
    }, // 筛选价格区间
    sortType: {
      sum: 'MULT',
      price: 'PRICE',
      new: 'NEW',
    }, // 二级筛选参数
    selectedCase: {
      sum: 1,
      price: 2,
      new: 3,
      select: 4,
    }, // 二级筛选
    top: 0, // 回到顶部
    complex: {
      id: '',
      imgUrl: '',
      name: '综合',
    },
    initArgs: {}, // 初次请求其他页面传来的参数
    navbarData: {
      goback: true,
      gohome: true,
      title: '商品列表',
      style: 1
    }, // 顶部导航
    navbarHeight: 0, // 顶部自定义导航高度
    shopCount: {
      plus: false,
      num: null,
      style: false,
    }, // 购物车数量
    sortTemp: ['ASC', 'DESC'], // 排序模板
    priceSort: '', //价格排序
  },

  // 正确返回
  requestBack: function (res) {
    let result = false
    const successCode = 0
    const { code } = res
    if (code === successCode) {
      result = true
    }

    return result
  },

  // 错误返回
  requestError: function (res) {
    // do something
  },

  // 请求
  request: function (params) {
    const { options, name, loading } = params
    return new Promise((resolve) => {
      return
      // return resolve(resultobj);
    })
  },

  // 方法
  requestApi: function (name) {
    const methods = {}

    methods[name] = (options) => {
      return this.request(options)
    }

    return methods
  },

  // 重置筛选项
  handleReset: function () {
    log('筛选')
    const obj = this.data.filerTerm
    const arr = Object.keys(obj)
    log(arr)
    arr.forEach(item => {
      obj[item].min = null
      obj[item].max = null
    })

    this.setData({
      filerTerm: obj,
      spot: false,
      filterItem: false,
    })
  },

  // 选中筛选项
  selectFilterItem: function (options = false) {
    log('选中筛选项', options)
    const mark = options
    this.setData({
      filterItem: mark,
    })
  },


  // 仅看现货
  handleStock: function () {
    const spot = !this.data.spot
    log('现货', spot)
    this.selectFilterItem(spot)
    this.setData({
      spot: spot,
    })
  },

  // 输入筛选项
  handleChange: function (options) {
    log(options)
    const min = 'min'
    const max = 'max'
    const filterValue = this.data.filerTerm
    const list = Object.keys(filterValue)
    let keys = options.detail.item
    const mark = options.detail.flag
    const write = options.detail[mark]
    let result = false // 默认筛选
    log(keys, mark, write,)
    const inputKeys = {}
    inputKeys[keys] = {}
    if (write <= 0) {
      inputKeys[keys][mark] = null
      list.map(item => {
        if (item === keys) {
          filterValue[keys] = Object.assign({}, filterValue[keys], inputKeys[keys])
        }
      })
    } else if (mark === min) {
      if (filterValue[keys][max] && (Number(write) > Number(filterValue[keys][max]))) {
        log('交换大的')
        inputKeys[keys][mark] = filterValue[keys][max]
        inputKeys[keys][max] = write
        list.map(item => {
          if (item === keys) {
            filterValue[keys] = Object.assign({}, filterValue[keys], inputKeys[keys])
          }
        })
      } else {
        inputKeys[keys][mark] = write
        list.map(item => {
          if (item === keys) {
            filterValue[keys] = Object.assign({}, filterValue[keys], inputKeys[keys])
          }
        })
      }
    } else if (mark === max) {
      if (filterValue[keys][min] && (Number(write) < Number(filterValue[keys][min]))) {
        log('交换小的')
        inputKeys[keys][mark] = filterValue[keys][min]
        inputKeys[keys][min] = write
        list.map(item => {
          if (item === keys) {
            filterValue[keys] = Object.assign({}, filterValue[keys], inputKeys[keys])
          }
        })
      } else {
        inputKeys[keys][mark] = write
        list.map(item => {
          if (item === keys) {
            filterValue[keys] = Object.assign({}, filterValue[keys], inputKeys[keys])
          }
        })
      }
    }

    log('最后的值', filterValue)
    const checkFilter = Object.keys(filterValue)
    checkFilter.forEach(item => {
      log('检测筛选')
      if (filterValue[item].max || filterValue[item].min) {
        result = true
      }
    })

    this.selectFilterItem(result)

    this.setData({
      filerTerm: filterValue,
    })
  },

  // 跳转详情页
  detail: function (options) {
    log('详情详情', options)
    const { skuId, id } = options.detail
    const formatSku = skuId || ''
    const formatSpu = id || ''
    wx.navigateTo({
      url: `/pages/goodsDetail/index?skuId=${formatSku}&spuId=${formatSpu}`,
    })
  },

  // 添加成功提示
  addSuccess: function (message) {
    wx.showToast({
      title: message,
      icon: 'success',
      duration: 2000
    })
  },

  // 未选中提示
  warningTip: function (message) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000,
    })
  },

  // 设置界面宽度
  setPageWidth: function (element) {
    log('首次', element, global)
    const query = wx.createSelectorQuery()
    query.select(`.${element}`).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec((res) => {
      log('快读', res)
      res[0].top       // #the-id节点的上边界坐标
      res[1].scrollTop // 显示区域的竖直滚动位置
      this.setData({
        pageWidth: res[0].width
      })
    })
  },

  // 设置一级滚动
  getUsePhone: function (num) {
    const pageWidth = this.data.pageWidth / 2
    const away = num - pageWidth
    log('一级滚动', away)
    this.setData({
      leftAway: away,
    })
  },

  // 清除首次的缓存
  clearCache() {
    this.setData({
      initArgs: null,
    })
  },

  // 点击一级分类
  handleFirst(e) {
    log(e)
    log(e.target.offsetLeft)
    const num = e.target.offsetLeft
    const mark = e.target.dataset.item
    log('所有的点击一级分类', mark)
    this.getUsePhone(num)
    const firstItem = this.data.firstItem
    if (firstItem === mark) {
      return
    }
    this.setData({
      firstItem: mark,
      selectedItem: 1,
      priceSort: '',
    })
    if (!this.data.leftAway) {
      this.setData({
        goodsItems: firstItem
      })
    } else {
      this.setData({
        goodsItems: ''
      })
    }
    this.handleReset()
    this.clearCache()
    // 请求数据
    const options = {
      cateIdLevel1: mark,
    }
    this.emtpyPreFilter()
    this.queryShipList(options)
  },

  // 查询购物车情况
  getShoppingCart: function (options) {
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
  switchDetail: function (options) {
    const { proId, name } = options
    wx.navigateTo({
      // url: `/pages/scrollList/index?id=${proId}&name=${name}`,
      url: `/pages/scrollList/index`
    })
  },

  // 点击购物车
  callCart: function (e) {
    // 1. 添加购物车 2、查询更多列表
    // isQueryOtherSign 查询单品或多品、必须传 1
    const add = 0 // 0、不查询 1、查询更多
    const { proId, name, storageType } = e.currentTarget.dataset.info
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
      if (isQueryOther === add) {
        this.postCartAdd(proId)
      } else {
        this.switchDetail(skip)
      }
    })
  },

  // 全选算法
  allAlgorithm: function (state) {
    const list = this.data.goodsMore
    const init = this.data.initSelected
    if (state) {
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
  selectedAll: function () {
    const checked = this.data.checked
    this.setData({
      checked: !checked
    })
    this.allAlgorithm(!checked)
  },

  // 添加购物车接口
  postCartAddApi: function (params) {
    const api = 'postCartAdd'
    const combination = {
      options: params,
      name: api,
    }
    const addCart = this.requestApi(api)
    return addCart[api](combination)
  },

  // 二级弹框添加购物车
  handleCart: function () {
    const result = []
    const id = this.data.mulitId
    this.data.goodsMore.map(item => {
      if (item.single) {
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
    if (result.length > 0) {
      this.postCartAddApi(params).then(res => {
        const successMsg = this.data.message
        const successMark = 0
        const { code } = res
        if (code === successMark) {
          this.addSuccess(successMsg)
        }
      })
    } else {
      const message = this.data.nullTip
      this.warningTip(message)
    }
  },

  // 二级价格排序
  handleSort: function (e) {
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
  selectedAllCase: function () {
    const len = this.data.goodsMore.length
    let num = 0
    this.data.goodsMore.map(item => {
      if (item.single) {
        num++
      }
    })

    if (len === num) {
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
  handleOnChange: function (e) {
    const count = e.detail
    const { productCodeId, selected } = e.currentTarget.dataset.detail

    const goodsMore = this.data.goodsMore
    const result = goodsMore.map(item => {
      if (item.productCodeId === productCodeId) {
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
  handleAdd: function (e) {
    const goodsMore = this.data.goodsMore
    const id = e.currentTarget.dataset.detail.productCodeId
    const maxNumber = this.data.maxNumber
    const result = goodsMore.map(item => {
      if (item.productCodeId === id && item.selected < maxNumber) {
        item.selected++
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
  handleReduce: function (e) {
    const goodsMore = this.data.goodsMore
    const id = e.currentTarget.dataset.detail.productCodeId
    const miniNumber = this.data.miniNumber
    const flag = 0
    const result = goodsMore.map(item => {
      if (item.productCodeId === id && item.selected > miniNumber) {
        item.selected--
      }
      if (item.selected === flag) {
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
  handleSingleIcon: function (e) {
    const id = e.currentTarget.dataset.single.productCodeId
    const result = this.data.goodsMore.map(item => {
      if (item.productCodeId === id && item.single === false) {
        item.single = true
      } else if (item.productCodeId === id && item.single === true) {
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
  getGoodsMore: function (options) {
    const { id } = options
    const squence = this.data.priceText
    let ascending = 0 //  0、升序 1、 降序
    if (!squence.ascending.checked) {
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
      if (result.length === total && total > 0) {
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
  mulitGetGoods: function (options) {
    const { id } = options
    const squence = this.data.priceText
    let ascending = 0 //  0、升序 1、 降序
    if (!squence.ascending.checked) {
      ascending = 1
    }
    const childrenPageNum = this.data.childrenPageNum + 1
    const pageSize = this.data.pageSize
    const total = this.data.childrenTotal
    const len = this.data.goodsMore.length
    const childrenText = this.data.childrenText
    // 是否需要查询更多
    if (total === len && len > 0) {
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
      if (summary.length === total && total > 0) {
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
  postCartAdd: function (options) {
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
      if (code === flag) {
        this.addSuccess(message)
      }
    })
  },

  // 手动搜索
  handleSearch: function () {
    wx.redirectTo({
      url: '/pages/search/index'
    })
  },

  // 关闭更多
  backClose: function () {
    this.setData({
      show: '',
      mask: '',
    })
  },

  // 排列
  handleSequence: function () {
    this.setData({
      sort: !this.data.sort
    })
  },

  // 跳转至商品分类
  handleFilterItem: function () {
    log('跳转至商品分类页面', this.data.spot)
    const { entry } = this.data.animationMenu
    this.setData({
      animation: entry,
      show: true,
    })
  },
  // 关闭筛选页面
  onPopupClose: function () {
    log('筛选页面关闭')
    const { output } = this.data.animationMenu
    this.setData({
      animation: output,
    })
    // this.setData({ show: false });
  },


  // 按情况筛选
  handleCase: function (e) {
    log('二级筛选', e.target.dataset.case)
    const selectedItem = this.data.selectedItem
    const selected = e.target.dataset.case
    const stack = 'isGroup'
    const group = this.data.isGroup
    const freezePage = this.data.freezePage
    const pre = this.data.selectedCase[selected]

    log('这里条件', pre, selectedItem, freezePage, selected)

    if (selected === 'price') {
      const mark = this.data.priceSort
      const tem = this.data.sortTemp
      if (mark == tem[0]) {
        this.setData({
          priceSort: tem[1],
        })
      } else {
        this.setData({
          priceSort: tem[0],
        })
      }
    } else if (selected !== 'select') {
      this.setData({
        priceSort: '',
      })
    }

    // 选中同一个
    if (pre === selectedItem) {
      if (selected !== 'price') {
        return
      }
    }

    // 限制请求次数
    if (freezePage) {
      return
    }

    // 不是筛选重置
    if (selected !== 'select') {
      this.handleReset() // 重置筛选项
    }

    if (selected === 'select') {
      log('这里是筛选呢！！！')
      // 点击筛选
      this.handleFilterItem()
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
      // this.getGoodsList(params)
      log('二级筛选去请求数据')
      const options = {
        cateIdLevel1: this.data.firstItem,
        sortType: this.data.sortType[selected]
      }
      this.emtpyPreFilter()
      this.queryShipList(options)
    }
  },

  // 按条件查询列表
  getGoodsList: function (options) {
    const childrenText = this.data.childrenText
    this.setData({
      // goodsList: [],
      mainText: childrenText.loading,
      // freezePage: true,
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
      log('获得值', replyData.list)
      const flag = 0
      const mark = true
      if (total === flag) {
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
      if (replyData.list.length === total && total > flag) {
        this.setData({
          mainText: childrenText.nomore
        })
      } else if (total === flag) {
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
  mainScrollAdd: function async(options) {
    log('请求更多数据')
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

    if (mainTotal === len && len > flag) {
      this.setData({
        mainText: childrenText.nomore
      })
      return
    }

    this.setData({
      mainText: childrenText.loading,
      // freezePage: true
    })
    const api = 'getGoodsList'
    const goodsList = this.requestApi(api)
    const combination = {
      options: params,
      name: api,
    }
    log('去请求更多数据的参数', combination)
    const args = this.data.initArgs || {}
    const curPage = this.data.mainPageNum + 1
    args.curPage = curPage
    log('不应当没有当前页面', curPage, this.data.mainPageNum)
    this.queryShipList(args)

    goodsList[api](combination).then(res => {
      const { replyData } = res
      const { pageNum, total } = replyData
      const result = original.concat(replyData.list)
      const init = 0
      if (result.length === total) {
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
  loadMore: function () {
    const id = this.data.mulitId
    this.mulitGetGoods({ id: id }) // 查询更多
  },

  // 主列表滚动至底部添加更多
  mainMore: function () {
    log('滚动加载更多')
    const empty = this.data.empty
    if (empty) {
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
  formatMenus: function () {
    const result = {}
    const menus = this.data.MainMenus
    const original = Object.keys(this.data.MainMenus)
    original.map(item => {
      result[menus[item]] = []
    })

    return result
  },

  // 手动输入
  handleInput: function (e) {
    const list = this.data.goodsMore // 数据
    const itemId = e.currentTarget.dataset.detail.productCodeId // 改变项
    const number = Number(e.detail.value) // 改变的数字
    const flag = 0
    const result = list.map(item => {
      if (item.productCodeId == itemId && number > flag) {
        item.selected = number
        item.single = true
      } else if (item.productCodeId == itemId && number == flag) {
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
  createObj: function () {
    const result = {}
    const menus = this.data.MainMenus
    const original = Object.keys(this.data.MainMenus)
    original.map(item => {
      result[menus[item]] = {}
    })

    return result
  },

  saveCachePath: function (path) {
    app.globalData.cachepath = path || null
  },

  // 处理不同情况的参数
  mergeArguments: function (obj) {
    const { selected, search } = obj
    let result = ''
    if (selected) {
      result = selected
    } else if (search) {
      result = search
    }
    return result
  },

  // 前往购物车
  handleCar() {
    log('购物车')
    wx.switchTab({
      url: '/pages/shoppingCart/index',
    })
  },

  // 返回顶部
  handleTop() {
    log('返回顶部')
    this.setData({
      top: 0,
    })
  },

  // 清空之前的数据
  emtpyPreFilter() {
    this.setData({
      goodsList: []
    })
  },

  // 确定筛选
  handleFilter() {
    // 关闭筛选项
    this.onPopupClose()
    // 提交请求
    const options = {
      cateIdLevel1: this.data.firstItem || '',
      isHaveStock: this.data.spot ? 'Y' : '',
      minPrice: this.data.filerTerm.price.min || '',
      maxPrice: this.data.filerTerm.price.max || '',
    }
    this.emtpyPreFilter()
    this.queryShipList(options)
  },

  // 设置一级导航
  setFirstLevel(arr) {
    const first = this.data.complex
    const nav = arr.map((item) => {
      item.id = item.id ? ('JQZ-' + item.id) : ''
      return item
    })
    nav.unshift(first)
    log('一级导航', nav)
    this.setData({
      firstTitle: nav,
    })
  },

  // 请求一级导航
  async queryFirstNav() {
    const body = ""
    const res = await levelFirst(body)
    log('处理一级导航', res)
    const { data } = res
    this.setFirstLevel(data)
  },

  // 当前选中一级导航
  async selectedFristLevel(current) {
    let result = ''
    const id = current
    const totalLevel = this.data.firstTitle
    totalLevel.forEach(item => {
      if (item.id === id) {
        result = item.id
      }
    })
    log('设置一级导航', result)
    this.setData({
      firstItem: result,
    })
    if (!this.data.leftAway) {
      this.setData({
        goodsItems: result
      })
    } else {
      this.setData({
        goodsItems: ''
      })
    }
  },

  // 赋值购买车数量
  empowerShopcartNum(num) {
    const count = Number(num)
    const options = {}
    options.num = count > 99 ? 99 : count // 最大数值
    options.style = count > 9 ? true : false // 改变样式
    options.plus = count > 99 ? true : false // 有添加 +
    this.setData({
      shopCount: options,
    })
  },

  // 查询购物车商品数量
  async queryShopNum() {
    const body = {
      "storeId": app.globalData.storeId
    }
    const res = await queryShopCart(body)
    log('购车数据', res)
    const { data } = res
    this.empowerShopcartNum(data)
  },

  // 缓存首次查询参数
  cacheArgs(args) {
    const info = args
    this.setData({
      initArgs: info,
    })
  },

  // 获取顶部导航自定义高度
  getDiyHeight() {
    const height = getNavbarHeight()
    this.setData({
      navbarHeight: height,
    })
  },

  // 设置搜索文字
  setSearchText(text) {
    log('设置文字', text)
    if (text && text != 'undefined') {
      this.setData({
        searchText: text,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await this.getDiyHeight()
    await this.queryShopNum()
    await this.queryFirstNav()
    const { cateIdLevel1, cateIdLevel2, title } = options
    log('分类过来', cateIdLevel1, cateIdLevel2, decodeURIComponent(title))
    const formatTitle = title ? decodeURIComponent(title) : ''
    const formLevel1 = cateIdLevel1 ? ('JQZ-' + cateIdLevel1) : ''
    this.setSearchText(decodeURIComponent(formatTitle))
    const initArgs = {
      cateIdLevel1: formLevel1,
      cateIdLevel2,
      title: decodeURIComponent(formatTitle),
    }
    await this.cacheArgs(initArgs)
    await this.selectedFristLevel(formLevel1)
    const queryArgs = {
      cateIdLevel1,
      cateIdLevel2,
      title: decodeURIComponent(formatTitle),
    }
    await this.queryShipList(queryArgs)
  },

  // 赋值页面列表
  empowerPage(data, curPage, totalPage) {
    log('页面数据', data, curPage)
    const list = data
    const curList = this.data.goodsList
    const total = curList.concat(list)
    const next = curPage >= totalPage ? true : false
    this.setData({
      goodsList: total,
      showLoading: false,
      miniLoading: false,
      noMoreGoods: true,
      empty: next,
      mainPageNum: curPage,
    })
  },

  // 开启小 loading
  openLoading() {
    this.setData({
      miniLoading: true,
      noMoreGoods: false,
    })
  },

  // 请求商品列表数据
  async queryShipList(args) {
    this.openLoading()
    log('这里出现的问题', args)
    console.log('需求点', args)
    const sortType = this.data.sortType.sum
    const sort = this.data.priceSort
    const body = {
      "appId": app.globalData.appid,
      "cateIdLevel1": "",
      "cateIdLevel2": "",
      "curPage": 1,
      "isHaveStock": "",
      "maxPrice": 0,
      "minPrice": 0,
      "pageSize": 10,
      "sortDirection": sort,
      "sortType": sortType,
      "status": "",
      "storeId": app.globalData.storeId,
      "title": this.data.searchText,
    }
    const formatArgs = JSON.parse(JSON.stringify(args))
    formatArgs.cateIdLevel1 = formatArgs.cateIdLevel1 ? formatArgs.cateIdLevel1.split('JQZ-')[0] : ''
    const options = Object.assign({}, body, formatArgs)
    const res = await queryShopList(options)
    const { data } = res
    const { totalRecord, curPage, totalPage } = data
    this.empowerPage(data.records, curPage, totalPage)
  },
  onShow: function () {
    const element = 'wrap'
    this.setPageWidth(element, global)
    // this.queryShopNum()
  }
})