// pages/goodsCategory/index.js
const app = getApp();
import { queryGoodList } from '../../api/goodType'
import log from '../../utils/log'

Page({
  mixins: [require('../../mixins/setColor.js')],
  /**
   * 页面的初始数据
   */
  data: {
    toView: 'a0',
    activeId: 'a0',
    pageSign: 'a', // 定位标识用
    windowHeight: null, // 屏幕高度
    menuToTop: [], // 主菜单距顶部
    proListToTop: [], // 二级菜单距顶部
    heightArr: [],
    MenuheightArr: [],
    category: [],
    content: [],
    selectedGoods: [],
    filters: [],
    currentTime: new Date().getTime(),
    selectedGoodsNumber: 0,
    inputTip: '请输入正确数值',
    onceCalc: false, // 只能计算一次页面高度
    mainMenu: false, // 主菜单计算标识
    listMenu: false, // 二级菜单计算标识
    scrollMark: false, // 滚动标识
    mainScroll: 0, // 主菜单
    message: '请选中或填入筛选条件',
    identification: 'ONUPTIME',
    once: false,
    int: ['SALEPRICE', 'HANDSIZE', 'MAINSTNNUM', 'SUBSTNNUM'],
    double: ['SUBSTNWET', 'MAINSTNWET', 'GOLDWET'],
    filtersMark: {
      SALEPRICE: {
        mark: 'SALEPRICE',
        unit: ''
      },
      GOLDWET: {
        mark: 'GOLDWET',
        unit: ''
      },
      MAINSTNWET: {
        mark: 'MAINSTNWET',
        unit: ''
      },
      HANDSIZE: {
        mark: 'HANDSIZE',
        unit: ''
      },
      MAINSTNNUM: {
        mark: 'MAINSTNNUM',
        unit: ''
      },
      SUBSTNNUM: {
        mark: 'SUBSTNNUM',
        unit: ''
      },
      SUBSTNWET: {
        mark: 'SUBSTNWET',
        unit: ''
      },
      ONUPTIME: {
        mark: 'ONUPTIME',
        unit: ''
      }
    },
    globalStyle: getApp().globalData.globalStyle,
    cateItems: {},
    title: null,
    curNav: null,
    show: false, // 默认无 loading
  },
  handleSearch: function () {
    wx.navigateTo({
      url: '/pages/search/index'
    })
  },
  // 点击主菜单选中一个
  clickItem(e) {
    const foremost = this.calcPageHeightMachine()
    log(foremost)
    if (foremost) {
      this.getPageHeight()
      const time = 60
      const params = {
        mark: null,
        time: time,
        args: e,
        callback: this.menuRunFunc
      }
      this.delayReplay(params)
    } else {
      this.menuRunFunc(e)
    }
  },
  // 计算页面高度执行机制
  calcPageHeightMachine: function () {
    let result = false
    const { menuToTop, proListToTop } = this.data
    const mark = 0
    const menuLen = menuToTop.length
    const proLen = proListToTop.length

    if (menuLen === mark && proLen === mark) {
      result = true
    }

    return result
  },
  // 获得页面高度数据(主菜单、二级展开)
  getPageHeight: function () {
    const { onceCalc } = this.data
    if (onceCalc) {
      return
    }
    // 重置
    this.setData({
      MenuheightArr: [],
      heightArr: [],
      proListToTop: [],
      menuToTop: [],
      onceCalc: true
    })
  },
  // 需延迟执行反应
  delayReplay: function (options) {
    const { mark, time, args, callback } = options
    setTimeout(() => {
      if (!mark) {
        this.setData({
          scrollMark: true
        })
      }
      callback(args)
    }, time)
  },
  // 点击菜单运行函数
  menuRunFunc: function (e) {
    const mark = this.data.pageSign
    const id = e.currentTarget.dataset.id
    const oldId = this.data.activeId
    // 改变左侧一级菜单
    if (id === oldId) return
    this.setData({
      once: true,
      activeId: id,
      toView: id,
    })
    return // 一期屏蔽此功能
    const params = Number(id.split(mark)[1])
    this.setMenuAnimation(params)
  },
  // 计算左边选中的下标
  calculateIndex(arr, scrollHeight) {
    let index = null;
    for (let i = 0; i < arr.length; i++) {
      if (scrollHeight >= 0 && scrollHeight < arr[0]) {
        index = 0;
      } else if (scrollHeight >= arr[i - 1] && scrollHeight < arr[i]) {
        index = i;
      }
    }


    const menus = this.data.MenuheightArr

    const mark = 80

    let result = null
    if (index > 10) {
      result = menus[index] + mark
    } else {
      result = menus[index] - mark
    }

    this.setData({
      mainScroll: result
    })

    return index;
  },
  // 计算滚动的区间
  calculateHeight(height) {
    if (!this.data.heightArr.length) {
      this.data.heightArr.push(height)
    } else {
      const len = this.data.heightArr.length - 1
      let preValue = 0
      this.data.heightArr.map((item, index) => {
        if (index === len) {
          preValue = item
        }
      })

      height += preValue
      this.data.heightArr.push(height);
    }
  },
  // 设置动画，使一级主菜单滚动到指定位置
  setMenuAnimation(i) {
    let self = this
    const menuToTop = this.data.menuToTop
    const windowHeight = this.data.windowHeight
    if (menuToTop[i].animate) {
      // 节流
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => {
        self.setData({
          mainScroll: (menuToTop[i].top - windowHeight),
        })
      }, 200)
    } else {

      const menus = this.data.mainScroll
      const flag = 0 // 默认值
      if (menus === flag) return
      this.setData({
        mainScroll: flag,
      })
    }
  },
  // 滚动执行调用
  scrollRunFunc: function (e) {
    const proListToTop = this.data.proListToTop
    for (let i = 0; i < proListToTop.length; i++) {
      if (e.detail.scrollTop < proListToTop[i] && i !== 0 && e.detail.scrollTop > proListToTop[i - 1]) {
        return this.setDis(i)
      }
    }

    // 找不到匹配项，默认显示第一个数据
    const once = this.data.once // 点击后滚动不能影响点击结果
    if (once) {
      this.setData({
        once: false
      })
      return
    }
  },
  // 设置左侧一级菜单栏的选中状态
  setDis(i) {
    const once = this.data.once // 点击后滚动不能影响点击结果

    if (once) {
      this.setData({
        once: false
      })
      return
    }

    const mark = this.data.pageSign
    const result = i - 1
    this.setData({
      activeId: mark + result,
    })

    this.setMenuAnimation(i)
  },
  // 主菜单区间
  calculateMenuHeight(height) {
    if (!this.data.MenuheightArr.length) {
      this.data.MenuheightArr.push(height)
    } else {
      const len = this.data.MenuheightArr.length - 1
      let preValue = 0
      this.data.MenuheightArr.map((item, index) => {
        if (index === len) {
          preValue = item
        }
      })

      height += preValue
      this.data.MenuheightArr.push(height);
    }
  },
  // 选中取消一个小按钮
  handleGood: function (e) {
    const selected = e.currentTarget.dataset.item.primarySubclassId
    const currentSelected = JSON.parse(JSON.stringify(this.data.selectedGoods))
    let number = this.data.selectedGoodsNumber
    if (currentSelected.includes(selected)) {
      let site = currentSelected.indexOf(selected)
      currentSelected.splice(site, 1)
      number--
    } else {
      currentSelected.push(selected)
      number++
    }

    this.setData({
      selectedGoods: currentSelected,
      selectedGoodsNumber: number
    })
    this.traversal(selected)
  },
  // 遍历取消或添加标签
  traversal: function (id) {
    const result = this.data.category.map(item => {
      item.subclassList.map(childItem => {
        if (childItem.selected && id === childItem.primarySubclassId) {
          childItem.selected = false
        } else if (!childItem.selected && id === childItem.primarySubclassId) {
          childItem.selected = true
        }
      })
      return item
    })

    this.setData({
      category: result
    })
  },

  // 更新页面数据
  updatedPage(data) {
    log('更新页面设置', data)
    const info = data
    info.forEach(item => {
      item.level2CategoryList.map(ite => {
        ite.parentId = item.id
      })
    })
    this.setData({
      cateItems: info,
    })
  },

  // 获取第一个默认分类首页
  getInitTitle(title) {
    this.setData({
      title: title,
    })
  },
  // 获取第一个默认选中
  getInitSelected(id) {
    this.setData({
      curNav: id,
    })
  },

  // 查询商品分类
  async queryGoodsType() {
    this.setData({
      show: true
    })
    const body = ''
    const res = await queryGoodList(body)
    log('商品分类', res)
    const { data } = res
    const title = data[0] ? data[0].name : null
    const curNav = data[0] ? data[0].id : null
    this.updatedPage(data)
    this.getInitTitle(title)
    this.getInitSelected(curNav)
    this.setData({
      show: false,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryGoodsType()
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
    this.setTabBarStyleAndsetNavigationBarColor(false, 1)
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