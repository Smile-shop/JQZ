<template>
  <div class="coupons-content">
    <div class="nav-picker" :style="{ 'background-color': themeColor }">
      <div>
        <div @click="pick(0)" :style="{ 'color': loginWay == 0 ? themeColor : 'white' }" :class="{ 'selected-item': loginWay == 0 }">
          待领取 ({{couponNum.notReceiveCount}})
        </div>
      </div>
      <div>
        <div @click="pick(1)" :style="{ 'color': loginWay == 1 ? themeColor : 'white' }" :class="{ 'selected-item': loginWay == 1 }">未使用 ({{couponNum.notUsedCount}})</div>
      </div>
      <div>
        <div @click="pick(2)" :style="{ 'color': loginWay == 2 ? themeColor : 'white' }" :class="{ 'selected-item': loginWay == 2 }">已使用 ({{couponNum.usedCount}})</div>
      </div>
      <div>
        <div @click="pick(4)" :style="{ 'color': loginWay == 4 ? themeColor : 'white' }" :class="{ 'selected-item': loginWay == 4 }">已过期 ({{couponNum.expiredCount}})</div>
      </div>
    </div>

    <div class="coupons-list" :style="couponsListHeight">
      <CouponsItem @showQr="showQr" @getCouponItem="getCouponItem" :type="loginWay" :listItem="item" v-for="item in couponList" :key="item.id"></CouponsItem>
    </div>

    <div class="get-all-btn" @click="getAllCoupons" :style="{'background-color': themeColor}" v-if="loginWay == 0 && couponList.length > 0 && isAllPick(couponList)">一键领取所有优惠券</div>

    <Toast :type="3" :model="toastShow" :title="'优惠券条形码'" @close="toastShow = false" ref="toast"></Toast>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import CouponsItem from '../../components/CouponsItem';
import Toast from '../../components/Toast';
export default {
  components: {
    CouponsItem,
    Toast
  },
  computed: {
    ...mapState({
      themeColor: state => state.themeColor,
      homeMemberData: state => state.homeMemberData,
      urlData: state => state.urlData
    }),
    id() {
      return this.$route.params.id * 1;
    },
    couponsListHeight() {
      let htmlDomDpr = window.navigator.appVersion.includes('iPhone') ? 2 : 1;
      let hasAllBtnHeight = [`calc(100vh - 105px)`, `calc(100vh - 111px)`][htmlDomDpr - 1];
      let noAllBtnHeight = [`calc(100vh - 75px)`, `calc(100vh - 67px)`][htmlDomDpr - 1];
      return {
        height: this.loginWay == 0 && this.couponList.length > 0 ? hasAllBtnHeight : noAllBtnHeight
      }
    },
    user() {
      const urlData = window.localStorage.getItem('urlData');
      if (urlData) {
        return JSON.parse(urlData);
      }
    }
  },
  data() {
    return {
      loginWay: 0,
      toastShow: false,
      data: {
        phone: '0000',
        id: '0000'
      },
      couponList: [],
      couponNum: {
        // 未使用数量
        notUsedCount: 0,
        // 过期数量
        expiredCount: 0,
        // 未领取数量
        notReceiveCount: 0,
        // 已使用数量
        usedCount: 0
      }
    }
  },
  watch: {
    id() {
      this.pickItem(this.id);
    }
  },
  mounted() {
    this.pickItem(this.id);
    this.getCouponCount();
  },
  methods: {
    // 获取各状态优惠券数量
    getCouponCount() {
      this._http({url: '/jop-web/coupon/count'}, {}).then(res => {
        if(res.data.code === 0) {
          const resData = res.data.data;
          this.couponNum = {
            notUsedCount: resData.notUsedCount,
            expiredCount: resData.expiredCount,
            notReceiveCount: resData.notReceiveCount,
            usedCount: resData.usedCount,
          }
        } else {
          this.$toast({
            message: res.data.msg,
            duration: 1000
          })
        }
      })
    },
    // 领取优惠券
    getCouponItem() {
      this.pickItem(this.id);
      this.getCouponCount();
    },
    isAllPick(list) {
      let countList = list.filter(p => p.count)
      return countList.length > 0;
    },
    pickItem(val) {
      this.loginWay = val;
      if (!val) {
        this.getCouponIndex();
      } else {
        this.getCouponList(val - 1);
      };
    },
    pick(val) {
      this.$router.replace({
        path: `/coupons/${val}`
      });
    },
    showQr(data) {
      this.$refs.toast.showJsBarcode('#barcode_3', data.code);
      this.$nextTick(() => {
        this.$refs.toast.showQrCode(data.code);
      })
      this.toastShow = true;
    },
    getAllCoupons() {
      this._http({url: '/jop-web/coupon/getAll'}, {}).then(res => {
        if(res.data.code === 0) {
          this.couponList = [];
          // 处理首页未领取的优惠券
          this.$store.dispatch('getHomeMemberIndex', {
            companyKey: this.urlData.companyKey,
            openid: this.urlData.openid
          });
          // 更新tab框数量
          this.getCouponCount();
        } else {
          this.$toast({
            message: res.data.msg,
            duration: 1000
          })
        }
      })
    },
    // 获取未领取的优惠券列表
    getCouponIndex() {
      let params = {
        params: {
          card_no: this.user.memberCard,
          companyKey: this.urlData.companyKey
        },
        page: {
          pageNum: 1,
          pageSize: 100
        }
      };
      // 获取列表前，先清空之前列表
      this.couponList = [];
      this._http({url: '/jop-web/coupon/index'}, params).then(res => {
        if(res.data.code === 0) {
          this.couponList = res.data.data.list;
        } else {
          this.$toast({
            message: res.data.msg,
            duration: 1000
          })
        }
      })
    },
    // 获取未使用、已使用、使用中、已过期的优惠券列表
    getCouponList(data) {
      let params = {
        params: {
        card_no: this.homeMemberData.cardNum,
        companyKey: this.urlData.companyKey,
        status: data
        },
        page: {
          pageNum: 1,
          pageSize: 100
        }
      }
      // 获取列表前，先清空之前列表
      this.couponList = [];
      this._http({url: '/jop-web/coupon/list'}, params).then(res => {
        if(res.data.code === 0) {
          this.couponList = res.data.data.list;
        } else {
          this.$toast({
            message: res.data.msg,
            duration: 1000
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.coupons-content {
  display: flex;
  flex-direction: column;
  position: relative;
}
.nav-picker {
  display: flex;
  width: 100%;
  height: 44px;
  align-items: center;
  z-index: 2000;
  div {
    flex-basis: 20%;
    flex-grow: 1;
    text-align: center;
    font-size: 14px;
    div {
      width: calc(100% - 2px);
      margin: 0 auto;
      height: 42px;
      line-height: 42px;
    }
    .selected-item {
      background-color: white;
    }
  }
}
.coupons-list {
  flex-grow: 1;
  width: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: auto;
}
.get-all-btn {
  height: 44px;
  line-height: 44px;
  text-align: center;
  color: #ffffff;
  font-size: 16px;
  width: 100%;
  // position: absolute;
  // bottom: 0;
}
</style>
