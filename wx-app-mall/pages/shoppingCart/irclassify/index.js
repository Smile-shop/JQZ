import { delBatchShoppingCart, updateShoppingCart } from '../../../api/shoppingCart'
import { bindMemberInfo } from '../../../api/register'
import { saveGoods } from '../../../utils/order'
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Object,
      value: {},
      observer(val) {
        let allSelect
        const isValidList = val.invalidGoogsList || []
        const shopppingCartList = val.googsList || []
        if (this.data.isEditting) {
          this.filterSeleted(isValidList)
        } else {
          allSelect = this.data.seletedDataId.length >= shopppingCartList.length
        }
        this.filterSeleted(shopppingCartList)
        const allList = isValidList.concat(shopppingCartList)
        this.setData({
          shopppingCartList,
          shoppingCartMoney: 0,
          shoppingCartNumber: 0,
          isValidList,
          allList,
          allSelect
        })
        this.computedResult()
      }
    },
    isEditting: {
      type: Boolean,
      value: false,
      observer(isEdit) {
        const isValidList = this.data.isValidList
        isValidList.forEach(item => {
          item.isSelect = false
        })
        const seletedData = this.data.shopppingCartList.filter(item => item.isSelect)
        const allSelect = !isEdit && seletedData.length == this.data.shopppingCartList.length && this.data.shopppingCartList.length !== 0 ? true : false
        this.setData({
          isValidList,
          isEdit,
          allSelect,
          seletedData
        })
        this.triggerEvent('getSelectGoods', {selectGoodsNum: this.data.seletedData.length})
      }
    },
    pullRefresh: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    shopppingCartList: [],
    isValidList: [],
    allSelect: false,
    isEdit: false,
    shoppingCartMoney: 0,
    shoppingCartNumber: 0,
    instance: null,
    globalStyle: getApp().globalData.globalStyle,
    safeArea: getApp().globalData.safeArea,
    showConfirm: false,
    showCollConfirm: false,
    clearCollectConfirm: false,
    bindPhone: false,
    seletedData: [],
    seletedDataId: [],
    selectedIndex: '',
    selectedType: '',
    allList: []
  },

  lifetimes:{
    ready(){
      const bindPhone = !(app.globalData.userInfoAndStore && app.globalData.userInfoAndStore.member)
      this.setData({ bindPhone })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    filterSeleted(data){
      data.forEach(item => item.isSelect = this.data.seletedDataId.includes(item.id) ? true : false)
    },
    // 下拉刷新
    refresh(){
      this.triggerEvent('updateList')
    },
    // 加载更多
    handleMore(){},
    // 确定清空非正常状态的商品
    async confirmClearCollect(){
      const list = this.data.isValidList.map(item => item.id)
      const res = await delBatchShoppingCart(list)
      if(!res.code){
        this.setData({clearCollectConfirm: false, isValidList: []})
        wx.showToast({
          title: '清空成功',
          icon: 'none'
        })
      }
    },
    // 确定移入收藏夹
    collectConfirm(){
      console.log(this.data.selectedType)
      const shopppingCartList = this.data.shopppingCartList
      const isValidList = this.data.isValidList
      if(this.data.selectedType == 'n'){
        this.data.shopppingCartList.splice(this.data.selectedIndex, 1)
      }else{
        this.data.isValidList.splice(this.data.selectedIndex, 1)
      }
      wx.showToast({
        title: '收藏成功',
        icon: 'none'
      })
      this.setData({showCollConfirm: false, shopppingCartList, isValidList})
      if(this.data.instance){
        this.data.instance.close()
      }
    },
    // 唤起清除非正常商品提示弹窗
    clearCollect(){
      this.setData({clearCollectConfirm: true})
    },
    // 唤起加入收藏夹提示弹窗
    moveCollect(e){
      const { goods, index, type } = e.target.dataset
      const selectedIndex = index || 0
      const selectedType = type
      const allData = this.data.shopppingCartList.concat(this.data.isValidList)
      const seleted = allData.filter(item => item.isSelect == true)
      if(seleted.length || selectedType != 'all'){
        this.setData({showCollConfirm: true, selectedIndex, selectedType})
      }else{
        wx.showToast({
          title: '请选择商品',
          icon: 'none'
        })
      }
    },
    // 确认删除商品
    async confirm(){
      let shopppingCartList = this.data.shopppingCartList
      let isValidList = this.data.isValidList
      const allData = this.data.shopppingCartList.concat(this.data.isValidList)
      const seleteId = allData.filter(item => item.isSelect == true).map(item => item.id)
      const list = seleteId.length && this.data.selectedType == 'all' ? seleteId : [this.data.selectedType == 'n' ? shopppingCartList[this.data.selectedIndex].id : isValidList[this.data.selectedIndex].id]
      await delBatchShoppingCart(list)
      wx.showToast({
        title: '删除成功',
        icon: 'none'
      })
      if(this.data.selectedType == 'n'){
        shopppingCartList.splice(this.data.selectedIndex, 1)
      }else if (this.data.selectedType == 'v'){
        isValidList.splice(this.data.selectedIndex, 1)
      }else{
        shopppingCartList = shopppingCartList.filter(item => !list.includes(item.id))
        isValidList = isValidList.filter(item => !list.includes(item.id))
      }
      this.setData({showConfirm: false, shopppingCartList, isValidList})
      this.triggerEvent('upDateCarGoods', {goodsLength: shopppingCartList.concat(isValidList).length})
      if(this.data.instance){
        this.data.instance.close()
      }
    },
    // 改变全选选中状态
    computedShoppingCartList(list, isSelect = false) {
      return list.map(p => { p.isSelect = isSelect; return p })
    },
    // 单选
    itemOnChange(e, type) {
      // type 是否在点击数量加减的时候自动选中
      if(e.target.dataset.type == 'n'){
        const setSelectLanguage = 'shopppingCartList[' + e.target.dataset.goodsindex + '].isSelect'
        this.setData({
          [setSelectLanguage]: !type ? !this.data.shopppingCartList[e.target.dataset.goodsindex].isSelect : true
        })
      }else{
        const setSelectLanguage = 'isValidList[' + e.target.dataset.goodsindex + '].isSelect'
        this.setData({
          [setSelectLanguage]: !type ? !this.data.isValidList[e.target.dataset.goodsindex].isSelect : true
        })
      }
      const seletedData = this.data.shopppingCartList.filter(p => p.isSelect).concat(this.data.isValidList.filter(p => p.isSelect))
      // 检查是否全选
      let allSelect = false
      if(this.data.isEdit){
        allSelect = seletedData.length == this.data.allList.length
      }else{
        allSelect = this.data.shopppingCartList.filter(p => p.isSelect).length == this.data.shopppingCartList.length
      }
      this.setData({
        allSelect,
        seletedData
      })
      this.computedResult()
    },
    // 改变全选选中状态
    allOnChange(e) {
      const shopppingCartList = this.computedShoppingCartList(this.data.shopppingCartList, !this.data.allSelect)
      const isValidList = this.data.isEdit ? this.computedShoppingCartList(this.data.isValidList, !this.data.allSelect) : this.computedShoppingCartList(this.data.isValidList, false)
      this.setData({
        shopppingCartList,
        isValidList,
        allSelect: !this.data.allSelect,
        seletedData: e.detail ? (this.data.isEdit ? shopppingCartList.concat(isValidList) : shopppingCartList) : []
      })
      this.computedResult()
    },
    getSeletedId() {
      const seletedDataId = this.data.seletedData.map(item => item.id)
      this.setData({ seletedDataId })
    },
    // 改变购物车数量
    async stepperOnChange(e) {
      const { goods, goodsindex } = e.target.dataset
      const data = {
        "id": goods.id,
        "quantity": e.detail,
        "skuId": goods.skuId,
        "storeId": app.globalData.storeId
      }
      await updateShoppingCart(data)
      const setSelectLanguage = 'shopppingCartList[' + goodsindex + '].quantity'
      this.setData({
        [setSelectLanguage]: e.detail
      })
      this.computedResult()
    },
    // 计算选中商品合计和件数
    computedResult() {
      this.getSeletedId()
      const goodsTotalInfo = this.data.shopppingCartList.reduce((acc, cur) => {
        let money = acc.money
        let number = acc.number
        if (cur.isSelect) {
          money += cur.price * cur.quantity
          number += cur.quantity
        }
        return { money,  number }
      }, {money: 0, number: 0})
      this.setData({
        shoppingCartMoney: goodsTotalInfo.money,
        shoppingCartNumber: goodsTotalInfo.number
      })
      this.triggerEvent('getSelectGoods', {selectGoodsNum: this.data.seletedData.length})
    },
    // 唤起删除商品弹窗
    onDel(e) {
      const { goods, index, type } = e.target.dataset
      const selectedIndex = index || 0
      const selectedType = type
      const allData = this.data.shopppingCartList.concat(this.data.isValidList)
      const seleted = allData.filter(item => item.isSelect == true)
      if(seleted.length || selectedType != 'all'){
        this.setData({showConfirm: true, selectedIndex, selectedType})
      }else{
        wx.showToast({
          title: '请选择商品',
          icon: 'none'
        })
      }
    },
    stop(){},
    // 商品详情
    goodsDetail(e) {
      const { goods } = e.currentTarget.dataset
      // 判断货品是否正常
      const isLost = goods.skuStatus
      if (isLost == '正常' || isLost == '缺货中') {
        wx.navigateTo({
          url: `/pages/goodsDetail/index?skuId=${goods.skuId}&spuId=${goods.spuId}`
        })
      } else {
        wx.showToast({
          title: goods.skuStatus,
          duration: 2000,
          icon: 'none'
        })
      }
    },
    // 获取用户手机号
    bindgetphonenumber(e) {
      console.log(e.detail)
      const mark = e.detail.errMsg
      const flag = 'getPhoneNumber:ok'
      if (mark == flag) {
        const phone = e.detail
        phone.storeId = app.globalData.storeId
        delete phone.errMsg
        this.bindMemberInfo(phone)
      }
    },
    // 绑定手机
    async bindMemberInfo(data){
      await bindMemberInfo(data)
      this.setData({bindPhone: false})
      wx.showToast({
        title: '绑定成功',
        icon: 'none'
      })
    },
    // 去结算
    settlement() {
      if(!this.data.shoppingCartNumber || this.data.bindPhone) return
      const list = this.data.shopppingCartList.filter(item => item.isSelect)
      for (let i = 0; i < list.length; i++){
        const item = list[i]
        if(item.quantity > item.stock){
          return wx.showToast({
            title: `${item.title}库存不足${item.quantity}件`,
            icon: 'none'
          })
        }
      }
      if (list.length && saveGoods(list)) {
        wx.navigateTo({
          url: `/pages/confirmOrder/index`
        })
      }
    }
  }
})
