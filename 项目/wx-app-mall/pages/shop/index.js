// pages/shop/index.js
const app = getApp()
import { queryWithImgDistancePage } from '../../api/index'
Page({
  mixins: [require('../../mixins/setColor.js')],
  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    list: [],
    noMore: false,
    loading: true,
    pullRefresh: true,
    curPage: 1,
    options: '',
    name: ''
  },
  // 取消搜索
  onCancel(){
    this.setData({value: '', name: ''})
  },
  // 搜索
  onSearch(){
    this.setData({curPage: 1})
    this.getShopList(this.data.name)
    // this.setData({value: ''})
  },
  // 获取input值
  getInputValue(e){
    this.setData({name: e.detail.value})
  },
  // 分页获取所有店铺
  getAllShop(){
    this.setData({curPage: 1, value: '', name: ''})
    this.getShopList(this.data.name)
  },
  // 下拉刷新
  refresh(){
    this.setData({curPage: 1})
    this.getShopList(this.data.name)
  },
  // 加载更多
  handleMore(){
    if(this.data.noMore) return
    let curPage = this.data.curPage
    curPage++
    this.setData({curPage})
    this.getShopList(this.data.name)
  },

  // 根据坐标获取店铺分页列表
  async getShopList(name){
    const data = {
      coordCur: this.data.options,
      curPage: this.data.curPage,
      pageSize: 10,
      name: name
    }
    const res = await queryWithImgDistancePage(data)
    const list = res.data && res.data.records
    this.setData({noMore: list.length < 10, loading: false, pullRefresh: false})
    list.forEach(item => {
      if(item.coordTx){
        item.longitude = Number(item.coordTx.split(',')[0])
        item.latitude = Number(item.coordTx.split(',')[1])
      }
    })
    if(this.data.curPage === 1){
      this.setData({ list })
    }else{
      let list = this.data.list
      list = list.concat(list)
      this.setData({ list })
    }
  },
  // 获取用户定位
  getLocation(){
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'gcj02',
        success(res) {
          const { latitude, longitude} = res
          const options = longitude + ',' + latitude
          resolve(options)
        },
        fail(err) {
          const options = '114.132021,22.563851'
          reject(options)
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad () {
    try{
      const options = await this.getLocation()
      this.setData({ options })
      this.getShopList()
    } catch(options){
      this.setData({ options })
      this.getShopList()
    }
    this.setData({loading: true})
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
    this.setTabBarStyleAndsetNavigationBarColor(false, 3) 
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