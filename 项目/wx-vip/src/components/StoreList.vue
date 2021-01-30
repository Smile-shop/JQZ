<template>
  <div>
    <div class="shop-item" @click="goConsumeItem(item)" v-for="(item, index) in shopList" :key="index">
      <div class="item">
        <div class="num">
          <div class="name">{{ item.nameOut || item.shopName }}</div>
          <div class="phone">电话：{{ item.phone }}</div>
        </div>
        <div class="icon">
          <!-- {{ computedDistance(item) }} -->
          {{item.distance}}
          <i class="vip-v3-iconfont">&#xe60e;</i>
        </div>
      </div>
      <div class="address">地址：{{ item.address }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['currentPoint', 'shopList'],
  data() {
    return {
    }
  },
  mounted() {
    // console.log(this.shopList)
    // window.alert(JSON.stringify(this.currentPoint))
    // this.getShopList();
  },
  methods: {
    goConsumeItem(item) {
      this.$emit('goMap', {
        point: [item.longitude, item.latitude],
        phone: item.phone,
        shopName: item.shopName
      })
    },
    computedDistance(item) {
      let pointA = [item.longitude, item.latitude];
      let pointB = this.currentPoint;
      let distance = AMap.GeometryUtil.distance(pointA, pointB);
      let distanceData = distance ? distance : 0;
      if(distanceData < 5000) {
        return `${distanceData.toFixed(1)}米`;
      } else {
        return `${(distanceData / 1000).toFixed(1)}公里`;
      }
    }
  }
}
</script>

<style lang="less" scoped>
.shop-item:not(:last-child) {
  margin-bottom: 1px;
}
.shop-item {
  background-color: white;
  .item {
    display: flex;
    padding: 4px 0;
    align-items: center;
    .num {
      flex-basis: 50%;
      flex-grow: 1;
      padding-left: 10px;
      .name {
        font-weight: bold;
        font-size: 14px;
      }
      .phone {
        font-size: 13px;
        padding-top: 5px;
      }
    }
    .icon {
      width: 100px;
      padding-right: 7.5px;
      text-align: right;
      color: #666666;
      font-size: 14px;
      .vip-v3-iconfont {
        font-size: 14px;
        color: #666666;
      }
    }
  }
  .address {
    padding: 0 10px 6px 10px;
    font-size: 14px;
  }
}
</style>
