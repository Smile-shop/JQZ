// components/local/goldPrice/index.js
let isCircling = false
let transformWidth = 0
let transformSpeed = 0
let recoverTransformWidth = 0

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: [],
      observer: function(val) {
        const goldPriceText = val.reduce((acc, cur, index) => {
          const comma = index == 0 ? '' : ', '
          const text = comma + cur.materialCondition + ' ￥' + cur.goldPrice
          return acc + text
        }, '')
        this.setData({
          goldPriceText,
        }, () => {
          if (val.length > 0) {
            this.createAnimation()
          }
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
    animationData: {},
    goldPriceText: '',
    // globalStyle: getApp().globalData.globalStyle
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取view宽度
    getViewWidth(id) {
      return new Promise((resolve, reject) => {
        this.createSelectorQuery().select(id).boundingClientRect(rect => {
          if (rect) {
            resolve(rect.width)
          } else {
            reject(false)
          }
        }).exec()
      })
    },
    // 封装同时获取
    getAllWiewWidth(cb) {
      Promise.all([this.getViewWidth('#move-content'), this.getViewWidth('#move-container')]).then(res => {
        const [contentWidth, containerWidth] = res;
        cb({ contentWidth, containerWidth })
      }).catch(err => {
        console.log('无法获取视图元素')
      })
    },
    // 创建动画
    createAnimation() {
      this.getAllWiewWidth(res => {
        const { contentWidth, containerWidth } = res
        if (contentWidth > containerWidth) {
          // 计算滚动距离  并留50的空格
          // transformWidth = contentWidth - containerWidth + 20
          transformWidth = contentWidth
          // 计算返回的距离
          recoverTransformWidth = containerWidth
          // 计算滚动速度 每s滚动50像素
          transformSpeed = transformWidth / 50 * 1000
          this.animation = wx.createAnimation({
            duration: transformSpeed,
            timingFunction: 'linear',
            delay: 0
          })
          isCircling = true
          this.reAnimation(1)
        }
      })
    },
    // 监听动画结束，并重新启动
    reAnimation(e) {
      setTimeout(function () {
        isCircling = !isCircling
        const duration = isCircling ? transformSpeed : 10
        const width = isCircling ? -transformWidth : (e === 1 ? 0 : recoverTransformWidth)
        this.animation.translateX(width).step({ duration: duration })
        this.setData({
          animationData: this.animation.export(),
          globalStyle: getApp().globalData.globalStyle
        })
      }.bind(this), 200)
    }

  }
})
