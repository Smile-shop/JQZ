<template>
  <div class="tiger-index">
    <div class="balloon-wrapper">
      <i class="balloon" />
      <i class="balloon" />
    </div>
    <music-icon />
    <div class="top" v-show="theme">
      <i class="iconfont icon-back" v-show="backIcon" @click="back">&#xe6a4;</i>
      <p class="head-title">{{barTitle}}</p>
      <i
        v-show="shareData.isShare ==='1'"
        class="iconfont icon-share"
        @click="share"
      >&#xe603;</i>
    </div>
    <Banner :background="bannerImage" :logo="logoImage" />
    <Machine v-if="hackReset" :share-data="shareData" @refresh="refreshMachinePage" />
    <advertising-swiper
      v-show="Object.keys(scheme).length && gameInfo.isScheme === '1'"
      :silde-content="scheme.advertistings"
    />
    <Recommendation v-show="gameInfo.isScheme === '1'" :detail="scheme" />
    <Error :show.sync="errorShow" :no-member="isMember" :msg="errorMessage" />
    <div class="sharelayer" v-show="sharebox" @click="hide">
      <img src="@/assets/images/fenxiang.png" />
    </div>
  </div>
</template>

<script>
import URL from '@/config/url.js'
import { getLocalStorage } from '@/utils/local-storage'
import { EventBus } from '@/utils/event-bus'
import { mapMutations } from 'vuex'
import {
  querySchemeList,
  gameDetails,
  getwxToken,
  queryShare,
  shareSuccess,
  shareCounter,
  showCount
} from '@/axios/tiger'
import Banner from 'layout/Banner'
import Machine from 'layout/Machine'
import AdvertisingSwiper from 'layout/AdvertisingSwiper.vue'
import Recommendation from 'layout/Recommendation'
import Error from 'dialog/Error.vue'
import MusicIcon from 'layout/MusicIcon'
import { goBackIcon } from '@/utils/set-url-data.js'
export default {
  components: {
    Banner,
    Machine,
    AdvertisingSwiper,
    Recommendation,
    Error,
    MusicIcon
  },
  data() {
    return {
      backIcon: goBackIcon(), // 返回图标
      theme: true, // 游戏主题名称
      hackReset: true,
      gameInfo: {},
      logoImage: '',
      bannerImage: '',
      errorMessage: '',
      barTitle: '',
      isMember: false,
      errorShow: false,
      scheme: {},
      shareData: {},
      sharebox: false,
      userInfo: getLocalStorage()
    }
  },
  mounted() {
    EventBus.$on('netError', (flag, msg) => {
      this.errorMessage = msg
      this.errorShow = flag
    })

    // 接收非会员事件
    EventBus.$on('checkMember', flag => {
      this.errorShow = flag
      this.isMember = flag
    })
  },
  created() {
    this._getSchemeList()
    this._getToken()
    this._getShowCount()
  },
  methods: {
    ...mapMutations([
      'setgroupCode',
      'setinvalidImg',
      'setactiveInProducts',
      'setGameActiveData',
      'setWinning',
      'setPlaying',
      'setMarkBtnstatus',
      'setMarkLinkstatus',
      'setMarktext',
      'setmarkStatus',
      'setPumping',
      'setplaystatus',
      'setproductGift',
      'setJggShareInfo',
      'setJggOnlyMember'
    ]),
    back() {
      this.$router.go(-1)
    },
    share() {
      this.sharebox = true
    },
    hide() {
      this.sharebox = false
    },
    refreshMachinePage() {
      this.hackReset = false
      this.$nextTick(() => {
        this.hackReset = true
      })
    },
    loginCase() {
      const { tiket, memberCard } = getLocalStorage()
      if (tiket && memberCard) {
        this.isMember = true
      } else {
        this.isMember = false
      }
    },
    async _getShowCount() {
      const { id } = this.$route.query
      const activeId = id
      const options = {
        id: activeId
      }
      await showCount(options)
      await this.$loading.close()
    },
    async _getToken() {
      const { toDayShare } = this.gameInfo // 首次分享有效
      // if (toDayShare) {
      //   // 关闭分享增加次数的显示
      //   EventBus.$emit('closeShareInfo', true)
      //   return
      // }

      const { companyKey, id } = this.$route.query
      const sendCompanyKey = companyKey ? companyKey : this.userInfo.companyKey
      const activeId = id
      const options = {
        companyKey: sendCompanyKey,
        url: window.location.href.split('#')[0],
        type: 'jsapi'
      }
      const { data } = await getwxToken(options)

      // eslint-disable-next-line
      wx.config({
        debug: false,
        appId: data.appid,
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: data.signature,
        jsApiList: [
          'onMenuShareTimeline', // 获取 分享到朋友圈
          'onMenuShareAppMessage' // 获取 分享给朋友
        ]
      })

      const { data: shareData } = await queryShare({
        activeId: activeId
      })

      this.shareData = shareData

      // 发送一个全局分享数据事件，共享给抽奖后的分享次数显示
      EventBus.$emit('getShareInfo', this.shareData)

      const card = this.userInfo.memberCard

      // eslint-disable-next-line
      wx.ready(function() {
        // eslint-disable-next-line
        wx.onMenuShareTimeline({
          title: shareData.shareTitle,
          link: window.location.origin.concat(
            `/wx-interface-web/wx/auth?companyKey=${
              options.companyKey
            }&shareId=${
              shareData.activeId ? shareData.activeId : id
            }&page=${URL}`
          ),
          desc: shareData.shareContent,
          imgUrl: shareData.shareImg,
          success: function() {
            const options = {
              activeId: shareData.activeId ? shareData.activeId : id,
              memberCard: card
            }
            shareCounter(options).then(() => {
              // alert('恭喜你，分享成功！')
            })
            shareSuccess(options).then(() => {
              alert('恭喜你，分享成功！')
            })
          }
        })

        // eslint-disable-next-line
        wx.onMenuShareAppMessage({
          title: shareData.shareTitle,
          link: window.location.origin.concat(
            `/wx-interface-web/wx/auth?companyKey=${
              options.companyKey
            }&shareId=${
              shareData.activeId ? shareData.activeId : id
            }&page=${URL}`
          ),
          desc: shareData.shareContent,
          imgUrl: shareData.shareImg,
          success: function() {
            const options = {
              activeId: shareData.activeId ? shareData.activeId : id,
              memberCard: card
            }
            // shareCounter(options).then(result => {
            shareCounter(options).then(() => {
              // alert('恭喜你，分享成功！')
            })
            // shareSuccess(options).then(result => {
            shareSuccess(options).then(() => {
              alert('恭喜你，分享成功！')
              window.location.reload()
            })
          }
        })

        // eslint-disable-next-line
        // wx.updateTimelineShareData(wxShare)
        // eslint-disable-next-line
        // wx.updateAppMessageShareData(wxShare)
      })
    },
    async _getSchemeList(obj = {}) {
      const { id } = this.$route.query
      const activeId = id
      const options = {
        id: activeId,
        memberCard: this.userInfo.memberCard
      }
      const share = {
        activeId: activeId
      }
      const { data: schemes } = await querySchemeList(obj)
      const { data: gameInfo } = await gameDetails(options)
      const { data: shareInfo } = await queryShare(share)

     if (!gameInfo.toDayShare && Number(shareInfo.isShareAdd) === 1) {
        // 关闭分享增加次数的显示
        EventBus.$emit('closeShareInfo', true)
      }



      this.setGameActiveData(gameInfo)
      this.setinvalidImg(gameInfo.invalidImg)

      // 设置游戏主标题
      document.title = gameInfo.activityName

      // 设置导航标题
      this.barTitle = gameInfo.activeTheme
      this.bannerImage = gameInfo.imgName

      this.gameInfo = gameInfo

      this.logoImage = gameInfo.companyLogo

      sessionStorage.setItem('barTitle', this.barTitle)
      sessionStorage.setItem('bannerImage', this.bannerImage)
      sessionStorage.setItem('logoImage', this.logoImage)

      const ads =
        schemes &&
        schemes.filter(scheme => {
          if (scheme.id + '' === gameInfo.scheme) {
            return scheme
          }
        })[0]

      if (ads) this.scheme = ads
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'assets/rem.scss';
@keyframes updown {
  0% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0px);
  }
}
.head-title {
  display: inline-block;
  max-width: 260px;
  overflow: hidden;
  text-overflow:ellipsis;
	white-space:nowrap
}
.tiger-index {
  position: relative;
  max-width: 540px;
  min-width: 320px;
  margin: 0 auto;
  background: #fc4346;
  max-width: 100%;
  .balloon-wrapper {
    position: absolute;
    z-index: 999;
    i {
      position: absolute;
      display: inline-block;
      width: 4.9vw;
      height: 4.9vw;
      animation: updown 2s infinite alternate;
      background: url('../../components/layout/images/qiqiu.png') no-repeat center/100%;
    }
    & i:first-child {
      left: 8vw;
      top: 42vw;
    }

    & i:last-child {
      left: 79vw;
      top: 18vw;
    }
  }

  .sharelayer {
    width: 100vw;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    padding: 0;
    margin: 0;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9999;

    & > img {
      float: right;
      width: 13rem;
      height: 10rem;
      margin-top: 1rem;
      margin-right: 1rem;
    }
  }

  .top {
    width: 100vw;
    height: 12vw;
    line-height: 12vw;
    text-align: center;
    background: #fff;
    font-size: 4vw;
    padding-right: 8vw;

    .icon-back {
      color: #fe5362;
      font-weight: bold;
      width: 3vw;
      height: 4vw;
      font-size: 6vw;
      float: left;
      vertical-align: middle;
    }

    .icon-share {
      color: #fe5362;
      font-weight: bold;
      width: 3vw;
      height: 4vw;
      font-size: 6vw;
      float: right;
      vertical-align: middle;
    }
  }
}
</style>