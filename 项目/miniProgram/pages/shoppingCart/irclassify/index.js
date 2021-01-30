// pages/shoppingCart/irclassify/index.js
import {
  Server
} from '../../../models/server.js'

let server = new Server()
Component({
  /**
   * 组件的属性列表
   */
  externalClasses: ['my-class'],
  properties: {
    list: {
      type: Array,
      value: [],
      observer: function (val) {
        this.setData({
          shopppingCartList: this.computedShoppingCartList(val),
          allSelect: false,
          shoppingCartMoney: 0,
          shoppingCartNumber: 0
        })
      }
    },
    isEditting: {
      type: Boolean,
      value: false,
      observer: function (val) {
        this.setData({
          isEdit: val
        })
      }
    },
    globalStyle: {
      type: String,
      value: '0'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    shopppingCartList: [],
    allSelect: false,
    isEdit: false,
    shoppingCartMoney: 0,
    shoppingCartNumber: 0,
    instance: null,
    globalStyle: getApp().globalData.globalStyle,
    safeArea: getApp().globalData.safeArea
  },

  /**
   * 组件的方法列表
   */
  methods: {
    computedShoppingCartList(list, isSelect = false) {
      return list.map(p => {
        p.isSelect = isSelect
        return p
      })
    },

    itemOnChange(e, type) {
      const setSelectLanguage = 'shopppingCartList[' + e.target.dataset.goodsindex + '].isSelect'
      this.setData({
        [setSelectLanguage]: !type ? !this.data.shopppingCartList[e.target.dataset.goodsindex].isSelect : true
      })
      this.computedResult()
      // 检查是否全选
      const isAll = this.data.shopppingCartList.filter(p => p.isSelect).length == this.data.shopppingCartList.length
      this.setData({
        allSelect: isAll
      })
    },

    allOnChange() {
      this.setData({
        shopppingCartList: this.computedShoppingCartList(this.data.list, !this.data.allSelect),
        allSelect: !this.data.allSelect
      })
      this.computedResult()
    },

    stepperOnChange(e) {
      const setSelectLanguage = 'shopppingCartList[' + e.target.dataset.goodsindex + '].count'
      this.setData({
        [setSelectLanguage]: e.detail
      })
      this.itemOnChange(e, true)
    },

    // 计算合计和件数
    computedResult() {
      const goodsTotalInfo = this.data.shopppingCartList.reduce((acc, cur) => {
        let money = acc.money
        let number = acc.number
        if (cur.isSelect) {
          money = money + cur.orderedPrice * cur.count
          number = number + cur.count
        }
        return {
          money,
          number
        }
      }, {money: 0, number: 0})
      this.setData({
        shoppingCartMoney: goodsTotalInfo.money,
        shoppingCartNumber: goodsTotalInfo.number
      })
    },
    onCloseSwipe() {
      if (this.data.instance) {
        this.data.instance.close()
      }
    },
    onSwipeOpen(event) {
      if (this.data.instance) {
        this.data.instance.close()
      }
      const instance = this.selectComponent('#' + event.currentTarget.id)
      this.setData({
        instance
      })
    },
    onSwipeClose(event) {
      console.log(event)
      // const { position, instance } = event.detail;
      const instance = this.selectComponent('#item-' + event.target.id)
      console.log(instance)
      // if (position == 'right') {
      const _this = this;
      wx.showModal({
        title: '温馨提示',
        content: '确定删除该商品吗？',
        success(res) {
          if (res.confirm) {
            _this.deleteGoods(event.target.dataset.goods, (deleteRes) => {
              if (deleteRes.code === 0) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'none',
                  duration: 2000
                })
                _this.triggerEvent('update')
                // instance.close()
              }
            })
          }
          //  else if (res.cancel) {
          //   instance.close()
          // }
        }
      })
      // }
    },
    goodsDetail(e) {
      const goods = e.currentTarget.dataset.goods
      // 判断是否下架
      const isLost = goods.valid == 0 || (goods.valid == 1 && goods.isNullStock == 1 && goods.stockNum <= 0)
      if (isLost) {
        wx.showToast({
          title: '商品已下架',
          duration: 2000,
          icon: 'none'
        })
      } else {
        const params = {
          proId: goods.productId,
          storageType: goods.storageType
        }
        wx.navigateTo({
          url: '/pages/goodsDetail/index?detail=' + encodeURIComponent(JSON.stringify(params))
        })
      }
    },
    deleteGoods(goods, cb) {
      const params = [goods.id]
      server.deleteShoppingCart(params).then(res => {
        cb(res)
      })
    },

    deleteOrEditMethods() {
      const list = this.data.shopppingCartList.reduce((acc, cur) => {
        if (cur.isSelect) {
          acc.push({
            id: cur.id,
            count: cur.count,
            code: cur.productCodeId,
            stockNum: cur.stockNum,
          })
        }
        return acc
      }, [])
      if (this.data.isEdit) {
        // 删除
        if (list.length > 0) {
          const _this = this;
          wx.showModal({
            title: '温馨提示',
            content: '确定删除该商品吗？',
            success(res) {
              if (res.confirm) {
                const params = list.reduce((a, c) => {
                  a.push(c.id)
                  return a
                }, [])
                server.deleteShoppingCart(params).then(deleteRes => {
                  wx.showToast({
                    title: '删除成功',
                    icon: 'none',
                    duration: 2000
                  })
                  _this.triggerEvent('update')
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: '请选择',
            icon: 'none',
            duration: 2000
          })
        }
      } else {
        // 分享
        if (list.length > 0) {
          const isLostList = this.hasShopping()
          if (isLostList.length > 0) {
            console.log('现货分享')
            this.triggerEvent('share', list)
          } else {
            wx.showToast({
              title: '您选择的商品都已下架，无法下单',
              icon: 'none',
              duration: 2000
            })
          }
        } else {
          wx.showToast({
            title: '请选择',
            icon: 'none',
            duration: 2000
          })
        } 
      }
    },

    hasShopping() {
      const list = this.data.shopppingCartList.reduce((acc, cur) => {
        if (cur.isSelect) {
          const isLost = cur.valid == 0 || (cur.valid == 1 && cur.isNullStock == 1 && cur.stockNum <= 0)
          if (!isLost) {
            acc.push(cur.id)
          }
        }
        return acc
      }, [])
      return list
    },

    computedShopppingCartCount() {
      return this.data.shopppingCartList.reduce((acc, cur) => {
        acc.push({
          productCodeId: cur.productCodeId,
          count: cur.count,
          productId: cur.productId
        })
        return acc
      }, [])
    }
  }
})
