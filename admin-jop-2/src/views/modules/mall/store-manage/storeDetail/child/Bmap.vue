<template>
  <div class="map">
    <div class="map-search">
      <input id='suggestId' placeholder="请输入搜索地址" />
      <div id="map-search-list"></div>
    </div>
    <baidu-map :center="data.center" :zoom="data.zoom" @ready="handler" style="width:100%;height:500px" @click="getClickInfo" :scroll-wheel-zoom='true' ak="iThF7XOXDizFyypghLAqaq0fLc9irAkE">
    </baidu-map>
    <div class="map-message">
      <div>地理坐标：{{`${data.centerQQ.lng}，${data.centerQQ.lat}`}}</div>
      <div>地理位置：{{data.position}}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref, watch } from '@vue/composition-api'
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
interface data {
  [props: string]: any
}
export default defineComponent({
  components: { BaiduMap },
  props: {
    baiduCoord: {
      type: Array,
      default: ['114.132021', '22.563851']
    }
  },
  setup(props, { emit }) {
    const data: data = reactive({
      center: { lng: 114.132021, lat: 22.563851 },
      centerQQ: { lng: 114.132021, lat: 22.563851 },
      zoom: 18,
      BMap: '',
      map: '',
      position: ''
    });
    watch(() => props.baiduCoord, (val: any) => {
      setTimeout(() => {
        data.center = { lng: val[0], lat: val[1] }
        data.centerQQ.lng = bMapToQQMap(val[0], val[1])[0]
        data.centerQQ.lat = bMapToQQMap(val[0], val[1])[1]
        changePosition(data.center.lng, data.center.lat, 1)
      }, 100);
    })
    onMounted(() => {
      // console.log(props)
    });
    const myValue = ref()
    // 地图搜索框
    function search() {
      const ac = new data.BMap.Autocomplete( // 建立一个自动完成的对象
        {
          input: 'suggestId',
          location: data.map
        });
      ac.addEventListener('onconfirm', function(e: any) { // 鼠标点击下拉列表后的事件
        const _value = e.item.value;
        myValue.value = _value.province + _value.city + _value.district + _value.street + _value.business;
        setPlace()
      });
    }
    function setPlace() {
      data.map.clearOverlays(); // 清除地图上所有覆盖物
      function myFun() {
        var pp = local.getResults().getPoi(0).point; // 获取第一个智能搜索的结果
        changePosition(pp.lng, pp.lat, 1)
      }
      // 智能搜索
      var local = new data.BMap.LocalSearch(data.map, {
        onSearchComplete: myFun
      });
      local.search(myValue.value);
    }
    // 初始化地图,设置中心点坐标
    function handler({ BMap, map }: any) {
      data.BMap = BMap
      data.map = map
      // const point = new BMap.Point(114.132021, 22.563851)
      // map.centerAndZoom(point, 18)
      // 鼠标拖拽事件
      // map.addEventListener('dragend', (e:any) => {
      //   changePosition(e.point.lng, e.point.lat, 1)
      // });
      // 添加鼠标滚动缩放
      map.enableScrollWheelZoom();
      // const marker = new BMap.Marker(point);
      // // 把标注添加到地图上
      // map.addOverlay(marker);
      changePosition(data.center.lng, data.center.lat, 1)
      search()
    }
    // 坐标转换地址
    function changePosition(lng: string, lat: string, type?: number) {
      data.centerQQ = { lng: bMapToQQMap(lng, lat)[0], lat: bMapToQQMap(lng, lat)[1] }
      const geocoder = new data.BMap.Geocoder();
      const point = new data.BMap.Point(lng, lat);
      data.map.clearOverlays()
      const marker = new data.BMap.Marker(point);
      // 把标注添加到地图上
      data.map.addOverlay(marker);
      data.map.centerAndZoom(point, 18);
      // if (type === 1) {
      geocoder.getLocation(point, (res: any) => {
        data.position = myValue.value || res.address
        const addresData = res
        addresData.address = myValue.value || addresData.address
        emit('getPosition', res)
      });
      // } else {
      //   data.position = myValue.value
      // }
    }
    // 鼠标点击地图事件
    function getClickInfo(e: any) {
      data.center.lng = e.point.lng
      data.center.lat = e.point.lat
      changePosition(e.point.lng, e.point.lat, 1)
    }

    function bMapToQQMap(lng: string, lat: string) {
      if (lng == null || lng === '' || lat == null || lat === '') return [lng, lat];
      const xPi = 3.14159265358979324 * 3000.0 / 180.0;
      const x = parseFloat(lng) - 0.0065;
      const y = parseFloat(lat) - 0.006;
      const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * xPi);
      const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * xPi);
      const lg = z * Math.cos(theta);
      const lt = z * Math.sin(theta);
      return [lg, lt];
    }

    return {
      data,
      handler,
      getClickInfo
    };
  },
});
</script>

<style lang="scss">
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
