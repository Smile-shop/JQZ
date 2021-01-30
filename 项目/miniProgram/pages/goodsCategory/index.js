// pages/goodsCategory/index.js
var app = getApp();

import { Server } from '../../models/server'

const ajax = new Server()

// let proListToTop = [], menuToTop = [], MENU = 0, windowHeight, timeoutId;
let timeoutId

Page({

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
      },
    },
    globalStyle: getApp().globalData.globalStyle,
    safeArea: getApp().globalData.safeArea
  },


  // 正确返回
  requestBack: function(res) {
    let result = false
    const successCode = 0
    const { code } = res 
    if (code === successCode) {
      result = true
    }

    return result
  },

  // 错误返回
  requestError: function(res) {
    // do something
  },

  // 请求
  request: function(params, loading = true) {
    const {options, name} = params
    return new Promise((resolve) => {
      ajax[name](options, loading).then((res) => {
        const result = this.requestBack
        if (result) {
          return resolve(res)
        }
      }).catch(err => {
        this.requestError(err)
      })
    })
  },

  // 方法
  requestApi: function() {
    return {
      getGoodsCategory: (options) => {
        const callbackName = 'getGoodsCategory'
        const params = {
          options: options,
          name: callbackName,
        }
        return this.request(params)
      }
    }
  },

  // 创建模板
  createTemplateObj: function(arr = []) {
    const original = arr
    const template = {}

    original.map(item => {
      template[item['identification']] = {}
    })

    return template
  },

  // 获得选项模板
  getParentValue: function(template, value) {
    const result = template
    const original = JSON.parse(JSON.stringify(value))

    const templateArr = []

    original.map(item => {
      item.subclassList = []  
      templateArr.push(item)
    })

    templateArr.map(item => {
      result[item['identification']] = item 
    })

    return result
  },

  // 格式化选中项
  formatSelected: function(arr) {
    const subList = 'subclassList'
    const original = arr
    const result = []
    original[subList].map(item => {
      let nape = encodeURIComponent(JSON.stringify(item))
      result.push(nape)
    })

    original.subList = result
    return original
  },

  // 最终要传递的数据项
  finialSend: function(obj) {
    const init = obj
    const names = Object.keys(init)
    const result = []
    const mark = 0
    names.map(item => {
      if(init[item].subclassList.length > mark) {
        let subItem = this.formatSelected(init[item])
        result.push(subItem)
      } 
    })

    
    return result
  },

  // 找到选中的全量数据
  querySelected: function(options) {
    const selected = options
    const original = JSON.parse(JSON.stringify(this.data.category))
    const template = this.createTemplateObj(original)
    const result = this.getParentValue(template, original)
    original.map(item => {
      item.subclassList.map((childItem) => {
        if(selected.includes(childItem.primarySubclassId)) {
          result[item['identification']].subclassList.push(childItem)
        }
      })
    })


    const finalNum = this.finialSend(result)

    return finalNum
  },

  // 提示选中或填入
  showTip: function(message) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 300
    })
  },

  // 校验是否有手动输入项
  filterInput: function() {
    let result = false
    const filters = this.data.filters

    filters.map(item => {
      if(( item.mini != null && (Number(item.mini) >= 0 )) || (item.max != null &&(Number(item.max) > 0))) {
        result = true
      }
    })

    return result
  },

  // 缓存数据用于无导航商品分类页
  cachedDataNoneBar: function(data) {
    app.globalData.assortGoods = data 
  },

  // 获得页面缓存的分类数据
  getCachedBar: function() {
    return app.globalData.assortGoods
  },

  // 确认搜索列表
  confirm: function() {
    const input = this.filterInput()
    if(this.data.selectedGoods.length > 0 || input) {
      const cached = {}
      cached.selected = this.data.selectedGoods
      cached.filter = this.data.filters
      this.cachedDataNoneBar(cached)
      const path = 'goodsCategory'
      const params = this.data.selectedGoods
      const selectedItem = this.querySelected(params)
      const info = encodeURIComponent(JSON.stringify(selectedItem))
      const filter = JSON.stringify(this.data.filters)
      wx.navigateTo({
        url: `/pages/goodsList/index?id=${info}&path=${path}&filter=${filter}`
      })
    } else {
      const message = this.data.message
      this.showTip(message)
    }
  },

  // 选中取消一个小按钮
  handleGood: function(e) {
    const selected = e.currentTarget.dataset.item.primarySubclassId
    const currentSelected = JSON.parse(JSON.stringify(this.data.selectedGoods))
    let number = this.data.selectedGoodsNumber
    if(currentSelected.includes(selected)) {
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
  traversal: function(id) {
    const result = this.data.category.map(item => {
      item.subclassList.map(childItem => {
        if(childItem.selected && id === childItem.primarySubclassId) {
          childItem.selected = false
        } else if(!childItem.selected && id === childItem.primarySubclassId) {
          childItem.selected = true
        }
      })
      return item 
    })

    this.setData({
      category: result
    })
  },

  // 重置
  resetSelected: function() {
    const list = this.data.category
    const arr = this.data.filters
    const filters = arr.map(item => {
      item.max = null
      item.mini = null 
      return item 
    })
    const result = list.map(item => {
      item.subclassList.map(childItem => {
        childItem.selected = false
      })
      return item 
    })
    this.setData({
      selectedGoods: [],
      selectedGoodsNumber: 0,
      category: result,
      filters: filters
    })
  },

  // 搜索
  handleSearch: function() {
    wx.navigateTo({
      url: '/pages/search/index'
    })
  },

  // 验证整数
  verificationInt: function(num) {
    let result = true
    const mark = '.'
    const str = String(num)
    if(str.includes(mark)) {
      result = false
    }
    return result
  },

  // 验证小数
  verificationDouble: function(num) {
    let result = true
    const mark = '.'
    const max = 3
    const str = String(num)
    const len = str.includes(mark) ? str.split(mark)[1] : null 
    if(str.includes(mark) && len.length > max) {
      result = false
    }

    return result
  },

  // 输入错误提示
  inputErrorTip: function(message) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    })
  },

  // 置空错误输入
  emptyErrorInput: function() {

  },

  // 获得小数值
  getDotValue: function(value) {
    const mark = '.'
    const len = 3
    const str = String(value)
    const current = str.split(mark)

    const point = current[1].slice(0, len)
    
    const result = Number(current[0] + mark + point)

    return result
  },

  // 最小值
  handleMini: function(e) {
    const value = e.detail.value
    const item = e.currentTarget.dataset.minifilter
    const currentSelected = this.data.selectedGoods
    const template = this.data.filters
    const identification = item.identification 
    let selected = this.data.selectedGoodsNumber

    const templateInt = this.data.int
    const templateDouble = this.data.double

    const illegal = ['undefined', 'null', ' ']

    // 不输入或置空不提示
    const empty = ['']
    if(empty.includes(value)) {
      template.map(item => {
        if (item.identification === identification && item.mini >= 0) {
          item.mini = null 
        }
      })

      if(currentSelected.includes(identification)) {
        const site = currentSelected.indexOf(identification)
        currentSelected.splice(site, 1)
        selected--
      }
      this.setData({
        filters: template,
        selectedGoods: currentSelected,
        selectedGoodsNumber: selected,
      })

      this.setData({
        filters: template
      })
      return 
    }

    if(illegal.includes(value) || Number(value) === 'NaN') {
      template.map(item => {
        if (item.identification === identification && item.mini) {
          item.mini = null 
        }
      })

      const msg = this.data.inputTip
      this.inputErrorTip(msg)
      this.setData({
        filters: template
      })
      return 
    }

    if (templateInt.includes(identification)) {
      const result = this.verificationInt(value)
      if(!result) {
        template.map(item => {
          if (item.identification === identification) {
            item.mini = null 
          }
        })
        const msg = this.data.inputTip
        this.inputErrorTip(msg)
        this.setData({
          filters: template
        })
        return 
      }
    } else if (templateDouble.includes(identification)) {
      const result = this.verificationDouble(value) 
      if(!result) {
        const pointValue = this.getDotValue(value)
        template.map(item => {
          if (item.identification === identification) {
            item.mini = pointValue
          }
        })
        this.setData({
          filters: template
        })
        return 
      }
    }

    
    // 之后验证
    const result = template.map(item => {
      if((item.identification === identification)) {
        if(!item.max) {
          item.mini = Number(value)
        } else if(item.max && (Number(value) <= item.max)) {
          item.mini = Number(value)
        } else {
          item.mini = null 
          const msg = this.data.inputTip
          this.inputErrorTip(msg)
        }
      }
      return item 
    })

    // 是否有输入完全
    result.map(item => {
      if(item.mini && item.max) {
        if (!currentSelected.includes(item.identification)) {
          selected++
          currentSelected.push(item.identification)
        }
      }
    })

    this.setData({
      selectedGoodsNumber: selected,
      filters: result,
    })
  },

  // 最大值
  handleMax: function(e) {
    const value = e.detail.value
    const item = e.currentTarget.dataset.maxfilter
    const template = this.data.filters
    const identification = item.identification 
    const currentSelected = this.data.selectedGoods
    let selected = this.data.selectedGoodsNumber

    const templateInt = this.data.int
    const templateDouble = this.data.double

    const illegal = ['undefined', 'null', 0, ' ']

    // 置空或不输入
    const empty = ['']
    if(empty.includes(value)) {
      template.map(item => {
        if(item.identification === identification) {
          item.max = null 
        }
      })

      if(currentSelected.includes(identification)) {
        const site = currentSelected.indexOf(identification)
        currentSelected.splice(site, 1)
        selected--
      }
      this.setData({
        filters: template,
        selectedGoods: currentSelected,
        selectedGoodsNumber: selected,
      })

      return 
    }

    if(illegal.includes(value) || Number(value) === 'NaN') {
      template.map(item => {
        if(item.identification === identification) {
          item.max = null 
        }
      })
      const msg = this.data.inputTip
      this.inputErrorTip(msg)
      this.setData({
        filters: template
      })
      return 
    }

    if (templateInt.includes(identification)) {
      const result = this.verificationInt(value)
      if (!result) {
        template.map(item => {
          if(item.identification === identification) {
            item.max = null 
          }
        })
        const msg = this.data.inputTip
        this.inputErrorTip(msg)
        this.setData({
          filters: template
        })
        return
      }
    } else if (templateDouble.includes(identification)) {
      const result = this.verificationDouble(value)
      if (!result) {
        const pointValue = this.getDotValue(value)
        template.map(item => {
          if (item.identification === identification) {
            item.max = pointValue
          }
        })
        this.setData({
          filters: template
        })
        return 
      }
    }

    // 之后验证
    const result = template.map(item => {
      if((item.identification === identification)) {
        if(!item.mini) {
          item.max = Number(value)
        } else if(item.mini && Number(value) >= item.mini) {
          item.max = Number(value)
        } else {
          item.max = null 
          const msg = this.data.inputTip
          this.inputErrorTip(msg)
        }
      }
      return item 
    })

    // 是否有输入完全
    result.map(item => {
      if(item.mini >= 0 && item.max ) {
        if (!currentSelected.includes(item.identification)) {
          selected++
          currentSelected.push(item.identification)
        }
      }
    })

    this.setData({
      selectedGoodsNumber: selected,
      filters: result,
      selectedGoods: currentSelected,
    })
  },

  // 首页查询
  getGoodsCategory: function() {
    const initSearch = this.requestApi()
    initSearch.getGoodsCategory().then(res => {
      const pageSign = this.data.pageSign
      const { data } = res 
      data.map((item, index) => {
        item.id = pageSign + index 
      })

      this.setData({
        category: data,
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  //事件处理函数
  onLoad: function () {
    // this.getGoodsCategory()
  },

  // 获得页面高度数据(主菜单、二级展开)
  getPageHeight: function() {
    const { onceCalc } = this.data 
    if(onceCalc) {
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
    
    // 获取商品二级展示的位置信息
    wx.createSelectorQuery().selectAll('.catefory-main').boundingClientRect((rects) => {
      const proListToTop = this.data.proListToTop
      rects.forEach((rect) => {
        const top = 44 // 顶部距离
        proListToTop.push(rect.top - top)
      })
      this.setData({
        proListToTop: proListToTop,
        listMenu: true,
      })
    }).exec()

    // 获取主菜单位置信息
    wx.createSelectorQuery().selectAll('.catgegory-item').boundingClientRect((rects) => {
      wx.getSystemInfo({
        success: (res) => {
          const windowHeight = res.windowHeight / 2
          const menuToTop = this.data.menuToTop
          rects.forEach((rect) => {
            menuToTop.push({
              top: rect.top,
              animate: rect.top > windowHeight,
            })
          })
          // 设置滚动
          this.setData({
            menuToTop: menuToTop,
            windowHeight: windowHeight,
            mainMenu: true,
          })
        }
      })
    }).exec()
  },

  // 需延迟执行反应
  delayReplay: function(options) {
    const {mark, time, args, callback} = options
    setTimeout(() => {
      if(!mark) {
        this.setData({
          scrollMark: true
        })
      }
      callback(args)
    }, time)
  },

  // 计算页面高度执行机制
  calcPageHeightMachine: function() {
    let result = false
    const {menuToTop, proListToTop} = this.data
    const mark = 0
    const menuLen = menuToTop.length
    const proLen = proListToTop.length

    if(menuLen === mark && proLen === mark) {
      result = true
    }

    return result
  },

  // 点击主菜单选中一个
  clickItem(e) {
    const foremost = this.calcPageHeightMachine()
    if(foremost) {
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

  // 点击菜单运行函数
  menuRunFunc: function(e) {
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

  // 滚动事件
  scroll(e) {
    return // 一期屏蔽此功能
    const foremost = this.calcPageHeightMachine()
    const once = this.data.scrollMark
    if(foremost || !once) {
      this.getPageHeight()
      const mark = this.data.scrollMark
      const time = 50
      const params = {
        mark: mark,
        time: time, 
        args: e,
        callback: this.scrollRunFunc
      }
      this.delayReplay(params)
    } else {
      this.scrollRunFunc(e)
    }
  },

  // 滚动执行调用
  scrollRunFunc: function(e) {
    const proListToTop = this.data.proListToTop
    for (let i = 0; i < proListToTop.length; i++) {
      if (e.detail.scrollTop < proListToTop[i] && i !== 0 && e.detail.scrollTop > proListToTop[i - 1]) {
        return this.setDis(i)
      }
    }

    // 找不到匹配项，默认显示第一个数据
    const once = this.data.once // 点击后滚动不能影响点击结果
    if(once) {
      this.setData({
        once: false
      })
      return 
    }
  },

  // 设置左侧一级菜单栏的选中状态
  setDis(i) {
    const once = this.data.once // 点击后滚动不能影响点击结果

    if(once) {
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

  // 计算滚动的区间
  calculateHeight(height) {
    if(!this.data.heightArr.length) {
      this.data.heightArr.push(height)
    }else {
      const len = this.data.heightArr.length - 1
      let preValue = 0
      this.data.heightArr.map((item, index) => {
        if(index === len) {
          preValue = item 
        }
      })
      
      height += preValue
      this.data.heightArr.push(height);
    }
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

  // 计算左边选中的下标
  calculateIndex(arr, scrollHeight) {
    let index= null;
    for(let i =0;i<arr.length;i++) {
      if (scrollHeight >= 0 && scrollHeight < arr[0]){
        index = 0;
      }else if(scrollHeight >= arr[i-1] && scrollHeight < arr[i]){
        index = i;
      }
    }


    const menus = this.data.MenuheightArr

    const mark = 80 

    let result = null
    if(index > 10) {
      result = menus[index] + mark
    } else {
      result = menus[index] - mark
    }

    this.setData({
      mainScroll: result
    })

    return index ;
  },

  // 是否需要更新页面数据
  reGetGoodsCategory: function() {
    const reRequest = this.requestApi()
    reRequest.getGoodsCategory().then(res => {
      const { data } = res 
      // const selected = this.data.selectedGoods // 选中的旧数据
      const selected = this.getCachedBar().selected // 已经在缓存中的选中数据
      const currentPageMark = 'goodsCategory' // 当前页面标识
      const prePage  = app.globalData.cachepath // 缓存的标志路径
      const arr = []
      const type = "2" // 筛选条件
      const len = 0
      const filters = []
      const pageSign = this.data.pageSign
      data.map((item) => {
        if(item.type === type) {
          filters.push(item)
        }
      })

      // 过滤筛选条件
      const filterResult = data.filter(item => item.type !== type)
      // 增加id 
      filterResult.map((item, index) => {
        item.id = pageSign + index 
      })
      const result = filterResult.map(item => {
        item.subclassList.map(childItem => {
            if(selected.includes(childItem.primarySubclassId) && (currentPageMark === prePage)) {
              childItem.selected = true
              arr.push(childItem.primarySubclassId)
            } else {
              childItem.selected = false
            }
          })
          return item
      })

      const addItem = {
        alias: "筛选条件",
        checkField: "",
        identification: "002",
        number: 24,
        original: "筛选条件",
        state: 1,
        subclassList: [],
        type: 1,
        id: pageSign + result.length 
      }

      if(filters.length > len) {
        const addUnit = this.data.filtersMark
        result.push(addItem)
        filters.map(item => {
          let marks = item.identification
          if(marks === addUnit[marks].mark) {
            item.unit = addUnit[marks].unit
            item.mini = null 
            item.max = null 
          }
        })

        // 获得旧填入数据
        // const filterOld = this.data.filters
        const filterOld = this.getCachedBar().filter // 已经存起来的填入数据
        filterOld.map(item => {
          filters.map(newItem => {
            if(newItem.identification === item.identification) {
              newItem.mini = item.mini
              newItem.max = item.max
              if(newItem.mini && item.max) {
                arr.push(item.identification)
              }
            }
          })
        })

        this.setData({
          filters: filters
        })
      }

      const selectedNum = arr.length
      const toView = this.data.toView
      const activeId = this.data.activeId 
      const mainScroll = this.data.mainScroll

      const originate = 'a0'
      const amount = result.length - 1
      const sign = this.data.pageSign
      const figure = Number(activeId.split(sign)[1])
      const location = figure > amount ? originate : activeId
      const operate = false // 每次重进重新计算页面
      
      this.setData({
        category: result,
        selectedGoods: arr, 
        selectedGoodsNumber: selectedNum,
        toView: location,
        activeId: location,
        mainScroll: mainScroll,
        onceCalc: operate
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        active: 1,
        globalStyle: getApp().globalData.globalStyle
      })
    }
    this.setData({
      globalStyle: getApp().globalData.globalStyle
    })
    this.reGetGoodsCategory()
  },
})