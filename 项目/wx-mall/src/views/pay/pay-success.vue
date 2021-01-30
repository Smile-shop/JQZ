<template>
  <base-layout
    :isShowHeaderLogin="false"
    :isShowBack="false"
    :isShowFooter="false"
    title="支付成功"
  >
    <article
      id="pay-success"
    >
      <i class="iconfont icon-xuanzhong"></i>
      <p>订单支付成功，{{countDown}}秒后将自动跳转至订单页面</p>
    </article>

    <van-dialog
      v-model="showQrCodeDialog"
      class="qrcode-dialog"
      :show-confirm-button="false"
      :close-on-click-overlay="true"
      :before-close="onAttentionPublicAppClose"
    >
      <div class="dialog-content">
        <header>
          <p>
            小主，我们正在加急给您备货，关注公众号可以获取最新的订货消息哦~
          </p>
        </header>
        <img v-if="isMobile.Android()" class="qrcode" :src="qrCodeUrl">
        <a  v-else href="javascript:;">
          <img class="qrcode" :src="qrCodeUrl">
        </a>
        <div class="tip">
          长按二维码解锁更多功能
        </div>
      </div>
    </van-dialog>
  </base-layout>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import BaseLayout from '@/layouts/base-layout.vue';
import {State, Getter, Action, Mutation, namespace} from 'vuex-class';

// 工具
import {getLocalStorage} from '@/utils/local-storage';
import { isMobile } from '@/utils/platform';

// http
import {httpReq} from '@/utils/http-req';
import {getWxComInfoReq} from '@/serves/home';

@Component({
  components: {
    BaseLayout,
  },
})
export default class StatePaySuccess extends Vue {
  private countDown: number = 3;

  // 显示二维码对话框
  private showQrCodeDialog = false;

  // 二维码地址
  private qrCodeUrl = '';

  @State('shareType')
  private shareType!: any;

  private isMobile = isMobile;

  private mounted() {
    this.attentionCompany();
  }

  private toOrderPage() {
    setInterval(() => {
      this.countDown--;

      if (this.countDown === 0) {
        this.$router.replace('/user/order/all');
      }
    }, 1000);
  }

  // 关注公众号
  private async attentionCompany() {
    const localData = getLocalStorage();
    const { wxUserInfo } = localData;

    if (wxUserInfo) {
      const { subscribe } = wxUserInfo;

      if (subscribe == '0' && this.shareType && this.shareType.shareGuide == '2') {
        await this.getQrCodeUrl();
        this.showQrCodeDialog = true;

        return;
      }
    }

    this.toOrderPage();
  }

  // 当关注二维码关闭
  private onAttentionPublicAppClose(action, done) {
    done();
    this.toOrderPage();
  }

  // 获取公众号二维码
  private async getQrCodeUrl() {
    const body = {};

    getWxComInfoReq.requestInit.body = JSON.stringify(body);
    const {
      publicId
    } = await httpReq(getWxComInfoReq);
    this.qrCodeUrl = `https://open.weixin.qq.com/qr/code?username=${publicId}`;
  }
}
</script>

<style lang="scss" scoped>
#pay-success {
  display: grid;
  align-content: start;
  justify-items: center;
  grid-row-gap: 3rem;
  padding-top: 7.4rem;
  width: 100%;

  & > .iconfont {
    font-size: 11rem;
    color: #00c09a;
  }

  & > p {
    margin: 0;
    line-height: 2;
    text-align: center;
    font-size: 1.8rem;
    color: #666666;
  }
}

.qrcode-dialog {
  .dialog-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    > header {
      margin-bottom: 20px;
      padding: 15px 25px;
      color:rgba(149,158,172,1);
      font-size: 16px;
      line-height: 2;
      box-shadow:0px 2px 20px 0px rgba(0, 0, 0, 0.1);
      border-radius:20px;
    }

    img {
      width: 200px;
      height: 200px;
    }

    > .tip {
      margin-top: 10px;
      margin-bottom: 30px;
      padding: 10px;
      background:rgba(154,194,247,0.25);
      border-radius:31px;
      color:rgba(96,98,102,1);
    }
  }
}
</style>
