<template>
  <base-layout
    :isShowFooter="true"
    :isShowHeader="true"
    title="全部订单"
  >
    <list
      v-model="isLoading"
      :finished="isFinished"
      :finished-text="dataList.length ? '没有更多了' : ''"
      @load="loadMore(false)"
    >
      <article
        id="order-all"
      >
        <nav>
          <div
            href="#"
            :class="{
              active: type === 'all'
            }"
            @click="navOnClick('all')"
          >
            我的订单
          </div>
          <div
            href="#"
            :class="{
              active: type === 'pay-await'
            }"
            @click="navOnClick('pay-await')"
          >
            待付款
            <span
              v-if="orderCount && orderCount.newCount"
              class="count"
            >
              ({{orderCount.newCount}})
            </span>
          </div>
          <div
            href="#"
            :class="{
              active: type === 'receive-await'
            }"
            @click="navOnClick('receive-await')"
          >
            待收货
          </div>
          <div
            href="#"
            :class="{
              active: type === 'finish'
            }"
            @click="navOnClick('finish')"
          >
            已完成
          </div>
        </nav>

        <router-link
          tag="section"
          to="/user/transaction-rules"
          class="transaction-rules"
        >
          <div class="left">
            查看交易规则
          </div>
          <div class="right">
            <i class="iconfont icon-you"></i>
          </div>
        </router-link>


        <ul
          class="data-list"
          v-if="dataList.length"
        >
          <li
            v-for="(item, index) of dataList"
            :key="index"
          >
            <header
              @click="toOrderDetailPage(item.orderNo)"
            >
              <div class="left">
                订单编号：{{item.orderNo}}
              </div>
              <div class="right">
                <span class="state">{{item.status | orderStatus}}</span>
                <i
                  v-if="item.status === 'RCT'"
                  class="iconfont icon-shanchu"
                  @click.stop="deleteOrderHandle(item.orderNo)"
                >
                </i>
              </div>
            </header>
            <the-product-info-row
              :data-list="item.orderInfo"
              :type="item.status === 'RCT' ? 'order-finish' : 'order'"
            />
            <footer>
              <section
                class="control"
              >
                <div class="left">
                  总金额：
                  <span class="money">
                    {{item.amount | formatCurrencyFraction}}
                  </span>
                </div>
                <div class="right">
                  <base-button
                    v-if="item.status === 'NEW' || item.status === 'PAY'"
                    text="取消订单"
                    type="border"
                    theme="dark"
                    @click="deleteOrderHandle(item.orderNo)"
                  />
                  <base-button
                    v-if="item.status === 'NEW' || item.status === 'PAY'"
                    text="立即支付"
                    @click="payOrderHandle(item.orderNo)"
                  />
                  <base-button
                    v-if="item.status === 'PAD'"
                    text="申请退款"
                    @click="orderRefundHandle(item.orderNo)"
                  />
                  <base-button
                    v-if="item.status === 'EMS'"
                    text="确认收货"
                    @click="orderConfirmHandle(item.orderNo)"
                  />
                </div>
              </section>

              <section
                v-if="item.status === 'PAY'"
                class="count-down"
              >
                付款剩余时间：
                <app-count-down
                  :start-time="item.createTime"
                  :end-minute="30"
                  @end="loadMore(true)"
                />
              </section>
            </footer>
          </li>
        </ul>
        <the-not-data
          v-else
          icon="icon-dingdan"
          text="暂无订单记录！"
          buttonText="马上选购"
          buttonLink="/home"
        />
      </article>
    </list>
  </base-layout>
</template>

<script lang="ts">
// vue
import {Vue, Component, Watch} from 'vue-property-decorator';
import {State, Getter, Action, Mutation, namespace} from 'vuex-class';

// 组件
import BaseLayout from '@/layouts/base-layout.vue';
import TheProductInfoRow from '@/components/the-product-info-row.vue';
import BaseButton from '@/components/base-button.vue';
import TheNotData from '@/components/the-not-data.vue';
import AppCountDown from '@/components/app-count-down.vue';
import {Toast, Dialog, List} from 'vant';

// http
import {httpReq} from '@/utils/http-req';
import {
  orderListReq,
  orderDeleteReq,
  orderDetailReq,
  orderRefundReq,
  orderConfirmReceiptReq,
  orderPayReq,
} from '@/serves/order';

// 工具
import {getLocalStorage} from '@/utils/local-storage';

// typings
import {ShoppingCartCount} from '@/typings/store';
type showPage = 'all' | 'pay-await' | 'receive-await' | 'finish';

@Component({
  components: {
    BaseLayout,
    TheProductInfoRow,
    BaseButton,
    TheNotData,
    List,
    AppCountDown,
  },
})
export default class UserOrderList extends Vue {
  // 页面显示类型
  private type: showPage = 'all';

  // 数据列表
  private dataList: any[] = [];

  // 是否加载
  private isLoading: boolean = false;

  // 是否全部完成
  private isFinished: boolean = false;

  // 当前页数
  private pageNum: number = 1;

  // 显示数量
  private pageSize: number = 20;

  @State('orderCount')
  private orderCount!: ShoppingCartCount;

  @State('shareType')
  private shareType!: any;

  // 查询订单数量
  @Action('selectOrderCount')
  private selectOrderCount!: any;

  private created() {
    this.type = this.$route.params.type as showPage;
    this.loadMore(true);
  }

  // 前往订单详情页面
  private toOrderDetailPage(orderID: string) {
    this.$router.push({
      path: '/user/order-detail',
      query: {
        orderID,
      },
    });
  }

  // 点击切换
  private navOnClick(type: showPage) {
    this.type = type;
    this.$router.replace({
      path: `/user/order/${type}`,
    });
  }

  // 监听页面显示类型
  @Watch('type')
  private watchType(value: showPage) {
    this.loadMore(true);
  }

  // 查询订单
  private selectOrder() {
    return new Promise((resolve, reject) => {
      function orderStatus(status: showPage) {
        switch (status) {
          case 'all':
            return '0';
          case 'pay-await':
            return '1';
          case 'receive-await':
            return '2';
          case 'finish':
            return '3';
          default:
            return '0';
        }
      }

      const body = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        status: orderStatus(this.type),
      };

      orderListReq.requestInit.body = JSON.stringify(body);
      const httpRes = httpReq(orderListReq);
      httpRes.then(data => {
        this.selectOrderCount();
        resolve(data);
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
        this.loadMore(true);
        Toast.clear();
        resolve();
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }

  // 确认收货处理
  private orderConfirmHandle(orderID: string) {
    Dialog.confirm({
      title: '确收收货吗？',
    }).then((value) => {
      this.orderConfirm(orderID);
    });
  }

  // 确认收货
  private orderConfirm(orderID: string) {
    return new Promise((resolve, reject) => {
      const body = {
        orderId: orderID,
      };

      orderConfirmReceiptReq.requestInit.body = JSON.stringify(body);
      const httpRes = httpReq(orderConfirmReceiptReq);
      Toast.loading('确认中...');
      httpRes.then(data => {
        this.loadMore(true);
        Toast('确认收货成功');
        resolve();
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }

  // 申请退款处理
  private orderRefundHandle(orderID: string) {
    Dialog.confirm({
      title: '确认退款吗？',
    }).then((value) => {
      this.orderRefund(orderID);
    });
  }

  // 申请退款
  private orderRefund(orderID: string) {
    return new Promise((resolve, reject) => {
      const body = {
        orderId: orderID,
      };

      orderRefundReq.requestInit.body = JSON.stringify(body);
      const httpRes = httpReq(orderRefundReq);
      Toast.loading('申请退款中...');
      httpRes.then(data => {
        this.loadMore(true);
        Toast('申请退款成功');
        resolve();
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }

  // 支付订单处理
  private async payOrderHandle(orderId) {
    const origin = window.location.origin;
    this.$router.push({
      path: '/pay/paying',
      query: {
        orderId,
      },
    });
  }

  // 加载更多
  private async loadMore(isInit: boolean) {
    if (isInit) {
      this.pageNum = 1;
      this.isFinished = false;
      document.documentElement!.scrollTop = 0;
    } else {
      this.pageNum++;
    }
    this.isLoading = true;
    const res = this.selectOrder();

    res.then((data: any) => {
      const {list, pageNum, pages} = data;
      this.pageNum = pageNum;

      // 分页处理
      if (pageNum >= pages) {
        this.isFinished = true;
      }

      if (pageNum > 1) {
        this.dataList.push(...list);
      } else {
        this.dataList = list;
      }

      // 加载完成
      this.isLoading = false;
    }).catch(reason => {
      // 加载完成
      this.isFinished = true;
      this.isLoading = false;
    });
  }
}
</script>

<style lang="scss" scoped>
#order-all {
  & > nav {
    position: sticky;
    top: 5.5rem;
    display: flex;
    justify-content: space-between;

    & > div {
      flex-basis: 25%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1.8rem 0;
      font-size: 1.5rem;
      color: #333333;
      background-color: #fff;

      &.active {
        border-bottom: 2px solid var(--color-theme);
        color: var(--color-theme);
      }

      & > .count {
        letter-spacing: .2rem;
        color: var(--color-theme);
      }
    }
  }

  & > .transaction-rules {
    display: flex;
    justify-content: space-between;
    margin-bottom: .7rem;
    padding: 1.1rem 1.4rem;
    background-color: #fff;

    & > .left {
      font-size: 1.8rem;
      color: var(--color-theme);
    }
  }

  & > .data-list {
    & > li {
      margin-bottom: .6rem;
      background-color: #fff;

      &:last-of-type {
        margin-bottom: 0;
      }

      & > header {
        display: grid;
        grid-auto-flow: column;
        justify-content: space-between;
        align-items: center;
        padding: 0 1.5rem;
        min-height: 4.5rem;
        font-size: 1.5rem;
        color: #333333;
        border-bottom: 1px solid #f5f5f5;

        & > .right {
          display: grid;
          grid-auto-flow: column;
          grid-column-gap: 1.2rem;

          & > .state {
            color: var(--color-theme);
          }

          & > .iconfont {
            font-size: 1.8rem;
            color: #999;
          }
        }
      }

      & > footer {
        & > .control {
          display: grid;
          grid-auto-flow: column;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #f5f5f5;
          padding: 0 1.5rem;
          min-height: 5.5rem;
          font-size: 1.5rem;
          color: #333333;

          & > .left {
            & > .money {
              font-size: 2.3rem;
              font-weight: bold;
              color: var(--color-theme);
            }
          }

          & > .right {
            display: grid;
            grid-auto-flow: column;
            grid-column-gap: 1.3rem;
          }
        }

        & > .count-down {
          border-top: 1px solid #f5f5f5;
          padding: 1.5rem;
          font-size: 1.5rem;
          color: var(--color-theme);
        }
      }
    }
  }
}
</style>
