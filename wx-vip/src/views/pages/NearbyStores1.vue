<template>
  <div>
    <div class="login-list-item">
      <div class="login-way" :style="{ 'background-color': themeColor }">
        <div @click="pickLoginWay(0)" :class="{ 'selected-item': loginWay == 0, 'bg-selected-item': loginWay == 1 }">列表</div>
        <div @click="pickLoginWay(1)" :class="{ 'selected-item': loginWay == 1, 'bg-selected-item': loginWay == 0 }">地图</div>
      </div>
    </div>

    <div id="container"></div>

    <div class="local">您的当前位置：{{ currentPosition.address }}</div>

    <div class="content">
      <component :is="componentId" :storeList="storeList" :shopList="allShopList" :currentPoint="currentPosition.point" @goMap="storeInMap"></component>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex';
import MapContainer from '../../components/MapContainer';
import StoreList from '../../components/StoreList';
export default {
  components: {
    MapContainer,
    StoreList
  },
  data() {
    return {
      loginWay: 0,
      currentPosition: {
        address: '',
        point: ''
      },
      storeList: [],
      map: null,
      shopList: [],
      allShopList: []
    }
  },
  computed: {
    ...mapState({
      themeColor: state => state.themeColor,
      urlData: state => state.urlData
      // shopList: state => state.nearbyStore.shopList
    }),
    componentId() {
      return !this.loginWay ? 'StoreList' : 'MapContainer'
    }
  },
  mounted() {
    const locationStr = window.sessionStorage.getItem('location');
    if (locationStr) {
      this.wxPosition(this, locationStr);
    } else {
      this.wxJDKPosition();
    }
    // this.position(this);
    // this.getNearbyShopList();
  },
  methods: {
    getNearbyShopList() {
      let params = {
        companyKey: this.urlData.companyKey,
        // shopStatus: '1',
        showStatus: '1'
      };

      this._http({url: '/jop-web/jop/getWxShopList'}, params).then(res => {
        if(res.data.code === 0) {
          this.shopList = res.data.data.list || [];
          this.getShopList();
        } else {
          this.$toast({
            message: res.data.msg,
            duration: 1000
          })
        }
      })
    },
    getShopList() {
      const list = this.shopList.map(p => {
        const pointA = [p.longitude, p.latitude];
        const pointB = this.currentPosition.point;
        const distance = AMap.GeometryUtil.distance(pointA, pointB);
        const distanceData = distance ? distance : 0;
        return {
          longitude: p.longitude,
          latitude: p.latitude,
          address: p.address,
          nameOut: p.nameOut,
          shopName: p.shopName,
          phone: p.phone,
          distanceM: distance,
          distance: distanceData < 5000 ? `${distanceData.toFixed(1)}米` : `${(distanceData / 1000).toFixed(1)}公里`
        }
      });
      this.allShopList = list.sort((a, b) => a.distanceM - b.distanceM);
    },
    wxJDKPosition() {
      let params = {
        companyKey: this.urlData.companyKey,
        url: window.location.href.split('#')[0]
      };
      const _this = this;
      this._http({url: '/jop-web/wxinit/jsapi_ticketSign'}, params).then(res => {
        if(res.data.code === 0) {
          const resData = res.data.data;
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: resData.appid, // 必填，公众号的唯一标识
            timestamp: resData.timestamp, // 必填，生成签名的时间戳
            nonceStr: resData.nonceStr, // 必填，生成签名的随机串
            signature: resData.signature, // 必填，签名
            jsApiList: [
              'getLocation'
            ] 
            // 必填，需要使用的JS接口列表
          });
          wx.ready(function() {
            wx.getLocation({
              type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
              success: function (res) {
                // const latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                // const longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                const location = {
                  latitude: res.latitude,
                  longitude: res.longitude
                }
                window.sessionStorage.setItem('location', JSON.stringify(location));
                _this.wxPosition(_this, JSON.stringify(location));
              }
            });
          })
        } else {
          this.$toast({
            message: res.data.msg,
            duration: 1000
          })
        }
      })
    },
    wxPosition(_this, locationStr) {
      // const locationStr = window.sessionStorage.getItem('location');
      if(locationStr) {
        _this.map = new AMap.Map('container', {
          resizeEnable: true
        });
        const location = JSON.parse(locationStr);

        let lnglat = [location.longitude, location.latitude];
        _this.currentPosition.point = lnglat;
        AMap.plugin('AMap.Geocoder', function() {
          let geocoder = new AMap.Geocoder({
            city: '010'
          });
          geocoder.getAddress(lnglat, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
              const address = result.regeocode.formattedAddress;
              _this.currentPosition.address = address;
              _this.getNearbyShopList();
            }
          });
        })
      }
    },
    // 定位
    position(_this) {
      _this.map = new AMap.Map('container', {
          resizeEnable: true
      });
      let geolocation;
      _this.map.plugin('AMap.Geolocation', function() {
        geolocation = new AMap.Geolocation({
          enableHighAccuracy: false,//是否使用高精度定位，默认:true
          timeout: 10000,          //超过10秒后停止定位，默认：无穷大
          buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          // buttonPosition:'RB'
        });
      });

      _this.map.addControl(geolocation);
      geolocation.getCurrentPosition();
      AMap.event.addListener(geolocation, 'complete', function(data) {
        _this.currentPosition.point = [data.position.O, data.position.P];
        let lnglat = [data.position.O, data.position.P];
        AMap.plugin('AMap.Geocoder', function() {
          let geocoder = new AMap.Geocoder({
            city: '010'
          });
          geocoder.getAddress(lnglat, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
              const address = result.regeocode.formattedAddress;
              _this.currentPosition.address = address;
            }
          });
        })
      });//返回定位信息 
      AMap.event.addListener(geolocation, 'error', function(data) {
        console.log(data)
        // _this.$store.dispatch('poupShow', {
        //   data: '定位失败！',
        //   time: 1
        // });
      });//返回定位出错信息
    },
    pickLoginWay(val) {
      if (this.shopList.length > 0) {
        this.loginWay = val;
      } else {
        this.$store.dispatch('poupShow', {
          data: '附近暂无门店！',
          time: 1
        });
      }
      if (val) {
        let pointList = [];
        this.shopList.forEach(item => {
          let point = [];
          point.push(item.longitude);
          point.push(item.latitude);
          let data = {
            point: point,
            phone: item.phone,
            shopName: item.shopName
          }
          pointList.push(data);
        })
        this.storeList = pointList;
      } else {
        this.storeList = [];
      }
    },
    storeInMap(data) {
      let list = [];
      list.push(data);
      this.storeList = list;
      this.loginWay = 1;
    }
  }
}
</script>

<style lang="less" scoped>
.login-way {
  display: flex;
  width: 300px;
  margin: 10px auto 0px auto;
  height: 35px;
  line-height: 35px;
  border-radius: 2.5px;
  div {
    width: 148.5px;
    text-align: center;
    height: 33px;
    margin: 1px;
    font-size: 14px;
  }
  div:first-child {
    border-bottom-left-radius: 2.5px;
    border-top-left-radius: 2.5px;
  }
  div:last-child {
    border-bottom-right-radius: 2.5px;
    border-top-right-radius: 2.5px;
  }
  .selected-item {
    color: white;
  }
  .bg-selected-item {
    background-color: white;
  }
}
.local {
  width: calc(100% - 15px);
  text-align: center;
  margin: 10px auto;
  font-size: 12px;
}
.content {
  width: 100%;
  // height: calc(100vh - 160px);
  height: calc(100vh - 115px);
  -webkit-overflow-scrolling: auto;
  overflow: auto;
}
</style>
