<template>
  <base-layout
    :isShowHeaderLogin="false"
    :isShowBack="false"
    :isShowFooter="false"
    title="支付失败"
  >
    <article
      id="pay-fail"
    >
      <i class="iconfont icon-unif060"></i>
      <p>订单支付失败，{{countDown}}秒后将自动跳转至订单页面</p>
    </article>
  </base-layout>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import BaseLayout from '@/layouts/base-layout.vue';

@Component({
  components: {
    BaseLayout,
  },
})
export default class PayFail extends Vue {
  private countDown: number = 3;

  private mounted() {
    setInterval(() => {
      this.countDown--;

      if (this.countDown === 0) {
        this.$router.replace('/user/order/all');
      }
    }, 1000);
  }
}
</script>

<style lang="scss" scoped>
#pay-fail {
  display: grid;
  align-content: start;
  justify-items: center;
  grid-row-gap: 3rem;
  padding-top: 7.4rem;
  width: 100%;

  & > .iconfont {
    font-size: 11rem;
    color: #dc4950;
  }

  & > p {
    margin: 0;
    line-height: 2;
    text-align: center;
    font-size: 1.8rem;
    color: #666666;
  }
}
</style>