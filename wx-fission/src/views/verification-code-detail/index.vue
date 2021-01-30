<template>
  <main class="code">
    <div v-if="!data.showPermisson">
      <div class="code-info">
        <goods-info :goods-info="data.goodsInfo" />
      </div>
      <div class="code-exchage">
        <exchange-info :product-info="data.goodsInfo.productInfoArr" />
      </div>
      <div class="code-btn">
        <button class="code-btn-sure" v-if="data.goodsInfo.verifyStatus === '1'" @click="comfirm">确认核销</button>
        <button
          class="code-btn-redone"
          :style="data.goodsInfo.verifyStatus === '2' ? 'margin-top: 8vw;' : ''"
          @click="reScanQRCode"
        >重新扫描</button>
      </div>
      <app-message-box
        v-model="data.showComfirm"
        asyncClose
        @affirm="verfication"
        :message="data.message"
      />
    </div>
    <div v-else>
      <permissionError />
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from 'vue';
import goodsInfo from './child/goods-info.vue';
import exchangeInfo from './child/exchange-info.vue';
import appMessageBox from '@/components/app-message-box.vue';
import permissionError from "./child/permission-error.vue";
import { getVerifyInfo, verifyOrder } from '@/api';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
export default defineComponent({
  components: { goodsInfo, exchangeInfo, appMessageBox, permissionError },
  setup() {
    const store = useStore();
    const route = useRoute()
    const data = reactive({
      showComfirm: false,
      goodsInfo: {},
      message: `<div>确定核销此订单？</div><div style="color: red; font-size: 3vw; margin-top: 2vw;line-height: 4vw">*核销完成后，务必到JMP操作出库！（商品无入库则忽略）</div>`,
      showPermisson: false
    });
    const getOrderInfo = async () => {
      try {
        const body = {
          orderNo: store.state.query.orderNo,
          verifierOpenId: store.state.user.openId,
        };
        const res: any = await getVerifyInfo(body);
        res.productInfoArr = res.productInfo ? JSON.parse(res.productInfo) : [];
        data.goodsInfo = res;
      } catch (error) {
        if (error === '您无核销此门店订单的权限，请联系商家设置!') {
          data.showPermisson = true
          document.title = '扫码结果'
        }
        console.log(error);
      }
    };
    const reScanQRCode = () => {
      window.wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
        success: (res: any) => {
          const url = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
          window.location.replace(url);
          // window.location.href = url;
        },
      });
    };
    const comfirm = () => {
      data.showComfirm = true;
    };
    const verfication = async () => {
      try {
        const body = {
          orderNo: store.state.query.orderNo,
          verifierOpenId: store.state.user.openId,
        };
        await verifyOrder(body);
        data.showComfirm = false;
        getOrderInfo()
      } catch (err) {
        console.log(err);
      }
    };

    onMounted(() => {
      if (route.query.showPermisson as string === 'true') {
        data.showPermisson = true
      }
      getOrderInfo();
    });

    return {
      data,
      reScanQRCode,
      comfirm,
      verfication,
    };
  },
});
</script>

<style lang="scss" scoped>
.code {
  background: #f7f7f7;
  height: 100vh;
  padding: 0 4vw;
  overflow: auto;
  &-exchage {
    margin-top: 2.7vw;
  }
  &-btn {
    text-align: center;
    font-size: 3.7vw;
    &-sure {
      margin-top: 8vw;
      width: 73.1vw;
      height: 10.7vw;
      border: none;
      outline: none;
      color: #fff;
      background: #fc7125;
      border-radius: 5.3vw;
    }
    &-redone {
      margin-top: 4vw;
      width: 73.1vw;
      height: 10.7vw;
      background: transparent;
      border-radius: 1.1vw;
      border: none;
      outline: none;
      color: #fc7125;
      border: 1px solid #fc7125;
      border-radius: 5.3vw;
    }
  }
}
</style>
