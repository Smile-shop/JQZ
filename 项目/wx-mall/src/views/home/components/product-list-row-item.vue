<template>
  <figure
    class="product-list-column-item"
    @click="toProductDetailPage"
    v-if="itemData"
  >
    <div
      class="left"
      v-imgURL="itemData.pic_url"
    >
    </div>
    <div class="right">
      <div class="top">
        <div class="name">
          {{itemData.productName}}
        </div>
        <div class="detail">
          <div
            v-for="(item, index) of productDisplayPropertys(itemData)"
            :key="index"
          >
            {{item.name}}：{{item.value | padEndUnit(item.unit)}}
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="price">
          <div class="price-current sale">{{itemData.actualPrice | formatCurrencyFraction}}</div>
          <div
            v-if="itemData.flagPrice"
            class="price-original"
          >
            {{itemData.flagPrice | formatCurrencyFraction}}
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="itemData.isActivity && itemData.activityName"
      class="activity-name"
    >
      {{itemData.activityName}}
    </div>
    <div
      v-if="itemData.topType !== 'SKL'"
      class="shopping-cart-add"
      @click.stop="addToShoppingCartHandle([itemData.code])"
    >
      <i class="iconfont icon-gouwuche"></i>
    </div>
  </figure>
</template>

<script lang="ts">
// vue
import {Vue, Component, Prop} from 'vue-property-decorator';
import {formatCurrencyFraction} from '@/filters/format-currency';
import {padEndUnit} from '@/filters/format-unit';

// 组件
import BaseLayout from '@/layouts/base-layout.vue';

// 工具
import {batchAddToShoppingCart} from '@/utils/common';
import { productDisplayPropertys } from '@/utils/product-property';

@Component({
  components: {
    BaseLayout,
  },
})
export default class ProductListColumnItem extends Vue {
  @Prop({
    required: true,
  })
  private itemData!: object | null;

  private productDisplayPropertys = productDisplayPropertys;

  // 前往产品详情页面
  private toProductDetailPage(): void {
    if (this.$route.name === 'HomeProductDetail') {
      this.$router.replace({
        path: `/home/product-detail/${(this.itemData as any).code}`,
      });
    } else {
      this.$router.push({
        path: `/home/product-detail/${(this.itemData as any).code}`,
      });
    }
  }

  // 添加商品到购物车处理
  private addToShoppingCartHandle(productID: string[]) {
    batchAddToShoppingCart(productID);
  }
}
</script>

<style lang="scss" scoped>
.product-list-column-item {
  position: relative;
  margin: 0;
  display: grid;
  grid-template-columns: 10.7rem auto;
  background-color: #fff;

  > .left {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
  }

  & > .right {
    display: grid;
    grid-gap: .9rem;
    align-content: space-between;
    padding: .9rem 1.3rem;

    & > .top {
      display: grid;
      align-content: start;
      grid-row-gap: .8rem;

      & > .name {
        font-size: 1.5rem;
        color: #333333;
      }

      & > .detail {
        display: grid;
        grid-template-columns: repeat(2 ,1fr);
        grid-gap: .9rem;
        font-size: 1.1rem;
        color: #999999;
        height: 3.8rem;

        > div {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    & > .bottom {
      & > .price {
        display: grid;
        grid-auto-flow: column;
        justify-content: start;
        grid-column-gap: .9rem;
        align-items: center;

        & > .price-current {
          font-size: 2rem;
          color: var(--color-theme);

          &::first-letter {
            font-size: 1.5rem;
          }

          &.sale {
            padding: .4rem 1.1rem;
            border-radius: 1.5rem;
            color: #fff;
            background-image: linear-gradient(90deg, #dc4950 0%, #ff9473 100%);
          }
        }

        & > .price-original {
          text-decoration: line-through;
          font-size: 1.5rem;
          color: #bbbbbb;
        }
      }
    }
  }


  & > .activity-name {
    position: absolute;
    left: 0;
    top: .6rem;
    border-top-right-radius: 1.2rem;
    border-bottom-right-radius: 1.2rem;
    padding: .6rem;
    font-size: 1.1rem;
    color: #fff;
    background-color: var(--color-theme);
  }

  & > .shopping-cart-add {
    position: absolute;
    right: 1.3rem;
    bottom: 1.1rem;
    border-radius: 2rem;
    padding: .9rem;
    color: #fff;
    background-color: var(--color-theme);
  }
}
</style>
