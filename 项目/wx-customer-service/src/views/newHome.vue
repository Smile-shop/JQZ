<template>
  <section class="home">
    <div
      class="self-service"
      :class="{'self-service-add': servicerList.shopGroup === '1' && loginTicket }"
    >
      <div class="title">我的客服顾问</div>
      <!-- 未登录 -->
      <div class="no-login" v-if="!loginTicket">
        <div>
          <div class="tip">登录后享受更完善服务</div>
          <div class="login-btn">
            <button @click="goLogin">一键登录</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Watch } from 'vue-property-decorator';
import { State, Getter } from 'vuex-class';
import { Toast, Popup, Icon, Loading } from 'vant';
import CommonMixin from '../mixin/CommonMixin';
import { User, Servicer } from '../store/modules/home';
// const io = require('socket.io-client');

import { getUrlKey } from '../../static/functions';
import service from '../common/http';
import wx from 'weixin-js-sdk';

interface ListType {
  [index: number]: string | number;
}

@Component({
  components: {
    VanPopup: Popup,
    VanIcon: Icon,
    VanLoading: Loading,
  },
  mixins: [CommonMixin],
})
export default class Home extends Vue {
  @Getter('getClient') public client!: any;
  @Getter('getUser') private user!: User;

  private servicerList = {
    list: [],
    selfList: [],
    shopList: [],
    onlyService: '',
    shopGroup: '',
    isComplain: null,
  };
  // 弹出门店选择
  private showSelect: boolean = false;

  // 店名
  private shopName: string = '选择门店';

  // 登录ticket
  private loginTicket: any = '';
  // 样式标识
  private isSelects: boolean = false;
  // 是否显示loading
  private isLoading: boolean = true;
  // 节流时间
  private lastTime: number = Date.now();

  private created() {
    // 获取登录的ticket值
    if (localStorage.getItem('ticket_' + this.user.companyKey)) {
      this.loginTicket = localStorage.getItem('ticket_' + this.user.companyKey);
    }
  }
  private mounted() {
    // 测试，分享功能有冲突
    this.hiddenWXMenuFunction();
  }

  private hiddenWXMenuFunction() {
    const params = {
      companyKey: this.user.companyKey,
      url: window.location.href.split('#')[0],
      type: 'jsapi',
    };
    const headers = {
      openid: this.user.openid,
      companyKey: this.user.companyKey,
    };
    this.httpServer(
      {
        url: '/jop-web/wxinit/jsapi_ticketSign',
        baseUrl: this.httpBaseUrl,
        headers,
      },
      params
    ).then((res: any) => {
      if (res.data.code === 0) {
        const wxJsSDKRes = res.data.data;
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: wxJsSDKRes.appid, // 必填，公众号的唯一标识
          timestamp: wxJsSDKRes.timestamp, // 必填，生成签名的时间戳
          nonceStr: wxJsSDKRes.nonceStr, // 必填，生成签名的随机串
          signature: wxJsSDKRes.signature, // 必填，签名
          jsApiList: ['hideAllNonBaseMenuItem'], // 必填，需要使用的JS接口列表
        });
        wx.ready(() => {
          wx.hideAllNonBaseMenuItem();
        });
      } else {
        Toast({
          message: res.data.msg,
          duration: 1000,
        });
      }
    });
  }

  // 弹出门店选择列表
  private showPop() {
    this.showSelect = !this.showSelect;
    if (this.showSelect) {
      // 禁止底层内容滚动
      document.body.style.overflowY = 'hidden';
      document.documentElement.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'auto';
      document.documentElement.style.overflowY = 'auto';
    }
  }

  private loginParams() {
    // 存入本地登录所要的参数
    const userLoginInfo = {
      openid: getUrlKey('o'),
      companyKey: getUrlKey('c'),
      headerImg: getUrlKey('i') || require('../assets/admin-user.png'),
      page: getUrlKey('childPage') || getUrlKey('p') || 'login',
      register_openid: getUrlKey('shareId') || '',
      isRegister: getUrlKey('r') || '1',
      memberCard: getUrlKey('m') || '',
      phone: getUrlKey('s') || '',
      localUrl: `${
        this.httpBaseUrl
      }/wx-interface-web/wx/auth?companyKey=${getUrlKey(
        'c'
      )}&page=wx_chat_system`,
      transferPage: '',
    };
    localStorage.setItem('urlData', JSON.stringify(userLoginInfo));
  }
  // 登录
  private goLogin() {
    this.loginParams();
    window.location.href = `${this.httpBaseUrl}/login_register/#/?c=${this.user.companyKey}`;
  }

  // 跳转对话页面
  private async pickServicer(servicer: Servicer, isOnlyServe: string) {
    // let topic: string = '';
    // if (!servicer.topic) {
    //   const params = {
    //     openid: this.user.openid,
    //     companyKey: this.user.companyKey,
    //     accountId: servicer.accountId
    //   };
    //   topic = await this.publishTopic(params);
    // } else {
    //   topic = servicer.topic;
    // }
    this.$store.dispatch('setServicer', {
      accountId: servicer.accountId || '',
      kfHeadimgurl:
        servicer.kfHeadimgurl || require('../assets/admin-user.png'),
      kfAccount: servicer.kfAccount || '',
      nick: servicer.nick || '',
      isOnline: servicer.isOnlineKf || '1',
      kfPhone: servicer.kfPhone || '',
      clerkId: servicer.clerkId || '',
      shopName: servicer.shopName || '',
    });
    // 如果未登录 存入登录参数
    if (this.loginTicket) {
      this.loginParams();
    }
    this.$router.push({
      path: '/about',
      query: {
        shopName:
          this.servicerList.shopGroup === '0' ||
          this.servicerList.shopGroup === '1' ||
          this.servicerList.shopGroup === '2'
            ? servicer.shopName
            : '',
        nameOut:
          this.servicerList.shopGroup === '0' ||
          this.servicerList.shopGroup === '1' ||
          this.servicerList.shopGroup === '2'
            ? servicer.nameOut
            : '',
        isOnline: servicer.isOnlineKf || '',
        onlyService: isOnlyServe || '',
        accountId: servicer.accountId,
      },
    });
  }
}
</script>

<style lang="less">
.home {
  overflow: auto;
  // height: calc(100vh - 45px);
  height: calc(100vh);

  .title {
    font-family: PingFang-SC-Regular;
    font-size: 16px;
    color: #333333;
    height: 45px;
    line-height: 45px;
    padding-left: 12px;
    background-color: #ffffff;
    text-align: center;
  }
  .no-login {
    border-top: 1px solid #ddd;
    padding: 16px 0;
    background: #fff;
    height: calc(100vh - 45px - 32px);
    display: flex;
    justify-content: center;
    align-items: center;
    .tip {
      font-size: 14px;
      color: #999;
      font-family: PingFang-SC-Medium;
      text-align: center;
    }
    .login-btn {
      text-align: center;
      margin-top: 5px;
      button {
        width: 160px;
        height: 40px;
        outline: none;
        color: #fff;
        border: none;
        background-image: linear-gradient(#7ea2ff, #7ea2ff),
          linear-gradient(#f5f5f5, #f5f5f5);
        font-size: 16px;
        border-radius: 5px;
        letter-spacing: 2px;
      }
    }
  }
}
</style>
