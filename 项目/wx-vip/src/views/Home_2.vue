<template>
  <div class="home-1">
    <div class="header">
      <div class="header-1" :style="{ 'background-color': data.themeColor }">
        <img src="../assets/home-1-bj-1.png" alt="背景图片" />
      </div>
      <div class="header-2"></div>

      <div class="title">
        <div>
          <img :src="data.logoImg" alt="logo" v-show="data.logoImg" />
        </div>
        <div>
          <i
            v-if="data.isShare === '1'"
            @click="$emit('showShare')"
            class="vip-v3-iconfont"
          >&#xe624;</i>
          <!-- <i class="vip-v3-iconfont">&#xe644;</i> -->
        </div>
      </div>

      <div class="header-content">
        <div class="login-content" v-if="loginOrNot && memberData.isMemberOrNot">
          <div class="user-photo">
            <div class="img">
              <img :src="data.headerImg" alt="user-photo" />
            </div>
            <div class="name">
              {{ memberData.phone | filtersPhone }}
              <i
                @click.stop="showQr"
                class="vip-v3-iconfont"
                :style="{ 'color': data.themeColor }"
              >&#xe62f;</i>
            </div>
            <div class="user-level" v-if="memberData.level">
              <i class="vip-v3-iconfont" :style="{ 'color': data.themeColor }">&#xe609;</i>
              {{ memberData.level }}
            </div>
          </div>
          <div class="number-totle">
            <!-- <div class="item" v-if="data.isTotalScore === '1'">
              累计积分：
              <span :style="{ 'color': data.themeColor }">{{ memberData.totalScore }}</span>
            </div>-->
            <div class="item">
              余额：
              <span
                :style="{ 'color': data.themeColor }"
              >{{ memberData.balance ? memberData.balance : 0}}</span>
            </div>
            <div class="col"></div>
            <div class="item" v-if="data.isAbleScore === '1'">
              可用积分：
              <span :style="{ 'color': data.themeColor }">{{ memberData.ableScore }}</span>
            </div>
          </div>
        </div>

        <div class="unlogin-content" v-else>
          <p :style="{ 'color': data.themeColor }">HI,您还未登录!</p>
          <div class="content-btn">
            <div
              class="login-btn"
              :style="{ 'color': data.themeColor }"
              @click="goLoginPage('login')"
            >登录</div>
            <div
              class="register-btn"
              v-show="data.isRegister === '1'"
              :style="{ 'background-color': data.themeColor }"
              @click="goLoginPage('register')"
            >注册</div>
          </div>
        </div>
      </div>

      <div class="package-link" @click="goPickPackage" v-if="data.isHaveCard === '1'">
        <div class="icon"></div>
        <div :style="{ 'color': data.themeColor }">我的会员卡包</div>
        <div class="icon">
          <i class="vip-v3-iconfont">&#xe60e;</i>
        </div>
      </div>

      <div class="menu-list">
        <div
          class="menu-item"
          v-for="item in data.viewFunction"
          :key="item.functionId"
          @click="menuPick(item.name)"
        >
          <div
            class="sub"
            :style="{ 'background-color': data.themeColor }"
            v-show="memberData.couponNum * 1 > 0 && `${item.name}`.includes('优惠券')"
          >{{ memberData.couponNum }}</div>
          <div class="name">
            <i
              class="vip-v3-iconfont"
              :style="{ 'color': data.themeColor }"
              v-if="`${item.name}`.includes('微保单')"
            >&#xe65b;</i>
            <i
              class="vip-v3-iconfont"
              :style="{ 'color': data.themeColor }"
              v-else-if="`${item.name}`.includes('会员声明')"
            >&#xe641;</i>
            <i
              class="vip-v3-iconfont"
              :style="{ 'color': data.themeColor }"
              v-else-if="`${item.name}`.includes('今日金价')"
            >&#xe6e6;</i>
            <i
              class="vip-v3-iconfont"
              :style="{ 'color': data.themeColor }"
              v-else-if="`${item.name}`.includes('附近门店')"
            >&#xe60d;</i>
            <i
              class="vip-v3-iconfont"
              :style="{ 'color': data.themeColor }"
              v-else-if="`${item.name}`.includes('系统设置')"
            >&#xe644;</i>
            <i
              class="vip-v3-iconfont"
              :style="{ 'color': data.themeColor }"
              v-else-if="`${item.name}`.includes('积分记录')"
            >&#xe731;</i>
            <i
              class="vip-v3-iconfont"
              :style="{ 'color': data.themeColor }"
              v-else-if="`${item.name}`.includes('满意度调研')"
            >&#xe676;</i>
            <i
              class="vip-v3-iconfont"
              :style="{ 'color': data.themeColor }"
              v-else-if="`${item.name}`.includes('资讯中心')"
            >&#xe60f;</i>
            <i
              class="vip-v3-iconfont"
              :style="{ 'color': data.themeColor }"
              v-else-if="`${item.name}`.includes('在线预约')"
            >&#xe74e;</i>
            <i
              class="vip-v3-iconfont"
              :style="{ 'color': data.themeColor }"
              v-else-if="`${item.name}`.includes('优惠券')"
            >&#xe672;</i>
            <i
              class="vip-v3-iconfont"
              :style="{ 'color': data.themeColor }"
              v-else-if="`${item.name}`.includes('今日签到')"
            >&#xe7c9;</i>
            <i
              class="vip-v3-iconfont"
              :style="{ 'color': data.themeColor }"
              v-else-if="`${item.name}`.includes('开心小游戏')"
            >&#xe613;</i>
            <i
              class="vip-v3-iconfont"
              :style="{ 'color': data.themeColor }"
              v-else-if="`${item.name}`.includes('我的礼品')"
            >&#xe6dc;</i>
            <i
              class="vip-v3-iconfont"
              :style="{ 'color': data.themeColor }"
              v-else-if="`${item.name}`.includes('微好礼')"
            >&#xe600;</i>
            <i
              class="vip-v3-iconfont"
              :style="{ 'color': data.themeColor }"
              v-else-if="`${item.name}`.includes('微商城')"
            >&#xe642;</i>
            <i class="vip-v3-iconfont" :style="{ 'color': data.themeColor }" v-else>&#xe615;</i>
            <p>{{ item.name }}</p>
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
          name: '优惠券',
          path: 'coupons/0',
        },
        {
          name: '积分记录',
          path: 'score-record',
        },
        {
          name: '微保单',
          path: 'consume-record',
        },
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
    // 跳转卡包页面
    goPickPackage() {
      window.location.href = `${this.httpUrl}/login_register/pick_package/?c=${this.urlData.companyKey}`;
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
    menuPick(menuName) {
      let menuData = this.menuList.find((p) => `${p.name}`.includes(menuName));
      if (menuData) {
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
      }
    },
    // 首页二维码展示
    showQr() {
      this.$refs.toast.showJsBarcode('#barcode_3', this.memberData.cardNum);
      this.$refs.toast.showQrCode(this.memberData.cardNum);
      this.Toastdata.toastShow = true;
    },
  },
};
</script>


<style lang="less" scoped>
.home-1 {
  width: 100%;
  .header {
    width: 100%;
    height: 255px;
    position: relative;
    .header-1 {
      width: 100%;
      height: 194.5px;
      img {
        width: 100%;
        height: 195px;
      }
    }
    .header-2 {
      width: 100%;
      height: 60px;
      background-color: white;
    }
    .title {
      position: absolute;
      left: 0;
      top: 0;
      width: 100vw;
      height: 55px;
      display: flex;
      align-items: center;
      div:first-child {
        flex-basis: 50%;
        flex-grow: 1;
        padding-left: 14px;
        // background-color: gold;
        padding-top: 40px;
        img {
          width: 110px;
          // height: 70px;
        }
      }
      div:last-child {
        width: 87.5px;
        text-align: right;
        .vip-v3-iconfont {
          font-size: 20px;
          color: white;
          padding-right: 15px;
        }
      }
    }
    .header-content {
      position: absolute;
      top: 55px;
      left: 0;
      width: 100vw;
      height: 200px;
      .unlogin-content {
        width: 350px;
        height: 154px;
        margin: 22px auto;
        // background-color: white;
        background: url(../assets/home-1-bg-2.png) 0 0 no-repeat;
        background-size: 100% 100%;
        box-shadow: 0 0 10px 0 rgba(6, 0, 1, 0.1);
        border-radius: 5px;
        text-align: center;
        p {
          font-size: 16px;
          padding-top: 42px;
        }
        .content-btn {
          display: flex;
          justify-content: center;
          div {
            width: 105px;
            height: 36px;
            line-height: 36px;
            font-size: 14px;
            border-radius: 18px;
            margin: 17.5px 10px;
          }
          .login-btn {
            background-color: white;
            border: solid 1px #eeeeee;
          }
          .register-btn {
            color: white;
          }
        }
      }
      .login-content {
        padding-top: 10px;
        .user-photo {
          width: 100%;
          height: 145px;
          .img {
            background-color: white;
            width: 80px;
            padding-top: 2px;
            text-align: center;
            border-radius: 40px;
            margin: 0 auto;
            img {
              width: 75px;
              border-radius: 37.5px;
              pointer-events: none;
            }
          }
          .name {
            text-align: center;
            color: #333333;
            font-size: 16px;
            box-shadow: 0px 0px 10px 0px rgba(6, 0, 1, 0.05);
            border-radius: 15px;
            height: 30px;
            line-height: 30px;
            width: 160px;
            margin: 0 auto;
            .vip-v3-iconfont {
              font-size: 19px;
            }
          }
          .user-level {
            font-size: 12px;
            color: #999999;
            text-align: center;
            padding-bottom: 6px;
            .vip-v3-iconfont {
              font-size: 17.5px;
            }
          }
        }
        .number-totle {
          width: 100vw;
          height: 45px;
          border-top: 1px solid #eeeeee;
          display: flex;
          align-items: center;
          .item {
            flex-basis: 45%;
            flex-grow: 1;
            text-align: center;
            font-size: 12px;
            color: #666666;
          }
          .col {
            width: 1px;
            height: 45px;
            border-left: 1px solid #eeeeee;
          }
        }
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
    .menu-list {
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      height: calc(100vh - 290px);
      .menu-item {
        width: calc((100vw - 3px) / 3);
        height: 100px;
        background-color: white;
        margin-top: 1px;
        position: relative;
        .sub {
          position: absolute;
          right: 10px;
          top: 9px;
          background-color: red;
          width: 15px;
          text-align: center;
          line-height: 15px;
          height: 15px;
          border-radius: 50%;
          color: white;
          font-size: 12px;
        }
        .name {
          text-align: center;
          padding-top: 12px;
          .vip-v3-iconfont {
            font-size: 30px;
          }
          p {
            font-size: 14px;
            color: #666666;
          }
        }
      }
      .menu-item:nth-of-type(3n + 2) {
        margin-left: 1px;
        margin-right: 1px;
      }
    }
  }
}
</style>


