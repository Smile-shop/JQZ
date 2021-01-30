<template>
  <div>
    <div @click="goDetails(listItem)" class="coupons-item">
      <div class="item-left" :style="{ 'background-color': (type == 4 || (type == 0  && listItem.count <= 0)) ? '#cccccc' : themeColor }">
        <div>{{ listItem.category }}</div>
      </div>
      <img class="stamp" src="../assets/stamp.png" alt="stamp">
      <div class="item-center" :style="backgroundImg">
        <div class="item-center-title">
          <div class="title" :style="{ 'color': (type == 4 || (type == 0  && listItem.count <= 0)) ? '#cccccc' : themeColor }">{{ listItem.name }}</div>
          <div class="btn" v-if="type != 5">
            <div class="qr-btn-div" v-if="type == 0" @click.stop="receive" :style="{ 'background-color': listItem.count && listItem.count > 0 ? themeColor : '#cccccc' }">
              <span v-if="listItem.count && listItem.count > 0">{{ listItem.is_receive ? '已领取' : '立即领取' }}</span>
              <span v-else>已抢光</span>
            </div>
            <div class="qr-btn-img" v-if="type == 1">
              <img class="qrBtn" @click.stop="showQr(listItem)" src="../assets/card-barcode.png" alt="二维码">
            </div>
            <div class="qr-btn-div" v-if="type == 2" :style="{ 'background-color': '#cccccc' }">
              {{ '已使用' }}
            </div>
            <div class="qr-btn-div" v-if="type == 4" :style="{ 'background-color': '#cccccc' }">
              {{ '已过期' }}
            </div>
          </div>
          <div class="btn" v-else>
            <div class="qr-btn-div" v-if="!listItem.code && isReceived && listItem.count && listItem.count > 0" @click.stop="receive" :style="{ 'background-color': themeColor }">
              <span>立即领取</span>
            </div>
          </div>
        </div>
        <div class="name" v-if="type == 5">券号：{{ listItem.id || listItem.couponId }}</div>
        <div class="name">门店：{{ listItem.shopName }}</div>
        <div class="name" v-if="type != 5">{{ listItem.details }}</div>
        <div class="name">{{ listItem | timeFilter(type) }}</div>
        <div class="name" v-if="type == 5">状态：{{ listItem | statusFilter(type) }}</div>
      </div>
      <div class="item-right" :style="{ 'background-color': (type == 4 || (type == 0  && listItem.count <= 0)) ? '#cccccc' : themeColor }"></div>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex';
import Toast from './Toast';
export default {
  props: ['type', 'listItem'],
  components: {
    Toast
  },
  computed: {
    ...mapState({
      themeColor: state => state.themeColor,
      homeMemberData: state => state.homeMemberData,
      urlData: state => state.urlData
    }),
    data() {
      return {
        phone: this.listItem.code,
        id: this.listItem.couponId
      }
    }
  },
  data() {
    return {
      backgroundImg: {
        background: "url(" + require('../assets/yhq-bg.png') + ") no-repeat right bottom",
        backgroundSize: '100% 100%'
      },
      toastShow: false,
      isReceived: true
    }
  },
  filters: {
    statusFilter(data, type) {
      if(data.id) {
        return ['无效', '有效'][data.status];
      } else {
        if (type !== 4) {
          return ['未使用', '已使用', '使用中'][data.status];
        } else {
          return '已过期';
        }
      }
    },
    timeFilter(data, type) {
      if(data.code) {
        if(data.status == 0) {
          return `有效期：${new Date(data.startTime).format('yyyy-MM-dd')} - ${new Date(data.endTime).format('yyyy-MM-dd')}`;
        }
        if(data.status == 1) {
          return `使用时间：${new Date(data.usedTime).format('yyyy-MM-dd')}`;
        }
        if(data.status == 2) {
          return `领取时间：${new Date(data.startTime).format('yyyy-MM-dd')} - ${new Date(data.endTime).format('yyyy-MM-dd')}`;
        }
      } else {
        return `领取时间：${new Date(data.startTime).format('yyyy-MM-dd')} - ${new Date(data.endTime).format('yyyy-MM-dd')}`;
      }
    }
  },
  methods: {
    goDetails(item) {
      if (this.type != 5) {
        this.$store.commit('couponDetails', item);
        this.$router.push({
          path: '/cpsdtl'
        })
      }
    },
    receive() {
      if (this.listItem.count && this.listItem.count > 0 && !this.listItem.is_receive) {
        let params = {
          card_no: this.homeMemberData.cardNum,
          companyKey: this.urlData.companyKey,
          id: this.listItem.id,
          specialId: this.listItem.specialId
        }
        this._http({url: '/jop-web/coupon/get'}, params).then(res => {
          if(res.data.code === 0) {
            this.$toast({
              message: '领取成功！',
              duration: 1000
            })
            this.$emit('getCouponItem');
            // 处理首页未领取的优惠券
            this.$store.dispatch('getHomeMemberIndex', {
              companyKey: this.urlData.companyKey,
              openid: this.urlData.openid
            });
            if (this.type == 5) {
              this.isReceived = false;
            }
          } else {
            this.$toast({
              message: res.data.msg,
              duration: 1000
            })
          }
        })
      }
    },
    showQr(data) {
      this.$emit('showQr', data);
    }
  }
}
</script>

<style lang="less" scoped>
.coupons-item {
  width: calc(100% - 15px);
  margin: 7.5px auto 0 auto;
  display: flex;
  position: relative;
  .stamp {
    position: absolute;
    left: 28.5px;
    width: 10px;
    height: 130px;
  }
  .item-left {
    width: 31px;
    font-size: 14px;
    word-wrap: break-word;
    text-align: center;
    color: white;
    word-wrap:break-word;
    letter-spacing:10px;
    display: flex;
    align-items: center;
    div {
      width: 31px;
      padding: 0 7.5px;
    }
  }
  .item-center {
    flex-basis: 50%;
    flex-grow: 1;
    height: 130px;
    overflow: hidden;
    .item-center-title {
      display: flex;
      // height: 70px;
      align-items: center;
      .title {
        flex-basis: 50%;
        flex-grow: 1;
        padding-left: 15px;
        font-size: 20px;
      }
      .btn {
        width: 80px;
        .qr-btn-img {
          padding-top: 15px;
          text-align: center;
          .qrBtn {
            width: 30px;
          }
        }
        .qr-btn-div {
          height: 32.5px;
          line-height: 32.5px;
          text-align: center;
          width: 70px;
          color: white;
          font-size: 14px;
          margin-top: 10px;
        }
      }
    }
    .name {
      width: 95%;
      padding: 0 10px 4px 15px;
      color: #999999;
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .item-right {
    width: 2.5px;
    height: 130px;
  }
}
</style>

