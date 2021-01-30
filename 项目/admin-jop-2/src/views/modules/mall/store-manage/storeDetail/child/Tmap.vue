<template>
  <div class="map" @click="data.showList=false">
    <div class="map-search">
      <input id='suggestId' placeholder="请输入搜索地址" @input="getPosilist" @focus="getPosilist" v-model="data.addressKeyword" autocomplete="off" />
      <div class="map-search-list" v-if="data.showList">
        <div class="map-search-list-item" @click="seleted(item)" v-for="(item,index) in data.posList" :key="index">
          <div class="map-search-list-item-name">{{ item.name }}</div>
          <div class="map-search-list-item-address">{{ item.address }}</div>
        </div>
      </div>
    </div>
    <div id="container" style="width:100%; height:500px"></div>
    <div class="map-message">
      <div>地理坐标：{{`${data.centerQQ.lng}，${data.centerQQ.lat}`}}</div>
      <div>地理位置：{{data.positon}}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref, watch } from '@vue/composition-api'
interface data {
  [props: string]: any
}
declare const qq: any
export default defineComponent({
  props: {
    center: {
      type: Array,
      default: () => { return [114.12542, 22.55821] }
    }
  },
  setup(props, { emit }) {
    const data: data = reactive({
      map: null,
      getAddress: null,
      getAddCode: null,
      searchService: null,
      addressKeyword: '',
      positon: '',
      centerQQ: { lng: 114.12542, lat: 22.55821 },
      posList: [],
      showList: false,
      marker: null
    })
    watch(() => props.center, (val: any) => {
      setTimeout(() => {
        if (val.length) {
          data.centerQQ = { lng: val[0], lat: val[1] }
        }
        init()
      }, 100)
    })
    onMounted(() => {
      init()
    })
    function init() {
      const myLatlng = new qq.maps.LatLng(data.centerQQ.lat, data.centerQQ.lng)
      const myOptions = {
        zoom: 18,
        center: myLatlng,
        mapTypeId: qq.maps.MapTypeId.ROADMAP
      }
      data.map = new qq.maps.Map(document.getElementById('container'), myOptions)
      setMarker()
      // 获取点击后的地址
      qq.maps.event.addListener(data.map, 'click', (event: any) => {
        // 获取点击后的地图坐标
        data.centerQQ.lng = event.latLng.getLng()
        data.centerQQ.lat = event.latLng.getLat()
        setMarker()
        getAddressCode()
      })

      // 调用地址显示地图位置并设置地址
      data.getAddress = new qq.maps.Geocoder({
        complete: (res: any) => {
          data.map.setCenter(res.detail.location)
          data.centerQQ.lng = res.detail.location.lng
          data.centerQQ.lat = res.detail.location.lat
          data.positon = res.detail.address
          getAddressCode()
          setMarker()
        }
      })
      // 通过坐标来显示地图地址
      data.getAddCode = new qq.maps.Geocoder({
        complete: (res: any) => {
          emit('getPosition', res)
          data.positon = res.detail.nearPois[0].address
        }
      })
      getAddressCode()
      data.searchService = new qq.maps.SearchService({
        // 检索成功的回调函数
        complete: (res: any) => {
          if (res.type === 'POI_LIST' && res.detail.pois) {
            data.posList = res.detail.pois
            data.showList = true
          }
        }
      })
    }
    function setMarker() {
      if (data.marker) {
        data.marker.setMap(null)
      }
      data.marker = new qq.maps.Marker({
        map: data.map,
        position: new qq.maps.LatLng(data.centerQQ.lat, data.centerQQ.lng)
      })
    }
    function seleted(item: any) {
      getAddressKeyword(item.address)
      data.addressKeyword = item.name
      data.showList = false
    }
    function getPosilist() {
      data.searchService.search(data.addressKeyword)
      getAddressKeyword(data.addressKeyword)
    }

    // 通过地址获得位置
    function getAddressKeyword(address: string) {
      // 通过getLocation()方法获取位置信息值
      data.getAddress.getLocation(address)
    }
    // 通过坐标获得地址
    function getAddressCode() {
      const lat = parseFloat(data.centerQQ.lat)
      const lng = parseFloat(data.centerQQ.lng)
      const latLng = new qq.maps.LatLng(lat, lng)
      // 调用获取位置方法
      data.getAddCode.getAddress(latLng)
    }
    return {
      data,
      seleted,
      getPosilist
    }
  },
})
</script>

<style lang="scss" scoped>
.map{
  position: relative;
  img {
      max-width: inherit;
  }
  &-message{
    padding-top: 15px;
    line-height: 30px;
  }
  &-search{
    position: absolute;
    z-index: 300;
    left: 30px;
    top: 10px;
    &-list{
      max-height: 300px;
      overflow: auto;
      width: 300px;
      background: #fff;
      &-item{
        padding: 5px 10px;
        cursor: pointer;
        &-address{
          font-size: 12px;
          color: #ccc;
        }
        &:hover{
          color:#2969ff;
          &-address{
            color: #2969ff;
          }
        }
      }
    }
    #suggestId{
      border-radius: 5px;
      width: 300px;
      border: 1px solid rgb(217, 217, 217);
      height: 32px;

      padding: 5px;
      &:focus {
        border-color: #2969ff;
        border-right-width: 1px !important;
        outline: 0;
        box-shadow: 0 0 0 2px rgba(0, 69, 255, 0.2);
      }
    }
  }
}
.tangram-suggestion-main{
  z-index: 2000;
  height: 300px;
}
</style>
