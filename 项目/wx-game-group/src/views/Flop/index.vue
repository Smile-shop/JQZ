<template>
  <div class="home" :style="{'--color': subjectColor}">
    <div class="top" v-show="theme">
      <i class="iconfont icon-back" v-show="backIcon" @click="back">&#xe6a4;</i>
      <p class="head-title">{{ActiveData.activeTheme ? ActiveData.activeTheme : activeTheme}}</p>
      <i
        v-show="isShare==='1'"
        @click="share"
        class="iconfont icon-share"
      >&#xe603;</i>
    </div>
    <div class="banner">
      <img :src="ActiveData.imgName ? ActiveData.imgName:bannerImg" @load="loadImage" />
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
            v-show="isInitData"
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
        </div>
        <WinningInfo></WinningInfo>
      </div>
    </div>
    <div class="layer" v-show="showdraw"></div>
    <Markbox
      ref="Markbox"
      :share="gameInfo.toDayShare"
      :shareAdd="shareData.shareCount"
      :Pumping="Pumping"
      @closeMark="closeMark"
      @starturn="starturn"
    ></Markbox>
    <div class="sharelayer" ref="shareLayer" v-show="sharebox" @click="maskHidden">
      <img src="@/assets/images/fenxiang.png" />
    </div>
    <advertising-swiper
      v-show="Object.keys(scheme).length && gameInfo.isScheme === '1'"
      :silde-content="scheme.advertistings"
    />
    <Recommendation v-show="gameInfo.isScheme === '1'" :detail="scheme" />
    <ShareQR :show.sync="qrcodeShow">
      <img v-if="showQrCode" :src="shareData.publicAccount" alt class="qrcode" />
    </ShareQR>
    <Error :show.sync="errorShow" :no-member="errorIsMember" :msg="errorMessage" />
  </div>
</template>

<script>
import ShareQR from 'dialog/ShareQR'
import Recommendation from 'layout/Recommendation'
import AdvertisingSwiper from 'layout/AdvertisingSwiper'
import WinningInfo from 'components/WinningInfo.vue'
import Markbox from 'components/fpMark.vue'
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
import { showCount } from '@/axios/tiger'
import { mapState, mapMutations } from 'vuex'
import moment from 'moment'
import { getLocalStorage, setStorage, getGiftStorage } from '@/utils'
import { shuffle } from '@/utils/tool.js'
import wxShareInit from '@/utils/share'
import { goBackIcon } from '@/utils/set-url-data.js'
export default {
  name: 'home',
  components: {
    Markbox,
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
      subscribe: false, // 公众号订阅情况
      theme: true, // 游戏主题名称
      errorShow: false, // 报错显示
      errorIsMember: false, // 会员情况
      isNewGame:false,
      isPublish:false,
      status:"",
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
      // mp3Url: '',
      activeId: '',
      // isMember: null,
      sharebox: false,
      shareData: {}, // 分享相关的数据
      ticket: '',
      // userMember: 0,
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
      subjectColor:"",
      degreeScore: {
        average: 2000,
        silver: 3000,
        dismond: 4000,
        gold: 5000
      },
      isInitData:false,
      Class: [
        "",
        "",
        "",
        "",
        "",
        ""
        // 'Animation0',
        // 'Animation1',
        // 'Animation2',
        // 'Animation3',
        // 'Animation4',
        // 'Animation5'
      ],
      gameboxList: [
        {
          giftId: 1,
          imgUrl: require('@/assets/images/pattern1.png'),
          gifUrl: require('@/assets/images/yhq.png'),
          text: '88元现金券'
        },
        {
          giftId: 2,
          imgUrl: require('@/assets/images/pattern2.png'),
          gifUrl: require('@/assets/images/yhq.png'),
          text: '188元现金券'
        },
        {
          giftId: 3,
          imgUrl: require('@/assets/images/pattern4.png'),
          gifUrl: require('@/assets/images/yhq.png'),
          text: '288元现金券'
        },
        {
          giftId: 4,
          imgUrl: require('@/assets/images/pattern3.png'),
          gifUrl: require('@/assets/images/yhq.png'),
          text: '388元现金券'
        },
        {
          giftId: 5,
          imgUrl: require('@/assets/images/pattern2.png'),
          gifUrl: require('@/assets/images/yhq.png'),
          text: '488元现金券'
        },
        {
          giftId: 6,
          imgUrl: require('@/assets/images/pattern1.png'),
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
    this.start()
    this._subscribeCase()
    this._getShowCount()
  },
  methods: {
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
      // let gameInfo;
      // if(this.ActiveData){
      //    gameInfo = this.ActiveData;
      // }else{
       const { data: gameInfo } = await gameDetails(options).catch(err =>
          this.alertTip(err)
        );
      // }

      const { data: shareData } = await queryShare(shareId)

      this.isShare = shareData.isShare;
      console.log(this.isShare);
      if(this.isShare==='0'){
        // eslint-disable-next-line
        var ua = window.navigator.userAgent.toLowerCase(); 
        if(ua.match(/MicroMessenger/i)==='micromessenger') {
          // eslint-disable-next-line
          WeixinJSBridge.call('hideOptionMenu');
        }
      }
      if (!this.QRMark) {
        this.qrcodeShow =
          Number(subscribe) !== 1 && Number(shareData.isLeadConcern) === 1
      }

      if (!gameInfo.toDayShare && Number(shareData.isShareAdd) === 1) {
        this.setflopShareInfo(true)
      }

      // 设置游戏主标题
      document.title = gameInfo.activityName

      // 设置导航标题
      this.barTitle = gameInfo.activeTheme
      this.bannerImage = gameInfo.imgName

      this.gameInfo = gameInfo
      this.shareData = shareData
      if(gameInfo&&gameInfo.subjectColor){
        this.subjectColor = gameInfo.subjectColor;
      }else{
        this.subjectColor = "#50009f";
      }
      if(gameInfo&&gameInfo.bannerList){
         const bannerList = gameInfo.bannerList;
         for(var index in this.gameboxList){
            bannerList.forEach((item)=>{
              if(item.imgUrl!=''&&(item.sortNum==this.gameboxList[index].giftId))
              {
                  this.gameboxList[index].imgUrl = item.imgUrl;
              }
            });
         }
      }
      this.initClass();
      this.isInitData = true;
      this.logoImage = gameInfo.companyLogo;
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
      console.log(ads, '这里是详情')
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
      'setflopShareInfo'
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
                data.beginTime = moment(data.beginTime).format('YYYY-MM-DD HH:mm:ss');
                data.endTime = moment(data.endTime).format('YYYY-MM-DD HH:mm:ss');
                let newData = Object.assign(this.ActiveData, data);
                this.setGameActiveData(newData);
                this.setinvalidImg(data.invalidImg);
                this.userMember = data.userMember;
                this.creditUsable = data.creditUsable;
                this.remainNum = data.remainNum;
                this.bannerImg = (data.imgName&&data.imgName!='')? data.imgName:require('@/assets/images/banner.png');
                this.activeTheme = data.activeTheme;
                this.theme = (data.activeTheme&&data.activeTheme!="")? true:false;
                this.isMember = data.isMember;
                this.isNewGame = (data.isNewGame&&data.isNewGame==1)? true:false;
                this.isPublish = (data.isPublish&&data.isPublish==1)? true:false;
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
          console.log(activeData);
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
          clearTimeout(timeout)
        }, 5000)
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
    async showgiftlayer(activeId) {
      const giftData = getGiftStorage.get()
      if (!giftData || !giftData.body) {
        return
      }
      const currentPath = this.$route.path
      const currentId = Number(activeId)
      const { path, gift } = giftData
      const { ticket } = getLocalStorage()
      const lave = gift ? Number(gift.remainNum) : ''
      const saveId = gift ? Number(gift.body.id) : ''
      if (ticket && path === currentPath && currentId && saveId) {
        if (lave > 0) {
          this.setMarktext('再来一次')
          this.setMarkLinkstatus(0)
          this.setMarkBtnstatus(true)
        } else {
          this.setMarktext('抽奖次数已用完')
          this.setMarkLinkstatus(0)
          this.setMarkBtnstatus(false)
        }
        this.setPumping(gift)
        this.setMarkBtnstatus(true)
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
      }, 2000)
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
    // 开始抽奖
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
        let afterBeginTime = moment(this.ActiveData.beginTime).valueOf(), //抽奖开始时间
          // beforeEndTime = moment(this.ActiveData.endTime).valueOf() - 1, //抽奖的结束时间
          beforeEndTime = moment(this.ActiveData.endTime).valueOf(), //抽奖的结束时间
 
          TimestampNowDate = moment(
            new Date(),
            'YYYY-MM-DD HH:mm:ss'
          ).valueOf(), //当前时间
          creditUsable = parseInt(this.ActiveData.creditUsable),
          consumeIntegral = parseInt(this.ActiveData.consumeIntegral),
          remainNum = parseInt(this.ActiveData.remainNum),
          isMember = this.ActiveData.isMember;

          console.log(this.ActiveData.beginTime);
          console.log(this.ActiveData.endTime);

        if (isMember == 0 && this.userMember == 0) {
          this.setconfirmStatus(true)
          this.gameStatus = false
        } else if (TimestampNowDate < afterBeginTime) {
          const text = '非常抱歉，活动还未开始，敬请期待！'
          this.alertTip(text)
          return false
        } else if (TimestampNowDate > beforeEndTime) {
          const text = '非常抱歉！活动已结束，敬请期待下次活动'
          this.alertTip(text)
          return false
        } else {
          this.showdraw = true
          let ClassName = this.Class[index]
          this.Class[index] = 'drawAnima'
          clearTimeout(this.animationTimer)
          this.animationTimer = setTimeout(() => {
            this.Class.splice(index, 1, 'drawAnimaturn')
          }, 1000)
          const { memberCard } = getLocalStorage()
          console.log(memberCard)
          let body = {
            id: this.ActiveData.activityId || this.ActiveData.id,
            memberCard: memberCard
          }

          // this.ComputedTime().then(() => {
          //   console.log('第一个then')
          //   if (this.code == '0') {
          //     this.$refs.Markbox.showMark()
          //   }
          //   if (typeof this.source == 'function') {
          //     this.source('非常抱歉，网络异常！')
          //   }
          //   this.Class.splice(index, 1, ClassName)
          //   this.showdraw = false
          // })

          // 返回弹出框需要参数
          const paramas = {
            index: index,
            ClassName: ClassName,
          }

          // 发送抽奖请求
          startDraw(body)
            .then(res => {
              clearTimeout(this.animationTimer) // 消除延迟动画
              let { data, code, msg } = res
              this.source = null
              if (code == '-1') {
                this.code = null
                setTimeout(() => {
                  this.showdraw = false
                }, 3000)
                this.Class.splice(index, 1, ClassName)
                this.$toast(msg)
                return paramas
              } else if (code == 0) {
                console.log('返回中奖数据-----------', data)
                this.gameStatus = false // 抽奖成功
                getGiftStorage.save(data)
                this.code = 0
                //数据返回；
                this.setFlopGiftInfo(data)
                remainNum = data.remainNum // 剩余次数
                creditUsable = data.creditUsable // 可用积分
                consumeIntegral = data.consumeIntegral // 消耗积分
                let productType = data.productType // 抽中实物要显示领取门店
                // 可用抽奖次数 creditUsable
                // 剩余抽奖次数 remainNum

                let giftid = data.giftCode,
                  WinningData

                // 存游戏数据
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
                // 存礼品数据
                const saveGiftData = () => {
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
                   console.log('安慰奖')
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
                  console.log('未登录')
                  this.setMarktext('您还未登录，请登录后领取')
                  this.setMarkLinkstatus(1)
                  this.setMarkBtnstatus(true)
                }
                // 获得礼品
                const winPrize = () => {
                  console.log('获得礼品')
                  if((this.isPublish||!this.isNewGame)) {
                      this.setMarktext('选择领取门店');
                      this.setMarkLinkstatus(3)
                      this.setMarkBtnstatus(true)
                  }else{
                      this.setMarkLinkstatus(0)
                      this.setMarkBtnstatus(true)
                  }

                }
                
                // 1. 登录(未登录，已登录)
                // 2. 中奖(未中奖，已中奖)
                // 2.1 中奖类型(1.礼品， 2.优惠券，3.积分)
                // 3. 剩余次数
                const { ticket, memberCard } = getLocalStorage() // 登录状态，会员情况
                if (!ticket || !memberCard) {
                  saveGameData()
                  saveGiftData()
                  if (giftid) {
                    noLogin()
                    return paramas
                  } else {
                    confortWin()
                    return paramas
                  }
                } else {
                  saveGameData()
                  saveGiftData()
                  if (giftid) {
                    if (productType === '1') {
                      winPrize()
                      return paramas
                    } else {
                      confortWin()
                      return paramas
                    }
                  } else {
                    confortWin()
                    return paramas
                  }
                }
              } else {
                console.log('第一次抽奖')
                this.Class.splice(index, 1, ClassName)
                this.gameStatus = false
                this.initMove()
                this.code = null
                this.$toast(msg)
                return paramas
              }
            }).then((options) => {
              const { index, ClassName } = options
              console.log('在此处弹出中奖', index, ClassName)
              {
              if (this.code == '0') {
                this.$refs.Markbox.showMark()
              }
              if (typeof this.source == 'function') {
                this.source('非常抱歉，网络异常！')
              }
              this.Class.splice(index, 1, ClassName)
              this.showdraw = false
              }
            })
            .catch(err => {
              console.log('开始抽奖出现异常', err)
              const network = err.toString().includes('Network')
              const timeout = err.toString().includes('timeout')
              const msg = '非常抱歉，网络异常！'
              if (network || timeout) {
                clearTimeout(this.animationTimer) // 消除延迟动画
                this.errorIsMember = true
                this.errorMessage = msg
                this.errorShow = true
                this.Class.splice(index, 1, ClassName)
                this.initMove()
                this.code = null
                this.gameStatus = false
                console.log(err)
              } else {
                console.log('应该到这里')
                clearTimeout(this.animationTimer) // 消除延迟动画

                const { ticket, memberCard } = getLocalStorage()

                if (ticket && memberCard) {
                  console.log('仅限会员，已登录')
                } else {
                  console.log('仅限会员, 未登录')
                  this.errorIsMember = true
                }

                this.errorMessage = err.toString()
                this.errorShow = true
                this.Class.splice(index, 1, ClassName)
                setTimeout(() => {
                  this.gameStatus = false
                }, 1500)
                this.initMove()
                this.code = null
                console.log(err)
              }
            })
        }
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
    },
    // 开始
    start() {
      console.log('开始')
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

.home {
  width: 100vw;
  min-height: 100vh;
  background:var(--color);
  padding-bottom: 1vw;

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
      width: 9.6vw;
      height: 9.6vw;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 50%;
      overflow: hidden;
      top: 8%;
      right: 6%;

      audio {
        display: none;
      }

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
      &>li {
        margin-bottom: 2vw;
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
        min-width: 68vw;
        height: 8vw;
        font-size: 3vw;
        color: #bc5700;
        padding: 0 4vw;
        text-align: center;
        background: #fee50b;
        line-height: 8vw;
        border-radius: 7vw;

        & mark {
          background: none;
          color: #bc5700;
        }
      }
    }

    .Winninginfo {
      position: relative;
      background:var(--color);

      filter: grayscale(30%); 
      -webkit-filter: grayscale(30%); 
      -moz-filter: grayscale(30%);
      -ms-filter: grayscale(30%);
      -o-filter: grayscale(30%);
      opcacity:0.5;


      overflow: hidden;
      border-radius: 1.3vw;
      margin: 0 auto;
      width: 92vw;
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
          background:var(--color);
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

    .game {
      margin-top: 2vw;
      margin-bottom: 4vw;

      .box {
        width: 92vw;
        margin: 0 auto;
        position: relative;
        height: 75vw;

        & > li {
          width: 28vw;
          height: 36vw;
          text-align: center;
          position: relative;
          border-radius: 2vw;
          transition: all 0.5s;
          overflow: hidden;
          position: absolute;
          transform-style: preserve-3d;
          perspective: 1000;
          box-sizing: border-box;

          & > img {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            background-size: 100%;
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
            background-size: 100%;
            animation:shaking 0.5s ease-in-out;
            box-shadow:rgb(11, 234, 235) 0px 0px 10px inset;
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
  animation: draw2 1s linear forwards;
}

.drawAnimaturn {
  z-index: 1000;
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
