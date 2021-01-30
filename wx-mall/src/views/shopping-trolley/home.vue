<template>
  <base-layout
    :isShowFooter="false"
    :custom-footer="true"
    title="购物车"
  >
    <list
      v-model="isLoading"
      :finished="isFinished"
      :finished-text="dataList.length ? '没有更多了' : ''"
      @load="loadMore(false)"
    >
      <article id="shopping-trolley-home">
        <section
          v-if="dataList.length"
          class="hasContent"
        >
          <section
            class="data-list"
          >
            <div
              class="data-list-item"
              v-for="(item, index) of dataList"
              :key="index"
              @click="toProductDetailPage(item.code)"
            >
              <div
                class="left"
                @click.stop
              >
                <checkbox
                  v-model="item.isSelected"
                  @change="onChange"
                >
                </checkbox>
              </div>
              <div
                class="middle"
                v-imgURL="item.pic_url"
              >
              </div>
              <div class="right">
                <div class="left">
                  <div class="top">
                    <div class="name">{{item.productName}}</div>
                    <div class="detail">
                      <div
                        v-for="(item, index) of productDisplayPropertys(item)"
                        :key="index"
                      >
                        {{item.name}}：{{item.value | padEndUnit(item.unit)}}
                      </div>
                    </div>
                  </div>
                  <div class="bottom">
                    <div class="price">
                      <span>
                        {{item.actualPrice | formatCurrencyFraction}}
                      </span>
                      <del
                        v-if="item.flagPrice"
                      >
                        {{item.flagPrice | formatCurrencyFraction}}
                      </del>
                    </div>
                  </div>
                </div>
                <div
                  class="right"
                  @click.stop="deleteProductHandle(index)"
                >
                  <i
                    class="iconfont icon-shanchu"
                  >
                  </i>
                </div>
              </div>
            </div>
          </section>
          <footer>
            <div class="left"
              @click="onCheckAllChange"
            >
              <checkbox
                v-model="checkAll"
              >
                全选
              </checkbox>
            </div>
            <div class="middle">
              <div class="count">
                <span>合计：</span>
                <span>{{privateTotal | formatCurrencyFraction}}</span>
              </div>
              <div class="detail">
                (不含运费)
              </div>
            </div>
            <div
              class="right"
              @click="orderSubmit"
            >
              提交订单({{selectedCount}})
            </div>
          </footer>
        </section>
        <the-not-data
          v-else
          icon="icon-gouwuche"
          text="购物车还是空的哦！"
          buttonText="马上选购"
          buttonLink="/home"
        >
        </the-not-data>
      </article>
    </list>
  </base-layout>
</template>

<script lang="ts">
// vue
import {Vue, Component, Model, Watch} from 'vue-property-decorator';
import {State, Action, Mutation} from 'vuex-class';

// 组件
import BaseLayout from '@/layouts/base-layout.vue';
import TheNotData from '@/components/the-not-data.vue';
import {Checkbox, Toast, List} from 'vant';
import BuyModeSelect from './components/buy-mode-select.vue';

// http
import {httpReq} from '@/utils/http-req';
import {
  shoppingCartInfoReq,
  deleteShoppingCartProductReq,
  productBatchSelectReq,
} from '@/serves/shopping-cart';

// 工具
import {batchAddToShoppingCart} from '@/utils/common';
import { productDisplayPropertys } from '@/utils/product-property';

@Component({
  components: {
    BaseLayout,
    TheNotData,
    Checkbox,
    BuyModeSelect,
    List,
  },
})

export default class ShoppingTrolleyHome extends Vue {
  //  商品列表
  private dataList: any[] = [];

  // 选中的数量
  private selectedCount: number = 0;

  // 合计
  private privateTotal: number = 0;

  // 全选
  private checkAll: boolean = false;

  // 是否加载
  private isLoading: boolean = false;

  // 是否全部完成
  private isFinished: boolean = false;

  // 删除中
  private deleting: boolean = false;

  // 当前页数
  private pageNum: number = 1;

  // 显示数量
  private pageSize: number = 20;

  private productDisplayPropertys = productDisplayPropertys;

  @State('isLogin')
  private isLogin!: boolean;

  @Action('selectShoppingCartCount')
  private selectShoppingCartCount: any;

  @Mutation('setShoppingCartCount')
  private setShoppingCartCount!: any;


  // 提交订单
  private orderSubmit(): void {
    const selectedItem = this.dataList.filter((item) => {
      return item.isSelected;
    });

    const codes: any[] = [];

    selectedItem.forEach((item: any, index: number) => {
      codes.push(item.code);
    });

    if (selectedItem.length) {
      this.$router.push({
        path: '/shopping-trolley/order-confirm',
        query: {
          checkedProduct: JSON.stringify(codes),
        },
      });
    } else {
      Toast('请选择商品');
    }
  }

  private mounted() {
    this.isLoading = true;

    if (this.isLogin) {
      const shoppingCart = window.localStorage.getItem('wxMallShoppingCart');

      if (shoppingCart) {
        const shoppingCartJSON = JSON.parse(shoppingCart);
        batchAddToShoppingCart(shoppingCartJSON).then((value) => {
          window.localStorage.removeItem('wxMallShoppingCart');
          this.isLoading = false;
          this.checkAll = true;
          this.onCheckAllChange();
        });
      } else {
        this.loadMore(true);
      }
    } else {
      this.selectLocalShoppingCartInfo();
    }
  }

  // 查询本地购物车信息
  private selectLocalShoppingCartInfo() {
    const shoppingCart = window.localStorage.getItem('wxMallShoppingCart');

    if (shoppingCart) {
      const shoppingCartJSON: string[] = JSON.parse(shoppingCart);

      if (shoppingCartJSON.length) {
        this.selectProductBatchSelectReq(shoppingCartJSON).finally(() => {
          this.isFinished = true;
          this.isLoading = false;
        });
      } else {
        this.isFinished = true;
        this.isLoading = false;
      }
    } else {
      this.isFinished = true;
      this.isLoading = false;
    }
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
        data.list = (data.list as any[]).map((item, index) => {
          item.isSelected = false;
          return item;
        });
        this.dataList = data.list;
        resolve(data);
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }

  // 查询购物车信息
  private getShoppingCartInfo() {
    return new Promise((resolve, reject) => {
      const body = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };

      shoppingCartInfoReq.requestInit.body = JSON.stringify(body);
      const httpRes = httpReq(shoppingCartInfoReq);
      httpRes.then(data => {
        data.list = (data.list as any[]).map((item, index) => {
          item.isSelected = false;
          return item;
        });
        resolve(data);
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }

  // 删除处理
  private deleteProductHandle(index: number) {
    if (this.isLogin) {
      if (!this.deleting) {
        this.deleting = true;
        this.deleteProduct(this.dataList[index].code).then((value) => {
          this.dataList.splice(index, 1);
          this.selectShoppingCartCount();
        }).finally(() => {
          this.deleting = false;
        });
      } else {
        Toast('操作太快了~~');
      }
    } else {
      const shoppingCart = window.localStorage.getItem('wxMallShoppingCart');
      let shoppingCartJSON = JSON.parse(shoppingCart as string);
      const shoppingCartSet = new Set([...shoppingCartJSON]);

      shoppingCartSet.delete(this.dataList[index].code);
      shoppingCartJSON = [...shoppingCartSet];
      window.localStorage.setItem('wxMallShoppingCart', JSON.stringify(shoppingCartJSON));
      const shoppingCartSetSize = shoppingCartSet.size;
      this.setShoppingCartCount(shoppingCartSetSize);

      if (shoppingCartSetSize) {
        this.selectProductBatchSelectReq(shoppingCartJSON);
      } else {
        this.isFinished = true;
        this.isLoading = false;
        this.dataList = [];
      }
    }
  }

  // 删除购物车商品
  private deleteProduct(id: string) {
    return new Promise((resolve, reject) => {
      const body = {
        list: [id],
      };

      deleteShoppingCartProductReq.requestInit.body = JSON.stringify(body);
      const httpRes = httpReq(deleteShoppingCartProductReq);
      Toast.loading('删除中...');
      httpRes.then(data => {
        Toast('删除成功');
        resolve(data);
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }

  // 选择按钮状态改变时
  private onChange() {
    const selectedItem = this.dataList.filter((item) => {
      return item.isSelected;
    });

    this.selectedCount = selectedItem.length;

    // 合计价格
    this.privateTotal = 0;
    selectedItem.forEach((item) => {
       this.privateTotal += item.actualPrice;
    });

    // 是否全选
    this.checkAll = this.dataList.every((item, index) => {
      return item.isSelected;
    });
  }

  // 全选处理
  private onCheckAllChange() {
    if (this.checkAll) {
      this.dataList.forEach((item) => {
        item.isSelected = false;
      });

      // 合计数量
      this.selectedCount = 0;

      // 合计价格
      this.privateTotal = 0;
    } else {
      this.dataList.forEach((item) => {
        item.isSelected = true;
      });

      // 合计数量
      this.selectedCount = this.dataList.length;

      // 合计价格
      this.privateTotal = 0;
      this.dataList.forEach((item) => {
        this.privateTotal += item.actualPrice;
      });
    }
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
    const res = this.getShoppingCartInfo();

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

  // 前往产品详情页面
  private toProductDetailPage(id: string): void {
    this.$router.push({
      path: `/home/product-detail/${id}`,
    });
  }
}
</script>

<style lang="scss" scoped>
#shopping-trolley-home {
  & > .hasContent {
    & > .data-list {
      & > .data-list-item {
        display: flex;
        padding: 1.9rem 1.5rem;
        background-color: #fff;
        border-bottom: 1px solid #f5f5f5;

        & > .left {
          display: flex;
          align-items: center;
          margin-right: 1rem;
        }

        & > .middle {
          margin-right: 1rem;
          height: 9.8rem;
          width: 9.8rem;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center center;
        }

        & > .right {
          display: flex;
          flex-grow: 1;
          align-self: stretch;
          justify-content: space-between;

          & > .left {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-right: 1rem;

            & > .top {
              & > .name {
                margin-bottom: .5rem;
                font-size: 1.8rem;
                color: #333333;
              }

              & > .detail {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                font-size: 1.5rem;
                color: #999999;

                > div {
                  flex-shrink: 0;
                  flex-basis: 49%;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  margin-bottom: .8rem;
                }
              }
            }

            & > .bottom {
              & > .price {
                & > span {
                  margin-right: .5rem;
                  font-size: 2rem;
                  color: var(--color-theme);
                }

                & > del {
                  font-size: 1.5rem;
                  color: #bbbbbb;
                }
              }
            }


          }

          & > .right {
            display: flex;
            align-items: center;
            padding-left: 2rem;
            & > .iconfont {
              color: #999999;
              font-size: 2rem;
            }
          }
        }
      }
    }

    & > footer {
      position: fixed;
      left: 0;
      bottom: 0;
      right: 0;
      display: flex;
      height: 5.5rem;
      background-color: #fff;

      & > .left {
        padding: .6rem 1.5rem;

        /deep/ & > .van-checkbox {
          display: flex;
          flex-direction: column;
          align-items: center;

          & > .van-checkbox__label {
            margin-left: 0;
            line-height: 1;
            font-size: 1.5rem;
            color: #333333;
          }
        }
      }

      & > .middle {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex-grow: 1;
        line-height: 1;
        padding: .8rem 1.3rem;

        & > .count {
          text-align: right;
          font-size: 2rem;
          color: #333333;
        }

        & > .detail {
          text-align: right;
          font-size: 1.5rem;
          color: #999999;
        }
      }

      & > .right {
        padding: 1.8rem 1.6rem;
        font-size: 1.8rem;
        color: #ffffff;
        background-color: var(--color-theme);
      }
    }
  }
}
</style>
