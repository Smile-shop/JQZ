<template>
  <div class="red-envelope">
    <div class="top" v-show="theme">
      <i class="iconfont icon-back" v-show="backIcon" @click="back">&#xe6a4;</i>
      <p class="head-title">{{ActiveData.activeTheme ? ActiveData.activeTheme : activeTheme}}</p>
      <i
        v-show="isShare=='1'"
        @click="share"
        class="iconfont icon-share"
      >&#xe603;</i>
    </div>
    <div class="banner">
      <img :src="ActiveData.imgName ? ActiveData.imgName : defaultBanner" @load="loadImage" />
      <div class="music-btn" @click="playAudio">
        <span :class="playing ? 'playing' : 'close-icon'"></span>
        <audio ref="audio" id="Audio" loop="true" preload="metadata" controls="false">
          <source src="http://static.jqzjop.com/wx_game_group/music/flop.mp3" />
        </audio>
      </div>
      <div class="side-nav">
        <button class="rule" @click="toPage('rule')">
          <span class="tab-link">规则</span>
        </button>
        <button class="me" @click="toPage('mygift')">
          <span class="tab-link">我的</span>
        </button>
      </div>
    </div>
    <div class="container">
      <ul class="context">
        <li>
          <p class="Time">
            活动时间：
            <span class="StartTime">{{ActiveData.beginTime}}</span>至
            <span class="EndTime">{{ActiveData.endTime}}</span>
          </p>
        </li>
        <li v-show="islogin">
          <p class="grade">
            <span class="grade-left">会员等级：{{gameInfo.level}}</span>
            <span class="grade-right">可用积分：{{ActiveData.creditUsable ? ActiveData.creditUsable : 0}}</span>
          </p>
        </li>
        <li>
          <p class="MarkTip" v-show="(isMember=='0' || parseInt(remainNum)>=0)?true:false">
            <span v-show="parseInt(remainNum)>=0?true:false">
              您今日还有
              <mark>{{ActiveData.remainNum ? ActiveData.remainNum : 0}}</mark> 次抽奖机会
            </span>
            <span v-if="ActiveData.consumeIntegral > 0">
              （每次消耗
              <mark>{{ActiveData.consumeIntegral}}</mark> 积分）
            </span>
            <span v-else>(不消耗积分)</span>
          </p>
        </li>
      </ul>
      <div class="game">
        <ul class="box" ref="box">
          <li
            :class="[Class[index],activeMax==index?'active':'']"
            v-for="(item,index) in gameboxList"
            :key="index"
            @click="draw($event,index)"
          >
            <img :src="item.imgUrl" />
          </li>
        </ul>
      </div>
      <div class="Winninginfo">
        <div class="title">
          <i></i>
          <span>中奖名单</span>
          <i></i>
        </div>
        <WinningInfo></WinningInfo>
      </div>
    </div>
    <div class="layer" v-show="showdraw"></div>
    <envelope-mark
      ref="Markbox"
      :share="gameInfo.toDayShare"
      :shareAdd="shareData.shareCount"
      :Pumping="Pumping"
      @closeMark="closeMark"
      @starturn="starturn"
    ></envelope-mark>
    <div class="sharelayer" ref="shareLayer" v-show="sharebox" @click="maskHidden">
      <img src="@/assets/images/fenxiang.png" />
    </div>
    <advertising-swiper
      v-show="Object.keys(scheme).length && gameInfo.isScheme === '1'"
      :silde-content="scheme.advertistings"
      :envelope="true"
    />
    <Recommendation v-show="gameInfo.isScheme === '1'" :detail="scheme" :envelope="true" />
    <ShareQR :show.sync="qrcodeShow">
      <img v-if="showQrCode" :src="shareData.publicAccount" alt class="qrcode" />
    </ShareQR>
    <Error :show.sync="errorShow" :no-member="errorIsMember" :msg="errorMessage" />
  </div>
</template>

<script>
import ShareQR from 'dialog/ShareQR'
import Recommendation from 'layout/Recommendation'
import AdvertisingSwiper from 'layout/AdvertisingSwiper.vue'
import WinningInfo from 'components/WinningInfo.vue'
import EnvelopeMark from 'components/EnvelopeMark.vue'
import Error from 'dialog/Error.vue'
import baseUrl from '@/config/config.js'
import {
  gameDetails,
  activeInProducts,
  loginGift,
  startDraw,
  querySchemeList,
  queryShare
} from '@/axios/api.js'
import { mapState, mapMutations } from 'vuex'
import moment from 'moment'
import { getLocalStorage, setStorage, getGiftStorage } from '@/utils'
import { shuffle } from '@/utils/tool.js'
import { showCount } from '@/axios/tiger'
import wxShareInit from '@/utils/share'
import { goBackIcon } from '@/utils/set-url-data.js'
export default {
  name: 'home',
  components: {
    EnvelopeMark,
    WinningInfo,
    ShareQR,
    AdvertisingSwiper,
    Recommendation,
    Error
  },
  data() {
    return {
      backIcon: goBackIcon(), // 返回图标
      isShare: '0', // 分享按钮
      defaultBanner:
        'http://www.jqzjop.com/ftp_images/01/game/game_default_banner.png', // 默认主题
      subscribe: false, // 公众号订阅情况
      theme: true, // 游戏主题名称
      errorShow: false, // 报错显示
      errorIsMember: false, // 会员情况
      errorMessage: '', // 报错信息
      mp3Url: '',
      flopmp3Url: '',
      imageCount: 0,
      Pumping: {},
      userMember: '',
      isMember: '',
      showdraw: false, //默认中遮罩层不展示
      timer: ' ', //控制快速旋转的定时器
      animationTimer: '', // 动画时间
      activeMax: 0, //默认奖品第一个奖品开始
      activeId: '',
      sharebox: false,
      shareData: {}, // 分享相关的数据
      ticket: '',
      bannerImg: '', //广告图
      qrcodeShow: false, // 推广二维码
      QRMark: false, // 操作过二维码关闭
      audio: null,
      activeTheme: '',
      creditUsable: 0,
      remainNum: 0,
      memberCard: '',
      source: null,
      giftList: [],
      gift: {}, // 中奖信息
      gameStatus: false,
      code: '',
      membershipLevel: '',
      scheme: {}, // 推广
      islogin: false, //没登录
      gameInfo: {},
      degreeScore: {
        average: 2000,
        silver: 3000,
        dismond: 4000,
        gold: 5000
      },
      Class: [
        'Animation0',
        'Animation1',
        'Animation2',
        'Animation3',
        'Animation4',
        'Animation5'
      ],
      gameboxList: [
        {
          giftId: 1,
          imgUrl: require('@/assets/images/hongbao.png'),
          gifUrl: require('@/assets/images/yhq.png'),
          text: '88元现金券'
        },
        {
          giftId: 2,
          imgUrl: require('@/assets/images/hongbao.png'),
          gifUrl: require('@/assets/images/yhq.png'),
          text: '188元现金券'
        },
        {
          giftId: 3,
          imgUrl: require('@/assets/images/hongbao.png'),
          gifUrl: require('@/assets/images/yhq.png'),
          text: '288元现金券'
        },
        {
          giftId: 4,
          imgUrl: require('@/assets/images/hongbao.png'),
          gifUrl: require('@/assets/images/yhq.png'),
          text: '388元现金券'
        },
        {
          giftId: 5,
          imgUrl: require('@/assets/images/hongbao.png'),
          gifUrl: require('@/assets/images/yhq.png'),
          text: '488元现金券'
        },
        {
          giftId: 6,
          imgUrl: require('@/assets/images/hongbao.png'),
          gifUrl: require('@/assets/images/yhq.png'),
          text: '688元现金券'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      ActiveData: state => state.game.GameActiveData,
      invalidImg: state => state.game.invalidImg,
      playing: state => state.game.playing,
      playstatus: state => state.game.playstatus
    }),
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
    this.count = 0
    this._getSchemeList()
    this._getIslogin()
    this._subscribeCase()
    this._getShowCount()
  },
  methods: {
    async _getShowCount() {
      const { id } = this.$route.query
      const activeId = id
      const options = {
        id: activeId
      }
      await showCount(options)
    },
    _getIslogin() {
      const { ticket, memberCard } = getLocalStorage()
      if (ticket && memberCard) {
        this.islogin = true
      }
    },
    _subscribeCase() {
      const { subscribe } = getLocalStorage()
      const num = Number(subscribe)
      if (num === 1) {
        this.subscribe = true
      }
    },
    toTop() {
      if (document.body.scrollTop > 0) {
        console.log(1)
        window.scrollTo(0, -1)
        document.body.scrollTop = 0
      }
      window.scrollTo(0, -1)
      document.body.scrollTop = 0
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
      const { data: gameInfo } = await gameDetails(options).catch(err =>
        this.alertTip(err)
      )
      const { data: shareData } = await queryShare(shareId)

      this.isShare = shareData.isShare

      if (!this.QRMark) {
        this.qrcodeShow =
          Number(subscribe) !== 1 && Number(shareData.isLeadConcern) === 1
      }

      if (!gameInfo.toDayShare && Number(shareData.isShareAdd) === 1) {
        this.setredEnveShareInfo(true)
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
          if (scheme.id + '' === gameInfo.scheme) {
            return scheme
          }
        })[0]

      if (ads) this.scheme = ads
    },
    share() {
      this.sharebox = true
    },
    maskHidden() {
      this.sharebox = false
    },
    hide() {
      this.sharebox = false
    },
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
      'setplaystatus',
      'setproductGift',
      'setPumping',
      'setconfirmStatus',
      'setFlopOnlyMember',
      'setFlopGiftInfo',
      'setflopRegister',
      'setredEnveShareInfo'
    ]),
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
    loadImage() {
      this.imageCount++
    },
    starturn() {
      this.initMove()
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
          this.$toast('游戏加载中，请稍后')
        }
      }
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

                // let invalidImg = data.invalidImg
                resolve(data)
              } else {
                reject('非常抱歉，系统繁忙中...')
              }
            } else {
              reject('非常抱歉，系统繁忙中...')
            }
            this.doshare(data)
          })
          .catch(err => {
            this.$loading.close()
            reject(err)
            this.$toast(err)
          })
      })
    },
    async dogameDetails(Pramas, body) {
      const res = await this.querygameDetails(Pramas) // eslint-disable-line
      activeInProducts(body)
        .then(res => {
          let { data, code } = res
          let activeData = []
          if (code == 0 && data) {
            activeData = data.map(val => {
              return {
                gifUrl: val.imgName,
                text: val.productName,
                jmpGiftCode: val.jmpGiftCode,
                sequence: val.sequence
              }
            })
          }
          this.giftList = activeData
          this.setproductGift(activeData)
        })
        .catch(err => {
          this.$loading.close()
          this.$toast(err)
        })
    },
    ComputedTime() {
      return new Promise(resolve => {
        let timeout = setTimeout(() => {
          resolve('0')
          console.log('初始化游戏')
          clearTimeout(timeout)
        }, 3000)
      })
    },
    closeMark() {
      this.closedraw()
    },
    closeQR() {
      this.qrcodeShow = false
      this.QRMark = true
    },
    async queryLoginGift(options) {
      const giftInfo = await loginGift(options)
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
      const lave = gift ? Number(gift.remainNum) : ''
      const saveId = gift ? Number(gift.body.id) : ''
      if (ticket && saveId === currentId && path === currentPath) {
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
        this.$refs.Markbox.showMark()
        this.closeQR()
        return
      }
    },
    //关闭弹框
    closedraw() {
      this.Class = []
      this.gameboxList = shuffle(this.gameboxList)
      this.showdraw = false
      var Timeout = setTimeout(() => {
        this.initClass()
        clearTimeout(Timeout)
        this.initMove()
      }, 300)
    },
    //出场动画样式类集合
    initClass() {
      this.Class = [
        'Animation0',
        'Animation1',
        'Animation2',
        'Animation3',
        'Animation4',
        'Animation5'
      ]
    },
    back() {
      //返回
      this.$router.go(-1)
    },
    initMove() {
      //初始动画
      clearInterval(this.timer)
      this.gameStatus = true
      this.timer = setInterval(() => {
        this.move()
      }, 1500)
      setTimeout(() => {
        this.gameStatus = false
      }, 3000)
    },
    move() {
      //执行动画；
      var count = this.count++
      this.activeMax = count % 6
    },
    alertError(text) {
      this.errorMessage = text
      this.errorShow = true
    },
    draw($event, index) {
      // 填坑，贴膏药
      let { wxUserInfo, memberCard } = getLocalStorage()

      if (this.ActiveData) {
        let isMember = this.ActiveData.isMember || this.$route.query.isMember
        if (isMember == '0') {
          this.memberCard = memberCard
            ? memberCard
            : wxUserInfo && wxUserInfo.memberCard
            ? wxUserInfo.memberCard
            : ''
        } else {
          this.memberCard = ''
        }
      }

      //选中卡牌改变——动画类；
      if (this.gameStatus) {
        this.$toast('游戏加载中，请稍后', 1000)
        return
      } else if (this.ActiveData.remainNum == '0') {
        let text = '抽奖次数已用完，暂不能抽奖'
        this.alertError(text)
        return false
      } else if (
        parseInt(this.ActiveData.creditUsable) <
          parseInt(this.ActiveData.consumeIntegral) &&
        this.ActiveData.creditUsable != null &&
        this.ActiveData.consumeIntegral != null &&
        this.isMember == 0
      ) {
        let text = '当前积分已不足，暂不能抽奖'
        this.alertError(text)
        return false
      } else {
        this.gameStatus = true
        clearInterval(this.timer)
        let creditUsable = parseInt(this.ActiveData.creditUsable)
        let consumeIntegral = parseInt(this.ActiveData.consumeIntegral)
        let remainNum = parseInt(this.ActiveData.remainNum)
        this.showdraw = true // 展示奖品
        let ClassName = this.Class[index]
        this.Class[index] = 'drawAnima'
        clearTimeout(this.animationTimer)
        // 清掉动画
        this.animationTimer = setTimeout(() => {
          this.Class.splice(index, 1, 'drawAnimaturn')
        }, 3000) 
        const { memberCard } = getLocalStorage()
        console.log(memberCard)
        let body = {
          id: this.ActiveData.activityId || this.ActiveData.id,
          memberCard: memberCard
        }

        this.ComputedTime().then(() => {
          if (this.code == '0') {
            this.$refs.Markbox.showMark()
          }
          if (typeof this.source == 'function') {
            this.source('非常抱歉，网络异常！')
          }
          this.Class.splice(index, 1, ClassName)
          console.log('关闭展示奖品')
          this.showdraw = false
        })

        startDraw(body)
          .then(res => {
            // this.showdraw = true // 展示奖品
            setTimeout(() => {
              this.gameStatus = false // 重置可抽奖
            }, 3000)
            let { data, code, msg } = res
            this.source = null
            if (code == '-1') {
              this.code = null
              this.showdraw = false
              this.Class.splice(index, 1, ClassName)
              this.$toast(msg)
            } else if (code == 0) {
              console.log('抽奖返回数据', data)
              getGiftStorage.save(data)
              this.code = 0
              //数据返回；
              this.setFlopGiftInfo(data)
              remainNum = Number(data.remainNum)
              creditUsable = data.creditUsable
              consumeIntegral = data.consumeIntegral
              let productType = data.productType // 抽中实物要显示领取门店
              // 可用抽奖次数 creditUsable
              // 剩余抽奖次数 remainNum

              console.log('登录了吗？？', this.ticket, productType)

              let giftid = data.giftCode,
                WinningData

              // 保存游戏数据
              const saveGameData = () => {
                let GameActiveData = {
                  creditUsable: creditUsable,
                  consumeIntegral: consumeIntegral,
                  remainNum: remainNum
                }
                this.setGameActiveData(
                  Object.assign(this.ActiveData, GameActiveData)
                )
              }

              // 保存礼品数据
              const saveGiftData = () => {
                console.log('礼品数据', giftid)
                if (giftid) {
                  this.giftList.forEach(val => {
                    if (giftid == val.jmpGiftCode) {
                      WinningData = Object.assign(data, val, { body: body })
                      this.setPumping(WinningData)
                    }
                  })
                } else {
                  WinningData = Object.assign(data, {
                    gifUrl: this.invalidImg,
                    text: ''
                  })
                  this.setPumping(WinningData)
                }
              }

              // 安慰奖
              const confortWin = () => {
                if (remainNum > 0) {
                  this.setMarktext('再来一次')
                  this.setMarkLinkstatus(0)
                  this.setMarkBtnstatus(true)
                } else {
                  this.setMarktext('抽奖次数已用完')
                  this.setMarkLinkstatus(0)
                  this.setMarkBtnstatus(false)
                }
              }

              // 未登录
              const noLogin = () => {
                this.setMarkBtnstatus(true)
                this.setMarkLinkstatus(1)
                this.setMarktext('您还未登录，请登录后领取')
                this.setflopRegister(true)
              }

              // 获得礼品
              const winPrize = () => {
                this.setMarktext('选择领取门店')
                this.setMarkLinkstatus(3)
                this.setMarkBtnstatus(true)
              }

              // 1. 登录(已经登录， 未登录)
              // 2.中奖(有中奖，未中奖)
              // 3.中奖类型(礼品，劵)
              // 4.剩余次数(有，无)
              const { ticket, memberCard } = getLocalStorage() // 登录， 会员情况
              if (!ticket || !memberCard) {
                // 未登录
                saveGameData()
                saveGiftData()
                if (giftid) {
                  // 中奖
                  noLogin()
                  return
                } else {
                  // 安慰奖
                  confortWin()
                  return
                }
              } else {
                saveGameData()
                saveGiftData()
                if (giftid) {
                  if (productType === '1') {
                    winPrize()
                    return
                  } else {
                    confortWin()
                    return
                  }
                } else {
                  // 安慰奖
                  confortWin()
                  return
                }
              }
            } else {
              this.Class.splice(index, 1, ClassName)
              this.gameStatus = false
              this.initMove()
              this.code = null
              this.$toast(msg)
            }
          })
          .catch(err => {
            console.log('开始抽奖出现异常')
            clearTimeout(this.animationTimer) // 消除延迟动画

            const { ticket, memberCard } = getLocalStorage()

            if (ticket && memberCard) {
              console.log('仅限会员，已登录')
            } else {
              console.log('仅限会员, 未登录')
              this.errorIsMember = true
            }

            this.errorMessage = err
            this.errorShow = true
            this.Class.splice(index, 1, ClassName)
            setTimeout(() => {
              this.gameStatus = false
            }, 1500)
            this.initMove()
            this.code = null
            console.log(err)
          })
        // }
      }
    },
    playAudio() {
      this.setPlaying(!this.playing)
    },

    alertTip(text) {
      this.gameStatus = false
      this.errorMessage = text
      this.errorShow = true
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
    }
  },
  mounted() {
    this.toTop()
    this.$loading.open()
    let localStorageData = getLocalStorage()
    let { wxUserInfo, ticket, memberCard } = localStorageData
    this.ticket = ticket
    if (this.ActiveData) {
      let isMember = this.ActiveData.isMember || this.$route.query.isMember
      if (isMember == '0') {
        this.memberCard = memberCard
          ? memberCard
          : wxUserInfo && wxUserInfo.memberCard
          ? wxUserInfo.memberCard
          : ''
      } else {
        this.memberCard = ''
      }
    }
    this.run = 0 //计数值
    let activeId =
      this.ActiveData.id ||
      this.ActiveData.activityId ||
      this.$route.query.id ||
      this.$route.query.shareId
    this.showgiftlayer(activeId)
    if (!activeId) {
      this.$router.replace('/home')
      return false
    } else {
      let body = { activeId: activeId },
        gamePramas = { id: activeId, memberCard }
      this.dogameDetails(gamePramas, body)
    }
    this.initMove()
    this.initPlayAudio()
  },
  watch: {
    imageCount(newVal) {
      if (newVal >= 1) {
        this.$loading.close()
      }
    },
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

<style lang="stylus" scoped>
.head-title {
  display: inline-block;
  max-width: 260px;
  overflow: hidden;
  text-overflow:ellipsis;
	white-space:nowrap
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

.red-envelope {
  width: 100vw;
  min-height: 100vh;
  // background: #50009f; // 背景做成可配置
  // padding-bottom: 10vw;
  padding-bottom: 1vw;
  background: url('../../assets/images/envelope.png') no-repeat;
  background-color: #b00803;

  .layer {
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100%;
    z-index: 11;
    opacity: 0;
    background: rgba(0, 0, 0, 0);
    transition: all 3s;
    animation: gradually 0.3s linear forwards;
  }

  .top {
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
      display: flex;
      justify-content: center;
      align-items: center;
      width: 7.6vw;
      height: 7.6vw;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 50%;
      overflow: hidden;
      top: 5%;
      right: 3%;

      audio {
        display: none;
      }

      &>span {
        display: inline-block;
        width: 6.6vw;
        height: 6.6vw;
        background: url('../../assets/images/radio-open.png') no-repeat;
        background-position: 50% 50%;
        border-radius: 50%;
        overflow: hidden;
        background-size: cover;
      }

      .playing {
        position: absolute;
        animation: turn 8s linear infinite;
      }

      .close-icon {
        position: absolute;
        background: url('../../assets/images/radio-close.png') no-repeat;
        background-size: cover;
      }
    }

    .side-nav {
      width: 12vw;
      position: absolute;
      left: 0;
      top: 0;

      & > button {
        width: 12vw;
        height: 7vw;
        font-size: 3vw;
        color: #ffffff;
        padding: 0;
        border: none;
        margin-top: 4vw;
        border-bottom-right-radius: 4vw;
        border-top-right-radius: 4vw;
        line-height: 7vw;
      }

      .rule {
        background: #ff9d1b;
      }

      .me {
        background: #fe5362;
      }
    }
  }

  .container {
    width: 100vw;

    // background: #50009F;
    .context {
      background: rgba(254, 229, 11, 0.42);
      border-top-left-radius: 40px;
      border-top-right-radius: 40px;
      padding-top: 2vw;

      &>li {
        // margin-bottom: 2vw;
        padding-bottom: 2vw;
        text-align: center;
      }

      .Time {
        color: #fff;
        font-size: 3vw;
      }

      .grade {
        color: #fee50b;
        font-size: 3vw;

        .grade-left {
          margin-right: 0.5rem;
        }

        .grade-right {
          margin-left: 0.5rem;
        }
      }

      .integration {
        color: #fee50b;
        font-size: 3vw;
      }

      .MarkTip {
        display: inline-block;
        background: url('../../assets/images/odds.png') no-repeat;
        min-width: 68vw;
        height: 8vw;
        font-size: 3vw;
        color: #fff;
        padding: 0 4vw;
        text-align: center;
        background-size: cover;
        line-height: 8vw;
        border-radius: 7vw;

        & mark {
          background: none;
          color: #fff;
        }
      }
    }

    .Winninginfo {
      position: relative;
      overflow: hidden;
      border-radius: 1.3vw;
      margin: 0 auto;
      width: 96vw;
      box-sizing: border-box;
      border: 1vw solid #EDBB92;
      border-radius: 2vw;

      .winning-info {
        color: #fade7a;
      }

      .title {
        position: absolute;
        height: 5vh;
        text-align: center;
        color: #fade7a;
        font-size: 5vw;
        font-family: PingFang-SC-Medium;
        width: 100%;
        z-index: 10;
        padding-top: 2vw;

        & > span {
          padding: 0 10px;
          position: relative;
          z-index: 11;
        }

        & > i:first-child {
          position: absolute;
          top: 2vh;
          width: 30%;
          height: 2vw;
          border-bottom: 1px solid #f7ca20;
          left: 3vw;
        }

        & >i:last-child {
          position: absolute;
          top: 2vh;
          width: 30%;
          height: 2vw;
          border-bottom: 1px solid #f7ca20;
          right: 3vw;
        }
      }
    }

    .game {
      padding-top: 2vw;
      padding-bottom: 5vw;
      margin-bottom: 2vw;
      background: rgba(254, 229, 11, 0.42);

      .box {
        width: 96vw;
        margin: 0 auto;
        position: relative;
        height: 75vw;

        & > li {
          width: 30vw;
          height: 36vw;
          text-align: center;
          position: relative;
          border-radius: 2vw;
          transition: all 0.5s;
          overflow: hidden;
          position: absolute;
          transform-style: preserve-3d;
          perspective: 1000;
          transition: all 0.3s;
          box-sizing: border-box;

          & > img {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            // background: url('../../assets/images/p-mormal.png') no-repeat;
            background-size: 100%;
            // padding: 2vw;
            box-sizing: border-box;
            position: relative;
            z-index: 1;
          }

          & > span {
            position: absolute;
            z-index: 0;
            width: 100%;
            height: 100%;
            background: #fff;
            left: 0;
            transform: rotateY(180deg);
          }
        }

        .active {
          & > span {
            background: #50009F;
          }

          & > img {
            // background: url('../../assets/images/p-hover.png') no-repeat;
            background-size: 100%;
            animation: shaking 0.5s ease-in-out;
          }
        }
      }
    }
  }
}

@keyframes gradually {
  100% {
    opacity: 1;
  }
}

@keyframes tran2 {
  10% {
    left: 5%;
  }

  100% {
    left: 34.78%;
  }
}

@keyframes tran3 {
  10% {
    left: 3%;
  }

  100% {
    left: 69.56%;
  }
}

@keyframes tran4 {
  10% {
    top: 0%;
  }

  100% {
    top: 52%;
  }
}

@keyframes tran5 {
  10% {
    top: 0%;
    left: 5%;
  }

  100% {
    left: 34.78%;
    top: 52%;
  }
}

@keyframes tran6 {
  10% {
    top: 0%;
    left: 3%;
  }

  100% {
    left: 69.56%;
    top: 52%;
  }
}

.Animation1 {
  animation: tran2 0.3s ease 0.3s forwards;
}

.Animation2 {
  animation: tran3 0.5s ease 0.6s forwards;
}

.Animation3 {
  animation: tran4 0.3s ease 1s forwards;
}

.Animation4 {
  animation: tran5 0.5s ease 1.3s forwards;
}

.Animation5 {
  animation: tran6 0.6s ease 1.6s forwards;
}

.drawAnima {
  z-index: 1000;
  // animation: draw2 1s linear forwards;
  animation: draw2 2s linear forwards;
}

.drawAnimaturn {
  z-index: 1000;
  // animation: draw3 2s linear infinite;
  animation: draw3 2s linear infinite;
}

@keyframes draw2 {
  10% {
    top: -10%;
    left: 34.78%;
    transform: scale(1.1);
    transform: rotateY(90deg);
  }

  50% {
    transform: rotateY(180deg);
  }

  80% {
    transform: rotateY(360deg);
  }

  100% {
    left: 34.78%;
    top: -20%;
    transform: scale(1.5);
  }
}

@keyframes draw3 {
  0% {
    left: 34.78%;
    top: -20%;
    transform: rotateY(90deg);
    transform: scale(1.5);
  }

  25% {
    left: 34.78%;
    top: -20%;
    transform: rotateY(150deg);
  }

  50% {
    left: 34.78%;
    top: -20%;
    transform: rotateY(220deg);
  }

  75% {
    left: 34.78%;
    top: -20%;
    transform: rotateY(300deg);
  }

  100% {
    left: 34.78%;
    top: -20%;
    transform: rotateY(360deg);
    transform: scale(1.5);
  }
}

@keyframes shaking {
  33% {
    transform: rotateY(-30deg);
  }

  66% {
    transform: rotateY(30deg);
  }

  100% {
    transform: rotateY(0deg);
  }
}

@keyframes turn {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
