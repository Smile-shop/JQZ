<template>
  <ul
    class="the-product-info-row"
  >
    <li
      v-for="(item, index) in dataList"
      :key="index"
      @click="toPage(item.code)"
    >
      <div
        class="left"
        v-imgURL="item.pic_url"
      >
      </div>
      <div class="middle">
        <div class="top">
          <div class="name">{{item.productName}}</div>
          <div
            v-if="type === 'collect'"
            class="detail"
          >
            <span
              v-if="item.includeGoldWeight"
            >
              金重：{{item.includeGoldWeight | padEndUnit('g')}}
            </span>
            <span
              v-if="item.mainStoneWeight"
            >
              主石：{{item.mainStoneWeight | padEndUnit('ct')}}/{{item.mainStoneQuality}}/{{item.mainStoneColor}}
            </span>
          </div>
          <!-- <div
            v-if="type === 'order'"
            class="count"
          >
            x1
          </div> -->
        </div>
        <div class="bottom">
          <div class="current-price">
            <!-- <span
              v-if="type === 'order' || type === 'order-finish'"
            >
              {{item.salesPrice | formatCurrencyFraction}}
            </span> -->
            <span
              v-if="item.salesPrice"
            >
              {{item.salesPrice | formatCurrencyFraction}}
            </span>
            <span
              v-else
            >
              {{item.actualPrice | formatCurrencyFraction}}
            </span>
          </div>
          <div class="original-price">
            <span
              v-if="item.originalPrice"
            >
              {{item.originalPrice | formatCurrencyFraction}}
            </span>
            <span
              v-else-if="item.flagPrice"
            >
              {{item.flagPrice | formatCurrencyFraction}}
            </span>
          </div>
        </div>
      </div>
      <div
        class="right"
      >
        <div
          v-if="type === 'collect'"
          class="collect-box"
        >
          <i
            class="iconfont icon-shanchu"
            @click.stop="onDelete(index)"
          >
          </i>
        </div>

        <div
          v-if="type === 'order-finish'"
          class="order-finish-box"
        >
          <base-button
            v-if="item.hasEvaluate === 'N' && pageStyle.isShowComment == 1"
            type="border"
            text="去评价"
            @click="toRemarkPage({
              productID: item.code,
              orderID: item.orderId,
            })"
          >
          </base-button>
        </div>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
// vue
import {Vue, Component, Prop, Model, Emit, Watch} from 'vue-property-decorator';
import {State} from 'vuex-class';

// 组件
import {formatCurrencyFraction} from '@/filters/format-currency';
import BaseButton from '@/components/base-button.vue';
import {Toast} from 'vant';

@Component({
  components: {
    BaseButton,
  },
  filters: {
    formatCurrencyFraction,
  },
})
export default class TheProductInfoRow extends Vue {
  @Prop()
  private type!: 'collect' | 'order' | 'order-finish';

  @Prop()
  private dataList!: any;

  @State('pageStyle')
  private pageStyle!: any;

  @Emit('delete')
  private onDelete(code: string) {
    return code;
  }

  // 前往页面
  private toPage(id: string): void {
    this.$router.push({
      path: `/home/product-detail/${id}`,
    });
  }

  // 前往产品评价页面
  private toRemarkPage(options: any): void {
    this.$router.push({
      path: '/user/product-remark',
      query: {
        productID: options.productID,
        orderID: options.orderID,
      },
    });
  }
}
</script>

<style lang="scss" scoped>
.the-product-info-row {
  display: grid;
  grid-auto-rows: 12.3rem;
  grid-row-gap: .5rem;

  & > li {
    display: grid;
    grid-template-columns: 9.7rem auto 9rem;
    grid-column-gap: 1rem;
    border-bottom: 1px solid #f5f5f5;
    padding: 1.3rem;
    background-color: #fff;
    line-height: 1;

    &:last-of-type {
      border-bottom: none;
    }

    & > .left {
      background-repeat: no-repeat;
      background-position: center center;
      background-size: contain;
    }

    & > .middle {
      display: grid;
      align-content: space-between;
      grid-row-gap: .8rem;
      padding: .3rem 0;

      & > .top {
        display: grid;
        grid-row-gap: 1rem;

        & > .name {
          color: #333333;
          font-size: 1.8rem;
        }

        & > .detail, & > .count {
          display: grid;
          grid-auto-flow: column;
          justify-content: start;
          grid-column-gap: 1rem;
          color: #999999;
          font-size: 1.5rem;
        }
      }

      & > .bottom {
        display: grid;
        grid-auto-flow: column;
        align-items: center;
        justify-content: start;
        grid-column-gap: 1rem;


        & > .original-price {
          color: #bbbbbb;
          font-size: 1.5rem;
          text-decoration: line-through;
        }

        & > .current-price {
          display: grid;
          color: var(--color-theme);
          font-size: 2rem;
          font-weight: bold;
        }
      }
    }

    & > .right {
      display: grid;

      & > .collect-box {
        display: grid;

        & > .iconfont {
          font-size: 2rem;

          &.icon-shanchu {
            color: #999999;
            align-self: center;
            justify-self: center;
          }
        }
      }

      & > .order-finish-box {
        display: grid;
        align-content: end;
      }
    }
  }
}
</style>
