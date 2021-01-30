<template>
  <base-layout
    :isShowFooter="false"
  >
    <article
      id="product-detail"
      ref="article"
    >
      <!-- 上部分 -->
      <section class="product-info">
        <section
          class="top"
          ref="top"
        >
          <section class="carousel">
            <swipe
              v-if="productInfo.picList.length"
              :autoplay="3000"
            >
              <swipe-item
                v-for="(item, index) of productInfo.picList"
                :key="index"
                @click="swipeImagePreview(index)"
              >
                <div
                  class="carousel-img"
                  v-imgURL="item"
                >
                </div>
              </swipe-item>
            </swipe>
            <swipe
              v-else
              :autoplay="3000"
            >
              <swipe-item
                @click="swipeImagePreview(index)"
              >
                <div
                  class="carousel-img"
                  v-imgURL=""
                >
                </div>
              </swipe-item>
            </swipe>
          </section>

          <!-- 促销 -->
          <section
            class="price-sale"
            v-if="productInfo.isActivity == '1'"
          >
            <div class="left">
              <span class="price-current">
                {{productInfo.actualPrice | formatCurrencyFraction}}
              </span>
              <del
                v-if="productInfo.flagPrice"
              >
                {{productInfo.flagPrice | formatCurrencyFraction}}
              </del>
            </div>
            <div class="right"
              v-activity-date-time="{
                dateStart: productInfo.activityStartTime,
                dateEnd: productInfo.activityEndTime,
              }"
            >
              <span class="name"></span>
              <span class="time"></span>
            </div>
          </section>

          <!-- 产品名称 -->
          <section class="product-name">
            <div class="left">
              <span class="name">
                {{productInfo.productName}}
              </span>
              <span
                v-if="productInfo.isActivity == '0'"
                class="price"
              >
                {{productInfo.actualPrice | formatCurrencyFraction}}
                <del
                  v-if="productInfo.flagPrice"
                >
                  {{productInfo.flagPrice | formatCurrencyFraction}}
                </del>
              </span>
              <span
                v-else
                class="activityContent"
              >
                此商品已参加{{productInfo.activityName}}活动！
              </span>
            </div>
            <div
              class="right"
            >
              <div
                v-if="isLogin && productInfo.topType !== 'SKL'"
                class="collect"
                @click="onClickCollect(productInfo.code)"
              >
                <i
                  :class="{
                    iconfont: true,
                    'icon-xingxing': true,
                    active: productInfo.collectStatus == 1,
                  }"
                >
                </i>
                收藏
              </div>
              <div
                class="poster"
                @click="generatePoster(false)"
              >
                <i
                  :class="{
                    iconfont: true,
                    'icon-haibao': true,
                  }"
                >
                </i>
                分享海报
              </div>
            </div>
          </section>

          <!-- 交易规格 -->
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
        </section>
        <!-- 下部分 -->
        <section
          class="bottom"
          ref="bottom"
        >
          <nav>
            <div
              :class="{
                active: productRemak == 0,
              }"
              @click="productRemak = 0"
            >
              商品详情
            </div>
            <div
              v-if="pageStyle && pageStyle.isShowComment == 1"
              :class="{
                active: productRemak == 1,
              }"
              @click="productRemak = 1"
            >
              商品评价
              <span class="remak-count">
              （{{productRemarkTotal}}）
              </span>
            </div>
          </nav>
          <section class="content-box">
            <section
              v-if="productRemak == 0"
              class="product-detail"
            >
              <section class="product-table-info">
                <table
                  v-if="productInfo.topType !== 'SKL'"
                >
                  <tr
                    v-for="(item, index) of productDetailInfo"
                    :key="index"
                  >
                    <td>{{item.name}}</td>
                    <td>{{item.value}}</td>
                  </tr>
                </table>
                <section
                  v-html="productInfo.detail"
                  class="details"
                >
                </section>
              </section>
            </section>
            <section
              v-if="productRemak == 1"
              class="product-remark"
            >
              <ul>
                <li
                  v-for="(item, index) in productRemarks"
                  :key="index"
                >
                  <header>
                    <div class="left">
                      <div>{{item.memberCard}}</div>
                      <div class="star">
                        <i
                          v-for="(item, index) of Array(item.csr).fill(7)"
                          :key="index"
                          class="iconfont icon-xingxing"
                        >
                        </i>
                      </div>
                    </div>
                    <div class="right">
                      {{item.creatTime | dateYMD}}
                    </div>
                  </header>
                  <p>
                    {{item.evaContent}}
                  </p>
                  <figure>
                    <img
                      v-for="(item, index) in item.ppath"
                      :key="index"
                      :src="item"
                    >
                  </figure>
                </li>
              </ul>
              <div
                v-if="!productRemarks.length"
                class="not-remark"
              >
                暂无评论
              </div>
              <pagination
                v-if="productRemarks.length"
                v-model="productRemarkPageNum"
                :total-items="productRemarkTotal"
                :items-per-page="productRemarkPageSize"
                @change="remarkPageTurningHandle"
                mode="simple"
              />
            </section>
          </section>
        </section>
      </section>

      <section class="recommend">
        <header>
          同类推荐
        </header>
        <div class="product-list">
          <product-list-column-item
            v-for="(item, index) of productRecommend"
            :key="index"
            :item-data="item"
          />
        </div>
      </section>

      <footer>
        <div class="left">
          <router-link
            class="user-center"
            tag="div"
            to="/user/home"
          >
            <i class="iconfont icon-wode1"></i>
            用户中心
          </router-link>
          <router-link
            class="shopping-trolley"
            tag="div"
            to="/shopping-trolley/home"
          >
            <i class="iconfont icon-gouwuche"></i>
            购物车
          </router-link>
        </div>
        <div class="right">
          <div
            v-if="productInfo.topType !== 'SKL'"
            class="add-shopping-trolley"
            @click="addToShoppingCartHandle([productInfo.code])"
          >
            加入购物车
          </div>
          <div
            class="buy"
            @click="buyHandle"
          >
            立即购买
          </div>
        </div>
      </footer>
      <van-dialog
        v-model="isShowPoster"
        class="share-image-dialog"
        :show-confirm-button="false"
        :close-on-click-overlay="true"
      >
        <div
          class="dialog-content"
        >
          <img v-if="isMobile.Android()" :src="shareImageUrl">
          <a  v-else href="javascript:;">
            <img :src="shareImageUrl">
          </a>
        </div>
        <div
          class="savaImage"
        >
          长按图片保存
          <i class="iconfont icon-shuaxin"></i>
        </div>
      </van-dialog>
    </article>
  </base-layout>
</template>

<script lang="ts">
// vue
import {Vue, Component, Watch} from 'vue-property-decorator';
import {State} from 'vuex-class';

// 组件
import BaseLayout from '@/layouts/base-layout.vue';
import {Swipe, SwipeItem, Checkbox, Toast, Pagination, ImagePreview} from 'vant';
import ProductListColumnItem from './components/product-list-column-item.vue';

// http
import {httpReq} from '@/utils/http-req';
import {productInfoReq, productDetailInfoReq} from '@/serves/home';
import {collectAddReq, collectDeleteReq} from '@/serves/user';
import {productRemarkListReq} from '@/serves/order';
import {productSearchReq, builderWaresQrcodeReq, getPosterReq} from '@/serves/home';

// 工具
import {batchAddToShoppingCart} from '@/utils/common';
import {getLocalStorage} from '@/utils/local-storage';
import moment from 'moment';
import {
  imageURL
} from '@/utils/url';
import wx from 'wx-jssdk-ts';
import { isMobile } from '@/utils/platform';

@Component({
  components: {
    BaseLayout,
    Swipe,
    SwipeItem,
    Checkbox,
    ProductListColumnItem,
    Pagination,
  },
})
export default class HomeProductDetail extends Vue {
  // 产品信息
  private productInfo: any = {
    picList: [],
  };

  // 产品详情信息
  private productDetailInfo: any[] = [];

  // 商品信息与评价切换
  private productRemak: number = 0;

  // 同类推荐商品
  private productRecommend: any[] = [];

  // 产品评论列表
  private productRemarks: any[] = [];

  // 产品评论当前页数
  private productRemarkPageNum = 1;

  // 产品评论总数
  private productRemarkTotal = 0;

  // 产品评论页面显示数
  private productRemarkPageSize = 10;

  // 海报
  private posterUrls: any[] = [];

  private shareImageUrl = '';

  private isMobile = isMobile;

  // 是否显示海报
  private isShowPoster = false;

  @State('isLogin')
  private isLogin!: boolean;

  @State('pageStyle')
  private pageStyle!: any;

  @Watch('$route', {
    deep: true,
  })
  private onRouteChange() {
    this.getProductInfo();
    this.selectProductList();
  }

  @Watch('productRemak')
  private onRroductRemakChange(value: 0 | 1) {
    if (value === 1) {
      this.selectProductRemarkList(false);
    }
  }

  private async mounted() {
    const productInfo = await this.getProductInfo();
    const productRecommend = this.selectProductList();
    const productRemarkCount = this.selectProductRemarkList(true);
    const productDetailInfo = this.getProductDetailInfoReq();
  }

  // 下载分享图片
  private async downShareImage() {
    const body = await this.generatePoster(true);
    const localStorageData = getLocalStorage();
    const {wxUserInfo, ticket} = localStorageData;
    const url = new URL(getPosterReq.url);

    if (wxUserInfo) {
      const {companyKey, memberCard, openid} = wxUserInfo;

      url.searchParams.append('companyKey', companyKey);
      url.searchParams.append('memberCard', memberCard);
      url.searchParams.append('openid', openid);

      if (ticket) {
        url.searchParams.append('ticket', ticket);
      }
    }

    if (body) {
      for (const [key, value] of Object.entries(body)) {
        url.searchParams.append(key, value);
      }

      const anchorElement = document.createElement('a');
      anchorElement.href = url.href;
      anchorElement.click();
    }
  }

  // 轮播图查看大图
  private swipeImagePreview(index) {
    ImagePreview({
      images: this.productInfo.picList.map((value) => {
        return imageURL(value);
      }),
      startPosition: index,
    });
  }

  // 购买处理
  private buyHandle() {
    if ((this.productInfo as any).isActivity === '1') {
      const isBetween = moment().isBetween(
        (this.productInfo as any).activityStartTime,
        (this.productInfo as any).activityEndTime,
      );
      if (isBetween) {
        this.$router.push({
          path: '/shopping-trolley/order-confirm',
          query: {
            checkedProduct: JSON.stringify([(this.productInfo as any).code]),
          },
        });
      } else {
        Toast('不在活动中');
      }
    } else {
      this.$router.push({
        path: '/shopping-trolley/order-confirm',
        query: {
          checkedProduct: JSON.stringify([(this.productInfo as any).code]),
        },
      });
    }
  }

  // 查询产品信息
  private getProductInfo() {
    return new Promise((resolve, reject) => {
      const body = {
        code: this.$route.params.id,
      };

      productInfoReq.requestInit.body = JSON.stringify(body);
      const httpRes = httpReq(productInfoReq);
      Toast.loading();
      httpRes.then(data => {
        this.productInfo = data;
        Toast.clear();
        resolve(data);
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }

  // 查询产品详情信息
  private getProductDetailInfoReq() {
    return new Promise((resolve, reject) => {
      const body = {
        code: (this.productInfo as any).code,
      };

      productDetailInfoReq.requestInit.body = JSON.stringify(body);
      const httpRes = httpReq(productDetailInfoReq);
      httpRes.then(data => {
        this.productDetailInfo = data;
        Toast.clear();
        resolve(data);
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }

  // 查询同类推荐
  private selectProductList() {
    return new Promise((resolve, reject) => {
      const body = {
        // 首饰大类
        jewelryLargeCategory: (this.productInfo as any).jewelryLargeCategory,
        // 排序
        sort: '99',
        pageSize: 4,
        pageNum: 1,
      };

      productSearchReq.requestInit.body = JSON.stringify(body);
      const httpRes = httpReq(productSearchReq);

      httpRes.then(data => {
        const {list, pageNum, pageSize} = data;
        this.productRecommend = list;
        resolve(data);
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }

  // 评论翻页处理
  private remarkPageTurningHandle() {
    this.selectProductRemarkList(false).then(value => {
      const bottomElement = this.$refs.bottom;
      (bottomElement as Element).scrollIntoView(true);
    });
  }

  // 查询商品评价
  private selectProductRemarkList(isCount?: boolean) {
    return new Promise((resolve, reject) => {

      const body = {
        pageNum: this.productRemarkPageNum,
        pageSize: this.productRemarkPageSize,
        code: (this.productInfo as any).code,
        reqAsk: isCount ? 'count' : '',
      };

      productRemarkListReq.requestInit.body = JSON.stringify(body);
      const httpRes = httpReq(productRemarkListReq);

      httpRes.then(data => {
        if (isCount) {
          this.productRemarkTotal = data;
        } else {
          const {list, pageNum, total, pages} = data;
          this.productRemarkPageNum = pageNum;
          this.productRemarkTotal = total;
          this.productRemarks = list;
        }
        resolve(data);
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }

  // 添加商品到购物车处理
  private addToShoppingCartHandle(productID: string[]) {
    batchAddToShoppingCart(productID);
  }

  // 点击收藏
  private onClickCollect(id: string) {
    const state = (this.productInfo as any).collectStatus;
    if (state === 1) {
      this.removeCollectReq(id);
    } else {
      this.addCollectReq(id);
    }
  }

  // 添加收藏
  private addCollectReq(id: string) {
    return new Promise((resolve, reject) => {
      const body = {
        productCode: id,
        customerName: '1',
      };

      collectAddReq.requestInit.body = JSON.stringify(body);
      const httpRes = httpReq(collectAddReq);
      httpRes.then(data => {
        Toast('收藏成功');
        (this.productInfo as any).collectStatus = 1;
        resolve(data);
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }

  // 移除收藏
  private removeCollectReq(id: string) {
    return new Promise((resolve, reject) => {
      const body = {
        productCode: id,
      };

      collectDeleteReq.requestInit.body = JSON.stringify(body);
      const httpRes = httpReq(collectDeleteReq);
      httpRes.then(data => {
        Toast.clear();
        (this.productInfo as any).collectStatus = 0;
        resolve(data);
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }

  // 生成海报
  private async generatePoster(getBody: boolean) {
    const localStorageData = getLocalStorage();
    const {wxUserInfo, ticket} = localStorageData;
    const {
      path,
      params
    } = this.$route;
    const {
      productName,
      picList,
      actualPrice,
      mainStoneWeight,
      goldWeight,
      jewelryLargeCategory,
      saleType,
      saleMode
    } = this.productInfo;
    let url = '';

    if (wxUserInfo) {
      const {companyKey, openid, memberCard} = wxUserInfo;
      const urlObject = new URL(`${VUE_APP_BASE_API}/wx-interface-web/wx/auth`);
      urlObject.searchParams.set('companyKey', companyKey);
      urlObject.searchParams.set('page', 'wx_mall');
      urlObject.searchParams.set('p1', 'share'); // 类型
      urlObject.searchParams.set('p2', memberCard); // 卡号
      urlObject.searchParams.set('p3', openid);
      const isDetail = (path as string).includes('/home/product-detail');

      // 是否是详情页
      if (isDetail) {
        urlObject.searchParams.set('childPage', JSON.stringify({
          path: `/home/product-detail/${params.id}`,
        }));
      }

      url = window.encodeURI(urlObject.href);
    }

    function tofixed(num: number, fractionDigits: number, isMoney?: boolean) {
      const isInteger = Number.isInteger(num);

      if (isInteger) {
        return num;
      } else {
        if (isMoney && num > 1000000) {
          return num.toFixed(1);
        } else {
          return num.toFixed(fractionDigits);
        }
      }
    }

    const body = {
      productName,
      backgroundUrl: imageURL(picList[0]),
      qrCodeUrl: url,
      productPrice: tofixed(actualPrice, 2, true),
      productWeight: '',
      down: 1,
      scale: 1
    };

    if (body.backgroundUrl) {
      if (jewelryLargeCategory == 'SGL' && saleMode == 'CGD' && goldWeight) {
        body.productWeight = `${tofixed(goldWeight, 2)}g`;
      }

      if (jewelryLargeCategory == 'XQL' && mainStoneWeight) {
        body.productWeight = `${tofixed(mainStoneWeight, 2)}ct`;
      }

      if (getBody) {
        return body;
      } else {
        builderWaresQrcodeReq.requestInit.body = JSON.stringify(body);
        const toast = Toast.loading({
          duration: 0,
          message: '海报加载中...',
        });

        try {
          const res = await httpReq(builderWaresQrcodeReq);
          this.shareImageUrl = res;
          this.isShowPoster = true;
        } catch (error) {
          toast.type = 'fail';
          toast.message = error || '海报加载失败';
        } finally {
          setTimeout(() => {
            Toast.clear();
          }, 1000);
        }
      }
    } else {
      this.$toast('没有商品图片');
    }
  }
}
</script>

<style lang="scss" scoped>
#product-detail {
  padding-bottom: 5.5rem;
  .share-image-dialog {
    overflow: unset;
    padding: 0;

    .dialog-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 18px;
      overflow: hidden;

      img {
        max-width: 100%;
        max-height: 75vh;
      }
    }

    .savaImage {
      bottom: -50px;
      margin-left: calc(50% - 75px);
      margin-right: auto;
      position: absolute;
      font-size: 14px;
      padding: 8px 10px;
      border-radius: 30px;
      background-color: var(--color-theme);;
      color: #FFF;
      width: 150px;
      display: flex;
      justify-content: center;
      align-items: center;

      > .iconfont {
        margin-right: 5px;
        font-size: 16px;
      }
    }
  }


  & > .product-info {
    & > .top {
      background-color: #fff;

      & > *:last-child {
        margin-bottom: .6rem;
      }

      & > .carousel {
        & .carousel-img {
          height: 47rem;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center center;
          background-color: #fff;
        }
      }

      & > .price-sale {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        align-items: center;
        padding: 0 1.6rem;
        height: 6.5rem;
        background-image: linear-gradient(90deg, #dc4950 0%, #ff9473 100%);

        & > .left {
          &::first-letter {
            font-size: 1.5rem;
          }

          & > .price-current {
            margin-right: .5rem;
            font-size: 3rem;
            font-weight: bold;
            color: #fff;
          }

          & > del {
            color: #ff9373;
            font-size: 1.5rem;
          }
        }

        & > .right {
          display: grid;
          align-content: center;
          justify-items: end;
          grid-row-gap: 1rem;
          font-size: 1.5rem;
          color: #ffffff;
        }
      }

      & > .product-name {
        display: flex;
        justify-content: space-between;
        margin-bottom: .6rem;
        border-bottom: 1px solid #f5f5f5;
        padding: 1.6rem 1.3rem;

        & > .left {
          display: flex;
          flex-direction: column;
          margin-right: 1rem;

          & > .name {
            margin-bottom: 1.3rem;
            font-size: 2.3rem;
            color: #333333;
          }

          & > .price {
            font-size: 3rem;
            color: var(--color-theme);

            & > del {
              font-size: 1.5rem;
              color: #bbbbbb;
            }
          }

          & > .activityContent {
            font-size: 1.5rem;
            color: var(--color-theme);
          }
        }

        & > .right {
          flex-shrink: 0;
          display: flex;
          align-items: center;

          > div {
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 1.5rem;
            color: #666666;

            &:not(:last-of-type) {
              margin-right: 4rem;
            }

            & > .iconfont {
              margin-bottom: .2rem;
              font-size: 2.5rem;
              color: #999999;

              &.active {
                color: var(--color-theme);
              }
            }

            &.poster {
              & > .iconfont {
                color: var(--color-theme);
              }
            }
          }
        }
      }

      & > .transaction-rules {
        display: flex;
        justify-content: space-between;
        padding: 1.1rem 1.4rem;
        background-color: #fff;

        & > .left {
          font-size: 1.8rem;
          color: var(--color-theme);
        }
      }

      & > .payment-method {
        & > div {
          border-bottom: 1px solid #f5f5f5;
          padding: 1.7rem 1.6rem;
          font-size: 1.8rem;
          color: #333333;

          & > .van-checkbox {
            /deep/ & .price {
              color: var(--color-theme);
            }
          }
        }
      }
    }

    & > .bottom {
      background-color: #fff;

      & > nav {
        display: flex;
        height: 5rem;

        & > div {
          display: flex;
          flex-basis: 50%;
          flex-grow: 1;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid #f5f5f5;
          font-size: 1.8rem;
          color: #333333;

          &.active {
            border-bottom: 1px solid var(--color-theme);
            color: var(--color-theme);
          }

          & > .remak-count {
            color: var(--color-theme);
          }
        }
      }

      & > .content-box {
        & > .product-detail {
          & > .product-table-info {
            display: flex;
            flex-direction: column;
            padding: 1.3rem 1.6rem;

            & > table {
              flex-grow: 1;
              font-size: 1.5rem;
              border-collapse: collapse;
              line-height: 1.5;

              & > tr {
                & > td {
                  border: 1px solid #f5f5f5;
                  padding: 1.1rem 1.3rem;

                  &:first-of-type {
                    width: 10rem;
                  }

                  &:last-of-type {
                    width: calc(100% - 10rem) ;
                  }
                }
              }
            }

            > .details {
              overflow: hidden;

              & img {
                width: 100%;
              }
            }
          }
        }

        & > .product-remark {
          & > ul {
            & > li {
              padding: 1.3rem 1.5rem;
              border-bottom: 1px solid #f5f5f5;

              & > header {
                display: grid;
                grid-auto-flow: column;
                justify-content: space-between;
                font-size: 1.5rem;
                color: #999999;

                & > .left {
                  display: grid;
                  grid-auto-flow: column;
                  align-items: center;
                  grid-column-gap: .6rem;

                  & > .star {
                    color: var(--color-theme);
                  }
                }
              }

              & > p {
                word-wrap: break-word;
                font-size: 1.5rem;
                line-height: 1.5;
                color: #333333;
              }

              & > figure {
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                grid-gap: .6rem;
                margin: 0;

                & > img {
                  height: 8rem;
                  width: 100%;
                }
              }
            }
          }

          & > .not-remark {
            padding: 2rem;
            text-align: center;
            font-size: 1.5rem;
            color: #666;
          }
        }
      }
    }
  }

  & > .recommend {
    & > header {
      padding: 1.8rem 1.6rem;
      font-size: 1.8rem;
      color: #333333;
    }

    & > .product-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: .5rem;
    }
  }

  & > footer {
    position: fixed;
    z-index: var(--zindex-fixed);
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    background-color: #fff;
    line-height: 1;

    & > .left {
      display: flex;
      padding: .5rem 1.8rem;

      & > div {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        font-size: 1.5rem;
        color: #333333;
        background-color: #fff;

        &:first-of-type {
          margin-right: 4.3rem;
        }

        & > .iconfont {
          font-size: 2.3rem;
        }
      }
    }

    & > .right {
      display: flex;
      flex-grow: 1;

      & > .add-shopping-trolley {
        text-align: center;
        flex-basis: 50%;
        padding: 1.9rem;
        font-size: 1.8rem;
        color: #ffffff;
        background-color: #fac302;
      }

      & > .buy {
        text-align: center;
        flex-basis: 50%;
        flex-grow: 1;
        padding: 1.9rem;
        font-size: 1.8rem;
        color: #ffffff;
        background-color: var(--color-theme);
      }
    }
  }

  /deep/ .van-image-preview__cover {
    position: absolute;
    bottom: 2vw;
    left: 0px;
    right: 0px;
    top: auto;
    margin-left: auto;
    pointer-events: none;

    .poster-text {
      text-align: center;
      font-size: 4vw;
      color: #FFF;
      text-shadow: 0px 0px 3px #000;
    }
  }
}
</style>
