// pages/addAddress/index.js
import { addShipAddress, queryShipAddressId, deleteShipAddress, updateShipAddress } from '../../api/address'
import log from '../../utils/log'
Page({
  mixins: [require('../../mixins/setColor.js')],
  /**
   * 页面的初始数据
   */
  data: {
    formData: {
      name: '',
      phone: '',
      areaName: '',
      detail: '',
      checked: ''
    },
    detailFort: 'textarea',
    show: false,
    showConfirm: false,
    navbarData: {
      goback: true,
      gohome: true,
      title: '新增收货地址',
      style: 1
    },
    edit: false,
    focus: false,
  },

  // 根据情况是否编辑
  editAddress() {
    this.setData({
      edit: true,
    })
  },

  // 根据 id 查地址后对应渲染
  renderAddress(address) {
    log(address)
    const info = address
    const result = {}
    result.name = info.receiver
    result.phone = info.phone
    result.checked = info.isDefault === 'Y' ? true : false
    result.detail = info.address
    result.areaName = info.province + ' / ' + info.city + ' / ' + info.district + ' /' + info.street
    result.label = info.label
    result.id = info.id
    this.setData({
      formData: result,
    })
  },

  // 根据 id 查询地址
  async queryAddressById(id) {
    const res = await queryShipAddressId(id)
    log('id收货地址', res)
    const { data } = res
    this.renderAddress(data)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    log('详情地址', options.id)
    const argsId = options.id
    if (options.id) {
      const name = 'navbarData.title'
      this.setData({
        [name]: '编辑收货地址',
      })
      this.queryAddressById(argsId)
      this.editAddress()
    }
  },
  getData: function (e) {
    this.setAdress();
    this.setData({ 'formData.areaName': e.detail.cityAreaArray.map(function (v) { return v.name; }).join(' / ') })

    wx.showToast({
      title: "你选择了" + e.detail.cityAreaArray.map(function (v) { return v.name; }).join(' / '),
      icon: 'none'
    });
  },
  setAdress() {
    log('关闭输入键盘', this.data.focus, this.data.show)
    if (!this.data.focus) {
      log('开启popup')
      const mark = this.data.show ? false : true
      this.data.show = mark
      this.setData({ show: mark })
    }
    if(this.data.show){
      log('关闭')
      this.data.focus = false
      this.setData({ focus: false })
    }

    //解决van-popup组件包裹tabs组件第一次渲染不显示下划线问题
    setTimeout(() => {

      this.selectComponent("#address").setLine()
    }, 400)
  },
  // 改变输入 textarea 
  changeText() {
    this.setData({
      detailFort: 'text'
    })
  },
  selete() {
    log('选择地址')
    this.setAdress()
  },
  cancelFocus() {
    log('获得焦点解除地址')
    this.data.show = false
    this.setData({ show: false })
  },
  detailFocus() {
    log('获得焦点解除地址')
    this.data.show = false
    const formData = this.data.formData
    if (!formData.detail) {
      log('头一次进入详情输入')
      formData.detail = ' '
      this.setData({ 
        formData: formData,
      })
    }
    this.setData({ 
      show: false,
    })
  },
  resetDetail() {
    const formData = this.data.formData
    if (formData.detail == ' ') {
      formData.detail = ''
      this.setData({ 
        formData: formData,
      })
    }
  },
  blur(e) {
    log('关闭选择地址')
    if (!this.data.show) {
      this.data.show = false
      this.setData({ show: false })
    }
    
    log('值', e)
    const { id } = e.target
    const idName = `formData.${id}`
    this.setData({ [idName]: e.detail })
    log(this.data.formData)
  },
  onChange(e) {
    this.setData({ 'formData.checked': e.detail })
  },
  // 返回上一页
  backPrePage(time = 2000) {
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/shoppingAddress/index?order=true&edit=true'
      })
    }, time)
  },
  // 保存成功提示
  saveSucTip(text, time = 2000, icon = 'none',) {
    const info = '保存' + text
    wx.showToast({
      icon: icon,
      title: info,
      duration: time,
    })
  },
  // 拆分符合后台的地址
  filterAddressSave(curAddress) {
    log('地址', curAddress, curAddress.detail)
    const info = curAddress
    const list = info.areaName.split('\/')
    const arr = []
    list.map(item => {
      arr.push(item.trim())
    })
    const result = {}
    result.province = arr[0]
    result.city = arr[1]
    result.district = arr[2]
    result.street = arr[3]
    result.phone = info.phone
    result.receiver = info.name
    result.isDefault = info.checked ? 'Y' : 'N'
    result.label = info.label || ''
    result.mid = info.mid || ''
    result.id = info.id || ''
    result.address = info.detail
    return result
  },
  // 修改地址
  async updateAddress() {
    log('修改地址')
    const currentAddress = this.data.formData
    const address = this.filterAddressSave(currentAddress)
    const ph = this.checkPhone(address.phone)
    const receiver = this.checkReceiver(address.receiver)
    const detail = this.checkDetail(address.address)
    if (!receiver) {
      this.phoneTip('收货人请设置 1 - 50 个字! 请正确输入', 2000)
      return
    }
    if (!detail) {
      this.phoneTip('详情地址填写 1 - 200 个字! 请正确输入', 2000)
      return
    }
    if (!ph) {
      this.phoneTip('请输入正确的手机号', 2000)
      return 
    }
    log('地址', address)
    const res = await updateShipAddress(address)
    const mark = 0
    const { code, msg } = res
    const time = 1000
    if (code === mark) {
      this.saveSucTip(msg, time)
      this.backPrePage(time)
    }
  },

  // 检测收货人
  checkReceiver(username) {
    log('收货人', username)
    let result = false
    if (username.length >= 1 && username.length <= 50) {
      result = true
    }

    return result
  },

  // 检测详情
  checkDetail(detail) {
    console.log('详情和', detail)
    let result = false
    if (detail.length >= 1 && detail.length <= 200) {
      result = true
    }

    return result
  },

  // 删除提示
  removeTip(text, time = 2000, icon = 'none') {
    const info = '删除' + text
    wx.showToast({
      title: info,
      icon: icon,
      duration: time,
    })
  },

  // 删除地址
  async remove() {
    log('删除地址')
    const id = this.data.formData.id
    if (id) {
      this.setData({
        showConfirm: true
      })
    }
  },
  // 检测手机号码
  checkPhone(phone) {
    const ph = phone
    const start = ph[0] == 1 ? true : false
    const len = phone.length == 11 ? true : false
    return start && len
  },

// 手机号提示
phoneTip(text, time = 2000, icon = 'none',) {
  const info = text
  wx.showToast({
    icon: icon,
    title: info,
    duration: time,
  })
},

// 删除地址
async confirm() {
  this.setData({
    showConfirm: false
  })
  log('删除')
  const time = 1000
  const id = this.data.formData.id
  const res = await deleteShipAddress(id)
  const { msg } = res
  this.removeTip(msg)
  this.backPrePage(time)
},

  async save() {
    // wx.navigateBack()
    const currentAddress = this.data.formData
    const address = this.filterAddressSave(currentAddress)
    const ph = this.checkPhone(address.phone)
    const receiver = this.checkReceiver(address.receiver)
    const detail = this.checkDetail(address.address)
    if (!receiver) {
      this.phoneTip('收货人请设置 1 - 50 个字! 请正确输入', 2000)
      return
    }
    if (!detail) {
      this.phoneTip('详情地址填写 1 - 200 个字! 请正确输入', 2000)
      return
    }
    if (!ph) {
      this.phoneTip('请输入正确的手机号', 2000)
      return 
    }
    const res = await addShipAddress(address)
    const mark = 0
    const { code, msg } = res
    const time = 2000
    if (code === mark) {
      this.saveSucTip(msg, time)
      this.backPrePage(time)
    }
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