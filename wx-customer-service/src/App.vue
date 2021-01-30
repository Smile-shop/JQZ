<!--
 * @Descripttion:
 * @version:
 * @Author: XJHong
 * @Date: 2020-04-22 18:10:17
 * @LastEditTime: 2020-06-20 09:13:44
-->
<template>
  <main v-on:click="globalClick">
    <!-- <Header></Header> -->
    <router-view/>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, Getter } from 'vuex-class';
import { User, Servicer } from './store/modules/home';
import { getUrlKey } from '../static/functions';
@Component({
})
export default class App extends Vue {
  @Getter('getClient') public client!: any;
  @Getter('getUser') private user!: User;
  private loginTicket: any = null;
  private created() {
    this.saveState();

    if (process.env.NODE_ENV !== 'production') {
      this.setTestData();
    } else {
      this.init();
    }
  }

  private setTestData() {
    const userInfo = {
      // openid: 'oYKLK1RxevmcyWhfRxmvhha_SX04' || 'oYKLK1ZjSbmwv7m9rkVrSOgD7Ing',
      openid: 'oYKLK1TTCbPg3MEvuOIJUQlo44lI' || 'oYKLK1ZjSbmwv7m9rkVrSOgD7Ing',
      companyKey: 'test01' ||  '01',
      headerImg: require('./assets/admin-user.png'),
      nick: '杨彬'
    };
    // 公众号消息推送模板消息点击进入聊天页面
    this.$store.dispatch('setUser', userInfo);
    // 调试需添加
    localStorage.setItem('ticket_test01', 'oYKLK1RxevmcyWhfRxmvhha_SX04');
  }

  // 保存state信息
  private saveState() {
    window.onpagehide = () => {
      window.sessionStorage.setItem('wxChatSystemState', JSON.stringify(this.$store.state));
    };
  }

  // 数据初始化
  private init() {
    const openid = getUrlKey('o');
    const companyKey = getUrlKey('c');
    const headerImg = getUrlKey('i');
    const nick = getUrlKey('n');

    if (companyKey) {
      const userInfo = {
        openid: getUrlKey('o'),
        companyKey: getUrlKey('c'),
        headerImg: getUrlKey('i'),
        nick: getUrlKey('n')
      };
      // 公众号消息推送模板消息点击进入聊天页面
      this.$store.dispatch('setUser', userInfo);
      const accountId = getUrlKey('p5');
      if (getUrlKey('childPage')) {
        this.$router.push({
          path: `/${getUrlKey('childPage')}`,
          query: {
            accountId,
            o: openid,
            c: companyKey,
            i: headerImg,
            n: nick,
            childPage: getUrlKey('childPage')
          }
        });
      }
    }
  }

  private mounted() {
    this.$store.dispatch('createClient');
    // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = () => {
      this.$store.dispatch('destoryClient');
    };
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        console.log('页面进入前台');
        this.$store.dispatch('stopOrStartPing', 'start');
      }
      if (document.visibilityState === 'hidden') {
        console.log('页面进入后台');
        this.$store.dispatch('stopOrStartPing', 'stop');
      }
    });
  }

  private globalClick() {
    this.$store.dispatch('resetActiveTime');
  }
}
</script>

<style lang="less">
html, body {
  margin: 0;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  main {
    width: 100vw;
    height: 100vh;
    background-color: #f2f2f2;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    -webkit-overflow-scrolling: touch;
    // overflow-scrolling: touch;
  }
}
</style>
