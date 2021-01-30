<template>
  <section class="near-stores">
    <div class="current-position" :style="{'background-color': themeColor}">
      <i class="vip-v3-iconfont vip-v3-icon-dizhi2"></i>
      <span>您当前位置：</span>
      {{currentPosition.address}}
    </div>
    <div id="container" v-show="false"></div>
    <div class="shop-list">
      <div class="shop-item" v-for="item in shopList" :key="item.shopId">
        <div class="shop-item-left">
          <div class="name" :style="{'color': themeColor}">{{item.nameOut || item.shopName}}<div>{{item | distanceFilter(currentPosition)}}</div></div>
          <div class="phone" v-if="item.phone">
            <i class="vip-v3-iconfont vip-v3-icon-group48"></i>
            <span>{{item.phone}}</span>
          </div>
          <div class="address" v-if="item.address">
            <i class="vip-v3-iconfont vip-v3-icon-dizhi"></i>
            <span>{{item.address}}</span>
          </div>
        </div>
        <div class="shop-item-right">
          <div class="link-item" v-if="item.phone" @click="callPhone(item)"><i :style="{'color': themeColor}" class="vip-v3-iconfont">&#xe638;</i></div>
          <div class="link-item" v-if="item.address" @click="showMap(item)"><i :style="{'color': themeColor}" class="vip-v3-iconfont">&#xe720;</i></div>
        </div>
      </div>
    </div>
    <div class="bg-over" v-if="loading">
      <van-loading size="24px" vertical>加载中...</van-loading>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
export default {
  components: {
  },
  data() {
    return {
      currentPosition: {
        point: null,
        address: ''
      },
      shopList: [],
      loading: false,
    }
  },
  computed: {
    ...mapState({
      themeColor: state => state.themeColor,
      urlData: state => state.urlData
    })
  },
  filters: {
    distanceFilter(val, currentPosition) {
      const pointA = [val.longitude, val.latitude];
      const pointB = currentPosition.point;
      const distance = AMap.GeometryUtil.distance(pointA, pointB);
      const distanceData = distance ? distance : 0;
      return distanceData < 1000 ? `${distanceData.toFixed(1)}米` : `${(distanceData / 1000).toFixed(1)}公里`;
      // return distanceData < 5000 ? `${distanceData.toFixed(1)}` : `${(distanceData / 1000).toFixed(1)}`;
    }
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') {
      const locationStr = '{"latitude":22.560718536376953,"longitude":114.12022399902344}';
      this.wxPosition(this, locationStr);
    } else {
      this.wxJDKPosition();
    }
  },
  methods: {
    callPhone(val) {
      if (val.phone) {
        window.location.href = `tel://${val.phone}`;
      }
    },
    showMap(val) {
      if(val.latitude && val.longitude) {
        wx.ready(function() {
          wx.openLocation({
            latitude: parseFloat(val.latitude), // 纬度，浮点数，范围为90 ~ -90
            longitude: parseFloat(val.longitude), // 经度，浮点数，范围为180 ~ -180。
            name: val.address, // 位置名
            address: val.address, // 地址详情说明
            scale: 18, // 地图缩放级别,整形值,范围从1~28。默认为最大
            infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
          });
        })
      }
    },
    distance(val) {
      const pointA = [val.longitude, val.latitude];
      const pointB = this.currentPosition.point;
      const distance = AMap.GeometryUtil.distance(pointA, pointB);
      const distanceData = distance ? distance : 0;
      return distanceData
      // return distanceData < 5000 ? `${distanceData.toFixed(1)}` : `${(distanceData / 1000).toFixed(1)}`;
    },
    sortShopList(data) {
      const result = data.map((item) => {
        return this.distance(item)
      })
      return result
    },
    ownSort(a, b) {
      return a.distanceNumber - b.distanceNumber
    },
    getNearbyShopList() {
      let params = {
        companyKey: this.urlData.companyKey,
        showStatus: '1'
      };
      this._http({url: '/jop-web/jop/getWxAroundShopList'}, params).then(res => {
        if(res.data.code === 0) {
          this.loading = false;
          const shopData = res.data.data.list || [];
          const sortShopList = this.sortShopList(res.data.data.list);
          if (Array.isArray(shopData)) {
            this.shopList = shopData.map((item, i) => {
              return Object.assign(item, {distanceNumber: sortShopList[i]})
            })
            this.shopList.sort(this.ownSort)
          }
        } else {
          this.$toast({
            message: res.data.msg,
            duration: 1000
          })
        }
      })
    },
    wxJDKPosition() {
      this.loading = true;
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
              'getLocation',
              'openLocation'
            ]
            // 必填，需要使用的JS接口列表
          });
          wx.ready(function() {
            wx.getLocation({
              type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
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
      this.loading = true;
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
  }
}
</script>

<style lang="less" scoped>
.near-stores {
  .bg-over {
    width: 100%;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .current-position {
    height: 40px;
    line-height: 40px;
    padding: 0 12px;
    color: #ffffff;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    span {
      padding-left: 8px;
    }
  }
  .shop-list {
    height: calc(100vh - 65px);
    overflow: auto;
    .shop-item {
      background-color: #ffffff;
      padding: 15px 12px;
      display: flex;
      align-items: center;
      .shop-item-left {
        flex-grow: 1;
        .name {
          font-size: 14px;
          > div {
            font-size: 12px;
            transform: scale(.75);
            transform-origin: 50% 50%;
            display: inline-block;
            padding-left: 8px;
            color: #999999;
          }
        }
        .phone, .address {
          color: #666666;
          font-size: 12px;
          padding-top: 8px;
          display: flex;
          i {
            font-size: 8px;
            padding: 2px 4px 0 0;
          }
        }
      }
      .shop-item-right {
        width: 120px;
        text-align: right;
        .link-item {
          width: 30px;
          text-align: center;
          height: 30px;
          line-height: 30px;
          display: inline-block;
          border: 1px solid #cccccc;
          margin-left: 13px;
          border-radius: 50%;
        }
      }
    }
    .shop-item:not(:last-child) {
      margin-bottom: 5px;
    }
  }
}
</style>
