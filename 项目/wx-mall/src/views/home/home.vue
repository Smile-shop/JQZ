<template>
  <base-layout
    :isShowHeader="false"
  >
    <article id="home-home">
      <header>
        <div
          class="log"
          :style="{
            'background-image': `url(${pageStyle ? pageStyle.logo : ''})`,
          }"
        >
        </div>
        <div class="input-box">
          <input
            v-model="productSearchOptions.keyword"
            type="text"
            placeholder="请输入关键字"
            @keydown.enter="toQueryResultPage"
          >
          <i
            class="iconfont icon-sousuo"
            @click="toQueryResultPage"
          >
          </i>
        </div>
        <div
          v-if="!isLogin"
          class="user"
          @click="loginHandle"
        >
          登录
        </div>
      </header>
      <section class="container">
        <header class="banner">
          <swipe
            :autoplay="3000"
          >
            <swipe-item
              v-for="(item, index) of (pageStyle ? pageStyle.banner : [])"
              :key="index"
            >
              <div
                class="banner-img"
                :style="{
                  'background-image': `url(${item.imgURL})`
                }"
                @click="bannerClickHandle(item)"
              >
              </div>
            </swipe-item>
          </swipe>
        </header>
        <!-- 秒杀 -->
        <section class="seckill">
          <section
            v-for="(item, index) of homeInfo.sklActivity"
            :key="index"
            class="sale-item"
          >
            <div
              class="title"
              v-if="item.productList.length"
            >
              <div class="line"></div>
              <div class="text">
                {{item.name}}
              </div>
              <div class="line"></div>
            </div>
            <div
              class="info"
              v-if="item.productList.length"
            >
              <div class="left">
                <div
                  v-activity-date-time="{
                    dateStart: item.startTime,
                    dateEnd: item.endTime,
                  }"
                  class="notStart"
                >
                  <span class="name"></span>
                  <span class="time"></span>
                </div>
              </div>
            </div>
            <div
              class="product-list"
              v-if="item.productList.length"
            >
              <product-list-column-item
                v-for="(item, index) of item.productList"
                :key="index"
                :item-data="item"
              />
            </div>
          </section>
        </section>
        <!-- 促销 -->
        <section class="sale">
          <section
            v-for="(item, index) of homeInfo.productSaleList"
            :key="index"
            class="sale-item"
          >
            <div
              class="title"
              v-if="item.productList.length"
            >
              <div class="line"></div>
              <div class="text">
                {{item.name}}
              </div>
              <div class="line"></div>
            </div>
            <div
              class="info"
              v-if="item.productList.length"
            >
              <div class="left">
                <div
                  v-activity-date-time="{
                    dateStart: item.startTime,
                    dateEnd: item.endTime,
                  }"
                  class="notStart"
                >
                  <span class="name"></span>
                  <span class="time"></span>
                </div>
              </div>
              <div
                class="right"
                @click="toQueryResultPage({
                  activityID: item.id,
                  topType: item.topType
                })"
              >
                更多
              </div>
            </div>
            <div
              class="product-list"
              v-if="item.productList.length"
            >
              <product-list-column-item
                v-for="(item, index) of item.productList"
                :key="index"
                :item-data="item"
              />
            </div>
          </section>
        </section>
        <!-- 所有商品 -->
        <section class="product-all">
          <header>
            <div class="left">
              <i class="iconfont icon-zuanshi_o"></i>
              所有商品
            </div>
            <div
              class="right"
              @click="toQueryResultPage"
            >
              更多
            </div>
          </header>
          <section class="product-list">
            <product-list-column-item
              v-for="(item, index) of homeInfo.productAllList"
              :key="index"
              :item-data="item"
            />
          </section>
          <footer
            @click="toQueryResultPage"
          >
            查看所有商品
          </footer>
        </section>
      </section>
      <van-dialog
        v-model="showQrCodeDialog"
        class="qrcode-dialog"
        :show-confirm-button="false"
        :close-on-click-overlay="true"
        :before-close="onAttentionPublicAppClose"
      >
        <div class="dialog-content">
          <header>
            <p>
              小主，我们正在加急给您备货，关注公众号可以获取最新的订货消息哦~
            </p>
          </header>
          <img v-if="isMobile.Android()" class="qrcode" :src="qrCodeUrl">
          <a  v-else href="javascript:;">
            <img class="qrcode" :src="qrCodeUrl">
          </a>
          <div class="tip">
            长按二维码解锁更多功能
          </div>
        </div>
      </van-dialog>
    </article>
  </base-layout>
</template>

<script lang="ts">
// vue
import {Vue, Component, Model, Watch} from 'vue-property-decorator';
import {State, Getter, Action, Mutation, namespace} from 'vuex-class';

// http
import {httpReq} from '@/utils/http-req';
import {HomeInfoReq, projectTitleReq, pageStyle, getWxComInfoReq, getProductShareStyleReq, getListDisplayParamsReq, getMailingMethodReq} from '@/serves/home';
import {folderNameReq, userInfoReq} from '@/serves/user';

// 组件
import BaseLayout from '@/layouts/base-layout.vue';
import {Toast, Swipe, SwipeItem, Dialog} from 'vant';

// 工具
import ProductListColumnItem from './components/product-list-column-item.vue';
import moment from 'moment';
import {getLocalStorage} from '@/utils/local-storage';
import {exit, forgetPassword} from '@/utils/login-handle';
import {
  VUE_APP_BASE_URL
} from '@/config/global-var';
import {setShare} from '@/router';
import { isMobile } from '@/utils/platform';

@Component({
  name: 'HomeHome',
  components: {
    BaseLayout,
    Swipe,
    SwipeItem,
    ProductListColumnItem,
  },
})
export default class HomeHome extends Vue {
  @State('productSearchOptions')
  private productSearchOptions!: any;

  @State('isLogin')
  private isLogin!: boolean;

  @State('pageStyle')
  private pageStyle!: any;

  @State('postMethod')
  private postMethod!: any;

  @State('shareType')
  private shareType!: any;

  @State('listDisplayParams')
  private listDisplayParams!: any;

  @Mutation('initProductSearchOptions')
  private initProductSearchOptions!: any;

  @Mutation('setShareType')
  private setShareType!: any;

  @Mutation('setPostMethod')
  private setPostMethod!: any;

  @Mutation('setListDisplayParams')
  private setListDisplayParams!: any;

  @Mutation('setProductSearchOptionsActivityList')
  private setProductSearchOptionsActivityList!: any;

  @Mutation('setProductSearchOptionsTopType')
  private setProductSearchOptionsTopType!: any;

  @Mutation('setServicesPermission')
  private setServicesPermission!: any;

  @Mutation('setPageStyle')
  private setPageStyle!: any;

  // 查询购物车数量
  @Action('selectShoppingCartCount')
  private selectShoppingCartCount!: any;

  // 修改购物车数量
  @Mutation('setShoppingCartCount')
  private setShoppingCartCount!: any;

  get brandIMGUrl() {
    const {wxUserInfo} = getLocalStorage();

    if (wxUserInfo) {
      return `${this.baseUrl}/ftp_images/${wxUserInfo.companyKey}/malllogo.jpg?${Math.random()}`;
    } else {
      return '';
    }
  }

  private baseUrl = VUE_APP_BASE_URL;

  private isMobile = isMobile;

  // 首页信息
  private homeInfo: object = {
    banner: [],
    logo: '',
    productAllList: [],
    productSaleList: [],
  };

  // 显示二维码对话框
  private showQrCodeDialog = false;

  // 二维码地址
  private qrCodeUrl = '';

  // 子页面
  private childPage = '';

  private created() {
    this.setQueryData();
  }

  private mounted() {
    this.initData();
  }

  private isFirstIn() {
    return 'c' in this.$route.query;
  }

  private setQueryData() {
    if (this.isFirstIn()) {
      const query = this.$route.query;
      const {
        o,
        c,
        i,
        p,
        m,
        s,
        openid,
        page,
        childPage,
        p1,
        r,
        subscribe,
      } = query;

      const urlData = {
        openid: o,
        companyKey: c,
        headerImg: i || 'http://www.jqzjop.com/ftp_images/01/common/jqz_default_avatar.jpg',
        memberCard: m ? m : null,
        phone: s ? s : null,
        page: page || null,
        register_openid: openid,
        localUrl: window.location.origin.concat('/wx-mall/#/'),
        transferPage: 'wx_mall', // 登陆后的返回页面
        isRegister: r, // 是否开发注册功能
        subscribe
      };

      window.localStorage.setItem('urlData', JSON.stringify(urlData));

      if (p1) {
        window.localStorage.setItem(`ticket_${c}`, p1 as string);
      }

      console.log(this.$route);
    }
  }

  private initData() {
    // 初始化搜索数据
    this.initProductSearchOptions();

    // 首次登录查询页面样式
    if (this.pageStyle == null || this.isFirstIn()) {
      this.getPageStyle();
    }

    // 首次登录配送样式
    if (this.postMethod == null || this.isFirstIn()) {
      this.getMailingMethodReq();
    }

    // 关注公众号与页面跳转
    const attentionCompany = async () => {
      // 首次登录获取分享样式, 列表显示参数
      if (this.shareType == null || this.isFirstIn()) {
        await this.getProductShareStyleReq();
      }

      const query = this.$route.query;
      const {
        childPage,
        c,
        subscribe
      } = query;

      if (c) {
        const { href } = location;
        // 重置路径
        if (href.includes('?')) {
          const [ first ] = href.split('?');
          location.replace(first);
        }

        // 没有注册与分享规则为首页分享
        if (subscribe == '0' && this.shareType && this.shareType.shareGuide == '1') {
          await this.getQrCodeUrl();
          this.showQrCodeDialog = true;

          // 如果有子页面, 当二维码关闭的时候跳到子页面
          if (childPage) {
            this.childPage = (childPage as string);
          }
        } else {
          // 页面跳转
          if (childPage) {
            setTimeout(() => {
              this.$router.push(JSON.parse(childPage as string));
            }, 2000);
          }
        }
      }
    };

    // 关注公众号
    attentionCompany();

    // 首次登录获取列表显示参数和首页信息
    const homeData = async () => {
      try {
        if (this.listDisplayParams == null || this.isFirstIn()) {
          await this.getListDisplayParamsReq();
        }
      } catch (error) {
        console.log('获取列表显示参数失败');
      } finally {
        this.HomeInfoSelect();
        // 查询是否登录
        if (this.isLogin) {
          const wxMallShoppingCart = window.localStorage.getItem('wxMallShoppingCart');

          if (wxMallShoppingCart) {
            const length = JSON.parse(wxMallShoppingCart).length;

            this.setShoppingCartCount(length);
          } else {
            this.selectShoppingCartCount();
          }
          this.userInfoSelect();
        }
      }
    };

    homeData();
  }

  // 获取分享样式
  private async getProductShareStyleReq() {
    const body = {};
    getProductShareStyleReq.requestInit.body = JSON.stringify(body);
    const res = await httpReq(getProductShareStyleReq);
    this.setShareType(res);
    return res;
  }

  // 获取配送方式
  private async getMailingMethodReq() {
    const body = {};
    getMailingMethodReq.requestInit.body = JSON.stringify(body);
    const res = await httpReq(getMailingMethodReq);
    this.setPostMethod(res);
    return res;
  }

  // 获取显示参数的列表
  private async getListDisplayParamsReq() {
    const body = {
      displayMode: 3
    };
    getListDisplayParamsReq.requestInit.body = JSON.stringify(body);
    const res = await httpReq(getListDisplayParamsReq);
    this.setListDisplayParams(res);
    return res;
  }

  // 获取公众号二维码
  private async getQrCodeUrl() {
    const body = {};

    getWxComInfoReq.requestInit.body = JSON.stringify(body);
    const {
      publicId
    } = await httpReq(getWxComInfoReq);
    this.qrCodeUrl = `https://open.weixin.qq.com/qr/code?username=${publicId}`;
  }

  // 当关注二维码关闭
  private async onAttentionPublicAppClose(action, done) {
    done();
    if (this.childPage) {
      this.$router.push(JSON.parse(this.childPage));
    }
  }

  // banner点击处理
  private bannerClickHandle(item: any) {
    const {clickType, code, linkURL} = item;

    if (clickType === 'code') {
      if (code) {
        this.$router.push({
          path: `/home/product-detail/${code}`,
        });
      }
    } else if (clickType === 'link') {
      if (linkURL) {
        window.location.href = linkURL;
      }
    }
  }

  // 前往查询结果页面
  private toQueryResultPage(options: any): void {
    if (options.activityID) {
      this.setProductSearchOptionsActivityList(options.activityID);
    }

    if (options.topType) {
      this.setProductSearchOptionsTopType(options.topType);
    }

    this.$router.push('/home/query-result');
  }

  // 登录处理
  private loginHandle() {
    exit();
  }

  // 查询首页信息
  private HomeInfoSelect() {
    return new Promise((resolve, reject) => {
      const body = {
        groupSize: 8,
        pageSize: 8,
      };

      HomeInfoReq.requestInit.body = JSON.stringify(body);
      const httpRes = httpReq(HomeInfoReq);

      httpRes.then(data => {
        this.homeInfo = data;

        resolve(data);
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }

  // 查询页面风格
  private getPageStyle() {
    return new Promise((resolve, reject) => {
      const body = {
      };

      pageStyle.requestInit.body = JSON.stringify(body);
      const httpRes = httpReq(pageStyle);

      httpRes.then(data => {
        const {shopCloud} = data;
        this.setPageStyle(data);
        this.setServicesPermission(shopCloud);
        setShare(this.$route);
        resolve(data);
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }

  // 查询用户信息
  private userInfoSelect() {
    return new Promise((resolve, reject) => {
      const {wxUserInfo} = getLocalStorage();
      const body = {
        companyKey: wxUserInfo!.companyKey,
        openid: wxUserInfo!.openid,
      };

      userInfoReq.requestInit.body = JSON.stringify(body);
      const httpRes = httpReq(userInfoReq);
      Toast.loading();
      httpRes.then(data => {
        Toast.clear();
        const {isMemberOrNot} = data;

        if (isMemberOrNot === 0) {
          exit();
          reject(data);
        } else {
          const {cardNum} = data.wxMemberInfo;
          window.localStorage.setItem('memberCard', cardNum);
          resolve(data);
        }
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }

  // 获取企业ftp用户名
  private getFolderName() {
    return new Promise((resolve, reject) => {
      const httpRes = httpReq(folderNameReq);

      httpRes.then(data => {
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
#home-home {
  .dialog-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    > header {
      margin-bottom: 20px;
      padding: 15px 25px;
      color:rgba(149,158,172,1);
      font-size: 16px;
      line-height: 2;
      box-shadow:0px 2px 20px 0px rgba(0, 0, 0, 0.1);
      border-radius:20px;
    }

    img {
      width: 200px;
      height: 200px;
    }

    > .tip {
      margin-top: 10px;
      margin-bottom: 30px;
      padding: 10px;
      background:rgba(154,194,247,0.25);
      border-radius:31px;
      color:rgba(96,98,102,1);
    }
  }

  & > header {
    position: sticky;
    top: 0;
    z-index: var(--zindex-sticky);
    display: flex;
    padding: .6rem 1.2rem;
    background-color: var(--color-theme);

    & > .log {
      margin-right: 1rem;
      border-radius: .3rem;
      height: 6.5rem;
      width: 6.5rem;
      background-color: #f5f5f5;
      background-size: contain;
      background-position: center center;
      background-repeat: no-repeat;
    }

    & > .input-box {
      position: relative;
      display: flex;
      flex-grow: 1;
      align-self: center;
      margin-right: 1rem;

      & > input {
        flex-grow: 1;
        border: none;
        border-radius: .3rem;
        padding: 1.5rem 1.2rem;
        font-size: 1.5rem;
      }

      & > .iconfont {
        position: absolute;
        align-self: center;
        right: 1.2rem;
        font-size: 2.2rem;
        color: var(--color-theme);
      }
    }

    & > .user {
      align-self: center;
      font-size: 2rem;
      color: #fff;
    }
  }

  & > .container {
    display: flex;
    flex-direction: column;
    overflow: hidden scroll;

    & > header {
      height: 17rem;
      background: #fff;

      & .banner-img {
        height: 17rem;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center center;
        background-color: #fff;
      }
    }

    & > .sale, .seckill {
      padding: 0 1.3rem;
      background: #fff;

      & > .sale-item {
        display: grid;
        grid-row-gap: 1.6rem;

        & > .title {
          display: grid;
          grid-template-columns: auto max-content auto;
          grid-column-gap: 1.2rem;
          align-items: center;
          padding-top: 1.3rem;

          & > .line {
            height: 1px;
            background-color: var(--color-theme);
          }

          & > .text {
            font-size: 2rem;
            font-weight: bold;
            color: var(--color-theme);
          }
        }

        & > .info {
          display: flex;
          justify-content: space-between;
          font-size: 1.5rem;
          color: #666666;

          & > .right {
            color: #999999;
          }
        }

        & > .product-list {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: 20rem;
          grid-column-gap: 1.1rem;
          overflow: scroll hidden;
        }
      }
    }

    .product-all {
      & > header {
        display: grid;
        align-items: center;
        justify-content: space-between;
        grid-auto-flow: column;
        padding: 1.5rem;

        & > .left {
          font-size: 2rem;
          color: var(--color-theme);
        }

        & > .right {
          font-size: 1.5rem;
          color: #999999;
        }
      }

      & > .product-list {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: .5rem;
      }

      & > footer {
        margin-top: .5rem;
        margin-bottom: .5rem;
        padding: 1.4rem;
        text-align: center;
        font-size: 1.8rem;
        color: var(--color-theme);
        background-color: #fff;
      }
    }
  }
}
</style>
