<template>
  <section>
    <MouseGame
      v-if="isPlayGame === 'startGame'"
      :isTryGame="isTryGame"
      :giftList="prizeList"
      :gameInfo="gameDetailsInfo"
      :gameDetail="ruleData"
      @gameOver="gameOver"
      :frame="frameList"
      :staticFrame="staticFrameList"
    ></MouseGame>
    <div
      class="cat-and-mouse"
      v-if="isPlayGame === 'endGame'"
      :style="{'overflow': rankListShow || isShowRule ? 'hidden' : 'auto'}"
    >
      <AppHeader>{{ruleData.activeTheme || '鼠年大翻身'}}</AppHeader>
      <div class="cat-mouse-body">
        <header class="header" :style="getHeaderAndFooterBackImg('header')">
          <div class="btn btn-1" @click="rankListShow = true">排行榜</div>
          <div class="btn btn-2" @click="isShowRule = true">规则</div>
          <div class="btn btn-3" @click="myGiftClick">我的</div>
          <!-- <div class="run-distance">
            <div class="time-distance">
              <div>成绩<div class="num">0m</div></div>
              <div>时间<div class="num">0.00s</div></div>
            </div>
          </div>-->
          <div class="vedio-content">
            <MusicBtn></MusicBtn>
          </div>
          <div
            class="game-time"
          >活动时间：{{ruleData.beginTime | timeKeep}}至{{ruleData.endTime | timeKeep}}</div>
          <div class="start-btn" @click="startGame(false)">开始赛猫</div>
          <div class="try-btn" @click="startGame(true)">试玩一下</div>
          <div class="game-info">
            今日还有
            <span class="info-point">{{ruleData.remainNum}}</span>
            次赛猫机会（每次消耗{{ruleData.consumeIntegral}}积分）
            <div class="member-info">
              <div>
                会员等级：
                <span class="info-point">{{ruleData.level}}</span>
              </div>
              <div>
                可用积分：
                <span class="info-point">{{ruleData.creditUsable}}</span>
              </div>
            </div>
          </div>
        </header>
        <footer class="footer" :style="getHeaderAndFooterBackImg('footer')">
          <div class="title"></div>
          <advertising-swiper
            v-show="Object.keys(scheme).length && ruleData.isScheme === '1'"
            :silde-content="scheme.advertistings"
          />
          <Recommendation v-show="ruleData.isScheme === '1'" :detail="scheme" />
        </footer>
      </div>
      <RankingList :visible.sync="rankListShow" :id="gameDetailsInfo.id"></RankingList>
      <Role :visible.sync="isShowRule" :gameDetail="ruleData" :prizeList="prizeList" />
      <winning-dialog
        :visible.sync="isWinningDialog"
        :lotteryInfo="lotteryInfo"
        :isMember="ruleData.userMember === '1'"
        @again="startGame(false)"
      />
      <Error :show.sync="errorShow" :msg="errorMessage" />
      <ShareQR :show.sync="qrcodeShow">
        <img v-if="showQrCode" :src="shareData.publicAccount" alt class="qrcode" />
      </ShareQR>
      <div class="loading" v-if="isLoading">
        <div class="donut"></div>
        <div class="loading-font">加载中...</div>
      </div>
    </div>
    <div class="init-game-content" :style="initGameBackground" v-if="isPlayGame === 'initGame'">
      <div class="time">
        <span>{{initGameCountDownData.time}}秒</span>
        <span @click="clearInitGameCountDown()">跳过</span>
      </div>
    </div>
  </section>
</template>

<script>
import RankingList from '@/components/ranking-list/RankingList.vue'
import AppHeader from '@/components/AppHeader.vue'
import MusicBtn from '@/components/MusicBtn.vue'
import MouseGame from './MouseGame.vue'
import Recommendation from 'layout/Recommendation'
import AdvertisingSwiper from 'layout/AdvertisingSwiper'
import Role from '@/views/common/rule/index.vue'
import WinningDialog from '@/components/winning-dialog/index.vue'
import Error from 'dialog/Error'
import ShareQR from 'dialog/ShareQR'

import {
  getGameDetails,
  getGameGiftList,
  gameStartDraw
} from '@/axios/cat-and-mouse.js'
import { querySchemeList, queryShare } from '@/axios/api.js'
import { getLocalStorage, setStorage } from '@/utils'
import baseUrl from '@/config/config.js'
import wxShareInit from '@/utils/share'
import { showCount } from '@/axios/tiger'
import { mapState, mapMutations } from 'vuex'

export default {
  components: {
    AppHeader,
    MusicBtn,
    MouseGame,
    AdvertisingSwiper,
    Recommendation,
    RankingList,
    Role,
    WinningDialog,
    Error,
    ShareQR
  },
  data() {
    return {
      isPlayGame: 'initGame',
      scheme: {}, // 推广
      staticFrameList: [],
      frameList: [],
      rankListShow: false,
      isShowRule: false,
      isWinningDialog: false,
      ruleData: {
        beginTime: '',
        endTime: '',
        serviceAddr: '',
        servicePhone: '',
        rule: '',
        isScheme: '1'
      },
      prizeList: [], // 奖品列表
      noPrizeList: [], // 安慰奖
      localData: null,
      gameDetailsInfo: {
        id: '',
        memberCard: ''
      },
      lotteryInfo: {},
      isTryGame: false,
      errorShow: false, // 报错显示
      errorMessage: '', // 报错信息
      initGameCountDownData: {
        time: 3,
        timer: null
      },
      qrcodeShow: false,
      shareData: {}, // 分享相关的数据
      subscribe: false, // 公众号订阅情况
      isGetGameDetailsing: true,
      isLoading: true,
      headerAndFooterBakImg: {
        header: null,
        footer: null
      }
    }
  },
  // watch: {
  //   isPlayGame: {
  //     handler: function(value) {
  //       if (value === 'initGame') {
  //         this.initGameCountDown();
  //       }
  //     },
  //     immediate: true
  //   }
  // },
  filters: {
    timeKeep(value) {
      return `${value}`.split(' ')[0]
    }
  },
  computed: {
    initGameBackground() {
      return {
        backgroundImage: `url(${this.ruleData.imgName})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }
    },
    showQrCode: function() {
      let result = false
      const { publicAccount } = this.shareData
      if (publicAccount && !this.subscribe) {
        result = true
      } else {
        result = false
      }

      return result
    }
  },
  created() {
    this.computeFrame(true)
    this.computeFrame(false)
  },
  mounted() {
    this._subscribeCase()
    const { ticket, memberCard, subscribe } = getLocalStorage()
    this.localData = {
      ticket,
      memberCard,
      subscribe
    }
    const { id, companyKey, isMember } = this.$route.query
    this.gameDetailsInfo.id = id
    this.gameDetailsInfo.memberCard = memberCard
    this.getGameDetails(id, memberCard)
    this.getGameGiftList(id)
    this._getShowCount()
  },
  methods: {
    ...mapMutations(['setflopShareInfo']),
    getBackgroundImg(list) {
      const _this = this
      Promise.all([_this.loadImg(list[0], 0), _this.loadImg(list[1], 1)])
        .then(function(values) {
          _this.isLoading = false
        })
        .catch(() => {
          this.$toast('加载失败，请退出重试！')
        })
    },
    loadImg(imgItem, type) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          if (type) {
            this.headerAndFooterBakImg.footer = img.src
          } else {
            this.headerAndFooterBakImg.header = img.src
          }
          resolve()
        }
        img.onerror = () => {
          reject()
        }
        img.src = require(`./assets/img/${imgItem}.png`)
      })
    },
    getHeaderAndFooterBackImg(type) {
      if (type === 'header') {
        return {
          backgroundImage: `url(${this.headerAndFooterBakImg.header})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%'
        }
      } else {
        return {
          backgroundImage: `url(${this.headerAndFooterBakImg.footer})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%'
        }
      }
    },
    async _getShowCount() {
      const { id } = this.$route.query
      const activeId = id
      const options = {
        id: activeId
      }
      await showCount(options)
    },
    _subscribeCase() {
      const { subscribe } = getLocalStorage()
      const num = Number(subscribe)
      if (num === 1) {
        this.subscribe = true
      }
    },
    // 微信分享功能
    doshare(body) {
      const params = {
        companyKey: body.companyKey,
        url: window.location.href.split('#')[0],
        type: 'jsapi'
      }
      let options = {}
      if (body) {
        options = {
          activeId: body.activityId,
          shareImg: body.shareImg,
          isShare: body.isShare,
          isMember: body.isMember,
          shareTitle: body.shareTitle,
          shareContent: body.shareContent
        }
      }
      wxShareInit(params, options)
    },
    initGameCountDown() {
      this.initGameCountDownData.timer = window.setInterval(() => {
        this.initGameCountDownData.time--
        if (this.initGameCountDownData.time < 0) {
          this.clearInitGameCountDown()
        }
      }, 1000)
    },
    clearInitGameCountDown() {
      if (this.initGameCountDownData.timer) {
        window.clearInterval(this.initGameCountDownData.timer)
      }
      this.initGameCountDownData.timer = null
      this.initGameCountDownData.time = 3
      this.isPlayGame = 'endGame'
      this.getBackgroundImg(['header', 'footer'])
    },
    gameOver(data) {
      console.log(data)
      if (!this.isTryGame) {
        if (data.gift && data.gift !== '未中奖') {
          const list = this.noPrizeList.concat(this.prizeList)
          this.lotteryInfo = {
            ...list.filter(item => item.jmpGiftCode === data.gift.giftCode)[0],
            ...data.gift,
            remainNum: this.ruleData.remainNum
          }
        }
        if (data.gift && data.gift.creditUsable) {
          this.ruleData.creditUsable = data.gift.creditUsable
        }
        this.isWinningDialog = true
      }
      this.isPlayGame = 'endGame'
    },
    myGiftClick() {
      if (!this.gameStatus) {
        let { wxUserInfo } = getLocalStorage()
        setStorage.save(JSON.stringify(wxUserInfo))
        window.location.href = `${baseUrl}/wx_member/gift/index.html#/gift`
      } else {
        this.$toast('抽奖正在进行中，请稍等')
      }
    },
    computeFrame(type) {
      const frameNum = type ? 41 : 3
      for (let i = 1; i < frameNum; i++) {
        const img = new Image()
        img.onload = () => {
          this.cacahImgList(type, i, img)
        }
        img.onerror = err => {
          console.log(err)
        }
        const pic_name = i > 9 ? `${i}` : `0${i}`
        img.src = require(`./assets/img/${
          type ? '' : 'static-'
        }frame/${pic_name}.png`)
      }
    },
    cacahImgList(type, index, img) {
      if (type) {
        this.frameList[index - 1] = img
      } else {
        this.staticFrameList[index - 1] = img
      }
    },
    alertError(text) {
      this.errorMessage = text
      this.errorShow = true
    },
    startGame(type) {
      if (this.isGetGameDetailsing) {
        this.$toast('游戏加载中，请稍后', 1000)
        return false
      }
      this.isTryGame = type
      if (!type) {
        const params = {
          id: this.gameDetailsInfo.id,
          memberCard: this.gameDetailsInfo.memberCard,
          isBackResult: 0
        }
        gameStartDraw(params)
          .then(res => {
            this.ruleData.remainNum = res.data.remainNum
            this.isPlayGame = 'startGame'
          })
          .catch(err => {
            // this.ruleData.remainNum = 0;
            // let text = '抽奖次数已用完，暂不能抽奖'
            if (err.includes('抽奖次数已用完')) {
              this.alertError('赛猫次数已用完，暂不能赛猫！')
            } else {
              this.alertError(err)
            }
            console.log(err)
          })
      } else {
        this.isPlayGame = 'startGame'
      }
    },
    async getGameDetails(id, memberCard) {
      this.isGetGameDetailsing = true
      const { subscribe } = getLocalStorage()
      const params = {
        memberCard,
        id
      }
      const { data } = await getGameDetails(params)
      this.ruleData = data
      if (this.ruleData.imgName) {
        this.isPlayGame = 'initGame'
        this.initGameCountDown()
      } else {
        this.clearInitGameCountDown()
      }
      this.getSchemeList(this.ruleData)

      this.doshare(this.ruleData)
      // this.qrcodeShow = Number(this.ruleData.isShare) === 1;
      const { data: shareData } = await queryShare({ activeId: id })
      this.isShare = shareData.isShare
      this.shareData = shareData
      if (!this.QRMark) {
        this.qrcodeShow =
          Number(subscribe) !== 1 &&
          Number(shareData.isLeadConcern) === 1 &&  // 是否引导关注 isLeadConcern
          Number(this.ruleData.isShare) === 1
      }

      if (data.toDayShare) {
        this.setflopShareInfo(false)
      }
      this.isGetGameDetailsing = false
    },
    getSchemeList(gameInfo) {
      querySchemeList({}).then(res => {
        const schemes = res.data
        const ads =
          schemes &&
          schemes.filter(scheme => {
            if (scheme.id + '' === gameInfo.scheme) {
              return scheme
            }
          })[0]

        console.log(ads, '这里是详情')
        if (ads) this.scheme = ads
      })
    },
    getGameGiftList(id) {
      getGameGiftList({ id }).then(res => {
        this.prizeList = res.data.noComfortPrize.sort(
          (a, b) => a.prizeDistance - b.prizeDistance
        )
        this.noPrizeList = res.data.comfortPrize
      })
    }
  },
  destroyed() {
    if (this.initGameCountDownData.timer) {
      window.clearInterval(this.initGameCountDownData.timer)
    }
  }
}
</script>

<style lang='scss' scoped>
.cat-and-mouse {
  -webkit-user-select: none; /*禁用手机浏览器的用户选择功能 */
  -moz-user-select: none;
  .cat-mouse-body {
    width: 100vw;
    height: calc(100vh - 44px);
    box-sizing: border-box;
    .header {
      position: relative;
      height: 668px;
      // background: url('~@/views/cat-and-mouse/assets/img/banner-header.jpg') no-repeat;
      // background-size: 100% 100%;
      .btn {
        position: absolute;
        width: 45px;
        height: 26px;
        line-height: 24px;
        text-align: center;
        color: #ffffff;
        border-top-right-radius: 13px;
        border-bottom-right-radius: 13px;
        font-size: 12px;
      }
      .btn-1 {
        background-color: #ec7627;
        top: 16px;
      }
      .btn-2 {
        background-color: #ff9d1b;
        top: 55px;
      }
      .btn-3 {
        background-color: #fe5362;
        top: 96px;
      }
      .run-distance {
        height: 51px;
        text-align: center;
        color: #ffffff;
        font-size: 24px;
        background-color: rgba(0, 0, 0, 0.4);
        .time-distance {
          width: 150px;
          height: 51px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          font-weight: bold;
          font-family: SourceHanSansCN-Bold;
          .num {
            font-size: 20px;
            font-weight: normal;
          }
        }
      }
      .vedio-content {
        position: absolute;
        right: 10px;
        top: 10px;
      }
      .game-time {
        color: #ffffff;
        font-size: 11px;
        position: absolute;
        top: 156px;
        width: 100vw;
        text-align: center;
      }
      .start-btn,
      .try-btn {
        position: absolute;
        left: calc(50vw - 127.5px);
        width: 255px;
        height: 42px;
        line-height: 42px;
        text-align: center;
        color: #ffffff;
        font-size: 22px;
        border-radius: 21px;
        box-shadow: inset 0px 7px 7px 0px rgba(255, 255, 255, 0.35),
          inset 0px -6px 5px 0px rgba(255, 255, 255, 0.35);
        background-blend-mode: normal, normal;
      }
      .start-btn {
        bottom: 155px;
        background-image: linear-gradient(0deg, #ff1337 0%, #fd875e 100%),
          linear-gradient(#ebc01e, #ebc01e);
      }
      .try-btn {
        bottom: 100px;
        background-image: linear-gradient(0deg, #febf28 0%, #fde19b 100%),
          linear-gradient(#ebc01e, #ebc01e);
      }
      .game-info {
        position: absolute;
        width: 100%;
        bottom: 45px;
        font-size: 12px;
        text-align: center;
        color: #ffffff;
        .info-point {
          color: #fdfc79;
        }
        .member-info {
          display: flex;
          justify-content: space-around;
          margin-top: 10px;
        }
      }
    }
    .footer {
      width: 100vw;
      // background: url('~@/views/cat-and-mouse/assets/img/bg-list.png');
      // background-size: 100% 100%;
      padding-top: 8px;
      .title {
        height: 20px;
        background-color: #ed776b;
      }
    }
  }
}
.init-game-content {
  width: 100vw;
  height: 100vh;
  .time {
    padding: 12px 15px;
    text-align: right;
    font-size: 14px;
    color: #ffffff;
    > span:first-child {
      font-size: 10px;
      padding-right: 5px;
    }
  }
}
.loading {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 8000;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  .donut {
    margin: calc(50vh - 25px) auto 0 auto;
    border: 4px solid rgba(0, 0, 0, 0.8);
    border-left-color: #ffffff;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: donut-spin 1.2s linear infinite;
  }
  .loading-font {
    font-size: 14px;
    color: #ffffff;
    text-align: center;
    padding-top: 15px;
  }
}
@keyframes donut-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>