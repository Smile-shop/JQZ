<template>
  <div class="Lottery">
    <div class="top" v-show="theme">
      <i class="iconfont icon-back" v-show="backIcon" @click="back">&#xe6a4;</i>
      <p class="head-title">{{ActiveData.activeTheme?ActiveData.activeTheme:activeTheme}}</p>
      <i
        v-show="isShare=='1'"
        class="iconfont icon-share"
        @click="share"
      >&#xe603;</i>
    </div>
    <div class="banner">
      <img :src="ActiveData.imgName?ActiveData.imgName:bannerImg" alt />
      <img src="@/assets/images/components/bingo/bottom.png" alt style="display:none" />
      <img src="@/assets/images/components/bingo/top.png" alt style="display:none" />
      <img src="@/assets/images/start-hover.png" alt style="display:none" />
      <div class="music-btn" @click="playAudio">
        <span :class="playing?'playing':'close-icon'"></span>
        <audio ref="audio" loop="true" id="Audio" preload="metadata" controls="false">
          <source src="http://static.jqzjop.com/wx_game_group/music/jgg.mp3" />
        </audio>
      </div>
    </div>
    <main>
      <div class="grade" v-show="islogin">
        <p>
          <span class="grade-left">会员等级：{{gameInfo.level}}</span>
          <span class="grade-right">可用积分：{{ActiveData.creditUsable}}</span>
        </p>
      </div>
      <div class="btn-group">
        <button class="rule" @click="toPage('rule')">
          <span class="tab-link">活动规则</span>
        </button>
        <button class="mygift" @click="toPage('mygift')">
          <span class="tab-link">我的奖品</span>
        </button>
      </div>
      <img class="money" src="@/assets/images/nine-grid/coin.png" alt="装饰钱币" />
      <div class="game" ref="game">
        <div class="count">
          <p class="Time">
            活动时间：
            <span class="StartTime">{{ActiveData.beginTime}}</span> 至
            <span class="EndTime">{{ActiveData.endTime}}</span>
          </p>
          <p class="MarkTip">
            <span v-show="parseInt(remainNum)>=0?true:false">
              您今日还有
              <mark>{{ActiveData.remainNum ? ActiveData.remainNum : 0}}</mark> 次抽奖机会
            </span>
            <span v-if="gameInfo.consumeIntegral > 0">
              （每次消耗
              <mark>{{ActiveData.consumeIntegral}}</mark> 积分）
            </span>
            <span v-else>(不消耗积分)</span>
          </p>
        </div>
        <JggPlay @sendStatus="sendStatus" ref="JggPlay"></JggPlay>
        <div class="light-group left">
          <div :class="{bright:!activeMin}"></div>
          <div :class="{bright:activeMin}"></div>
          <div :class="{bright:!activeMin}"></div>
          <div :class="{bright:activeMin}"></div>
        </div>
        <div class="light-group right">
          <div :class="{bright:activeMin}"></div>
          <div :class="{bright:!activeMin}"></div>
          <div :class="{bright:activeMin}"></div>
          <div :class="{bright:!activeMin}"></div>
        </div>
      </div>
      <div class="Winninginfo">
        <div class="title">
          <i></i>
          <span>中奖名单</span>
        </div>
        <WinningInfo></WinningInfo>
      </div>
      <Markbox
        ref="Markbox"
        @starturn="starturn"
        :share="shareData.isShare"
        :show="shareData.isShareAdd"
        :shareAdd="shareData.shareCount"
      ></Markbox>
    </main>
    <div class="sharelayer" ref="shareLayer" v-show="sharebox" @click="maskHidden">
      <img src="@/assets/images/fenxiang.png" />
    </div>
    <advertising-swiper
      v-show="Object.keys(scheme).length && gameInfo.isScheme === '1'"
      :silde-content="scheme.advertistings"
    />
    <Recommendation v-show="gameInfo.isScheme === '1'" :detail="scheme" />
    <ShareQR :show.sync="qrcodeShow">
      <img v-if="showQrcode" :src="shareData.publicAccount" alt class="qrcode" />
    </ShareQR>
  </div>
</template>

<script>
import ShareQR from 'dialog/ShareQR'
import Recommendation from 'layout/Recommendation'
import AdvertisingSwiper from 'layout/AdvertisingSwiper.vue'
import WinningInfo from 'components/WinningInfo.vue'
import Markbox from 'components/Mark.vue'
import {
  gameDetails,
  activeInProducts,
  loginGift,
  querySchemeList,
  queryShare
} from '@/axios/api.js'
import { showCount } from '@/axios/tiger'
import { mapState, mapMutations } from 'vuex'
import JggPlay from 'components/jggPlay.vue'
import moment from 'moment'
import {
  getLocalStorage,
  setStorage,
  // setGiftStorage,
  getGiftStorage
} from '@/utils'
import wxShareInit from '@/utils/share'
import baseUrl from '@/config/config.js'
import { goBackIcon } from '@/utils/set-url-data.js'
const ActiveLength = 8
export default {
  components: {
    WinningInfo,
    Markbox,
    JggPlay,
    AdvertisingSwiper,
    ShareQR,
    Recommendation
  },
  data() {
    return {
      backIcon: goBackIcon(), // 返回图标
      isShare: '0', // 分享情况
      subscribe: false, // 订阅公众号情况
      theme: true, // 游戏主题名称
      mp3Url: '',
      activeId: '',
      islogin: false, // 登录状态
      giftList: [], //活动数据
      Pumping: {}, //抽中奖品信息
      cutover: false,
      timer: ' ', //控制快速旋转的定时器
      timer2: null, //控制慢速旋转的定时器
      clickFlage: true, //是否能点击进行抽奖
      prize: '', //奖品
      activeMin: true, //一闪一闪的灯
      gameStatus: false,
      isMember: null, //会员资格
      sharebox: false,
      ticket: '',
      userMember: 0,
      bannerImg: '', //广告图
      audio: null,
      activeTheme: '',
      creditUsable: 0,
      remainNum: 0,
      shareData: {}, // 分享相关的数据
      scheme: {}, // 推广
      gameInfo: {}, // 活动详情
      qrcodeShow: false, // 关注二维码
      QRMark: false // 操作过二维码关闭
    }
  },
  created() {
    this.loginCase()
    this._getSchemeList()
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
      'setJggOnlyMember',
      'setLoginInfo'
    ]),
    loginCase() {
      const { ticket, memberCard } = getLocalStorage()
      if (ticket && memberCard) {
        this.islogin = true
      }
    },
    subscribeCase() {
      const { subscribe } = getLocalStorage()
      const num = Number(subscribe)
      if (num === 1) {
        this.subscribe = true
      }
    },
    toTop() {
      if (document.body.scrollTop > 0) {
        window.scrollTo(0, -1)
        document.body.scrollTop = 0
      }
      window.scrollTo(0, -1)
      document.body.scrollTop = 0
    },
    async _getShowCount() {
      const { id } = this.$route.query
      const activeId = id
      const options = {
        id: activeId
      }
      await showCount(options)
    },
    async _getSchemeList(obj = {}) {
      const { id } = this.$route.query
      const { memberCard, subscribe } = getLocalStorage()
      const activeId = id
      const options = {
        id: activeId,
        memberCard: memberCard
      }
      const shareId = {
        activeId
      }
      const { data: schemes } = await querySchemeList(obj)
      const { data: gameInfo } = await gameDetails(options)
      const { data: shareData } = await queryShare(shareId)
      this.isShare = shareData.isShare
      if (!this.QRMark) {
        this.qrcodeShow =
          Number(subscribe) !== 1 && Number(shareData.isLeadConcern) === 1
      }
      // 是否已经分享
      if (!gameInfo.toDayShare && Number(shareData.isShareAdd) === 1) {
        this.setJggShareInfo(true)
      }

      if (gameInfo.isMember === '0') {
        this.setJggOnlyMember(true)
      }

      // 设置游戏主标题
      document.title = gameInfo.activityName

      // 设置导航标题
      this.barTitle = gameInfo.activeTheme
      this.bannerImage = gameInfo.imgName

      this.gameInfo = gameInfo
      this.shareData = shareData

      this.logoImage = gameInfo.companyLogo

      sessionStorage.setItem('barTitle', this.barTitle)
      sessionStorage.setItem('bannerImage', this.bannerImage)
      sessionStorage.setItem('logoImage', this.logoImage)

      const ads =
        schemes &&
        schemes.filter(scheme => {
          if (String(scheme.id) === gameInfo.scheme) {
            return scheme
          }
        })[0]

      if (ads) this.scheme = ads
    },
    maskHidden() {
      this.sharebox = false
    },
    starturn() {
      this.$refs.JggPlay.initMove()
    },
    closeQR() {
      this.qrcodeShow = false
      this.QRMark = true
    },
    async queryLoginGift(options) {
      const giftInfo = loginGift(options)
      return giftInfo
    },
    showgiftlayer(activeId) {
      let giftData = getGiftStorage.get()
      if (!giftData || !giftData.body) {
        return
      }
      const { ticket } = getLocalStorage()
      const { path, gift } = giftData
      const currentPath = this.$route.path
      const currentId = Number(activeId)
      const saveId = gift ? Number(gift.body.id) : ''
      const lave = gift ? Number(gift.remainNum) : ''

      if (ticket && path === currentPath && saveId === currentId) {
        if (lave > 0) {
          const text = '再来一次'
          this.setMarktext(text)
          this.setMarkLinkstatus(0)
          this.setMarkBtnstatus(true)
        } else {
          const text = '抽奖次数已用完'
          this.setMarktext(text)
          this.setMarkLinkstatus(0)
          this.setMarkBtnstatus(false)
        }
        this.setPumping(gift)
        this.setmarkStatus(true)
        this.closeQR()
        return
      }
    },
    // 微信分享功能
    doshare(body) {
      const params = {
        companyKey:
          this.ActiveData.companyKey ||
          this.$route.query.companyKey ||
          body.companyKey,
        url: window.location.href.split('#')[0],
        type: 'jsapi'
      }
      let options = {}
      if (this.ActiveData || body) {
        options = {
          activeId:
            this.ActiveData.id ||
            this.ActiveData.activeId ||
            this.$route.query.id ||
            body.activityId ||
            body.id,
          shareImg: this.ActiveData.shareImg || body.shareImg,
          isShare: this.ActiveData.isShare || body.isShare,
          isMember: this.ActiveData.isMember || body.isMember,
          shareTitle: this.ActiveData.shareTitle || body.shareTitle,
          shareContent: this.ActiveData.shareContent || body.shareContent
        }
      }
      wxShareInit(params, options)
    },
    querygameDetails(Pramas) {
      return new Promise((resolve, reject) => {
        gameDetails(Pramas)
          .then(res => {
            let { data, code } = res
            if (code == 0) {
              if (data) {
                data.beginTime = moment(data.beginTime).format('YYYY-MM-DD')
                data.endTime = moment(data.endTime).format('YYYY-MM-DD')
                let newData = Object.assign(this.ActiveData, data)
                this.setGameActiveData(newData)
                this.setinvalidImg(data.invalidImg)
                this.userMember = data.userMember
                this.creditUsable = data.creditUsable
                this.remainNum = data.remainNum
                this.bannerImg = data.imgName
                this.activeTheme = data.activeTheme
                this.isMember = data.isMember
                let invalidImg = data.invalidImg
                this.initActive(invalidImg)
                resolve(data)
              } else {
                reject('非常抱歉，系统繁忙中...')
              }
            } else {
              reject('非常抱歉，系统繁忙中...')
            }
          })
          .catch(err => {
            this.$loading.close()
            reject(err)
            this.$toast(err)
          })
      })
    },
    async dogameDetails(Pramas, body) {
      const res = await this.querygameDetails(Pramas)

      activeInProducts(body)
        .then(res => {
          let { data, code } = res
          let activeData = []
          if (code == 0) {
            activeData = data.map(val => {
              return {
                gifUrl: val.imgName,
                text: val.productName,
                jmpGiftCode: val.jmpGiftCode,
                sequence: val.sequence
              }
            })
            let Activeleg = activeData.length
            this.setproductGift(activeData)
            //判断活动 奖品数量是否大于1；
            if (Activeleg >= 1) {
              //获取活动奖品序号；
              let sequenceAry = activeData.map(val => {
                return parseInt(val.sequence) - 1
              })
              //重绘活动数据列表
              for (let i = 0; i < Activeleg; i++) {
                this.ResetActive(activeData, i, sequenceAry)
              }
              this.setactiveInProducts(this.giftList)
              let groupCode = this.giftList.map(val => {
                return val.jmpGiftCode
              }) //这里
              this.setgroupCode(groupCode)
            }
          }
        })
        .catch(err => {
          this.$loading.close()
          this.$toast(err)
        })
      this.doshare(res)
      this.initMove()
    },
    //第一次请求后重绘九宫格数据
    ResetActive(Data, i, sequenAry) {
      this.giftList[sequenAry[i]] = Object.assign(Data[i])
    },
    //初始化九宫格数据
    initActive(imgUrl) {
      if (imgUrl) {
        this.giftList = []
        for (let i = 0; i < ActiveLength; i++) {
          let obj = {
            gifUrl: imgUrl,
            text: '谢谢参与',
            jmpGiftCode: -1,
            sequence: -1
          }
          this.giftList[i] = obj //序号
        }
      }
    },
    initMove() {
      this.timer = setInterval(() => {
        this.move()
      }, 1000)
    },
    //执行动画；
    move() {
      var count = this.run++
      this.activeMin = count % 2 === 0 ? true : false
    },
    sendStatus(status) {
      this.gameStatus = status
    },
    toPage(type) {
      if (type == 'rule') {
        let Pramas = this.$route.query
        this.$router.push({ path: '/rule', query: Pramas })
      } else {
        if (!this.gameStatus) {
          let { wxUserInfo } = getLocalStorage()
          setStorage.save(JSON.stringify(wxUserInfo))
          window.location.href = `${baseUrl}/wx_member/gift/index.html#/gift`
        } else {
          this.$toast('抽奖正在进行中，请稍等')
        }
      }
    },

    // 扫码进入默认播放
    scanQrcode() {
      var audio = document.getElementById('Audio')
      audio.play()

      document.addEventListener(
        'WeixinJSBridgeReady',
        function() {
          audio.play()
        },
        false
      )
    },
    // 音乐播放
    initPlayAudio() {
      this.audio = this.$refs.audio

      this.scanQrcode()

      this.$nextTick(() => {
        this.audio.play()
        this.setplaystatus(true)
      })

      if (this.audio) {
        if (this.playing) {
          if (!this.playstatus) {
            this.$nextTick(() => {
              this.audio.play()
            })
            this.setplaystatus(true)
          }
        } else {
          this.audio.pause()
          this.setplaystatus(false)
        }
      }
    },
    playAudio() {
      this.setPlaying(!this.playing)
    },
    back() {
      this.$router.go(-1)
    },
    share() {
      this.sharebox = true
    },
    hide() {
      this.sharebox = false
    }
  },

  mounted() {
    this.toTop()
    this.$loading.open()
    let { ticket, memberCard } = getLocalStorage()
    this.ticket = ticket
    this.run = 0 //计数值
    // let activeId =
    //   this.ActiveData.id || this.ActiveData.activityId || this.$route.query.id
    let activeId = this.$route.query.id
    if (activeId) {
      // this.showgiftlayer(activeId) // 为何需要这行代码呢？？？ 为了展示抽过奖
    }
    if (!activeId) {
      this.$router.replace('/home')
      return false
    } else {
      let body = { activeId: activeId },
        gamePramas = { id: activeId, memberCard }
      this.dogameDetails(gamePramas, body)
    }
    setTimeout(() => {
      this.initPlayAudio()
    }, 20)
  },
  computed: {
    ...mapState({
      ActiveData: state => state.game.GameActiveData,
      invalidImg: state => state.game.invalidImg,
      playing: state => state.game.playing,
      playstatus: state => state.game.playstatus
    }),
    showQrcode: function() {
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

  watch: {
    playing() {
      let audio = this.$refs.audio
      this.$nextTick(() => {
        if (this.playing) {
          if (!this.playstatus) {
            audio.play()
            this.setplaystatus(true)
          }
        } else {
          audio.pause()
          this.setplaystatus(false)
        }
      })
    },
    ActiveData: {
      handler() {},
      deep: true
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!this.gameStatus) {
      next(true)
    } else {
      this.$toast('抽奖正在进行中，请稍等')
    }
  },
  beforeDestroy() {
    const status = this.$refs.audio
    if (status) {
      this.$refs.audio.pause()
    }
    if (this.audio) {
      this.audio.pause()
    }
    this.$loading.close()
    clearTimeout(this.timer)
  }
}
</script>

<style lang='stylus' scoped>
.head-title {
  display: inline-block;
  max-width: 260px;
  overflow: hidden;
  text-overflow:ellipsis;
	white-space:nowrap
}
.Lottery {
  min-height: 100vh;
  background-color: #ffca00;
  // padding-bottom: 30px;
  padding-bottom: 5px;

  .grade {
    display: block;
    margin: 0 auto;
    font-size: 14px;
    font-weight: bold;
    color: #ff3d24;
    text-align: center;
    height: 2rem;
    line-height: 2rem;

    .grade-left {
      margin-right: 0.5rem;
    }

    .grade-right {
      margin-left: 0.5rem;
    }
  }

  .sharelayer {
    width: 100vw;
    min-height: 100%;
    background: rgba(0, 0, 0, 0.8);
    padding: 0;
    margin: 0;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 10;

    &>img {
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

  .banner {
    width: 100vw;
    height: 47vw;
    position: relative;

    &>img {
      width: 100%;
      height: 100%;
    }

    .music-btn {
      position: absolute;
      width: 9.6vw;
      height: 9.6vw;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 50%;
      overflow: hidden;
      top: 8%;
      right: 6%;

      &>span {
        display: inline-block;
        width: 100%;
        height: 100%;
        background: url('../../assets/images/radio-open.png') no-repeat;
        background-position: 50% 50%;
        border-radius: 50%;
        overflow: hidden;
      }

      .playing {
        animation: turn 8s linear infinite;
      }

      .close-icon {
        background: url('../../assets/images/radio-close.png') no-repeat;
        background-size: cover;
      }
    }
  }

  & > header {
    display: flex;
    flex-direction: column;
    margin-bottom: 2.2vw;
    height: 47.3vw;

    & > .stars-box {
      position: relative;
      flex-grow: 1;
      background-color: red;

      & > .stars {
        opacity: 1;
        position: absolute;
        width: 2vw;
        height: 2vw;
        background-color: #fff;
        border-radius: 50%;
        transform: scale(1);

        &:nth-of-type(1) {
          top: -1.25vw;
          left: 6.8vw;
          width: 3vw;
          height: 3vw;
        }

        &:nth-of-type(2) {
          top: 2vw;
          left: 70vw;
        }

        &:nth-of-type(3) {
          top: 4vw;
          left: 90vw;
          width: 3vw;
          height: 3vw;
        }

        &:nth-of-type(4) {
          top: 26vw;
          left: -1.25vw;
        }

        &:nth-of-type(5) {
          top: 33vw;
          left: 95vw;
          width: 3vw;
          height: 3vw;
        }

        &:nth-of-type(6) {
          top: 41vw;
          left: 6vw;
        }

        &:nth-of-type(7) {
          top: 45vw;
          left: 45vw;
          width: 3vw;
          height: 3vw;
        }

        &:nth-child(even) {
          animation: twinkle 1s linear infinite alternate;
        }

        @keyframes twinkle {
          100% {
            opacity: 0;
          }
        }

        &:nth-child(odd) {
          animation: bigSmall 1s 1s linear infinite alternate;
        }

        @keyframes bigSmall {
          100% {
            transform: scale(0.5);
          }
        }
      }
    }
  }

  & > main {
    position: relative;
    padding: 0 3.6vw;
    margin-top: 10px;

    & > .Integral {
      font-size: 3.7vw;
      color: #ff3d24;
      text-align: center;
      margin-bottom: 2.5vw;
      font-weight: bold;
    }

    & > .btn-group {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2.2vw;
      padding: 0 24vw;

      & > button {
        border: none;
        border-radius: 2.5rem;
        padding: 2vw 3.2vw;
        font-size: 3.2vw;
        color: #fff;
        background-color: #ff3d24;
      }
    }

    & > .game {
      position: relative;
      margin-bottom: 2.5vw;
      padding: 0 6.3vw 8.5vw 5.3vw;
      height: 94.2vw;
      background-image: url('../../assets/images/nine-grid/choujiang.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-position: center center;
      background-clip: border-box;

      & > .count {
        height: 13vw;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 0.4rem;
        font-family: PingFang-SC-Medium;
        text-align: center;

        .Time {
          font-size: 2.9vw;
          padding-top: 2.4vw;
          margin-bottom: 1vw;
        }

        .MarkTip {
          font-size: 3.2vw;

          mark {
            color: #fde817;
            background: none;
          }
        }
      }

      & > .play {
        height: 74.4vw;
        position: relative;
        padding: 0.7vw;

        & > li {
          position: absolute;
          height: 23.1vw;
          width: 25.7vw;
          box-sizing: border-box;
          text-align: center;
          color: #c14600;
          font-size: 3.2vw;
          background-image: url('../../assets/images/nine-grid/normal.png');
          background-repeat: no-repeat;
          background-size: 100% 100%;
          background-position: center center;
          background-clip: border-box;
          padding-top: 4vw;

          &.select {
            background-image: url('../../assets/images/nine-grid/select.png');
          }

          & > img {
            margin-bottom: 1vw;
            width: 85%;
            height: 40px;
          }
        }

        & > li:nth-child(1) {
          left: 2%;
        }

        & > li:nth-child(2) {
          left: 34.8%;
        }

        & > li:nth-child(3) {
          left: 67.5%;
        }

        & > li:nth-child(4) {
          left: 67.5%;
          top: 24.6vw;
        }

        & > li:nth-child(5) {
          left: 67.5%;
          top: 48.4vw;
        }

        & > li:nth-child(6) {
          left: 34.8%;
          top: 48.4vw;
        }

        & > li:nth-child(7) {
          left: 2%;
          top: 48.4vw;
        }

        & > li:nth-child(8) {
          left: 2%;
          top: 24.6vw;
        }

        & > li:nth-child(9) {
          left: 34.8%;
          top: 24.6vw;
          background-image: url('../../assets/images/nine-grid/start.png');
          background-repeat: no-repeat;
          background-size: cover;
        }
      }
    }
  }
}

.light-group {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 5.7vw;
  padding: 6vw 0;

  &.left {
    top: 4.5vw;
    left: 0;
    bottom: 0;
  }

  &.right {
    top: 4.5vw;
    right: 0;
    bottom: 0;
  }

  & > div {
    height: 5.5vw;
    width: 5.5vw;
    background-image: url('../../assets/images/nine-grid/dark.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center center;
    background-clip: border-box;

    &.bright {
      background-image: url('../../assets/images/nine-grid/light.png');
    }
  }
}

.Winninginfo {
  position: relative;
  background-color: #eab900;
  overflow: hidden;
  border-radius: 1.3vw;

  .title {
    position: absolute;
    height: 5vh;
    text-align: center;
    color: #ffffff;
    font-size: 5vw;
    font-family: PingFang-SC-Medium;
    width: 100%;
    z-index: 10;
    padding-top: 2vw;

    & > span {
      background: #eab900;
      padding: 0 10px;
      position: relative;
      z-index: 11;
    }

    & > i {
      position: absolute;
      top: 2vh;
      width: 80%;
      height: 2vw;
      border-bottom: 1px solid #f7ca20;
      left: 10vw;
    }
  }
}

.money {
  z-index: 10;
  position: absolute;
  left: 4vw;
  top: 7vw;
  height: 12vw;
  animation: jump 0.8s linear infinite alternate;
}

@keyframes turn {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes jump {
  100% {
    top: 10vw;
  }
}
</style>