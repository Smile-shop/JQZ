<template>
  <base-layout
    title="确认订单"
    :isShowFooter="false"
  >
    <article id="shopping-trolley-order-confirm">
      <section
        class="order-info"
      >
        <section
          v-show="getMethod == 2"
          class="address"
          @click="addressOnClick"
        >
          <div class="left">
            <div
              v-if="checkedAddress"
              class="have-address"
            >
              <div class="top">
                <span>{{checkedAddress.addressee}}</span>
                <span>{{checkedAddress.phone}}</span>
              </div>
              <div class="bottom">
                <span
                  v-if="checkedAddress.isDefault === 1"
                  class="default"
                >
                  默认
                </span>
                {{checkedAddress | addressConcat}}
              </div>
            </div>

            <div
              v-else
              class="not-address"
            >
              +请添加收货地址
            </div>
          </div>
          <div class="right">
            <i class="iconfont icon-you"></i>
          </div>
        </section>
        <section class="product">
          <section class="product-list">
            <the-product-info-row
              :dataList="products"
              type="order"
            />
          </section>
          <section
            v-if="postMethod"
            class="express-mode"
          >
            <header>
              配送方式
            </header>
            <section class="content">
              <radio
                v-if="canShopGet && postMethod.openTypshope == '1'"
                v-model="getMethod"
                name="1"
              >
                门店自取
              </radio>
              <radio
                v-if="postMethod.openExpressDelivery == '1'"
                v-model="getMethod"
                name="2"
              >
                {{postMethod.expressDelivery}}
              </radio>
            </section>
          </section>
          <section
            v-if="getMethod === '1'"
            class="shop"
          >
            <section class="shop-info">
              <header>
                门店信息
              </header>
              <ul>
                <li>
                  门店：{{shopInfo.nameOut || shopInfo.shopName}}
                </li>
                <li>
                  电话：{{shopInfo.phone}}
                </li>
                <li>
                  地址：{{shopInfo.address}}
                </li>
              </ul>
            </section>
            <div
              v-if="false"
              class="shop-select"
            >
              选择门店
            </div>
          </section>
        </section>
        <section
          v-if="false"
          class="discount-coupon"
        >
          <header
          >
            <span class="left">
              优惠券
            </span>
            <span class="right">
              2张可用
              <i class="iconfont icon-you"></i>
            </span>
          </header>
          <ul>
            <li>
              <div class="left">
                <span>金百福珠宝满10000减50</span>
                <span>立减50/满10000元时可用</span>
              </div>
              <div class="right">
                -¥50
              </div>
            </li>
          </ul>
        </section>
        <section class="message">
          <header>
            留言
          </header>
          <textarea
            v-model="remark"
            placeholder="请输入您的要求，如：颜色、规格..."
            maxlength="100"
          >
          </textarea>
        </section>
        <section class="price">
          <div class="total-prices">
            <div class="name">
              商品总计
            </div>
            <div class="value">
              <span class="count">{{products.length}}件</span>
              <span class="price">{{pricesTotal | formatCurrencyFraction}}</span>
            </div>
          </div>
          <!-- <div
            v-show="getMethod === '2'"
            class="postage"
          >
            <div>
              运费
            </div>
            <div>
              <span>到付</span>
            </div>
          </div> -->
        </section>
      </section>
      <footer>
        <div class="left">
          应付金额：
          <span>
            {{pricesTotal | formatCurrencyFraction}}
          </span>
        </div>
        <div
          class="right"
          @click="submitOrderHandle"
        >
          去付款
        </div>
      </footer>
      <address-select
        v-model="isShowAddressSelect"
        :data-list="addressList"
        @change="addressChange"
      />
    </article>
  </base-layout>
</template>

<script lang="ts">
// vue
import {Vue, Component, Model, Watch} from 'vue-property-decorator';
import {State, Getter, Action, Mutation, namespace} from 'vuex-class';

// 组件
import BaseLayout from '@/layouts/base-layout.vue';
import {Radio, Popup} from 'vant';
import TheProductInfoRow from '@/components/the-product-info-row.vue';
import {Toast, Dialog} from 'vant';
import AddressSelect from './components/address-select.vue';

// http
import {httpReq} from '@/utils/http-req';
import {addressListReq} from '@/serves/user';
import {shopListReq, orderCreateReq, orderPayReq} from '@/serves/order';
import {
  productBatchSelectReq,
} from '@/serves/shopping-cart';

// 工具
import {getLocalStorage} from '@/utils/local-storage';

@Component({
  components: {
    BaseLayout,
    Radio,
    TheProductInfoRow,
    AddressSelect,
    Popup,
  },
})
export default class ShoppingTrolleyOrderConfirm extends Vue {
  // 选择的产品
  private products: any[] = [];
  // 地址列表
  private addressList: any[] = [];
  // 门店信息
  private shopInfo: any = {};
  // 选择的地址
  private checkedAddress: any = null;
  // 是否能可门店自取
  private canShopGet: boolean = false;
  // 领取方式
  private getMethod: '1' | '2' | null = null;
  // 总价
  private pricesTotal: number = 0;
  // 是否显示地址选择框
  private isShowAddressSelect: boolean = false;
  // 备注信息
  private remark: string = '';

  @State('postMethod')
  private postMethod!: any;

  // 查询购物车数量
  @Action('selectShoppingCartCount')
  private selectShoppingCartCount!: any;

  @Watch('addressList')
  private watchAddressList(value: any[]) {
    if (value.length) {
      this.checkedAddress = value.find((item, index) => {
        return item.isDefault === 1;
      });

      if (this.checkedAddress) {
        this.checkedAddress = value[0];
      }
    } else {
      this.checkedAddress = null;
    }
  }

  @Watch('canShopGet')
  private watchCanShopGet(value: boolean) {
    if (value && this.postMethod.openTypshope == '1') {
      this.getMethod = '1';
    } else if (this.postMethod.openExpressDelivery == '1') {
      this.getMethod = '2';
    }
  }

  @Watch('products')
  private watchProducts(value: any[]) {
    const shopName = value[0] && value[0].shopName;

    if (shopName) {
      const isEqual = value.filter(item => {
        return item.shopName === shopName;
      });

      if (isEqual) {
        this.canShopGet = true;
        this.selectShopList([shopName]);
      } else {
        this.canShopGet = false;
      }
    } else {
      this.canShopGet = false;
    }

    this.pricesTotal = value.map((item) => {
      return item.actualPrice;
    }).reduce((a, b) => {
      return a + b;
    });
  }

  private mounted() {
    const codes = JSON.parse((this.$route.query.checkedProduct as string));
    if (Array.isArray(codes) && codes.length) {
      this.selectProductBatchSelectReq(codes).then((value) => {
        if (this.products.length < codes.length) {
          Toast('您选中的部分商品已被抢购');
        }
      });
      this.selectAddressList();
    } else {
      this.$router.push('/home');
      Toast('没有找到产品编号');
    }
  }

  // 查询地址列表
  private selectAddressList() {
    return new Promise((resolve, reject) => {
      const body = {};

      addressListReq.requestInit.body = JSON.stringify(body);
      const httpRes = httpReq(addressListReq);
      Toast.loading('查询中...');
      httpRes.then(data => {
        this.addressList = data;
        Toast.clear();
        resolve(data);
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }


  // 批量查询产品信息
  private selectProductBatchSelectReq(codeList: string[]) {
    return new Promise((resolve, reject) => {
      const body = {
        codeList,
        pageSize: 999,
      };

      productBatchSelectReq.requestInit.body = JSON.stringify(body);
      const httpRes = httpReq(productBatchSelectReq);
      httpRes.then(data => {
        this.products = data.list;
        resolve(data);
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }

  // 查询门店列表
  private selectShopList(shopNameList: string[]) {
    return new Promise((resolve, reject) => {
      const body = {
        shopNameList,
      };

      shopListReq.requestInit.body = JSON.stringify(body);
      const httpRes = httpReq(shopListReq);
      Toast.loading('查询中...');
      httpRes.then(data => {
        this.shopInfo = data[0];
        Toast.clear();
        resolve(data);
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }

  // 地址栏点击
  private addressOnClick() {
    if (this.addressList.length) {
      this.isShowAddressSelect = true;
    } else {
      this.$router.push('/user/location-create');
    }
  }

  // 地址选中事件
  private addressChange(index: number) {
    this.checkedAddress = this.addressList[index];
  }

  // 提交订单处理
  private async submitOrderHandle() {
    const validateRes = this.validate();

    if (validateRes.state) {
      const submitOrderRes: any = await this.submitOrder();
      this.$router.push({
        path: '/pay/paying',
        query: {
          orderId: submitOrderRes.orderId,
        },
      });
    } else {
      Toast(validateRes.msg);
    }
  }

  // 验证
  private validate() {
    const result = {
      state: true,
      msg: '',
    };

    const isSoldOut = this.products.every((item) => {
      return item.putaway === '1';
    });

    if (isSoldOut) {
      if (this.getMethod === '1') {
        return result;
      } else if (this.getMethod === '2') {
        if (!this.checkedAddress) {
          result.state = false;
          result.msg = '请填写地址';
        }
      } else {
        result.state = false;
        result.msg = '请选择收货方式';
      }
    } else {
      result.state = false;
      result.msg = '下手慢了哦，商品已被抢购';
    }

    return result;
  }

  // 提交订单
  private submitOrder() {
    return new Promise((resolve, reject) => {
      const codeList: any[] = [];
      this.products.forEach((item) => {
        codeList.push(item.code);
      });

      const body = {
        addressId: this.getMethod === '2' ? this.checkedAddress.id : '',
        sendType: this.getMethod,
        shopName: this.getMethod === '1' ? this.shopInfo.shopName : '',
        remark: this.remark,
        codeList,
      };

      orderCreateReq.requestInit.body = JSON.stringify(body);
      const httpRes = httpReq(orderCreateReq);
      Toast.loading('订单提交中...');
      httpRes.then(data => {
        Toast.clear();
        resolve(data);
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }
}
</script>

<style lang="scss" scoped>
#shopping-trolley-order-confirm {
  line-height: 1;
  padding-bottom: 6.5rem;

  & > .order-info {
    display: grid;
    grid-row-gap: .7rem;
    align-content: start;
    overflow: hidden scroll;

    & > .address {
      display: flex;
      justify-content: space-between;
      padding: 1.7rem 1.5rem;
      border-bottom: .6rem solid #fff;
      border-image: url(~@/assets/images/address.png) 100% 0 100% 0 stretch;
      font-size: 1.8rem;
      color: #333333;
      background-color: #fff;

      & > .left {
        flex-grow: 1;

        & > .have-address {
          display: grid;
          grid-row-gap: 1rem;

          & > .top {
            font-size: 1.8rem;
            color: #333333;

            & > span {
              &:first-of-type {
                margin-right: 2.4rem;
              }
            }
          }

          & > .bottom {
            line-height: 1.5;

            & > .default {
              margin-right: 1rem;
              border: 1px solid var(--color-theme);
              padding: .1rem 1rem;
              font-size: 1.3rem;
              color: var(--color-theme);
            }
          }
        }

        & > .not-address {
          text-align: center;
          line-height: 3;
          font-size: 1.8rem;
          color: var(--color-theme);
        }
      }

      & > .right {
        display: grid;
        align-items: center;
        justify-items: center;
        color: #999999;
      }
    }

    & > .product {
      background-color: #fff;

      & > .product-list {
        border-bottom: 1px solid #f5f5f5;
      }

      & > .express-mode {
        display: grid;
        grid-row-gap: 1.8rem;
        border-bottom: 1px solid #f5f5f5;
        padding: 1.5rem;
        font-size: 1.8rem;

        & > header {
          color: var(--color-theme);
        }

        & > .content {
          display: grid;
          grid-auto-flow: column;
          justify-content: start;
          grid-column-gap: 6rem;
        }
      }

      & > .shop {
        & > .shop-info {
          display: grid;
          grid-row-gap: 1.8rem;
          border-bottom: 1px solid #f5f5f5;
          padding: 1.5rem;
          font-size: 1.8rem;

          & > header {
            color: var(--color-theme);
          }

          & > ul {
            display: grid;
            grid-row-gap: 1.2rem;
            line-height: 1.5;
          }
        }


        & > .shop-select {
          text-align: center;
          padding: 1.7rem;
          font-size: 1.8rem;
          color: var(--color-theme);
        }
      }
    }

    & > .discount-coupon {
      background-color: #fff;

      & > header {
        display: grid;
        grid-auto-flow: column;
        justify-content: space-between;
        border-bottom: 1px solid #f5f5f5;
        padding: 1.9rem 1.6rem;
        color: var(--color-theme);

        & > .left {
          font-size: 1.8rem;
        }

        & > .right {
          display: grid;
          grid-auto-flow: column;
          grid-column-gap: 1.2rem;
          align-items: center;
          font-size: 1.5rem;

          & > .iconfont {
            font-size: 1.4rem;
            color: #999999;
          }
        }
      }

      & > ul {
        padding: 1.5rem;

        & > li {
          display: grid;
          grid-auto-flow: column;
          justify-content: space-between;
          font-size: 1.8rem;

          & > .left {
            display: grid;
            grid-row-gap: 1.2rem;

            & > span:last-of-type {
              font-size: 1.5rem;
              color: #999999;
            }
          }

          & > .right {
            display: grid;
            align-items: center;
            color: var(--color-theme);
          }
        }
      }
    }

    & > .message {
      display: grid;
      grid-row-gap: 1.8rem;
      border-bottom: 1px solid #f5f5f5;
      padding: 1.5rem;
      font-size: 1.8rem;
      background-color: #fff;

      & > header {
        color: var(--color-theme);
      }

      & > textarea {
        border: 1px solid #dddddd;
        padding: 1.3rem;
        min-height: 8rem;
        font-size: 1.5rem;
      }
    }

    & > .price {
      display: grid;
      grid-row-gap: 1.3rem;
      padding: 1.4rem;
      background-color: #fff;
      font-size: 1.8rem;

      & > div {
        display: grid;
        grid-auto-flow: column;
        justify-content: space-between;

        & > div:last-of-type {
          color: var(--color-theme);
        }

        &.total-prices {
          & > .value {
            & > .count {
              margin-right: 1.2rem;
              color: #333333;
            }
          }
        }
      }
    }
  }

  & > footer {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    display: grid;
    grid-template-columns: auto 14rem;
    overflow: hidden;
    height: 5.5rem;
    background-color: #fff;

    & > .left {
      display: grid;
      grid-auto-flow: column;
      justify-content: start;
      align-items: center;
      padding: 0 1.5rem;
      font-size: 2rem;
      color: #333333;

      & > span {
        color: var(--color-theme);
      }
    }

    & > .right {
      display: grid;
      align-items: center;
      justify-items: center;
      background-color: var(--color-theme);
      font-size: 2rem;
      color: #ffffff;
    }
  }
}
</style>
