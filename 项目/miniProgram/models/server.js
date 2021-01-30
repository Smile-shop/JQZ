import {
  HTTP
} from '../utils/http.js'
import {
  BASE_URL
} from '../config.js'
import { checkHasLogined } from '../utils/auth.js'


class Server extends HTTP {

  // 登录
  wxLogin(js_code, appid) {
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/auth/login`,
      method: 'POST',
      data: {
        js_code,
        appid
      }
    })
  }

  // 检查session_key
  checkSessionKey({ session_key }) {
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/auth/checksessionkey`,
      method: 'POST',
      data: {
        session_key
      }
    })
  }

  // 解密用户信息
  decryptMsg({ encryptedData, iv }) {
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/auth/decryptMsg`,
      method: 'POST',
      data: {
        encryptedData,
        iv
      }
    })
  }

  // 发送验证码
  sendMSMCode({ phone }) {
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/customer/login/sendcode`,
      method: 'POST',
      data: {
        phone
      }
    })
  }

  // 手机登录
  phoneLogin({ phone, verifyCode }) {
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/customer/login/verify`,
      method: 'POST',
      data: {
        phone,
        verifyCode
      }
    })
  }

  // 模糊搜索
  fuzzySearch(name = '', showCount = 20) {
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/proQuery/fuzzySearchProList`,
      method: 'POST',
      data: {
        name,
        showCount
      }
    })
  }

  // 首页
  getHomeGoods(companyKey) {
    const header = {}
    if (companyKey) header.companyKey = companyKey
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/wholesale/home`,
      method: 'POST',
      header
    })
  }

  // 商品列表查询
  searchGoods(text, pageNum = 1, pageSize = 100) {
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/proQuery/proConditionList`,
      method: 'POST',
      data: {
        data: {
          text
        },
        page: {
          pageNum,
          pageSize
        }
      }
    })
  }

  // 购物车列表
  getShoppingCartList({pageNum = 1, pageSize = 2, sort = 0}) {
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/shoppingcart/my`,
      method: 'POST',
      data: {
        page: {
          pageNum,
          pageSize
        },
        data: {
          sort: Number(sort)
        }
      }
    })
  }

  // 删除购物车商品
  deleteShoppingCart(idList) {
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/shoppingcart/remove`,
      method: 'POST',
      data: {
        idList
      }
    })
  }

  // 更新购物车数量
  updateShoppingCart(list) {
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/shoppingcart/update`,
      method: 'POST',
      data: {
        list
      }
    })
  }

  // 分类
  getGoodsCategory() {
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/wholesale/classifiedSerCondition`,
      method: 'POST'
    })
  }

  // 商品列表
  getGoodsList(options) {
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/proQuery/proConditionList`,
      method: 'POST',
      data: options
    })
  }

  // 更多款式
  getGoodsMoreType(options) {
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/shoppingcart/productCodeList`,
      method: 'POST',
      data: options
    })
  }

  // 商品详情
  getGoodsDetail(options, loading) {
    const header = {}
    if (getApp().globalData.isVisitor) {
      header.ticket = getApp().globalData.shareTicket
    }
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/proQuery/proDetail`,
      method: 'POST',
      data: options,
      loading: loading,
      header
    })
  }

  // 查询别名
  getAlias() {
    const header = {}
    if (getApp().globalData.isVisitor) {
      header.ticket = getApp().globalData.shareTicket
    }
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/proQuery/proParamsNames`,
      method: 'POST',
      data: {}
    })
  }

  // 添加购物车
  postCartAdd(options, loading) {
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/shoppingcart/add`,
      method: 'POST',
      data: options,
      loading: loading,
    })
  }

  // 查询购物车数量
  getCartNumber() {
    const header = {}
    if (getApp().globalData.isVisitor) {
      header.ticket = getApp().globalData.shareTicket
    }
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/shoppingcart/count`,
      method: 'POST',
      data: {},
      loading: false,
    })
  }

  // 获取下载excel文件链接
  getDownloadUrl(list) {
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/excel/export`,
      method: 'POST',
      data: list
    })
  }

  // 添加收藏
  postCollection(options, loading) {
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/favorite/add`,
      method: 'POST',
      data: options,
      loading: loading,
    })
  }

  // 取消收藏
  updateCollection(options, loading) {
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/favorite/remove`,
      method: 'POST',
      data: options,
      loading: loading,
    })
  }

   // 我的收藏列表
   getMyCollection({ pageNum, pageSize}) {
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/favorite/my`,
      method: 'POST',
      data: {
        pageNum,
        pageSize
      }
    })
  }
  // 客户信息接口
  customerInfo() {
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/customer/info`,
      method: 'POST',
      data: {}
    })
  }
  // 编辑客户信息接口
  getEdit(params) {
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/customer/edit`,
      method: 'POST',
      data: params
    })
  }

  // 取消商品收藏接口
  getRemove(params) {
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/favorite/remove`,
      method: 'POST',
      data: params
    })
  }

  // 加入购物车
  addShoppingCart(params) {
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/shoppingcart/add`,
      method: 'POST',
      data: params
    })
  }
// 多品-添加到购物车的商品列表
  productCodeList(params) {
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/shoppingcart/productCodeList`,
      method: 'POST',
      data: params
    })
  }

  // 查询预订单集合
  queryPerOrderSet(params) {
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/order/productDetails`,
      method: 'POST',
      data: params,
    })
  }

  // 查询订单
  queryOrder(params) {
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/order/cusOrderList`,
      method: 'POST',
      data: params,
    })
  }

  // 查询订单统计
  queryOrderCount(params) {
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/order/countOrder?customerId=${params}`,
      method: 'POST',
      data: params,
    })
  }

  // 查询订单详情
  queryOrderDetail(params) {
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/order/orderDetails?orderId=${params}`,
      method: 'POST',
      data: params,
    })
  }

  // 提交订单
  bookOrder(params) {
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/order/add`,
      method: 'POST',
      data: params,
    })
  }

  // 取消订单
  cancelOrder(params) {
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/order/customerCancel`,
      method: 'POST',
      data: params
    })
  }

  // 查询订单子商品列表
  queryOrderChildList(params) {
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/order/orderProductDetails`,
      method: 'POST',
      data: params,
    })
  }

  // 查询订单类型
  queryOrderType(params) {
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/order/orderDetails`,
      method: 'POST',
      data: params,
    })
  }

  // 查询订单价格排序
  queryOrderPrice(params) {
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/shoppingcart/orderType`,
      method: 'POST',
      data: params,
    })
  }

  // 查询小程序模板
  queryTemplate(params) {
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/wholesale/miniTemplateIdList`,
      method: 'POST',
      data: params,
    })
  }

  // 查询用户图像和名称
  queryUserNameImg(params) {
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/wholesale`,
      method: 'POST',
      data: params,
    })
  }

  // 存储微信图像和名称
  keepUserNameImg(params) {
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/wholesale`,
      method: 'POST',
      data: params,
    })
  }
  
  // 分享海报
  getPoster(params) {
    return this.request({
      url: `${BASE_URL}/wholesale-web/miniprogram/poster/getPoster`,
      method: 'GET',
      data: params
    })
  }
}

export { Server }
