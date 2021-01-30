// pages/shoppingCart/classify/index.js
// import {
//   Server
// } from '../../../models/server.js'

// let server = new Server()
Component({
  /**
   * 组件的属性列表
   */
  externalClasses: ['my-class'],
  properties: {
    list: {
      type: Array,
      value: [],
      observer: function(val) {
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
    globalStyle: getApp().globalData.globalStyle,
    safeArea: getApp().globalData.safeArea
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 处理购物车列表，根据大类largeCategory重新分组
    computedShoppingCartList(list, isSelect = false) {
      const firstList = list.reduce((acc, cur) => {
        cur.isSelect = isSelect
        const { largeCategory } = cur
        if (acc[largeCategory]) {
          acc[largeCategory].push(cur);
        } else {
          acc[largeCategory] = [cur]
        }
        return acc
      }, {})
      const endList = Object.keys(firstList).map(p => {
        // const number = firstList[p].reduce((acc, cur) => acc += Number(cur.stockNum), 0)
        const number = firstList[p].length
        return {
          name: p,
          list: firstList[p],
          number,
          isSelect: isSelect
        }
      })
      return endList
    },
    // 每个分类的全选和单选
    catOnChange(e) {
      const i = this.data.shopppingCartList.findIndex(p => p.name == e.target.id)
      const setSelectLanguage = 'shopppingCartList[' + i + '].isSelect'
      const list = this.data.shopppingCartList[i].list.map(p => {
        p.isSelect = !this.data.shopppingCartList[i].isSelect
        return p
      })
      const setItemSelectLanguage = 'shopppingCartList[' + i + '].list'
      this.setData({
        [setSelectLanguage]: !this.data.shopppingCartList[i].isSelect,
        [setItemSelectLanguage]: list
      })
      // 判断是否全选
      this.checkIsAll()
    },

    // 单个选中和取消
    itemOnChange(e, type) {
      const i = e.target.dataset.i
      const itemIndex = e.target.dataset.goodsindex
      const setSelectLanguage = 'shopppingCartList[' + i + '].isSelect'
      const setItemSelectLanguage = 'shopppingCartList[' + i + '].list[' + itemIndex + '].isSelect'
      let itemSelected
      if (type) {
        itemSelected = false
      } else {
        itemSelected = this.data.shopppingCartList[i].list[itemIndex].isSelect
      }
      if (itemSelected) {
        this.setData({
          [setSelectLanguage]: false,
          [setItemSelectLanguage]: false
        })
      } else {
        const itemSelectedList = this.data.shopppingCartList[i].list.filter(p => p.isSelect)
        const itemList = this.data.shopppingCartList[i].list
        const isAllSelect = itemSelectedList.length == itemList.length
        this.setData({
          [setSelectLanguage]: isAllSelect,
          [setItemSelectLanguage]: true
        })
      }
      // 判断是否全选
      this.checkIsAll()
    },

    // 检查是否全选
    checkIsAll() {
      const isAll = this.data.shopppingCartList.filter(p => p.isSelect).length == this.data.shopppingCartList.length
      this.setData({
        allSelect: isAll
      })
      // 处理商品总数
      this.computedResult()
    },
    // 全选按钮
    allOnChange() {
      this.setData({
        shopppingCartList: this.computedShoppingCartList(this.data.list, !this.data.allSelect),
        allSelect: !this.data.allSelect
      })
      // 处理商品总数
      this.computedResult()
    },
    // 增加和减少商品件数
    stepperOnChange(e) {
      const i = e.target.dataset.i
      const itemIndex = e.target.dataset.goodsindex
      const setItemSelectLanguage = 'shopppingCartList[' + i + '].list[' + itemIndex + '].count'
      this.setData({
        [setItemSelectLanguage]: e.detail
      })
      this.itemOnChange(e, true)
    },
    // 处理商品总数
    computedResult() {
      const goodsTotalInfo = this.data.shopppingCartList.reduce((acc, cur) => {
        const selectedList = cur.list.filter(p => p.isSelect)
        const money = acc.money + selectedList.reduce((a, c) => a += c.orderedPrice * c.count, 0)
        const number = acc.number + selectedList.reduce((a, c) => a += c.count, 0)
        return {
          money,
          number
        }
      }, { money: 0, number: 0 })
      this.setData({
        shoppingCartMoney: goodsTotalInfo.money,
        shoppingCartNumber: goodsTotalInfo.number
      })
    },
    // 跳转详情
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
    onCloseSwipe() {
      if (this.data.instance) {
        this.data.instance.close()
      }
    },
    onSwipeOpen(event) {
      if (this.data.instance) {
        this.data.instance.close()
      }
      const instance = this.selectComponent('#item-' + event.currentTarget.id)
      this.setData({
        instance
      })
    },
    // 滑动删除
    onSwipeClose(event) {
      // const { position, instance } = event.detail;
      const instance = this.selectComponent('#item-' + event.target.id)
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

    deleteGoods(goods, cb) {
      const params = [goods.id]
      // server.deleteShoppingCart(params).then(res => {
      //   cb(res)
      // })
    },

    deleteOrEditMethods() {
      const list = this.data.shopppingCartList.reduce((acc, cur) => {
        const itemList = cur.list.reduce((a, c) => {
          if (c.isSelect) {
            a.push({
              id: c.id,
              count: c.count,
              code: c.productCodeId,
              stockNum: c.stockNum,
            })
          }
          return a
        }, [])
        acc = acc.concat(itemList)
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
                // server.deleteShoppingCart(params).then(deleteRes => {
                //   wx.showToast({
                //     title: '删除成功',
                //     icon: 'none',
                //     duration: 2000
                //   })
                //   _this.triggerEvent('update')
                // })
              }
            }
          })
        } else {
          wx.showToast({
            title: '请选择商品',
            icon: 'none',
            duration: 2000
          })
        }
      } else {
        // 分享
        if (list.length > 0) {
          const isLostList = this.hasShopping()
          if (isLostList.length > 0) {
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
            title: '请选择商品',
            icon: 'none',
            duration: 2000
          })
        }  
      }
    },

    hasShopping() {
      const list = this.data.shopppingCartList.reduce((acc, cur) => {
        const itemList = cur.list.reduce((a, c) => {
          if (c.isSelect) {
            const isLost = c.valid == 0 || (c.valid == 1 && c.isNullStock == 1 && c.stockNum <= 0)
            if (!isLost) {
              a.push(c.id)
            }
          }
          return a
        }, [])
        acc = acc.concat(itemList)
        return acc
      }, [])
      return list
    },

    computedShopppingCartCount() {
      return this.data.shopppingCartList.reduce((acc, cur) => {
        const itemList = cur.list.reduce((a, c) => {
          a.push({
            productCodeId: c.productCodeId,
            count: c.count,
            productId: c.productId,
          })
          return a
        }, [])
        acc = acc.concat(itemList)
        return acc
      }, [])
    }
  }
})
