// pages/addAddress/address/index.js
import log from '../../../utils/log'
import { getCityData } from '../../../api/address'
let timer = null 
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cityData: {
      type: Array,
      value: [],
      observer(n){
        
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    freeze: false,
    active: 0,
    dataList: [{name: '请选择'}],
    cityAreaArray: [],
    index0: '',
    index1: '',
    index2: '',
    index3: ''
  },
  /**
   * 组件的方法列表
   */
  lifetimes: {
    created(){
      this.getCityData()
    },
  },
  methods:{
    setLine(){
      this.selectComponent("#tabs").setLine()
    },
    async getCityData(e){
      const code = e || 100000
      const data = {
        url: `https://restapi.amap.com/v3/config/district?subdistrict=1&key=1a52881aa126dfada2f4979c3c0ec013&keywords=${code}`
      }
      try {
        const city = await getCityData(data)
        const active = this.data.active
        if(code == 100000){
          log(city.districts[0].districts)
          this.setData({dataList: [{name: '请选择', data: city.districts[0].districts}]})
        }else{
          log(city.districts[0].districts)
          return city.districts[0].districts
        }
      } catch(err){
        
      }
    },
    change(e){
      this.data.active = e.detail.index
      this.setData({active: e.detail.index})
    },
    async setAreaData(item, active, index, callBack){
      log('设置地址', item, item.name)
      const data = await this.getCityData(item.adcode)
      let dataList = this.data.dataList
      let cityAreaArray = this.data.cityAreaArray
      cityAreaArray[active] = item
      dataList[active].name = item.name
      dataList[active + 1] = {data: data, name: '请选择'}
      if(active == 0){
        dataList.length = 2
        cityAreaArray.length = 1
      }else if(active == 1){
        dataList.length = 3
        cityAreaArray.length = 2
      }
      if(dataList.length >= 4){
        dataList.length = 4
      }
      /**
       * 香港澳门只有两级，做特殊处理
       */
      if((cityAreaArray[0].adcode === '820000' || cityAreaArray[0].adcode === '810000') && cityAreaArray.length === 2){
        this.triggerEvent('onSelect', {cityAreaArray: cityAreaArray})
        dataList.length = 2
      }
      dataList[active].selectedIndex = index
      this.setData({dataList: dataList, cityAreaArray: cityAreaArray}, callBack ? callBack() : null)
      if(active < 3 && (cityAreaArray[0].adcode !== '820000' || cityAreaArray[0].adcode !== '810000')){
        this.setData({active: active + 1})
      }
    },
    select(e){
      log('哪个代码')
      if (!this.data.freeze) {
        this.data.freeze = true
        this.setData({
          freeze: true
        })
        log('冻结清清裤')
        clearTimeout(timer)
        timer = setTimeout(() => {
          this.setData({
            freeze: false
          })
          clearTimeout(timer)
        }, 300)
      } else {
        log('不能改')
        clearTimeout(timer)
        timer = setTimeout(() => {
          this.setData({
            freeze: false
          })
          clearTimeout(timer)
        }, 300)
        return
      }
      log('选中地址')
      const {item, index} = e.currentTarget.dataset
      const i = `index${this.data.active}`
      this.data.active
      this.setData({[i]: index})
      log('这里', this.data.active,)
      switch(this.data.active) {
        case 0:
          if (item.level == "province") {
            log('省')
            this.setAreaData(item, this.data.active, index)
            break;
          }
        case 1:
          if (item.level == 'city') {
            log('市')
            this.setAreaData(item, this.data.active, index)
            break;
          }
        case 2:
          if (item.level == 'district') {
            log('区')
            this.setAreaData(item, this.data.active, index)
            break;
          }
        case 3:
          if (item.level == 'street') {
            log('街')
            const callBack = () => {
              this.triggerEvent('onSelect', {cityAreaArray: this.data.cityAreaArray})
            }
            this.setAreaData(item, this.data.active, index, callBack)
              break;
          }
     } 
    }
  },
})

