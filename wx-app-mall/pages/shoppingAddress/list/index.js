// pages/shoppingAddress/list/index.js
import { deleteShipAddress } from '../../../api/address'
import log from '../../../utils/log'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: []
    },
    fromOrder: {
      type: Boolean,
      value: false
    },
    edit: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    instance: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClose(event) {
      log('关闭调用')
      const { instance } = event.detail;
      this.setData({ instance })
    },
    async showTip(msg) {
      const text = '删除' + msg
      wx.showToast({
        title: text,
        icon: 'none'
      })
      this.data.instance.close()
      this.triggerEvent('reloadAddressList')
    },
    async delData(id) {
      const res = await deleteShipAddress(id)
      const { msg } = res
      log('删除接口', msg)
      this.showTip(msg)
    },
    del(e) {
      log('删除的地址', e)
      const id = e.currentTarget.dataset.item.id || ''
      if (id) {
        wx.showModal({
          title: '提示',
          content: '确认删除吗',
          success: (res) => {
            if (res.confirm) {
              log('点击确定')
              this.delData(id)
            } else if (res.cancel) {
              log('点击取消')
              this.data.instance.close()
            }
            // this.data.instance.close()
            // wx.showToast({
            //   title: '删除成功',
            //   icon: 'none'
            // })
          }
        })
      }
    },
    edit(e) {
      const { id } = e.currentTarget.dataset
      const order = true
      wx.navigateTo({
        url: `/pages/addAddress/index?id=${id}&order=${order}`,
      })
    },
    choose(e) {
      if (this.data.fromOrder) {
        try {
          const value = wx.getStorageSync('orderDetail')
          if (value) {
            const orderDetail = Object.assign({}, value, { address: e.target.dataset.item })
            wx.setStorage({
              key: "orderDetail",
              data: orderDetail,
              success: () => {
                console.log(getCurrentPages().length)
                const pageLength = getCurrentPages().length
                if(pageLength % 2 == 0 && this.data.edit || pageLength == 5){
                  wx.navigateBack({ delta: 2 })
                }else{
                  wx.navigateBack({ delta: 1 })
                  wx.reLaunch({
                    url: 'url',
                  })
                }
                // wx.navigateTo({
                //   url: '/pages/confirmOrder/index'
                // })
              }
            })
          }
        } catch (e) {}
      }
    }
  }
})
