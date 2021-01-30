// pages/coupons/item/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 数据源
     */
    tabData: {
      type: Array,
      value: [],
      observer(val){
        this.setData({ dataList: val })
      }
    },
    /**
     * 是否需要显示checkBox
     */
    showCheckBox: {
      type: Boolean,
      value: false
    },
    emptyTop: {
      type: String,
      value: '180'
    }
  },

  /**
   * 组件的初始数据
   */
  data: { 
    dataList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onShowDetail(e){
      const { index } = e.target.dataset
      const tabsIndexData =  `dataList[${index}].showDetail`
      this.setData({[tabsIndexData]: !this.data.dataList[index].showDetail})
    },
    onChange(e){
      const checked  = e.detail
      const { index } = e.target.dataset
      this.data.dataList.forEach((item, i) => {
        const a = `dataList[${i}].checked`
        if(i === index){
         this.setData({[a]: true})
        }else{
          this.setData({[a]: false})
        }
      })
      this.triggerEvent('change', {item: this.data.dataList[index] })
    }
  }
})
