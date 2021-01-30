<template>
  <div id="verification">
    <div class="step">
      <div class="step-item active">
        <div class="step-item-number">
          <i class="iconfont icon-checked"></i>
        </div>
        <span>
          支付成功
        </span>
      </div>
      <div
        :class="{
          'step-item': true,
          active: order.verify == 2
        }"
      >
        <div class="step-line"></div>
        <div class="step-item-number">
          2
        </div>
        <span>
          到店
        </span>
      </div>
      <div
        :class="{
          'step-item': true,
          active: order.verify == 2
        }"
      >
        <div class="step-line"></div>
        <div class="step-item-number">
          3
        </div>
        <span>
          兑换成功
        </span>
      </div>
    </div>
    <div class="qrcode">
      <div v-if="order.verify != 2" class="await">
        <img
          v-if="qrCodeUrl"
          class="qrcode-image"
          :src="qrCodeUrl"
          alt="二维码"
        >
        <app-loading
          v-else
          color="#555"
        />
        <p class="code">
          兑换码：<span class="mark">{{order.exchangeCode}}</span>
        </p>
        <p class="remark">
          到店向工作人员出示“二维码”
        </p>
        <p class="remark">
          此码一次有效，请勿泄漏
        </p>
      </div>
      <div v-else class="success">
        <img class="qrcode-image" :src="qrCodeUrl" alt="二维码">
        <p class="remark">
          领取时间：{{forDay(order.verifyTime)}}
        </p>
        <i class="iconfont icon-yihexiao"></i>
      </div>
    </div>
    <div class="info">
      <header>
        兑换信息
      </header>
      <ul>
        <li
          v-for="(item, index) of order.formInputVoList"
          :key="index"
        >
          <span class="key">
            {{item.name}}
          </span>
          <span class="value">
            {{item.value}}
          </span>
        </li>
      </ul>
    </div>
    <div class="rule">
      <header>
        <i class="iconfont icon-lengxing"></i>
        <span class="text">
          兑换规则
        </span>
        <i class="iconfont icon-lengxing"></i>
      </header>
      <div v-html="order.rule" class="content">
      </div>
    </div>
  </div>
  <app-control page="2"/>
</template>

<script lang="ts">
import { getExchangeInfo, getExchangeQrcode } from "@/api";
import AppControl from "@/components/app-control.vue";
import AppLoading from "@/components/app-loading.vue";
import { computed, defineComponent, onMounted, onUnmounted, ref } from "vue";
import dayjs from 'dayjs';

export default defineComponent({
  components: {
    AppControl,
    AppLoading
  },
  setup(){
    const order = ref({
      exchangeCode: '',
      formInputVoList: [],
      rule: '',
      verify: 1,
      verifyTime: 0
    });
    const qrCodeUrl = ref('');
    let timer = 0;

    // 获取数据
    async function getOrder() {
      const body = {};

      try {
        const res = await getExchangeInfo(body);
        if (res) {
          order.value = res;

          if (res.verify != 2) {
            timer = setTimeout(() => {
              getOrder();
            }, 8000);
          }
        }
      } catch (error) {
        console.warn(error);
      }
    }

    // 获取二维码
    async function getQrCode() {
      const body = {};

      try {
        const res = await getExchangeQrcode(body);
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        qrCodeUrl.value = url;
      } catch (error) {
        console.warn(error);
      }
    }

    function init() {
      getOrder();
      getQrCode();
    }

    const forDay = (val: any) => {
      if (val) {
        return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
      } else {
        return '--'
      }
    }

    onMounted(() => {
      init();
    })

    onUnmounted(() => {
      clearTimeout(timer);
    })

    return {
      order,
      qrCodeUrl,
      forDay
    }
  }
})
</script>

<style lang="scss" scoped>
#verification {
  padding: 4vw;
  background: #F7F7F7;
  min-height: 100vh;

  > .step {
    display: flex;
    justify-content: space-between;
    margin-bottom: 3vw;
    background: #FFFFFF;
    border-radius: 2vw;
    padding: 4vw 10vw;

    > .step-item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 3.7vw;
      color: #9D9595;
      width: 16vw;

      &.active {
        color: #1D0800;

        > .step-item-number {
          background: #FC7125;
        }

        > .step-line {
          background: #FC7125;
        }
      }

      > .step-item-number {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 3.5vw;
        border-radius: 50%;
        width: 5.5vw;
        height: 5.5vw;
        background: #9D9595;
        color: #FFF;
        font-size: 3.2vw;
      }

      > .step-line {
        position: absolute;
        top: 2.6vw;
        right: 10vw;
        height: 2px;
        width: 23vw;
        background: #9D9595;
      }
    }
  }

  > .qrcode {
    margin-bottom: 3vw;
    background: #FFFFFF;
    border-radius: 2vw;
    padding: 4vw;

    > .await, .success {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;

      > .qrcode-image {
        width: 36vw;
        height: 36vw;
      }

      > .remark {
        margin-top: 2.7vw;
        font-size: 3.7vw;
        color: #9D9595;

        &:not(:last-of-type) {
          margin-bottom: 1vw;
        }
      }
    }

    > .await {
      > .code {
        margin-top: 2.7vw;
        font-size: 3.7vw;
        color: #1D0800;
        margin-bottom: 2.7vw;

        > .mark {
          color: #FC7125;
        }
      }
    }

    > .success {
      > .qrcode-image {
        opacity: .5;
      }

      > .iconfont {
        position: absolute;
        top: 15vw;
        right: 20vw;
        font-size: 20vw;
        color: #FC4C39;
      }
    }
  }

  > .info {
    margin-bottom: 3vw;
    background: #FFFFFF;
    border-radius: 2vw;
    padding: 5vw;

    > header {
      margin-bottom: 5.5vw;
      border-left: 1vw solid #FC7125;
      padding-left: 3vw;
      font-size: 3.7vw;
      color: #1D0800;
    }

    > ul {
      > li {
        display: flex;
        font-size: 3.7vw;
        color: #9D9595;
        line-height: 1.5;

        &:not(:last-of-type) {
          margin-bottom: 5vw;
        }

        > .key {
          flex-shrink: 0;
          margin-right: 3vw;
          width: 20vw;
        }

        > .value {
          color: #1D0800;
        }
      }
    }
  }

  > .rule {
    margin-bottom: 3vw;
    background: #FFFFFF;
    border-radius: 2vw;
    padding: 5vw;

    > header {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3.7vw;
      color: #1D0800;
      margin-bottom: 5.5vw;

      > .text {
        margin: 0 3vw;
      }

      > .iconfont {
        font-size: 2.5vw;
        color: #FC7125;
      }
    }

    > .content {
      overflow-x: hidden;
      white-space: normal !important;
      word-break: break-all !important;
      font-size: 3.7vw;
      color: #9D9595;

      pre {
        white-space: normal !important;
        word-break: break-all !important;
      }
    }
  }
}
</style>
