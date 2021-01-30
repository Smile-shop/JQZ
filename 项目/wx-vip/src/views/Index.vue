<template>
  <section class="app-main">
    <!-- <header v-show="headerInfo.hasNav">
      <Header :navTitle="headerInfo.titleName" :navTitleRight="headerInfo.rightTitle" :rightUrl="headerInfo.rightUrl"></Header>
    </header> -->
    <component @showShare="shareShow = true" v-if="$route.name === 'Index'" class="app-body" :is="currentTabComponent" :ignoreMenuList="ignoreMenuList"></component>
    <keep-alive v-else include="ConsumeRecord,Gift,LinkCoupon">
      <router-view class="app-body"></router-view>
    </keep-alive>
    <!-- <footer class="app-footer">技术支持：金千枝数字化技术中心</footer> -->
    <footer class="app-footer">金千枝平台提供技术支持</footer>
    <div class="go-share-img" v-show="shareShow" @click="shareShow = false">
      <img src="../assets/guide.png" alt="去分享">
    </div>
    <van-popup v-model="indexPoupShow" :close-on-popstate="true" :close-on-click-overlay="false" style="background-color:transparent">
      <div class="poups-content">
        <div class="update-icon">
          <img src="../assets/index-infor.png" alt="去分享">
        </div>
        <div class="update-content">
          <div class="info">您有资料需要完善</div>
          <div class="info-zp" v-if="indexPoupScore">完善资料将获赠{{indexPoupScore}}积分</div>
          <div v-else class="placeholder-div"></div>
          <div class="btn">
            <div @click="closePoup">下次再填</div>
            <div @click="goPage">去完善资料</div>
          </div>
        </div>
      </div>
    </van-popup>
    <div class="request-poup-container" v-if="requestPoupShow">
      <div class="req-poups-content">
        <div class="req-poups-img">
          <img src="../assets/request-poups-infor.png" alt="去分享">
        </div>
        <div class="req-poups-info">抱歉，网页出现异常</div>
        <div class="req-poups-btn">
          <div class="btn-back-home btn" @click="goHome">
            <i class="vip-v3-iconfont">&#xe628;</i>
            <span style="padding-left:8px">返回首页</span>
          </div>
          <div class="btn-reload btn" @click="reLoadPage">
            <i class="vip-v3-iconfont">&#xe62a;</i>
            <span style="padding-left:12px">重试</span>
          </div>
        </div>
      </div>
    </div>
    <div 
      v-if="wxChatShow"
      class="go-servicer-icon" 
      ref="dragDiv"
      :style="{'background-color': themeColor, 'left': `${dragDiv.left}px`, 'top': `${dragDiv.top}px`}" 
      @touchstart="appTouchStart" 
      @touchmove="appTouchMove" 
      @touchend="appTouchEnd" 
      @click="goWxChat">
      <img src="~@/assets/servicer-icon.png" alt="service">
      客服
      <!-- <div class="close-icon" :style="{'border': `1px solid ${themeColor}`}">
        <i class="vip-v3-iconfont" :style="{'color': themeColor}" @click.stop.prevent="wxChatShow = false">&#xe606;</i>
      </div> -->
    </div>
  </section>
</template>

<script>
import Home_1 from './Home_1';
import Home_2 from './Home_2';
import { mapState } from 'vuex';
import { Icon } from 'vant';
export default {
  components: {
    Home_1,
    Home_2,
    VanIcon: Icon
  },
  computed: {
    currentTabComponent() {
      return `Home_${this.homePageData.pageStyle}`;
    },
    headerInfo() {
      return this.$route.meta;
    },
    ...mapState({
      urlData: state => state.urlData,
      homeMemberData: state => state.homeMemberData,
      homePageData: state => state.homePageData,
      indexPoupShow: state => state.indexPoupShow,
      indexPoupScore: state => state.indexPoupScore,
      requestPoup: state => state.requestPoupShow,
      isOpenService: state => state.homePageData.isOpenService,
      themeColor: state => state.themeColor
    })
  },
  watch: {
    isOpenService(val) {
      this.wxChatShow = val === '1';
      this.$nextTick(() => {
        this.init();
      })
    },
    requestPoup: {
      handler: function(val) {
        this.requestPoupShow = val;
      },
      immediate: true
    }
  },
  data() {
    return {
      shareShow: false,
      ignoreMenuList: ['share', 'mber-state', 'near-stores', 'gold-price', 'consult', 'gift', '微好礼', '微商城', '开心小游戏'],
      isDragging: false,
      dragPosition: {
        touchPoX: 0,
        touchPxY: 0
      },
      dragDiv: {
        left: 0,
        top: 0
      },
      pageShowInfo: {
        maxWidth: 375,
        maxHeight: 667
      },
      touchStartPosition: null,
      isTouch: false,
      wxChatShow: false,
      requestPoupShow: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    })
  },
  methods: {
    init() {
      if (this.wxChatShow) {
        this.pageShowInfo = {
          maxWidth: document.body.clientWidth,
          maxHeight: document.body.clientHeight,
          divWith: this.$refs.dragDiv.offsetWidth,
          divHeight: this.$refs.dragDiv.offsetHeight
        }
        this.dragDiv = {
          left: document.body.clientWidth - this.$refs.dragDiv.offsetWidth,
          top: document.body.clientHeight - this.$refs.dragDiv.offsetHeight - 145
        }
      }
    },
    closePoup() {
      this.$store.commit('closeIndexPoup', {
        isShow: false,
        score: 0
      });
    },
    goPage() {
      this.closePoup();
      this.$router.push({
        path: '/per-info',
        query: {
          type: '2'
        }
      })
    },
    goWxChat() {
      window.location.href = `${this.httpUrl}/wx-interface-web/wx/auth?companyKey=${this.urlData.companyKey}&page=wx_chat_system`;
    },
    appTouchStart(e) {
      this.isTouch = false;
      if (e.type === 'touchstart') {
        const touches = e.touches[0];
        this.touchStartPosition = touches;
        this.dragPosition = {
          touchPxY: touches.clientY - this.dragDiv.top,
          touchPoX: touches.clientX - this.dragDiv.left
        }
      }
    },
    appTouchMove(e) {
      if (e.type === 'touchmove') {
        const touches = e.touches[0];
        // 判断是否为拖拽，是则直接阻止，否则为点击
        if (this.touchStartPosition && this.touchStartPosition.clientY !== touches.clientY) {
          this.isTouch = true;
          e.preventDefault();
        }
        const left = touches.clientX - this.dragPosition.touchPoX;
        const top = touches.clientY - this.dragPosition.touchPxY;
        if (left < 0) {
          this.dragDiv.left = 0;
        } else if (left > (this.pageShowInfo.maxWidth - this.pageShowInfo.divWith)) {
          this.dragDiv.left = this.pageShowInfo.maxWidth - this.pageShowInfo.divWith;
        } else {
          this.dragDiv.left = touches.clientX - this.dragPosition.touchPoX;
        }
        if (top < 0) {
          this.dragDiv.top = 0;
        } else if (top > (this.pageShowInfo.maxHeight - this.pageShowInfo.divHeight)) {
          this.dragDiv.top = this.pageShowInfo.maxHeight - this.pageShowInfo.divHeight;
        } else {
          this.dragDiv.top = touches.clientY - this.dragPosition.touchPxY;
        }
      }
    },
    appTouchEnd(e) {
      if (this.isTouch) {
        e.preventDefault();
        this.isTouch = false;
      }
      if (e.type === 'touchend') {
        this.dragPosition = {
          touchPoX: 0,
          touchPxY: 0
        }
      }
    },
    goHome() {
      this.$store.commit('requestIndexPoup', false);
      this.$router.replace({
        path: '/home'
      })
    },
    reLoadPage() {
      location.reload();
    }
  }
}
</script>

<style lang="less" scoped>
.app-main {
  width: 100%;
  height: 100vh;
  background-color: #F5F5F5;
  display: flex;
  flex-direction: column;
  .app-body {
    flex-grow: 1;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    -webkit-overflow-scrolling: touch;
    overflow: auto;
  }
  .app-footer {
    color: #CCCCCC;
    text-align: center;
    height: 25px;
    line-height: 25px;
    font-size: 12px;
  }
  .go-share-img {
    position: fixed;
    top: 0;
    background-color: black;
    width: 100vw;
    height: 100vh;
    opacity: .8;
    z-index: 3000;
    img {
      float: right;
      width: 160px;
    }
  }
  .poups-content {
    width: 315px;
    height: 190px;
    position: relative;
    .update-icon {
      position: absolute;
      left: 117px;
      width: 80px;
      height: 80px;
      background-color: #ffffff;
      border-radius: 50%;
      z-index: 4001;
      font-size: 0;
      text-align: center;
    }
    .update-content {
      position: absolute;
      top: 40px;
      width: 100%;
      height: 150px;
      background-color: #ffffff;
      border-radius: 5px;
      z-index: 4000;
      .info {
        margin-top: 50px;
        text-align: center;
        font-size: 16px;
        color: #333333;
      }
      .info-zp {
        font-size: 12px;
        text-align: center;
        color: #d54212;
        padding: 16px 0 7px 0;
      }
      .placeholder-div {
        height: 40px;
      }
      .btn {
        height: 38px;
        display: flex;
        font-size: 16px;
        div {
          flex-grow: 1;
          text-align: center;
          height: 38px;
          line-height: 38px;
        }
        div:last-child {
          color: #d54212;
        }
      }
    }
  }
  .request-poup-container {
    position: fixed;
    width: 100vw;
    height: 100vh;
    z-index: 8000;
    background-color: rgba(0, 0, 0, .5);
    display: flex;
    align-items: center;
    justify-content: center;
    .req-poups-content {
      width: 257px;
      background-color: #fff;
      border-radius: 8px;
      padding: 15px 0 25px 0;
      .req-poups-img {
        width: 162px;
        height: 105px;
        margin: 0 auto;
        text-align: center;
        > img {
          width: 100%;
          height: 100%;
        }
      }
      .req-poups-info {
        font-size: 12px;
        color: #BEC4CE;
        text-align: center;
      }
      .req-poups-btn {
        display: flex;
        justify-content: space-around;
        margin-top: 20px;
        .btn {
          width: 100px;
          height: 28px;
          line-height: 28px;
          border-radius: 14px;
          text-align: center;
          font-size: 12px;
          font-weight: 400;
          > i {
            font-size: 10px;
          }
        }
        .btn-back-home {
          border: 1px solid #BEC4CE;
          color: #BEC4CE;
        }
        .btn-reload {
          border: 1px solid #6595F6;
          color: #6595F6;
        }
      }
    }
  }
  .go-servicer-icon {
    position: absolute;
    z-index: 10000;
    width: 55px;
    height: 40px;
    border-radius: 45px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 14px;
    font-weight: 400;
    color: #ffffff;
    padding: 0 15px;
    img {
      width: 20px;
    }
    .close-icon {
      position: absolute;
      right: 0;
      top: -8px;
      background-color: #ffffff;
      width: 16px;
      height: 16px;
      line-height: 16px;
      border-radius: 50%;
      text-align: center;
    }
  }
}
</style>
