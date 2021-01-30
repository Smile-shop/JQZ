<template>
  <router-view/>
  <app-dialog
    :modelValue="store.state.isShowNeedBuy"
    @update:modelValue="store.commit('setIsShowNeedBuy', false)"
  >
    <div class="need-buy-dialog">
      <div class="header">
        <img src="~@/assets/img/need-buy.png" alt="图片">
      </div>
      <div class="content">
        <div class="message">
          参与分销需先完成购买
        </div>
        <div class="control">
          <button @click="store.commit('setIsShowService', true)" class="cancel">
            添加客服微信
          </button>
          <button @click="store.dispatch('pay')" :disabled="canBuy == false" class="affirm">
            {{canBuy ? '立即购买' : '无法购买'}}
          </button>
        </div>
      </div>
    </div>
  </app-dialog>
  <app-dialog
    :modelValue="store.state.isShowPayFail"
    @update:modelValue="store.commit('setIsShowPayFail', false)"
  >
    <div class="buy-fail-dialog">
      <div class="header">
        <img src="~@/assets/img/pay-fail.png" alt="图片">
      </div>
      <div class="content">
        <div class="title">
          支付失败
        </div>
        <div class="message">
          支付遇到问题，请尝试继续支付，如有疑问请联系客服
        </div>
        <div class="control">
          <button @click="store.commit('setIsShowService', true)" class="cancel">
            添加客服微信
          </button>
          <button @click="store.dispatch('pay')" :disabled="canBuy == false" class="affirm">
            {{canBuy ? '立即购买' : '无法购买'}}
          </button>
        </div>
      </div>
    </div>
  </app-dialog>
  <app-dialog
    :modelValue="store.state.isShowFollow"
    @update:modelValue="store.commit('setIsShowFollow', false)"
    :alpha="0.9"
  >
    <div class="follow">
      <a
        v-if="isApple()"
        href="javascript:;"
      >
        <img :src="home.merchantQrcode" alt="二维码">
      </a>
      <img
        v-else
        :src="home.merchantQrcode"
        alt="二维码"
      >
      <p class="message">
        长按识别二维码，查询订单和收益
      </p>
    </div>
  </app-dialog>
  <app-dialog
    :modelValue="store.state.isShowService"
    @update:modelValue="store.commit('setIsShowService', false)"
    :title="'在线客服：' + home.distributionMerchantSettingVo.kfName"
    :alpha="0.9"
  >
    <div class="service">
      <div class="phone">
        <div class="left">
          <i class="iconfont icon-dianhua"></i>
          {{home.distributionMerchantSettingVo.kfPhone}}
        </div>
        <div class="right">
          <a :href="`tel:${home.distributionMerchantSettingVo.kfPhone}`">
            一键拨打
          </a>
        </div>
      </div>
      <div class="qrcode">
        <a
          v-if="isApple()"
          href="javascript:;"
        >
          <img :src="home.distributionMerchantSettingVo.kfQrcode" alt="二维码">
        </a>
        <img
          v-else
          :src="home.distributionMerchantSettingVo.kfQrcode"
          alt="二维码"
        >
        长按识别二维码联系我们
      </div>
    </div>
  </app-dialog>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import AppDialog from '@/components/app-dialog.vue';
import { isApple } from '@/utils/platform';

export default defineComponent({
  components: {
    AppDialog,
  },
  setup() {
    const store = useStore();

    return {
      store,
      isApple,
      home: computed(() => store.state.home),
      canBuy: computed(() => store.getters.canBuy)
    }
  }
})
</script>

<style lang="scss" scoped>
.service {
  padding: 5vw 5vw 8vw 5vw;

  > .title {
    margin-bottom: 7vw;
    text-align: center;
    font-size: 3.7vw;
    color: #1D0800;
  }

  > .phone {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5vw;

    > .left {
      display: flex;
      align-items: center;
      font-size: 3.7vw;
      color: #FC7125;

      > .iconfont {
        margin-right: 3vw;
        font-size: 6vw;
      }
    }

    > .right {
      > a {
        border-radius: 5vw;
        border: 1px solid #FC5B1A;
        padding: 1.5vw 4.5vw;
        font-size: 3.2vw;
        color: #FC601D;
        background-color: #FFF;
      }
    }
  }

  > .qrcode {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 3.2vw;
    color: #9D9595;

    img {
      padding: 5vw;
      width: 41vw;
      height: 41vw;
    }
  }
}

.follow {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 9vw 7vw;

   img {
     padding: 5vw;
     width: 41vw;
     height: 41vw;
   }

   > .message {
    font-size: 3.2vw;
    color: #9D9595;
   }
}

.need-buy-dialog {
  > .header {
    > img {
      width: 100%;
      height: 52vw;
    }
  }

  > .content {
    padding: 3.7vw 3vw 5vw 3vw;

    > .title {
      margin-bottom: 4vw;
      text-align: center;
      font-size: 4.3vw;
      color: #1D0800;
    }

    > .message {
      padding: 0 3vw;
      text-align: center;
      text-align-last: center;
      line-height: 1.5;
      margin-bottom: 4vw;
      text-align: center;
      font-size: 3.7vw;
      color: #9D9595;
    }

    > .control {
      display: flex;
      justify-content: space-between;
      margin-top: 7vw;

      > button {
        width: 34vw;
        border-radius: 4.8vw;
        padding: 2vw;
        font-size: 3.7vw;

        &.cancel {
          border: 1px solid #FC7125;
          background-color: #FFF;
          color: #FC7125;
        }

        &.affirm {
          border: 1px solid #FC7125;
          background-color: #FC7125;
          color: #FFF;
        }

        &:disabled {
          background-color: #FDB892;
          border: 1px solid #FDB892;
        }
      }
    }
  }
}

.buy-fail-dialog {
  > .header {
    > img {
      width: 100%;
      height: 52vw;
    }
  }

  > .content {
    padding: 3.7vw 3vw 5vw 3vw;

    > .title {
      margin-bottom: 4vw;
      text-align: center;
      font-size: 4.3vw;
      color: #1D0800;
    }

    > .message {
      padding: 0 3vw;
      text-align: center;
      text-align-last: center;
      line-height: 1.5;
      margin-bottom: 4vw;
      text-align: center;
      font-size: 3.7vw;
      color: #9D9595;
    }

    > .control {
      display: flex;
      justify-content: space-between;
      margin-top: 7vw;

      > button {
        width: 30vw;
        border-radius: 4.8vw;
        padding: 2vw;
        font-size: 3.7vw;

        &.cancel {
          border: 1px solid #FC7125;
          background-color: #FFF;
          color: #FC7125;
        }

        &.affirm {
          border: 1px solid #FC7125;
          background-color: #FC7125;
          color: #FFF;
        }
      }
    }
  }
}
</style>
