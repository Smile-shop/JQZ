<template>
  <div>
    <div class="home">
      <div class="home-content" :style="{ 'background-color': data.themeColor }">
        <div class="title">
          <div class="logo">
            <img :src="data.logoImg" v-show="data.logoImg" alt="logo" />
          </div>
          <div class="actions">
            <i
              v-if="data.isShare === '1'"
              @click="$emit('showShare')"
              class="vip-v3-iconfont"
            >&#xe624;</i>
          </div>
        </div>

        <div class="user-photo" v-if="loginOrNot && memberData.isMemberOrNot">
          <div class="img">
            <img :src="data.headerImg" alt="user-photo" />
          </div>
          <div class="name">{{ memberData.phone | filtersPhone }}</div>
        </div>

        <div class="login" v-else>
          <div
            class="login-btn"
            :style="{ 'color': data.themeColor }"
            @click="goLoginPage('login')"
          >登录</div>
          <div
            class="register-btn"
            v-show="data.isRegister === '1'"
            @click="goLoginPage('register')"
          >注册</div>
        </div>
      </div>

      <div class="decript" :style="{ 'background-color': data.themeColor }">
        <img src="../assets/v3-vip-tb.png" alt="decript" />
        <div class="qr" @click.stop="showQr">
          <i class="vip-v3-iconfont" :style="{ 'color': data.themeColor }">&#xe62f;</i>
        </div>
      </div>

      <div
        class="package-link van-hairline--bottom"
        @click="goPickPackage"
        v-if="data.isHaveCard === '1'"
      >
        <div class="icon"></div>
        <div :style="{ 'color': data.themeColor }">我的会员卡包</div>
        <div class="icon">
          <i class="vip-v3-iconfont">&#xe60e;</i>
        </div>
      </div>

      <div class="user-state" v-if="loginOrNot && memberData.isMemberOrNot">
        <div class="state-item">
          <div class="p1">会员等级</div>
          <div class="p2" :style="{ 'color': data.themeColor }">{{ memberData.level }}</div>
        </div>
        <!-- <div class="state-item" v-if="data.isTotalScore === '1'">
          <div class="p1">累计积分</div>
          <div class="p2" :style="{ 'color': data.themeColor }">{{ memberData.totalScore }}</div>
        </div>-->
        <div class="state-item">
          <div class="p1">余额</div>
          <div
            class="p2"
            :style="{ 'color': data.themeColor }"
          >{{ memberData.balance ? memberData.balance : 0 }}</div>
        </div>
        <div class="state-item" v-if="data.isAbleScore === '1'">
          <div class="p1">可用积分</div>
          <div class="p2" :style="{ 'color': data.themeColor }">{{ memberData.ableScore }}</div>
        </div>
      </div>

      <div class="user-state">
        <div class="state-item" @click="menuPick('coupons/0')" v-if="filtersMenuTab('优惠券')">
          <div class="p-icon">
            <i class="vip-v3-iconfont" :style="{ 'color': data.themeColor }">&#xe672;</i>
          </div>
          <div
            class="sub-right-top"
            :style="{ 'background-color': data.themeColor }"
            v-show="memberData.couponNum * 1 > 0"
          >{{ memberData.couponNum }}</div>
          <div class="p-icon-name">优惠券</div>
        </div>
        <div class="state-item" @click="menuPick('score-record')" v-if="filtersMenuTab('积分记录')">
          <div class="p-icon">
            <i class="vip-v3-iconfont" :style="{ 'color': data.themeColor }">&#xe731;</i>
          </div>
          <div class="p-icon-name">积分记录</div>
        </div>
        <div class="state-item" @click="menuPick('consume-record')" v-if="filtersMenuTab('微保单')">
          <div class="p-icon">
            <i class="vip-v3-iconfont" :style="{ 'color': data.themeColor }">&#xe65b;</i>
          </div>
          <div class="p-icon-name">微保单</div>
        </div>
      </div>

      <div class="list">
        <div
          v-for="(item, index) in data.viewFunction"
          :key="index"
          @click="menuPick(item.name, 'list')"
          v-show="filtersMenuTab(item.name)"
        >
          <div class="item-pages" v-if="pageList(item)">
            <div class="item-header" :style="{ 'color': data.themeColor }">
              <i class="vip-v3-iconfont" v-if="item.name === '会员声明'">&#xe641;</i>
              <i class="vip-v3-iconfont" v-if="item.name === '附近门店'">&#xe60d;</i>
              <i class="vip-v3-iconfont" v-if="item.name === '今日金价'">&#xe6e6;</i>
              <i class="vip-v3-iconfont" v-if="item.name === '在线预约'">&#xe74e;</i>
              <i class="vip-v3-iconfont" v-if="item.name === '系统设置'">&#xe644;</i>
              <i class="vip-v3-iconfont" v-if="item.name === '微好礼'">&#xe600;</i>
              <i class="vip-v3-iconfont" v-if="item.name === '微商城'">&#xe642;</i>
              <i class="vip-v3-iconfont" v-if="item.name === '满意度调研'">&#xe676;</i>
              <i class="vip-v3-iconfont" v-if="item.name === '资讯中心'">&#xe7c9;</i>
              <i class="vip-v3-iconfont" v-if="item.name === '今日签到'">&#xe60f;</i>
              <i class="vip-v3-iconfont" v-if="item.name === '开心小游戏'">&#xe613;</i>
              <i class="vip-v3-iconfont" v-if="item.name === '我的礼品'">&#xe6dc;</i>
            </div>
            <div class="item-body">{{ item.name }}</div>
            <div class="item-footer">
              <i class="vip-v3-iconfont">&#xe60e;</i>
            </div>
          </div>
        </div>
      </div>

      <Toast
        :type="3"
        ref="toast"
        :qrcodeImg="memberData.qrcodeImg"
        :model="Toastdata.toastShow"
        :title="'会员条码'"
        :data="data"
        @close="Toastdata.toastShow = false"
      ></Toast>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Toast from '../components/Toast';
export default {
  props: ['ignoreMenuList'],
  components: {
    Toast,
  },
  data() {
    return {
      menuList: [
        {
          name: '会员声明',
          path: 'mber-state',
        },
        {
          name: '附近门店',
          path: 'near-stores',
        },
        {
          name: '今日金价',
          path: 'gold-price',
        },
        {
          name: '在线预约',
          path: 'app-online',
        },
        {
          name: '系统设置',
          path: 'sys-set',
        },
        {
          name: '微好礼',
          path: '微好礼',
        },
        {
          name: '微商城',
          path: '微商城',
        },
        {
          name: '满意度调研',
          path: 'evaluation',
        },
        {
          name: '资讯中心',
          path: 'consult',
        },
        {
          name: '今日签到',
          path: 'sign',
        },
        {
          name: '开心小游戏',
          path: '开心小游戏',
        },
        {
          name: '我的礼品',
          path: 'gift',
        },
      ],
      Toastdata: {
        toastShow: false,
        phone: '',
      },
      loginOrNot: null,
    };
  },
  computed: {
    ...mapState({
      urlData: (state) => state.urlData,
      memberData: (state) => state.homeMemberData,
      data: (state) => state.homePageData,
    }),
  },
  filters: {
    filtersPhone(data) {
      if (data) {
        let newPhone = `${data}`.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        return newPhone;
      }
    },
  },
  mounted() {
    const ticket = window.localStorage.getItem(
      `ticket_${this.urlData.companyKey}`
    );
    this.loginOrNot = ticket;
  },
  methods: {
    // 是否在列表里边
    pageList(item) {
      return this.menuList.findIndex((p) => p.name === item.name) > -1;
    },
    // 跳转卡包页面
    goPickPackage() {
      window.location.href = `${this.httpUrl}/login_register/pick_package/?c=${this.urlData.companyKey}`;
    },
    filtersMenuTab(name) {
      console.log('这里的问题', name);
      console.log('总数据', this.data.viewFunction);
      return (
        this.data.viewFunction.findIndex((p) => p.name.includes(name)) > -1
      );
    },
    setLocalStorage(data) {
      const urlData = {
        openid: this.urlData.openid,
        companyKey: this.urlData.companyKey,
        register_openid: this.urlData.register_openid,
        localUrl: `${this.httpUrl}/wx_member/index.html#/home`,
        isRegister: this.data.isRegister,
        page: data,
        headerImg: this.urlData.headerImg,
        memberCard: this.urlData.memberCard,
        phone: this.urlData.phone,
      };
      window.localStorage.setItem('urlData', JSON.stringify(urlData));
    },
    goLoginPage: async function (data) {
      const res = await this.$store.dispatch('getHomePageRegisterInfo', {
        openid: this.urlData.openid,
        companyKey: this.urlData.companyKey,
      });
      if (res.data.code === 0) {
        const resData = res.data.data;
        // 判断是否为会员
        if (resData.isMember === '1') {
          // 判断是否为卡包注册
          if (resData.registType === '0') {
            // 判断是否有卡包
            if (resData.isHaveCard === '1' && resData.ticket) {
              window.localStorage.setItem(
                `ticket_${this.urlData.companyKey}`,
                resData.ticket
              );
              this.loginOrNot = resData.ticket;
            } else {
              window.location.href = resData.openCardUrl;
            }
          } else {
            this.setLocalStorage(data);
            window.location.href = `${this.httpUrl}/login_register/#/?c=${this.urlData.companyKey}`;
          }
        } else {
          if (resData.registType === '0') {
            window.location.href = resData.openCardUrl;
          } else {
            this.setLocalStorage(data);
            window.location.href = `${this.httpUrl}/login_register/#/?c=${this.urlData.companyKey}`;
          }
        }
      } else {
        this.$toast({
          message: res.data.msg,
          duration: 1000,
        });
      }
    },
    goPage(path) {
      if (path === '微商城') {
        window.location.href = `${this.httpUrl}/wx-interface-web/wx/auth?companyKey=${this.urlData.companyKey}&page=wx_mall`;
      } else if (path === '微好礼') {
        window.location.href = `${this.httpUrl}/wx-interface-web/wx/auth?companyKey=${this.urlData.companyKey}&page=wx_point_mall`;
      } else if (path === '开心小游戏') {
        window.location.href = `${this.httpUrl}/wx-interface-web/wx/auth?companyKey=${this.urlData.companyKey}&page=wx_game_group`;
      } else if (path === 'gift') {
        this.setLocalStorage(path);
        window.location.href = `${
          this.httpUrl
        }/wx_member/gift/index.html#/gift?c=${
          this.urlData.companyKey
        }${Date.now()}`;
      } else {
        this.$router.push({
          path: `/${path}`,
        });
      }
    },
    // 判断是否需要登陆或注册
    isLoginOrRegister(data) {
      return {
        isTrue:
          this.ignoreMenuList.includes(data) ||
          (this.memberData.isMemberOrNot && this.loginOrNot),
        path:
          this.data.isRegister === '1' && !this.memberData.isMemberOrNot
            ? 'register'
            : `${!this.loginOrNot ? 'login' : data}`,
      };
    },
    menuPick(menuName, isList) {
      let menuData = isList
        ? this.menuList.find((p) => `${p.name}`.includes(menuName))
        : { path: menuName };
      // 排除不需要登陆注册的页面
      let goWhere = this.isLoginOrRegister(menuData.path);
      if (goWhere.isTrue) {
        this.goPage(menuData.path);
      } else {
        this.$dialog
          .confirm({
            title: '温馨提示',
            message:
              goWhere.path === 'login'
                ? '您还未登录哦，是否确定去登录？'
                : '您还不是会员哦，是否确定去注册？',
          })
          .then(() => {
            this.goLoginPage(goWhere.path);
          })
          .catch(() => {
            // 弹窗关闭
          });
      }
    },
    // 首页二维码展示
    showQr() {
      if (this.memberData.cardNum) {
        this.$refs.toast.showJsBarcode('#barcode_3', this.memberData.cardNum);
        this.$refs.toast.showQrCode(this.memberData.cardNum);
        this.Toastdata.toastShow = true;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.home {
  width: 100vw;
  .home-content {
    height: 160px;
    .title {
      height: 67.5px;
      display: flex;
      .logo {
        flex-basis: 50%;
        flex-grow: 1;
        padding: 10px 20px;
        img {
          width: 110px;
          // height: 70px;
        }
      }
      .actions {
        height: 67.5px;
        line-height: 60px;
        width: 60px;
        text-align: center;
        font-size: 20px;
        color: white;
      }
    }
    .user-photo {
      width: 100%;
      .img {
        background-color: white;
        width: 60px;
        text-align: center;
        padding-top: 3px;
        border-radius: 30px;
        height: 58px;
        margin: 0 auto;
        img {
          width: 55px;
          border-radius: 27.5px;
          pointer-events: none;
        }
      }
      .name {
        text-align: center;
        color: white;
        font-size: 14px;
        padding-top: 6px;
      }
    }
    .login {
      width: 100%;
      padding-top: 25px;
      color: white;
      text-align: center;
      div {
        display: inline-block;
        width: 105px;
        height: 36px;
        line-height: 36px;
        font-size: 16px;
        border-radius: 18px;
      }
      .login-btn {
        background-color: white;
      }
      .register-btn {
        background-color: #ff8d47;
      }
    }
  }
  .decript {
    width: 100%;
    height: 50px;
    position: relative;
    img {
      width: 100%;
      height: 38.5px;
      position: absolute;
      bottom: 0px;
      pointer-events: none;
    }
    .qr {
      width: 30px;
      height: 30px;
      background-color: white;
      border-radius: 15px;
      text-align: center;
      line-height: 30px;
      position: absolute;
      top: 15px;
      left: calc((100vw - 30px) / 2);
      font-size: 15px;
    }
  }

  .package-link {
    background-color: white;
    margin-top: 9px;
    display: flex;
    align-items: center;
    height: 45px;
    justify-content: space-between;
    .icon {
      width: 30px;
      text-align: center;
    }
  }

  .user-state {
    width: 100%;
    background-color: white;
    display: flex;
    margin-bottom: 10px;
    .state-item {
      flex-basis: 30%;
      flex-grow: 1;
      text-align: center;
      position: relative;
      .sub-right-top {
        position: absolute;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        line-height: 15px;
        text-align: center;
        color: white;
        top: 5px;
        right: 25px;
      }
      .p1 {
        font-size: 14px;
        padding: 6px;
        color: #858585;
      }
      .p2 {
        font-size: 16px;
        padding-bottom: 12px;
      }
      .p-icon {
        font-size: 30px;
        padding: 12px;
      }
      .p-icon-name {
        font-size: 15px;
        color: #858585;
        padding-bottom: 15px;
      }
    }
  }
  .columns {
    width: 100%;
    height: 10px;
  }
  .list {
    width: 100%;
  }
  .item-pages {
    background-color: white;
    margin-top: 1px;
    height: 40px;
    display: flex;
    align-items: center;
    .item-header {
      width: 50px;
      text-align: center;
      font-size: 25px;
    }
    .item-body {
      flex-basis: 50%;
      flex-grow: 1;
      color: #858585;
      font-size: 14px;
    }
    .item-footer {
      width: 40px;
      text-align: center;
      color: #858585;
      font-size: 14px;
    }
  }
  .toast-container {
    color: red;
    text-align: center;
    width: 90vw;
    height: 60vh;
  }
}
</style>

