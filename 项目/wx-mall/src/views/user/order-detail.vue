<template>
  <base-layout
    title="订单详情"
  >
    <article
      id="order-detail"
    >
      <section class="order-info">
        <ul>
          <li>
            <span>订单状态：</span>
            <span class="mark">{{orderInfo.status | orderStatus}}</span>
          </li>
          <li>
            <span>订单总计：</span>
            <span class="mark">
              {{orderInfo.amount | formatCurrencyFraction}}
            </span>
          </li>
          <li>
            <span>订单编号：</span>
            <span>{{orderInfo.orderNo}}</span>
          </li>
          <li>
            <span>配送方式：</span>
            <span>{{orderInfo.pickupWay | expressType}}</span>
          </li>
          <li>
            <span>下单时间：</span>
            <span>{{orderInfo.createTime | dateYMDHMS}}</span>
          </li>
        </ul>
      </section>
      <section
        v-if="orderInfo.pickupWay === 'EMS'"
        class="express-info"
      >
        <dl>
          <dt>物流信息</dt>
          <dd>
            <span>物流单号：</span>
            <span>{{orderInfo.expressNumber}}</span>
          </dd>
          <dd>
            <span>物流公司：</span>
            <span>{{orderInfo.expressCompany}}</span>
          </dd>
        </dl>
      </section>
      <section
        v-if="orderInfo.pickupWay === 'SLF'"
        class="shop-info"
      >
        <dl>
          <dt>门店信息</dt>
          <dd>
            <span>门店：</span>
            <span>{{orderInfo.shopInfo.nameOut || orderInfo.shopInfo.shopName}}</span>
          </dd>
          <dd>
            <span>电话：</span>
            <span>{{orderInfo.shopInfo.phone}}</span>
          </dd>
          <dd>
            <span>地址：</span>
            <span>{{orderInfo.shopInfo.address}}</span>
          </dd>
        </dl>
      </section>
      <section
        v-if="orderInfo.pickupWay === 'EMS'"
        class="shipping-address"
      >
        <ul>
          <li>
            <span>收货人：</span>
            <span>{{orderInfo.addressee}}</span>
          </li>
          <li>
            <span>电话：</span>
            <span>{{orderInfo.addresseePhone}}</span>
          </li>
          <li>
            <span>收货地址：</span>
            <span>{{orderInfo.mailingAddress}}</span>
          </li>
        </ul>
      </section>
      <section class="product-list">
        <header>
          <span>
            商品清单
          </span>
          <span>
            共计{{orderInfo.orderInfo.length}}件商品
          </span>
        </header>
        <section class="data-list-items">
          <the-product-info-row
            :type="orderInfo.status === 'RCT' ? 'order-finish' : 'order'"
            :data-list="orderInfo.orderInfo"
          />
        </section>
        <footer>
          <ul class="price-list">
            <li>
              <span>
                商品总计
              </span>
              <span>
                {{orderInfo.amount | formatCurrencyFraction}}
              </span>
            </li>
            <li>
              <span>
                运费
              </span>
              <span>
                到付
              </span>
            </li>
          </ul>
          <div class="price-count">
            实付金额：
            <span class="price">
              {{orderInfo.amount | formatCurrencyFraction}}
            </span>
          </div>
        </footer>
      </section>
      <section class="leave-message">
        <header>
          留言
        </header>
        <section class="content">
          {{orderInfo.remark}}
        </section>
      </section>
      <section class="button-group">
        <div
          v-if="orderInfo.status === 'NEW'"
          class="pay-await"
        >
          <base-button
            text="取消订单"
            type="border"
            theme="dark"
            @click="deleteOrderHandle(orderInfo.orderNo)"
          >
          </base-button>
          <base-button
            text="立即支付"
            @click="payOrderHandle(orderInfo.orderNo)"
          >
          </base-button>
        </div>
        <div
          v-if="orderInfo.status === 'RCT'"
          class="finish"
        >
          <base-button
            text="删除订单"
            type="border"
            theme="dark"
             @click="deleteOrderHandle(orderInfo.orderNo)"
          >
          </base-button>
        </div>
      </section>
    </article>
  </base-layout>
</template>

<script lang="ts">
// vue
import {Vue, Component} from 'vue-property-decorator';

// 组件
import BaseLayout from '@/layouts/base-layout.vue';
import TheProductInfoRow from '@/components/the-product-info-row.vue';
import BaseButton from '@/components/base-button.vue';
import {Toast, Dialog} from 'vant';

// http
import {httpReq} from '@/utils/http-req';
import {orderDetailReq, orderDeleteReq, orderPayReq} from '@/serves/order';

// 工具
import {getLocalStorage} from '@/utils/local-storage';

@Component({
  components: {
    BaseLayout,
    TheProductInfoRow,
    BaseButton,
  },
})
export default class UserOrderDetail extends Vue {
  // 订单信息
  private orderInfo: any = {
    orderInfo: [],
    shopInfo: {},
  };

  private mounted() {
    const orderID = this.$route.query.orderID;
    if (orderID) {
      this.selectOrderDetail(orderID as string);
    } else {
      this.$router.back();
    }
  }

  // 查询订单详情
  private selectOrderDetail(orderID: string) {
    return new Promise((resolve, reject) => {
      const body = {
        orderId: orderID,
      };

      orderDetailReq.requestInit.body = JSON.stringify(body);
      const httpRes = httpReq(orderDetailReq);
      Toast.loading('查询中...');
      httpRes.then(data => {
        this.orderInfo = data;
        Toast.clear();
        resolve();
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }

  // 删除订单处理
  private deleteOrderHandle(orderID: string) {
    Dialog.confirm({
      title: '确定要删除该订单吗?',
    }).then((value) => {
      this.deleteOrder(orderID);
    });
  }

  // 删除订单
  private deleteOrder(orderID: string) {
    return new Promise((resolve, reject) => {
      const body = {
        orderId: orderID,
      };

      orderDeleteReq.requestInit.body = JSON.stringify(body);
      const httpRes = httpReq(orderDeleteReq);
      Toast.loading('删除中...');
      httpRes.then(data => {
        this.$router.back();
        Toast.clear();
        resolve();
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }

  // 支付订单处理
  private async payOrderHandle(orderId) {
    this.$router.push({
      path: '/pay/paying',
      query: {
        orderId,
      },
    });
  }
}
</script>

<style lang="scss" scoped>
#order-detail {
  line-height: 1;

  & > * {
    margin-bottom: 1.2rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  & > .order-info {
    padding: 1.5rem;
    background-color: #fff;

    & > ul {
      display: grid;
      grid-row-gap: 1.5rem;

      & > li {
        font-size: 1.8rem;

        & > span {
          &:first-of-type {
            color: #999999;
          }

          &:last-of-type {
            color: #333333;

            &.mark {
              color: var(--color-theme);
            }
          }
        }
      }
    }
  }

  & > .shop-info, .express-info {
    padding: 1.5rem;
    background-color: #fff;

    & > dl {
      display: grid;
      align-content: start;
      grid-row-gap: 1.5rem;
      margin: 0;

      & > dt {
        font-size: 1.8rem;
        color: #333333;
      }

      & > dd {
        margin: 0;
        font-size: 1.8rem;

        & > span {
          &:first-of-type {
            color: #999999;
          }

          &:last-of-type {
            color: #333333;

            &.mark {
              color: var(--color-theme);
            }
          }
        }
      }
    }
  }

  & > .shipping-address {
    padding: 1.5rem;
    background-color: #fff;

    & > ul {
      display: grid;
      grid-row-gap: 1.5rem;

      & > li {
        font-size: 1.8rem;

        & > span {
          &:first-of-type {
            color: #999999;
          }

          &:last-of-type {
            color: #333333;

            &.mark {
              color: var(--color-theme);
            }
          }
        }
      }
    }
  }

  & > .product-list {
    background-color: #fff;

    & > header {
      display: grid;
      grid-auto-flow: column;
      justify-content: space-between;
      border-bottom: 1px solid #f5f5f5;
      padding: 1.5rem;
      font-size: 1.8rem;
      color: #333333;

      & > span {
        &:last-of-type {
          font-size: 1.5rem;
          color: #999999;
        }
      }
    }

    & > .data-list-items {
      border-bottom: 1px solid #f5f5f5;
    }

    & > footer {
      display: grid;
      grid-row-gap: 1.7rem;
      padding: 1.5rem;
      font-size: 1.8rem;

      & > ul {
        display: grid;
        grid-row-gap: 1.5rem;

        & > li {
          display: grid;
          grid-auto-flow: column;
          justify-content: space-between;

          & > span {
            &:last-of-type {
              color: var(--color-theme);
            }
          }
        }
      }

      & > .price-count {
        text-align: right;
        font-size: 2rem;
        font-weight: bold;

        & > .price {
          color: var(--color-theme);
        }
      }
    }
  }

  & > .leave-message {
    padding: 1.5rem;
    background-color: #fff;

    & > header {
      margin-bottom: 1.5rem;
      font-size: 1.8rem;
      color: #333333;
    }

    & > .content {
      word-wrap: break-word;
      word-break: break-all;
      font-size: 1.8rem;
      color: #999999;
    }
  }

  & > .button-group {
    padding: 1rem 4.2rem 5rem 4.2rem;

    & > .pay-await {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-column-gap: 1.9rem;
      height: 5.5rem;
    }

    & > .finish {
      display: grid;
      height: 5.5rem;
    }
  }
}
</style>
