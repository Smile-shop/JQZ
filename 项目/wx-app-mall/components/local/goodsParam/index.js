// components/local/goodsParam/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    paramData: [
      {
        title: '款号',
        content: 'QXYRNN12134'
      },
      {
        title: '金属颜色',
        content: '红色'
      },
      {
        title: '系列',
        content: '钻石'
      },
      {
        title: '品牌',
        content: '金六福珠宝'
      },
      {
        title: '款式',
        content: '时尚吊坠项链手环'
      },
      {
        title: '手寸',
        content: '40'
      },
      {
        title: '主石材质',
        content: 'QXYRNN12134'
      },
      {
        title: '副石材质',
        content: 'M08001'
      },
      {
        title: '副石数量',
        content: '19'
      },
      {
        title: '副石总重',
        content: '10ct'
      },
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
