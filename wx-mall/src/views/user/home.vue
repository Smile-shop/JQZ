<template>
  <base-layout
    :isShowFooter="true"
    :isShowHeader="false"
  >
    <article
      id="user-home"
    >
      <header>
        <section
          class="top"
        >
          <div
            class="back"
            @click="historyBack"
          >
            <i class="iconfont icon-fanhui"></i>
          </div>
          <div
            class="title"
          >
            用户中心
          </div>
        </section>
        <section
          class="middle"
        >
          <img
            :src="headPortrait"
            alt="头像"
          >
          <span>
            {{cardNum}}（{{level}}）
          </span>
        </section>
        <section
          class="bottom"
        >
          <div>
            累计积分：{{totalScore}}
          </div>
          <div>
            可用积分：{{ableScore}}
          </div>
        </section>
      </header>
      <section
        class="content"
      >
        <ul
          class="order-menu"
        >
          <router-link
            tag="li"
            to="/user/order/all"
          >
            <i class="iconfont icon-dingdan"></i>
            <span>全部订单</span>
          </router-link>
          <router-link
            tag="li"
            to="/user/order/pay-await"
          >
            <i class="iconfont icon-daifukuan"></i>
            <span>待付款</span>
            <badge
              v-if="orderCount && orderCount.newCount"
              :count="orderCount.newCount"
            />
          </router-link>
          <router-link

            tag="li"
            to="/user/order/receive-await"
          >
            <i class="iconfont icon-daishouhuo"></i>
            <span>待收货</span>
            <badge
              v-if="orderCount && orderCount.payCount"
              :count="orderCount.payCount"
            />
          </router-link>
          <router-link
            tag="li"
            to="/user/order/finish"
          >
            <i class="iconfont icon-dingdanye"></i>
            <span>已完成</span>
          </router-link>
        </ul>
        <ul
          class="user-menu"
        >
          <router-link
            tag="li"
            to="/user/collect"
          >
            <i class="iconfont icon-shoucang left"></i>
            <span class="middle">收藏的商品</span>
            <i class="iconfont icon-you right"></i>
          </router-link>
          <!-- <router-link
            tag="li"
            to="/user/info"
          >
            <i class="iconfont icon-wode left"></i>
            <span class="middle">个人信息</span>
            <i class="iconfont icon-you right"></i>
          </router-link> -->
          <li
            @click="changePassword"
          >
            <i class="iconfont icon-mima left"></i>
            <span class="middle">修改密码</span>
            <i class="iconfont icon-you right"></i>
          </li>
          <router-link
            tag="li"
            to="/user/point-history"
          >
            <i class="iconfont icon-jifen left"></i>
            <span class="middle">积分记录</span>
            <i class="iconfont icon-you right"></i>
          </router-link>
          <router-link
            tag="li"
            to="/user/location-receive"
          >
            <i class="iconfont icon-dingwei left"></i>
            <span class="middle">收货地址</span>
            <i class="iconfont icon-you right"></i>
          </router-link>
        </ul>
        <the-button-submit
          @click="exitHandle"
          buttonText="退出登录"
        />
      </section>
    </article>
  </base-layout>
</template>

<script lang="ts">
// vue
import {Vue, Component} from 'vue-property-decorator';
import {State, Getter, Action, Mutation, namespace} from 'vuex-class';

// 组件
import BaseLayout from '@/layouts/base-layout.vue';
import TheButtonSubmit from '@/components/the-button-submit.vue';
import Badge from '@/components/base-badge.vue';
import {Toast} from 'vant';

// http
import {httpReq} from '@/utils/http-req';
import {
  userInfoReq,
  userInfoCompleteReq,
} from '@/serves/user';

// 工具
import {getLocalStorage} from '@/utils/local-storage';
import {exit, forgetPassword} from '@/utils/login-handle';

// typings
import {ShoppingCartCount} from '@/typings/store';

@Component({
  components: {
    BaseLayout,
    TheButtonSubmit,
    Badge,
  },
})
export default class LoginRegister extends Vue {
  // 会员卡号
  private cardNum: string = '';
  // 会员等级
  private level: string = '';
  // 累计积分
  private totalScore: number = 0;
  // 可用积分
  private ableScore: number = 0;

  @State('orderCount')
  private orderCount!: ShoppingCartCount;

  // 查询订单数量
  @Action('selectOrderCount')
  private selectOrderCount!: any;

  // 头像
  get headPortrait(): string {
    const localStorageData = getLocalStorage();
    const {wxUserInfo} = localStorageData;

    if (wxUserInfo) {
      return wxUserInfo.headerImg;
    } else {
      return '';
    }
  }

  private mounted() {
    this.userInfoSelect();
    // 查询订单数量
    this.selectOrderCount();
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
      Toast.loading('查询中...');
      httpRes.then(data => {
        Toast.clear();
        const {isMemberOrNot} = data;

        if (isMemberOrNot === 0) {
          exit();
          reject(data);
        } else {
          const {ableScore, totalScore, cardNum, level} = data.wxMemberInfo;
          this.ableScore = ableScore;
          this.totalScore = totalScore;
          this.cardNum = cardNum;
          this.level = level;
          window.localStorage.setItem('memberCard', cardNum);
          resolve(data);
        }
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }

  // 历史后退
  private historyBack() {
    this.$router.back();
  }

  // 退出账户
  private exitHandle() {
    exit();
  }

  // 修改密码
  private changePassword() {
    forgetPassword();
  }
}
</script>

<style lang="scss" scoped>
#user-home {
  display: grid;
  grid-template-rows: 25rem auto;
  overflow-y: scroll;
  overflow-x: hidden;
  height: 100%;
  width: 100%;

  & > header {
    display: grid;
    grid-template-rows: 5.5rem auto 5.5rem;
    background-image: url(~@/assets/images/bg.jpg);
    background-size: cover;
    background-repeat: no-repeat;

    & > .top {
      display: grid;
      grid-template-columns: 3rem auto;
      grid-auto-flow: column;
      align-items: center;
      padding: .9rem 1.5rem;
      background-color: transparent;

      // 返回
      & > .back {
        & > .iconfont {
          font-size: 2rem;
          color: #fff;
        }
      }

      // 标题
      & > .title {
        text-align: center;
        font-size: 2.3rem;
        color: #fff;
        padding-right: 3rem;
      }
    }

    & > .middle {
      display: grid;
      grid-row-gap: 1.5rem;
      align-content: center;
      justify-items: center;
      grid-auto-flow: row;

      & > img {
        border: .3rem solid #fff;
        border-radius: 3.75rem;
        height: 7.2rem;
        width: 7.2rem;
      }

      & > span {
        font-size: 1.8rem;
        color: #f5f5f5;
      }
    }

    & > .bottom {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      color: #ffffff;
      font-size: 1.8rem;
      background-color: rgba(0, 0, 0, .2);

      & > div {
        display: grid;
        align-items: center;
        justify-items: center;

        &:first-of-type {
          border-right: 1px solid rgba(255, 255, 255, .2);
        }
      }
    }
  }

  & > .content {
    display: grid;
    grid-template-rows: 8.3rem max-content max-content;
    grid-row-gap: 1.3rem;

    & > .order-menu {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      background-color: #fff;

      & > li {
        position: relative;
        display: grid;
        align-content: center;
        justify-content: center;
        justify-items: center;
        grid-row-gap: 1rem;
        font-size: 1.5rem;
        color: #333;

        & > .iconfont {
          font-size: 3rem;
          color: #999999;
        }
      }
    }

    & > .user-menu {
      display: grid;
      grid-auto-rows: 5.5rem;
      background-color: #fff;

      & > li {
        display: grid;
        grid-template-columns: 3.5rem auto max-content;
        align-items: center;
        padding: 0 1.6rem;
        border-bottom: 1px solid #f5f5f5;

        &:last-of-type {
          border-bottom: none;
        }

        & > .left {
          font-size: 2.4rem;
          color: #999999;
        }

        & > .middle {
          font-size: 1.5rem;
          color: #333333;
        }

        & > .right {
          font-size: 1.5rem;
          color: #cccccc;
        }
      }
    }
  }
}
</style>