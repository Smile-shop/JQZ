<template>
  <div>
    <CouponsItem :type="5" :listItem="couponsData" @getCouponItem="getCouponItem"></CouponsItem>
    <div class="details-content">
      <!-- <div class="details-item">
        <div class="title" :style="{ 'color': themeColor }">详情</div>
        <p>券号：{{ couponsData.id || couponsData.couponId }}</p>
        <p>有效期：{{couponsData | timeFilter}}</p>
      </div> -->
      <div class="details-item">
        <div class="title" :style="{ 'color': themeColor }">使用说明</div>
        <pre>{{couponsData.details}}</pre>
      </div>

      <div class="details-img details-item" v-if="couponsData.pic_url">
        <img :src="couponDetailsImg" alt="coupons-img">
      </div>


      <div class="details-item" v-if="couponsData.code && couponsData.status === 0 && isOutTime">
        <div class="title" :style="{ 'color': themeColor }">优惠券条码</div>
        <div class="barcode">
          <img id="barcode_details">
        </div>
        <div class="qrcode" style="text-align: center;">
          <canvas id="qrcode_details"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import QRious from 'qrious';
import CouponsItem from '../../components/CouponsItem';
export default {
  components: {
    CouponsItem,
  },
  data() {
    return {
      qrcode: null
    }
  },
  computed: {
    ...mapState({
      themeColor: state => state.themeColor,
      couponsData: state => state.couponDetails,
      urlData: state => state.urlData
    }),
    couponDetailsImg() {
      let imgname = this.couponsData.pic_url;
      return `${this.httpUrl}/jop-wx-web/op/showimage?companyKey=${this.user.companyKey}&imgname=${imgname}&alias=Coupon`;
    },
    user() {
      const userStr = window.localStorage.getItem('urlData');
      if(userStr) {
        return JSON.parse(userStr);
      }
    },
    isOutTime() {
      return this.couponsData.endTime > new Date().getTime();
    }
  },
  filters: {
    timeFilter(data) {
      if(data.useStartTime && data.useEndTime) {
        return `${new Date(data.useStartTime).format('yyyy/MM/dd')} - ${new Date(data.useEndTime).format('yyyy/MM/dd')}`;
      } else {
        return `${new Date(data.startTime).format('yyyy/MM/dd')} - ${new Date(data.endTime).format('yyyy/MM/dd')}`;
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 未使用的时候显示二维码和条形码
      if (this.couponsData.code && this.couponsData.status === 0 && this.isOutTime) {
        // 生成条形码
        JsBarcode("#barcode_details", `${this.couponsData.code}`, {
          marginTop: 30,
          fontSize: 16,
          displayValue: true,
          width: 2,
          height: 80
        });
        // 二维码
        const params = {
          element: document.getElementById('qrcode_details'),
          value: this.couponsData.code,
          size: 244
        }
        this.qrcode = new QRious(params);
      }
    },
    getCouponItem() {
      this.$nextTick(() => {
        this.init();
      })
    }
  }
}
</script>

<style lang="less" scoped>
.details-content {
  width: 100%;
  // height: calc(100vh - 225px);
  height: calc(100vh - 180px);
  margin-top: 10px;
  background-color: white;
  overflow: auto;
  .details-item {
    padding: 20px 14px 0 14px;
    .title {
      font-size: 14px;
      font-weight: bold;
    }
    pre {
      margin: 6px 0 7px 0;
      color: #666666;
      font-size: 12px;
      line-height: 22.5px;
      min-width: 100%;
      word-break: break-word;
      white-space: pre-warp;
    }
    .barcode {
      text-align: center;
    }
    .qrcode {
      width: 100%;
      text-align: center;
      #qrcode_details {
        margin: 0 auto;
        width: 244px;
      }
    }
  }
  .details-img {
    img {
      width: 100%;
    }
  }
}
</style>
