<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
// vue
import { Vue, Component, Watch } from 'vue-property-decorator';
import { State, Getter, Action, Mutation, namespace } from 'vuex-class';
import { setMockCookie } from '@/utils/mockData';
import { getMailingMethodReq } from '@/serves/home';
import { httpReq } from '@/utils/http-req';
import { getLocalStorage } from '@/utils/local-storage';

// 工具
import fontResize from '@/utils/rem';

@Component({})
export default class App extends Vue {
  @State('pageStyle')
  private pageStyle!: any;
  @Mutation('setPostMethod')
  private setPostMethod!: any;

  private async created() {
    if (process.env.NODE_ENV !== 'production') {
      await this.testDataInsert();
    }
    if (!this.$route.fullPath.indexOf('/home/product-detail')) {
      this.getMailingMethodReq();
    }
    this.setState();
  }

  @Watch('pageStyle')
  private watchPageStyle(value) {
    if (value) {
      const { themeColor, title } = value;

      if (title) {
        document.title = title;
      }

      if (themeColor) {
        document.documentElement!.style.setProperty(
          '--color-theme',
          themeColor
        );
      }
    }
  }

  private async getMailingMethodReq() {
    const body = {};
    getMailingMethodReq.requestInit.body = JSON.stringify(body);
    const res = await httpReq(getMailingMethodReq);
    this.setPostMethod(res);
    return res;
  }

  private initPageStyle() {
    if (this.pageStyle) {
      this.watchPageStyle(this.pageStyle);
    }
  }

  private saveState() {
    const { path } = this.$route;

    // 在首页刷新的话初始化所有设置
    if (path != '/home/home') {
      localStorage.setItem('state', JSON.stringify(this.$store.state));
    } else {
      localStorage.removeItem('state');
    }
  }
  /*  */
  private setState() {
    const state = localStorage.getItem('state');
    const urlData = localStorage.getItem('urlData');
    if (state) {
      this.$store.replaceState({
        ...JSON.parse(state),
      });
    }
  }

  private mounted() {
    fontResize();
    this.jumpHistory();
    this.initPageStyle();
    window.onpagehide = () => {
      this.saveState();
    };
  }

  // 登录后跳回原来页面
  private jumpHistory() {
    const { wxUserInfo } = getLocalStorage();
    if (wxUserInfo!.childPage) {
      this.$router.push(wxUserInfo!.childPage);
      wxUserInfo!.childPage = null;
      window.localStorage.setItem('urlData', JSON.stringify(wxUserInfo));
    }
  }

  // 设置测试数据
  private async testDataInsert() {
    const urlData = {
      openid: 'oP6kNs2mVzaBPX1oZngGucyYPco4',
      companyKey: '01',
      headerImg:
        'http://thirdwx.qlogo.cn/mmopen/zshZlqTMgm6p8uzUVAZ6VKvBeIDyUaku22AFmMbk5fUrNmOrOianUu4BaPhicQhosWnm5UkAYIiaVXfOm5sibe4OQo2Vmah8nHWZ/132',
      page: null,
      register_openid: 'oP6kNs2mVzaBPX1oZngGucyYPco4',
      localUrl: window.location.origin.concat('/wx-mall/#/'),
      isRegister: '1',
      memberCard: '18673056556',
      subscribe: '0',
    };

    window.localStorage.setItem('urlData', JSON.stringify(urlData));
    window.localStorage.setItem('ticket_01', 'jqz210708b1da51f2c737531a51f');
    window.localStorage.setItem('memberCard', '18673056556');

    const res = await setMockCookie({
      openid: 'oP6kNs2mVzaBPX1oZngGucyYPco4',
      companyKey: '01',
    });
  }
}
</script>

<style type="scss">
@import url('~@/styles/var.scss');
@import url('~@/styles/common.scss');
</style>
