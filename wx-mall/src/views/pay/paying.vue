<template>
  <base-layout
    :isShowHeaderLogin="false"
    :isShowBack="false"
    :isShowFooter="false"
    title="订单支付"
  >
    <article id="pay">
      <i class="iconfont icon-quanefukuan"></i>
      <p>请支付</p>
    </article>
  </base-layout>
</template>

<script lang="ts">
// vue
import {Vue, Component, Model, Watch} from 'vue-property-decorator';
import {State, Getter, Action, Mutation, namespace} from 'vuex-class';

// 组件
import BaseLayout from '@/layouts/base-layout.vue';

// http
import {httpReq} from '@/utils/http-req';
import {Toast} from 'vant';
import {orderPayReq} from '@/serves/order';

// 工具
import wxPay from '@/utils/wx-pay';
import {getLocalStorage} from '@/utils/local-storage';

@Component({
  components: {
    BaseLayout,
  },
})
export default class Pay extends Vue {
  // 查询购物车数量
  @Action('selectShoppingCartCount')
  private selectShoppingCartCount!: any;

  /* private created() {
    const $route = this.$route;

    if (!$route.query.isReload) {
      this.$router.replace({
        path: '/pay/paying',
        query: {
          orderId: this.$route.query.orderId,
          isReload: '1',
        },
      });

      window.location.reload();
    }
  } */

  private mounted() {
    const {isReload} = this.$route.query;

    if (!isReload) {
      this.$router.replace({
        path: '/pay/paying',
        query: {
          orderId: this.$route.query.orderId,
          isReload: '1',
        },
      });

      window.location.reload();
    } else {
      this.payHandle();
    }
  }

  // 刷新后支付
  /* private reload() {
    const {
      query
    } = this.$route;
    const {
      isReload
    } = query;

    if (isReload) {
      this.$router.replace({
        path: '/pay/paying',
        query: {
          orderId: this.$route.query.orderId,
          isReload: '1',
        },
      });

      window.location.reload();
    } else {
      this.payHandle();
    }
  } */

  // 支付处理
  private async payHandle() {
    const {wxUserInfo} = getLocalStorage();
    const orderPayOptions = {
      orderId: this.$route.query.orderId,
      openid: wxUserInfo!.openid,
    };

    this.orderPay(orderPayOptions).then((orderPayRes: any) => {
      const {result_code, return_msg} = orderPayRes;

      if (result_code === 'SUCCESS') {
        wxPay(orderPayRes).then(res => {
          this.$router.replace('/pay/pay-success');
        }).catch((reason: string) => {
          Toast(reason || '支付失败');
          this.$router.replace('/pay/pay-fail');
        });
        this.selectShoppingCartCount();
      } else {
        Toast(return_msg);
        this.$router.replace('/pay/pay-fail');
      }
    });
  }

  // 支付订单
  private orderPay(options) {
    return new Promise((resolve, reject) => {
      const body = {
        orderId: options.orderId,
        openid: options.openid,
      };

      orderPayReq.requestInit.body = JSON.stringify(body);
      const httpRes = httpReq(orderPayReq);
      httpRes.then(data => {
        resolve(data);
      }).catch(reason => {
        Toast(reason || '支付失败');
        // this.$router.replace('/pay/pay-fail');
        reject(reason);
      });
    });
  }
}
</script>

<style lang="scss" scoped>
#pay {
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
</style>