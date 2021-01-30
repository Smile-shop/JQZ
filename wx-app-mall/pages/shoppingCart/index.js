
const app = getApp();
import { getUserInfoLocal } from '../../utils/userInfo'
import { queryShoppingCart } from '../../api/shoppingCart'
Page({
  mixins: [require('../../mixins/setColor.js')],
  /**
   * 页面的初始数据
   */
  data: {
    hasShoppingGoods: false,
    isEditting: false,
    loading: true,
    pageList: {},
    hasGoods: false,
    selectGoodsNum: 0,
    pullRefresh: false
  },
  upDateCarGoods(e){
    const { goodsLength } = e.detail
    if(goodsLength){
      this.setData({hasGoods: true})
    }else{
      this.setData({hasGoods: false})
    }
  },
  async getCartGoods(){
    const data = { storeId: app.globalData.storeId }
    const res = await queryShoppingCart(data)
    const pageList = res.data || {}
    if(pageList.googsList && pageList.googsList.length || pageList.invalidGoogsList && pageList.invalidGoogsList.length){
      this.setData({hasGoods: true})
    }else{
      this.setData({hasGoods: false})
    }
    this.setData({ pageList, loading: false, pullRefresh: false })
  },
  getSelectGoods(e){
    const { selectGoodsNum } = e.detail
    this.setData({ selectGoodsNum })
  },
  // 购物车编辑按钮
  editShopppingCart() {
    const isEditting = !this.data.isEditting
    this.setData({
      isEditting
    })
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
  onShow() {
    // this.getShoppingCartList(this.data.shopppingCartListSort)
    this.setData({ selectGoodsNum: 0 })
    getUserInfoLocal() ? this.getCartGoods() : this.setData({ pageList: {}, loading: false })
    this.setTabBarStyleAndsetNavigationBarColor(false, 2) 
  },
  onLoad() {},
  onHide() {}
})