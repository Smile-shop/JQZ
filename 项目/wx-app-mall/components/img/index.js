// components/img/index.js
Component({
  options:{
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    mode: {
      type: String,
      value: 'aspectFit'
    },
    customClass: {
      type: String,
      value: ''
    },
    src: {
      type: String,
      value: ''
    },
    useErrorSlot: {
      type: Boolean,
      value: true
    },
    useLoadingSlot: {
      type: Boolean,
      value: true
    },
    round: Boolean,
    width: {
      type: null,
    },
    height: {
      type: null,
    },
    radius: null,
    lazyLoad: Boolean,
    showMenuByLongpress: {
      type: Boolean,
      value: true
    },
    fit: {
      type: String,
      value: 'fill',
    },
    showError: {
      type: Boolean,
      value: true,
    },
    showLoading: {
      type: Boolean,
      value: true,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
