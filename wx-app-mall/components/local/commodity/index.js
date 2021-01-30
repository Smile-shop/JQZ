// components/local/commodity/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    paramList: {
      type: Array,
      value: [
        {
          id: 0,
          name: '红18k金'
        },
        {
          id: 1,
          name: '白18K金'
        },
        {
          id: 2,
          name: '精美时尚新款'
        },
        {
          id: 3,
          name: '电影同款'
        },
        {
          id: 4,
          name: '18K金D色'
        },
        {
          id: 5,
          name: '18K金D色电影同款'
        },
      ]
    },
    showAction: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    gindex: null, // 选中当前的个数
    selectData: '', // 选中的值,
    selectColor: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 关闭action
    onclose() {
      this.setData({
        showAction: false
      })
    },
    // 选择
    onSelect(e) {
      // this.data.selectColor = !this.data.selectColor
      this.setData({
        gindex:  e.currentTarget.dataset.index,
        selectData: e.currentTarget.dataset.item,
        selectColor: this.data.selectColor
      })
    }
  }
})
