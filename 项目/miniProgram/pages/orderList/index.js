// pages/orderList/index.js
import {
  Server 
} from '../../models/server'
const ajax = new Server()
const app = getApp()
import { setGlobalGoldStyle } from '../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    formatStyle: {
      '0': 'diamand', // 钻石版
      '1': 'gold', // 黄金版
    },
    globalStyle: app.globalData.globalStyle,
    orderId: '', 
    activeItem: 'assort',
    priceSort: 1,
    pagination: false,
    list: [],
    firstItem: null, // 第一个序列
    typeList: [], // 格式化后分类数据
    pageNum: 1, // 当前页码
    pageSize: 10, // 页面条数
    stockStatus: '',// 分类、现货 Y只看现货(不需要不填)
    sort: '', // 价格排序 Y降序从高到低(不需要不填)  N升序从低到高
    total: 0, // 总数量
    totalPages: 1, // 总页码
    paginationNum: [], // 分页数量
    activePage: '', // 上一页，下一页选中
    activePageNext: '', // 下一页可选
    activePagePre: '', // 上一页可选
    totalAmount: 0, // 合计价格
    totalNum: 0, // 件数
  },

  // 更新页面数据
  updatePageData(obj) {
    console.log('更新页面数据')
    const {data, replyData} = obj
    const { list, total, } = data
    const { total: totalNum, totalAmount } = replyData
    console.log('获得商品件数', totalAmount)
    const prettifyList = this.formatTypeData(list)
    const totalPages = Math.ceil(total / this.data.pageSize)
    const paginationNum = this.createdPaginationNum(totalPages)
    const pageNum = this.data.pageNum
    this.initNextPage(pageNum, totalPages)
    this.setData({
      total,
      totalAmount,
      totalNum,
      list: list,
      typeList: prettifyList,
      totalPages: totalPages,
      paginationNum: paginationNum,
    })
  },

  // 更新选中状态
  updateSelected(item) {
    this.setData({
      activeItem: item,
    })
  },

  // 查询订单类型
  queryOrderType(type) {
    let style = ''
    const flag = 'Y'
    const spot = 'spot'
    const id = this.data.orderId
    if (type == spot) {
      style = flag
      this.setData({
        stockStatus: style,
      })
    }
    const options = {}
    options.data = {
      orderId: id,
      stockStatus: style,
      sort: '',
    }
    options.page = {
      pageNum: 1,
      pageSize: this.data.pageSize,
    }
    ajax.queryOrderChildList(options).then(res => {
      const { code, data } = res
      const mark = 0 
      if (code == mark) {
        this.updatePageData(res)
      }
    })
  },

  // 查询订单价格
  queryOrderPrice() {
    let result = null
    const preface = 'N'
    const flag = 'Y'
    const mark = 3
    const id = this.data.orderId
    const priceSort = this.data.priceSort
    if (priceSort == mark) {
      result = flag
      this.setData({
        sort: result,
      })
    } else {
      result = preface
      this.setData({
        sort: result,
      })
    }
    console.log('价格参数', id, result,)
    const options = {}
    options.data = {
      orderId: id,
      stockStatus: '',
      sort: result,
    }
    options.page = {
      pageNum: 1,
      pageSize: this.data.pageSize,
    }
    ajax.queryOrderChildList(options).then(res => {
      const { code, data } = res
      const mark = 0 
      if (code == mark) {
        this.updatePageData(res)
      }
    })
  },

  // 重新点击更新页面
  handleResetPage(type) {
    let result = false
    const mark = this.data.activeItem
    if (mark === type) {
      result = true
    }
    return result
  },


  // 分类事件
  handleAssort: function() { 
    console.log('分类')
    const mark = 1
    const type = 'assort'
    const updateData = this.handleResetPage(type)
    if (updateData) {
      return 
    }
    this.updateSelected(type)
    this.queryOrderType(type)
    this.resetIcon()
    this.setPageNum(mark)
  },

  // 现货事件
  handleSpot: function() {
    console.log('现货')
    const mark = 1
    const type = 'spot'
    const updateData = this.handleResetPage(type)
    if (updateData) {
      return 
    }
    this.updateSelected(type)
    this.queryOrderType(type)
    this.resetIcon()
    this.setPageNum(mark)
  },

  // 复位价格 icon
  resetIcon() {
    const init = 1
    this.setData({
      priceSort: init,
    })
  },

  // 改变价格排序 icon
  updatePriceSortIcon() {
    console.log('价格排序', this.data.priceSort)
    let result = 1
    const start = 1
    const middle = 2
    const mark = this.data.priceSort
    if (mark == result) {
      result += start
    } else if (mark == middle) {
      result += middle
    } else {
      result = middle
    }
    this.setData({
      priceSort: result,
    })
  },

  // 价格事件
  handleSort: function() {
    console.log('价格')
    const mark = 1
    const type = 'price'
    this.updateSelected(type)
    this.updatePriceSortIcon()
    this.setPageNum(mark)
    this.queryOrderPrice()
  },

  // 翻页
  turnPage: function() {
    console.log('关闭翻页反应')
    this.setData({
      pagination: false,
    })
  },

  // 翻页事件
  handlePage: function() {
    console.log('点击翻页')
    this.setData({
      pagination: true,
    })
  },

  // 设置当前选中页码
  setPageNum(num) {
    this.setData({
      pageNum: num,
    })
  },

  // 上一页
  prePage() {
    console.log('上一页')
    let result = 1
    const page = this.data.pageNum
    const id = this.data.orderId
    const mark = 1
    if (page > mark) {
      result = page - mark
    } else {
      result = page
    }
    if (result == page) {
      return 
    }
    this.setData({
      activePage: 'pre',
    })
    this.setPageNum(result)
    this.queryOrderInfo(id)
  },

  // 下一页
  nextPage() {
    console.log('下一页')
    let result = 1
    const page = this.data.pageNum
    const mark = 1
    const max = this.data.totalPages
    const id = this.data.orderId
    if (page < max) {
      result = page + mark
    } else {
      result = page
    }
    if (result == page) {
      return 
    }
    this.setData({
      activePage: 'next',
    })
    this.setPageNum(result)
    this.queryOrderInfo(id)
  },

  // 初始化有无下一页
  initNextPage(num, totalPage) {
    this.activePagePre(num)
    this.activePageNext(num, totalPage)
    const mark = 1
    if ((totalPage > mark) && (num == mark)) {
      // this.setData({
      //   activePage: 'next'
      // })
      // this.activePageNext(num, totalPage)
    } else if ((totalPage > mark) && (num == totalPage)) {
      // this.setData({
      //   activePage: 'pre'
      // })
      // this.activePagePre(num)
    }
  },

  // 下一页可选
  activePageNext(curPage, totalPage) {
    let result = false 
    if (curPage < totalPage) {
      result = true
    }
    this.setData({
      activePageNext: result,
    })
  },

  // 上一页可选
  activePagePre(curPage) {
    console.log('当前页码', curPage)
    const mark = 1
    let result = false
    if (curPage > mark) {
      result = true
    }
    this.setData({
      activePagePre: result,
    })

  },

  // 翻到具体页码
  concretePage(num) {
    const pageNum = num
    const id = this.data.orderId
    const options = {}
    options.data = {
      orderId: id,
      stockStatus: this.data.stockStatus,
      sort: this.data.sort,
    }
    options.page = {
      pageNum: pageNum,
      pageSize: this.data.pageSize,
    }
    ajax.queryOrderChildList(options).then(res => {
      console.log('获得数据', res)
      this.turnPage()
      const { code } = res
      const mark = 0
      if (mark == code) {
        this.updatePageData(res)
      }
    })
  },

  // 翻新页面
  handleNewPage: function(options) {
    console.log('翻新夜间更新数据', options)
    const pageNum = options.detail.pageNum
    console.log('翻到第多少页呢', pageNum)
    this.setPageNum(pageNum)
    this.concretePage(pageNum)
  },

  // 获得第一个的id用于更新滚动定位
  updateScoll(list) {
    console.log('获取', list)
    const id = list[0].list[0].orderId
    this.setData({
      firstItem: id,
    })
  },

  // 格式化分类数据
  formatTypeData(arr) {
    const list = arr
    const valu = {}
    const names = []
    const result = []
    list.map(item => {
      if (!names.includes(item.largeCategory)) {
        names.push(item.largeCategory)
        valu[item.largeCategory] = []
        valu[item.largeCategory].push(item)
      } else {
        valu[item.largeCategory].push(item)
        valu.len += 1
      }
    })
    console.log('格式化后的数据', valu, names)
    // list.map(item => {
    //   valu[item.largeCategory].push(item)
    // })

    // console.log('得到结果来么', valu)
    names.map(item => {
      let obj = {}
      obj.name = item
      obj.list = valu[item]
      result.push(obj)
    })

    console.log('终结数据', result)
    this.updateScoll(result)
    return result
  },

  // 分页数量
  createdPaginationNum(num) {
    const result = []
    const flag = Number(num)
    for (let i=1; i<=flag; i++) {
      result.push(i)
    }
    return result
  },

  // 查询订单数据
  queryOrderInfo(id) {
    const options = {}
    options.data = {
      orderId: id,
      stockStatus: this.data.stockStatus,
      sort: this.data.sort,
    }
    options.page = {
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
    }
    ajax.queryOrderChildList(options).then(res => {
      console.log('获得数据', res)
      const { code } = res
      const mark = 0
      if (mark == code) {
        this.updatePageData(res)
      }
    })
  },

  // 存储订单号
  saveOrderId(id) {
    this.setData({
      orderId: id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('为啥这样的呢', options)
    const style = app.globalData.globalStyle
    const { orderId } = options
    this.saveOrderId(orderId)
    this.queryOrderInfo(orderId)
    this.setData({
      globalStyle: style,
    })
    setGlobalGoldStyle(style)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})