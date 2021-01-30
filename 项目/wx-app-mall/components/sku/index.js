// components/sku/index.js
import log from '../../utils/log'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    sku: {
      type: Object,
      value: {},
    },
    selectedAttribute: {
      type: Object,
      value: {},
    },
    animation: {
      type: String,
      value: 'popup'
    },
    show: {
      type: Boolean,
      value: false,
    },
    number: {
      type: Number,
      value: 1,
    },
    haveStock: {
      type: Boolean,
      value: false,
    },
    spuTitle: {
      type: String,
      value: '',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    shopInfo: {
      photo: 'http://120.78.133.68/LocalUser/7015/Jewel/FC013[1].jpg',
      price: '5000',
      stock: '1000'
    },
    material: {
      selected: false,
      name: '材质',
      data: [{
        name: '红18K金',
        selected: false,
      }, {
        name: '白18K金',
        selected: false,
      }, {
        name: '精美时尚新款',
        selected: false,
      }, {
        name: '2020明星款',
        selected: false,
      }],
    },
    sku: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleColse() {
      log('关闭sku')
      this.triggerEvent('closeSku')
    },
    handle() {
      log('点击空白区域')
    },
    handleReduce(e) {
      const { num } = e.currentTarget.dataset
      log('减少', num)
      if (num <= 1) {
        return
      }
      const options = { number: num - 1 }
      this.triggerEvent('reduceNum', options)
    },
    handleAdd(e) {
      const { num } = e.currentTarget.dataset
      log('增加', num)
      const options = { number: num + 1 }
      this.triggerEvent('addNum', options)
    },
    selectedItem(e) {
      log('数据', e.target.dataset)
      const { obj, one, total, id, disabled, initdisabled } = e.target.dataset
      log('第一道', disabled, initdisabled)
      if (disabled || initdisabled) {
        return
      }
      log(e, '选中sku', obj, one, id)
      const list = total.skuPropList
      const material = this.data.material
      list.map(item => {
        log('一直增', item)
        item.propValue.forEach(it => {
          log('比较情况', it.value, it.id, it.selected)
          if (((it.value === one) && (it.id === id)) && (!it.selected)) {
            it.selected = true
            item.selected = true
            //  其余的同一个都去掉
            log('测是数据', it)
            item.propValue.forEach(keys => {
              if ((keys.selected && (keys.value != it.value))) {
                keys.selected = false
              }
            })
          } else if (((it.value === one) && (it.id === id)) && (it.selected)) {
            it.selected = false
            log('腹肌', item.name)
            //  父元素需要去掉提示么？
            item.propValue.forEach(keys => {
              if (keys.selected) {
                item.selected = true
              } else {
                item.selected = false
              }
            })
          }
        })
      })

      material.data.map(item => {
        if ((item.name === one) && (!item.selected)) {
          item.selected = true
          material.selected = true
        } else if ((item.name === one) && (item.selected)) {
          item.selected = false
          material.selected = false
        } else {
          item.selected = false
        }
      })

      // this.setData({
      //   sku: list,
      //   material: material,
      // })
      total.skuPropList = list
      this.triggerEvent('handleSku', { sku: total })
    },
    handleCart() {
      log('进入购物车')
      this.triggerEvent('addShopCart')
    },
    handleBuy() {
      log('立即购买')
      this.triggerEvent('buyNow')
    }
  }
})
