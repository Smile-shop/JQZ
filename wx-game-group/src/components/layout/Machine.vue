<template>
  <div ref="machine" class="machine">
    <div class="scroll-view">
      <div ref="machine1" class="slotMachine">
        <div
          v-for="(item, index) in activeGifts"
          :key="index"
          class="slot"
          :style="{ background: 'url('+item.imgName+') no-repeat center/100%' }"
        />
      </div>
      <div ref="machine2" class="slotMachine">
        <div
          v-for="(item, index) in activeGifts"
          :key="index"
          class="slot"
          :style="{ background: 'url('+item.imgName+') no-repeat center/100%' }"
        />
      </div>
      <div ref="machine3" class="slotMachine">
        <div
          v-for="(item, index) in activeGifts"
          :key="index"
          class="slot"
          :style="{ background: 'url('+item.imgName+') no-repeat center/100%' }"
        />
      </div>
    </div>
    <div class="lights">
      <i v-for="(item, index) in 14" :key="index" class="light-item" />
    </div>
    <div class="lights lights-left">
      <i v-for="(item, index) in 5" :key="index" class="light-item" />
    </div>
    <div class="lights lights-left lights-right">
      <i v-for="(item, index) in 5" :key="index" class="light-item" />
    </div>
    <div class="lights lights-bottom">
      <i v-for="(item, index) in 14" :key="index" class="light-item" />
    </div>
    <div class="text">
      <p>
        活动时间：
        <span>{{ gameDetail.beginTime && gameDetail.beginTime.split(' ')[0] }}</span> 至
        <span>{{ gameDetail.endTime && gameDetail.endTime.split(' ')[0] }}</span>
      </p>
      <p class="member-level" v-show="islogin">
        <span class="level">会员等级：{{gameDetail.level}}</span>
        <span class="integral-level">可用积分：{{Number(gameDetail.creditUsable)}}</span>
      </p>
    </div>
    <div class="integral">
      <p>
        今日还有
        <span
          v-if="gameDetail.isNum === '0'"
        >{{ gameDetail.remainNum > 0 ? gameDetail.remainNum : 0 }}</span>
        <span v-else>{{gameDetail.remainNum !== null ? gameDetail.remainNum : '无数'}}</span>
        次抽奖机会
        <span
          v-if="gameDetail.isMember === '0'"
        >（每次消耗{{ gameDetail.consumeIntegral }}积分）</span>
        <span v-else>（不消耗积分）</span>
      </p>
    </div>
    <button :disabled="buttonDisable" class="rule button" @click="toPage('rule')" />
    <button
      class="start button"
      :disabled="buttonDisable"
      :class="{'disabled-btn': buttonDisable}"
      @click="startLotteryDraw"
    />
    <button class="my button" :disabled="buttonDisable" @click="gohome" />
    <button class="finger button" />
    <span class="cup-bg" />
    <h3 class="reward-title">中奖名单</h3>
    <div v-if="winningGiftList.length" class="roll reward-list">
      <ul>
        <li v-for="(item,index) in winningGiftList" :key="index">
          <img v-if="item.imgUrl" :src="item.imgUrl" alt="avatar" />
          <img v-else src="../layout/images/default-avatar.jpg" alt="avatar" />
          <span>{{ item.record }}</span>
        </li>
      </ul>
    </div>
    <div v-else class="roll reward-list empty-msg">
      <span>暂无中奖用户</span>
    </div>
    <winning-dialog
      :shareNum="num"
      :share="toshare"
      :show.sync="winningDialogShow"
      :userMember="isMember"
      :detail="gameDetail"
      :gift="winningGift"
      @close="toClose"
    />
    <ShareQR :show.sync="qrcodeShow">
      <img v-if="shareData.publicAccount" :src="shareData.publicAccount" alt class="qrcode" />
    </ShareQR>
  </div>
</template>

<script>
import baseUrl from '@/config/config'
import { EventBus } from '@/utils/event-bus'
import { getLocalStorage, setStorage } from '@/utils'
import {
  giftRecords,
  activeInProducts,
  startDraw,
  queryShare,
  gameDetails
} from '@/axios/tiger'
import 'jquery-slotmachine/dist/slotmachine.min'
import WinningDialog from '../dialog/Winning'
import ShareQR from '../dialog/ShareQR'
import { mapMutations } from 'vuex'

export default {
  components: {
    ShareQR,
    WinningDialog
  },
  props: {
    shareData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      toshare: true, // 今日分享
      num: 0, // 分享增加次数
      inited: false,
      loading: true,
      winningIdx: '',
      baseUrl,
      qrcodeShow: false,
      userInfo: getLocalStorage(),
      gameDetail: {},
      winningGift: {},
      activeGifts: [],
      winningGiftList: [],
      winningDialogShow: false,
      buttonDisable: false, // 节流
      isMember: false, // 会员情况
      islogin: false, // 登录情况
      el1: {},
      el2: {},
      el3: {},
      machine1: {},
      machine2: {},
      machine3: {}
    }
  },
  watch: {
    winningDialogShow(flag) {
      if (!flag) {
        // 强制刷新游戏组件 会弹出二维码，注释后待测试
        // this.$emit('refresh')
      }
    }
  },
  async mounted() {
    this.init()
  },
  created() {
    this.loginCase()
    this.getqueryShare()
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
    toClose() {
      this.winningDialogShow = false
    },
    getqueryShare() {
      const { id } = this.$route.query
      const options = {
        activeId: id
      }
      queryShare(options).then(res => {
        const { msg, data, code } = res
        this.num = data.shareCount
      })
    },
    loginCase() {
      const { ticket, memberCard } = getLocalStorage()
      console.log('会员情况', ticket, memberCard)
      // 是否登录
      if (ticket && memberCard) {
        this.islogin = true
      }
      // 是否登录和会员情况
      if (ticket && memberCard) {
        this.isMember = false
      } else {
        this.isMember = true
      }
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
    async init() {
      this.inited = false
      const { id } = this.$route.query
      const options = {
        activeId: id
      }
      Promise.all([
        this._getWinningGiftList(options),
        this._getGameDetail(),
        this._getActiveGifts(options)
      ])
        .then(() => {
          this._initScorll()
          this.inited = true
        })
        .catch(err => {
          console.log(err, '初始化失败')
        })
    },
    startLotteryDraw() {
      setTimeout(() => {
        this.buttonDisable = true
      }, 20)
      if (this.inited) {
        this.startScorll()
      } else {
        setTimeout(() => {
          this.buttonDisable = false
        }, 20)
        alert('初始化中,请稍后再试')
      }
    },
    gohome() {
      location.href = `${baseUrl}/wx_member/gift/index.html#/gift`
    },
    async _getGameDetail() {
      try {
        const { id } = this.$route.query
        const activeId = id
        const options = {
          id: activeId,
          memberCard: this.userInfo.memberCard
        }
        const { data } = await gameDetails(options)
        this.gameDetail = data
        this.qrcodeShow =
          Number(this.userInfo.subscribe) !== 1 &&
          Number(this.shareData.isShare) === 1
        this.toshare = data.toDayShare ? false : true // 成功 1 ，其他 null
      } catch (error) {
        this.buttonDisable = true
      }
    },
    async _getActiveGifts() {
      try {
        const { id } = this.$route.query
        const options = {
          activeId: id
        }
        const { data } = await activeInProducts(options)

        let activeData = []
        activeData = data.map(val => {
          return {
            gifUrl: val.imgName,
            text: val.productName,
            jmpGiftCode: val.jmpGiftCode,
            sequence: val.sequence
          }
        })
        this.setproductGift(activeData)

        this.activeGifts = data
      } catch (error) {
        this.activeGifts = []
      }
    },
    async _getWinningGiftList() {
      try {
        const { id } = this.$route.query
        const options = {
          activeId: id
        }
        const { data } = await giftRecords(options)
        this.winningGiftList = data.list
      } catch (error) {
        this.winningGiftList = []
      }
    },
    _closeLoading() {
      this.loading = false
    },
    _initScorll() {
      if (!this.activeGifts || this.activeGifts.length === 0) {
        return
      }
      const len = this.activeGifts.length
      function RandomNumBoth(Min = 0, Max = len) {
        var Range = Max - Min
        var Rand = Math.random()
        var num = Min + Math.round(Rand * Range)
        return num
      }
      this.el1 = this.$refs.machine1
      this.el2 = this.$refs.machine2
      this.el3 = this.$refs.machine3

      // eslint-disable-next-line
      this.machine1 = new SlotMachine(this.el1, {
        active: RandomNumBoth(),
        delay: 500
      })
      // eslint-disable-next-line
      this.machine2 = new SlotMachine(this.el2, {
        active: RandomNumBoth(),
        delay: 500
      })
      // eslint-disable-next-line
      this.machine3 = new SlotMachine(this.el3, {
        active: RandomNumBoth(),
        delay: 500
      })

      this._closeLoading()
    },
    upateCreditUsable(creditUsable) {
      this.gameDetail.creditUsable = creditUsable
    },
    // 请求抽奖接口
    async _getWinningIdx() {
      const { id } = this.$route.query
      const activeId = id
      const memberCard = this.userInfo.memberCard
      const options = {
        id: activeId,
        memberCard
      }

      const { data } = await startDraw(options).catch(() => {
        this.buttonDisable = false
      })
      console.log('中奖返回信息', data, Date.now())
      this.activeGifts.forEach((item, idx) => {
        if (item.jmpGiftCode === data.giftCode) {
          this.winningGift = item
          this.winningIdx = idx
        }
      })

      const { creditUsable } = data
      this.upateCreditUsable(creditUsable)

      this.winningGift = Object.assign(this.winningGift, data)

      console.log('处理后的中奖信息', this.winningGift, this.winningIdx)
    },
    _checkRules() {
      const {
        isMember,
        creditUsable,
        consumeIntegral,
        remainNum,
        isNum,
        userMember
      } = this.gameDetail

      if (!(isNum === '1' && isMember === '1')) {
        // 仅限会员，不限参与次数，消耗积分
        if (isMember === '0' && isNum === '1') {
          if (userMember === '1') {
            if (Number(creditUsable) < Number(consumeIntegral)) {
              // alert('积分不足!')
              EventBus.$emit('netError', true, '积分不足!')
              return false
            }
          } else {
            // 用户非会员时，不允许抽奖
            EventBus.$emit('checkMember', true)
            return false
          }
        } else if (isMember === '1' && isNum === '0') {
          // 所有用户，限参与次数，不消耗积分，消耗次数
          if (remainNum <= 0) {
            // alert('参与次数超限，明天再来吧！')
            EventBus.$emit('netError', true, '参与次数超限，明天再来吧！')
            return false
          }
        } else {
          if (String(userMember) === '1') {
            // 仅限会员，限参与次数，消耗积分，消耗次数
            if (
              Number(creditUsable) < Number(consumeIntegral) ||
              Number(remainNum) <= 0
            ) {
              // alert('积分不足或参与次数超限，可分享朋友圈可参与次数！')
              EventBus.$emit(
                'netError',
                true,
                '积分不足或参与次数超限，可分享朋友圈获得参与次数！'
              )
              return false
            }
          } else {
            // 用户非会员时，不允许抽奖
            EventBus.$emit('checkMember', true)
            return false
          }
        }
      }

      return true
    },
    reduceFrequency() {
      // 显示中奖后得消耗次数
      if (this.gameDetail.remainNum && this.gameDetail.remainNum >= 1) {
        this.gameDetail.remainNum -= 1
      }
    },
    // 开始抽奖
    async startScorll() {
      await this._getWinningIdx()
      // this.buttonDisable = true
      console.log('这里执行才有用', this.buttonDisable)

      const rootHeight = this.machine1.element.clientHeight
      const picPostion = this.winningIdx * rootHeight
      console.log('客户端的高度', rootHeight, '位置', picPostion)

      const that = this
      function _completeDefault() {
        this.element.firstChild.style.cssText = `transform: matrix(1, 0, 0, 1, 0, ${-picPostion -
          rootHeight});`
      }

      try {
        const flag = true
        if (flag) {
          // 抽奖中禁止触摸
          if (this.buttonDisable) {
            this.$refs.machine.addEventListener('touchmove', function(event) {
              event.preventDefault()
            })
          }

          console.log('设置转动的3个图像', picPostion, this.winningIdx)
          // 第一列设置
          this.machine1.shuffle(5, function() {
            if (picPostion || that.winningIdx === 0) {
              _completeDefault.call(this)
            } else {
              this.element.firstChild.style.cssText = `transform: matrix(1, 0, 0, 1, 0, ${0 -
                rootHeight});`
            }
          })
          // 第二列设置
          setTimeout(() => {
            this.machine2.shuffle(5, function() {
              if (picPostion || that.winningIdx === 0) {
                _completeDefault.call(this)
              } else {
                this.element.firstChild.style.cssText = `transform: matrix(1, 0, 0, 1, 0, ${0 -
                  rootHeight});`
              }
            })
          }, 1000)
          // 第三列设置
          setTimeout(() => {
            this.machine3.shuffle(5, function() {
              if (picPostion || that.winningIdx === 0) {
                _completeDefault.call(this)
              } else {
                this.element.firstChild.style.cssText = `transform: matrix(1, 0, 0, 1, 0, ${-rootHeight *
                  2});`
              }
            })
          }, 2500)

          setTimeout(() => {
            this.buttonDisable = false
            this.winningDialogShow = true
            this.reduceFrequency()
          }, 1000 * 6)
        } else {
          this.buttonDisable = false
        }
      } catch (error) {
        this.winningDialogShow = false
        this.buttonDisable = false
        this._getActiveGifts()
      }
    }
  }
}
</script>

<style lang='scss' scoped>
@import 'assets/rem.scss';
.slotMachine {
  width: 25.3vw;
  height: 30.3vw;
  overflow: hidden;
  display: inline-block;
  text-align: center;
  background-color: #ffffff;
  border-radius: 0.3rem;
}
.slotMachine:nth-of-type(2) {
  border-left: none;
  border-right: none;
  margin: 0 0.3rem;
}
.slotMachine .slot {
  width: 25.3vw;
  height: 30.3vw;
}

@keyframes glow {
  0% {
    transform: translate3d(0, 0, 0);
    background: #f3d38a;
  }
  100% {
    transform: translate3d(0, 0, 0);
    background: rgba($color: #75413b, $alpha: 0.7);
  }
}
@keyframes updown {
  0% {
    transform: translate3d(0, -20px, 0);
  }
  100% {
    transform: translate3d(0px);
  }
}
@keyframes ani {
  0% {
    transform: translate3d(0);
  }
  100% {
    transform: translate3d(0, -100%, 0);
  }
}
.machine {
  overflow: hidden;
  position: relative;
  width: 96%;
  height: 123.5vw;
  margin: 0 auto;
  background: url('./images/tiger-bg.png') no-repeat center/100%;

  .qrcode {
    width: 9.98667rem;
    height: 9.98667rem;
  }

  .scroll-view {
    box-sizing: border-box;
    position: absolute;
    top: 19.8vw;
    left: 8.8vw;
  }

  .lights {
    display: flex;
    position: absolute;
    left: 7vw;
    top: 16.2vw;
  }

  .light-item {
    display: inline-block;
    margin-left: 3.9vw;
    width: 2.2vw;
    height: 2.2vw;
    border-radius: 50%;
    background: #f3d38a;
    animation: glow 1500ms ease-out infinite alternate;
  }

  .light-item:nth-of-type(1) {
    margin-left: 0;
  }

  .lights-bottom {
    top: 51vw;
  }

  .lights-left {
    display: flex;
    flex-direction: column;
    left: 5.5vw;
    top: 17.5vw;
    .light-item {
      margin-left: 0;
      margin-top: 4vw;
    }
  }

  .lights-right {
    left: 88.4vw;
  }

  .member-level {
    .level {
      margin-right: 2vw;
    }
    .integral-level {
      margin-left: 2vw;
    }
  }

  .integral,
  .text {
    font-size: 3.1vw;
    color: #fe4c00;
    text-align: center;
    margin-top: 4.5vw;
    p {
      line-height: 4.5vw;
    }
  }

  .integral {
    position: absolute;
    color: #fff;
    margin-top: 0;
    top: 57vw;
    left: 18.5vw;
    @media screen and (max-width: 320px) {
      transform: translateX(-15px);
    }
  }

  .reward-list {
    position: absolute;
    top: 103vw;
    left: 6vw;
  }

  .empty-msg {
    span {
      color: #fec957;
    }
    top: px2rem(4000);
    left: px2rem(250);
    font-size: px2rem(36);
  }
  .roll {
    height: 16.5vw;
    overflow: hidden;
    color: #fff;
  }
  .roll ul {
    list-style: none;
    animation: ani 5s linear infinite both; /*动画ani，5s，循环匀速播放*/
  }
  .roll li {
    display: flex;
    font-size: 3.8vw;
    align-items: center;
    line-height: 8vw;
    padding: 0 px2rem(10);
    img {
      width: 6.5vw;
      height: 6vw;
      margin-right: 0.5vw;
    }
  }
  .button {
    width: 14.2vw;
    height: 17.1vw;
    border: none;
    outline: none;
    position: absolute;
    bottom: 32vw;
  }
  .finger {
    width: 14.5vw;
    height: 14vw;
    left: 52.8vw;
    bottom: 33.5vw;
    animation: updown 1s infinite alternate;
    background: url('./images/finger.png') no-repeat center/100%;
  }
  .disabled-btn {
    background: url('./images/go-hover-2.png') no-repeat center/100% !important;
  }
  .start {
    width: 33.8vw;
    height: 28.65vw;
    left: 30.5vw;
    bottom: 31.5vw;
    background: url('./images/go-btn.png') no-repeat center/100%;
  }
  .my {
    right: 10.1vw;
    background: url('./images/my-btn.png') no-repeat center/100%;
  }
  .rule {
    left: 10.1vw;
    background: url('./images/rule-btn.png') no-repeat center/100%;
  }
  .cup-bg {
    position: absolute;
    width: 15vw;
    height: 15vw;
    right: 8.8vw;
    bottom: 4.2vw;
    background: url('./images/cup.png') no-repeat center/100%;
  }
  .reward-title {
    position: absolute;
    bottom: 20.5vw;
    left: 38.5vw;
    font-size: 4.8vw;
    color: #fff;
  }
  .reward-title::before,
  .reward-title::after {
    position: absolute;
    top: 50%;
    content: '';
    display: inline-block;
    height: 1px;
    width: 30vw;
    background: #ffba35;
  }
  .reward-title::after {
    right: 23vw;
  }
  .reward-title::before {
    left: 23vw;
  }
}
</style>
