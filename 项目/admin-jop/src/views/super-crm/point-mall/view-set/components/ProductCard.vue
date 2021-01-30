<template>
  <div
    class="product-card"
    ref="productCard"
  >
    <img :src="require('@/assets/images/super-crm/point-mall/diamond-ring.jpg')" alt="图片">
    <div class="sale-type">
      店庆大促
    </div>
    <div class="detail">
      <div class="name-box">
        <div class="left">
          钻石戒指
        </div>
        <div class="right">
          现金抵积分
        </div>
      </div>
      <div class="price-box">
        <div class="left">
          <span class="price">
            <span class="number">
              100
            </span>
            <span class="unit">
              积分
            </span>
          </span>
          <span class="original-price">
            150积分
          </span>
        </div>
        <div
          v-if="data.isShowExchange == '1'"
          class="right"
        >
          已兑100件
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';

@Component({
})
export default class ProductCard extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  data!: any;
}
</script>

<style lang="scss" scoped>
.product-card {
  position: relative;
  width: 200px;

  > img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    object-position: center center;
  }

  > .sale-type {
    position: absolute;
    top: 0;
    right: 0;
    color: #ffffff;
    background-color: var(--theme-color);
    padding: 5px;
    font-size: 12px;
  }

  > .detail {
    padding: 10px;

    > .name-box {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;

      > .left {
        color: #333333;
        font-size: 12px;
      }

      > .right {
        border-radius: 4px;
        padding: 2px 4px;
        background-color: var(--theme-color);
        font-size: 9px;
        color: #ffffff;
      }
    }

    > .price-box {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;

      > .left {
        > .price {
          font-size: 14px;
          color: var(--theme-color);
          font-weight: bold;

          > .unit {
            font-size: 12px;
            font-weight: normal;
          }
        }

        > .original-price {
          text-decoration: line-through;
          color: #bbbbbb;
          font-size: 12px;
        }
      }

      > .right {
        font-size: 12px;
        color: #999999;
      }
    }
  }

}
</style>


