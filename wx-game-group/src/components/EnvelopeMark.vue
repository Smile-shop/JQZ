<template>
  <div class="mark" ref="mark" v-show="cutover">
    <div class="flash-share" v-show="getredEnveShareInfo && isRegister">
      <i />
      <p>分享给好友或朋友圈，增加{{shareAdd}}次游戏机会</p>
    </div>
    <div class="blin"></div>
    <div class="caidai"></div>
    <div class="container">
      <div class="first-gold"></div>
      <div class="second-gold"></div>
      <div class="there-gold"></div>
      <div class="winning reback">
        <div class="red-body">
          <div :class="prize ? 'win-title' : 'unfortunately'"></div>
          <ul>
            <li v-if="prize">
              <img :src="Pumping.gifUrl" class="giftImg" />
            </li>
            <li v-else>
              <img src="../assets/images/wzj.png" class="giftImg" />
            </li>
            <li>
              <p class="title">{{prize ? '恭喜您中了'+Pumping.text : '很遗憾您与大奖擦肩而过!'}}</p>
            </li>
            <li>
              <p class="text" v-show="productType  === '2' ">您可前往"会员中心-优惠券"中查看</p>
            </li>
            <li v-show="chance">
              <p class="text">
                <span>
                  剩余
                  <i style="color:#e5b293;font-style: normal;">{{chance}}</i> 次机会
                </span>
                <span>(本次抽奖消耗{{consumeIntegral}}积分)</span>
              </p>
            </li>
            <li>
              <span
                target="_self"
                class="btn"
                @click="markBtn"
                :style="btnStatus ? activebtn : disablebtn"
              >{{BtnText}}</span>
            </li>
            <li class="register" @click="register" v-show="!isRegister">还不是会员, 点此注册</li>
          </ul>
        </div>
        <span class="close-icon" @click="Close"></span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import { toLogin, toRegister } from '@/utils/login-handle'
import { getLocalStorage, setGiftStorage } from '@/utils'
export default {
  name: '',
  props: {
    shareAdd: {
      type: Number,
      default: () => 1
    },
    share: {
      type: String,
      default: () => '0'
    }
  },
  data() {
    return {
      cutover: false,
      disablebtn: {
        background: '#eeeeee',
        color: '#999999'
      },
      ticket: '',
      activebtn: {
        background: '#ffd400',
        color: '#d24903'
      },
      btnStatus: true,
      isRegister: ''
    }
  },

  computed: {
    ...mapGetters(['getflopGiftInfo', 'getflopRegister', 'getredEnveShareInfo']),
    ...mapState({
      markStatus: state => state.game.markStatus,
      Pumping: state => state.game.Pumping,
      BtnText: state => state.game.Marktext,
      MarkBtnstatus: state => state.game.MarkBtnstatus,
      MarkLinkstatus: state => state.game.MarkLinkstatus,
      ActiveData: state => state.game.GameActiveData
    }),
    productType: function() {
      let result = 0
      const { ticket } = getLocalStorage()
      if (ticket) {
        result = this.Pumping.productType ? this.Pumping.productType : ''
      }
      return result
    },
    chance: function() {
      let result = 0
      const num = Number(this.Pumping.remainNum)
      if (num > 0) {
        result = num
      }

      return result
    },
    prize: function() {
      let result = false
      const flag = this.Pumping.text
      if (flag) {
        result = true
      }

      return result
    },
    consumeIntegral: function() {
      let result = 0
      const num = Number(this.Pumping.consumeIntegral)
      if (num > 0) {
        result = num
      }

      return result
    },
    cliam: function() {
      let result = true
      const { ticket } = getLocalStorage()
      const type = Number(this.Pumping.productType)
      if (ticket && type === 2) {
        result = false
      }
      return result
    }
  }, //监听属性 类似于data概念
  created() {
    this.login()
  },
  beforeMount() {},

  mounted() {
    const localStorageData = getLocalStorage()
    let { ticket } = localStorageData
    this.ticket = ticket
    let markElement = this.$refs.mark
    if (markElement) {
      markElement.addEventListener(
        'touchmove',
        function(e) {
          e.stopPropagation()
          e.preventDefault()
          return false
        },
        false
      )
    }
  },

  methods: {
    ...mapMutations(['setmarkStatus']),
    login() {
      const { ticket } = getLocalStorage()
      this.isRegister = ticket
    },
    register() {
      const data = this.Pumping
      this.saveGiftInfo(data)
      toRegister()
    },
    showMark() {
      this.cutover = true
    },
    saveGiftInfo(winGifInfo) {
      const path = this.$route.path
      const options = {
        path,
        gift: winGifInfo
      }
      const formatO = JSON.stringify(options)
      setGiftStorage.save(formatO)
    },
    clearGiftInfo() {
      setGiftStorage.save('')
    },
    Close() {
      console.log('关闭中奖结果')
      this.clearGiftInfo()
      this.cutover = false
      setTimeout(() => {
        this.$emit('closeMark')
      }, 300)
    },
    redeem() {
      const { orderId } = this.getflopGiftInfo
      if (orderId) {
        window.location.href = `${this.httpUrl}/wx_member/gift/index.html#/data?id=${orderId}`
        this.Close()
      }
    },
    markBtn() {
      this.cutover = false
      if (this.MarkLinkstatus == 1) {
        const giftData = this.Pumping
        this.saveGiftInfo(giftData)
        toLogin()
      } else if (this.MarkLinkstatus == 2) {
        this.redeem()
      } else if (this.MarkLinkstatus == 0) {
        setTimeout(() => {
          this.$emit('closeMark')
        }, 300)
        this.clearGiftInfo()
      } else if (this.MarkLinkstatus === 3) {
        this.redeem()
      }
    }
  },
  watch: {
    MarkBtnstatus(newVal) {
      if (newVal) {
        this.btnStatus = true
      } else {
        this.btnStatus = false
      }
    },
    Pumping: {
      handler() {},
      deep: true
    }
  } //监控data中的数据变化
}
</script>
<style lang='stylus' scoped>
.mark {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10000;
  width: 100vw;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);

  .flash-share {
    position: fixed;
    top: 5vw;
    right: 3vw;
    width: 72vw;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    z-index: 99;

    i {
      position: fixed;
      top: 3vw;
      right: 3vw;
      width: 8.3vw;
      height: 8.3vw;
      background: url('./layout/images/arrow.png') no-repeat center / 100%;
    }

    p {
      font-size: 4vw;
      position: fixed;
      top: 13.3vw;
      right: 3vw;
      padding: 2vw;
      background-color: #000000 !important;
      border-radius: 2vw;
    }
  }

  .blin {
    width: 100%;
    height: 100%;
    background: url('../assets/images/components/bingo/gold.png') center no-repeat;
    background-size: 100%;
    animation: circle 10s linear infinite;
  }

  .caidai {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
  }

  .container {
    display: flex;
    width: 100vw;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    justify-content: center;
    align-items: center;

    .first-gold {
      position: absolute;
      top: 61vw;
      left: -2vw;
      z-index: 3;
      width: 14vw;
      height: 14vw;
      background: url('../assets/images/first-gold.png') center no-repeat;
      background-size: contain;
    }

    .second-gold {
      position: absolute;
      top: 78vw;
      right: 5vw;
      z-index: 3;
      width: 12vw;
      height: 12vw;
      background: url('../assets/images/second-gold.png') center no-repeat;
      background-size: contain;
    }

    .there-gold {
      position: absolute;
      top: 93vw;
      left: 6vw;
      z-index: 3;
      width: 9vw;
      height: 9vw;
      background: url('../assets/images/there-gold.png') center no-repeat;
      background-size: contain;
    }

    .win-title {
      position: absolute;
      top: 2.5vw;
      width: 84vw;
      height: 8vw;
      background: url('../assets/images/jackpot.png') center no-repeat;
      background-size: contain;
    }

    .unfortunately {
      position: absolute;
      top: 2.5vw;
      width: 84vw;
      height: 8vw;
      background: url('../assets/images/unfortunately.png') center no-repeat;
      background-size: contain;
    }

    .winning {
      width: 84vw;
      height: 100vw;
      z-index: 1;
      transform: scale(0.1);
      background: url('../assets/images/winEnvelope.png') no-repeat;
      background-size: cover;

      .red-head {
        position: relative;
        top: -0.33333333rem;
        width: 100%;
        height: 23vw;
        background: url('../assets/images/hyh.png') no-repeat;
        background-size: 100%;
        z-index: 10;
      }

      .winningImg {
        position: relative;
        top: -0.33333333rem;
        width: 100%;
        height: 23vw;
        background: url('../assets/images/zjl.png') no-repeat;
        background-size: 100%;
        z-index: 10;
      }

      .red-body {
        position: relative;
        z-index: 2;
        width: 100%;
        background-size: 80% 100%;
        text-align: center;
        box-sizing: border-box;

        & > ul {
          width: 68vw;
          margin: 0 auto;
          border-radius: 4vw;
          padding-top: 10.5vw;

          & > li:first-child {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 35vw;
          }

          & > li {
            text-align: center;
            margin-bottom: 1vw;
          }

          .register {
            cursor: pointer;
            margin-bottom: 2vw;
            color: #ffffff;
          }

          .giftImg {
            max-width: 45vw;
            max-height: 30vw;
          }
        }

        & > ul>li:nth-child(2) {
          margin-bottom: 2vw;
          margin-top: 12vw;
        }

        .title {
          font-size: 4vw;
          color: #ffef37;
          letter-spacing: 0.5vw;
          font-weight: 500;
        }

        .text {
          color: #fff;
          font-size: 3.3vw;
          letter-spacing: 0.1vw;

          & > em {
            color: #fade7a;
            font-size: 3vw;
            font-style: normal;
          }
        }

        .btn {
          z-index: 2;
          width: 58vw;
          height: 11vw;
          background-size: 100%;
          animation: shake 0.5s 2 linear alternate;
          border-radius: 2rem;
          font-size: 4vw;
          text-align: center;
          line-height: 10vw;
          display: inline-block;
          margin: 0 auto;
          background: url('../assets/images/an-bg.png') no-repeat;
          background-size: 100% 100%;
          color: #fff;
          margin-top: 2vw;
          margin-bottom: 1vw;
          box-sizing: border-box;
          letter-spacing: 1px;
          font-weight: 500;
        }
      }

      .card {
        position: absolute;
        left: 5vw;
        top: 35vw;
        z-index: 1;
        width: 73vw;
        height: 43vw;
        transition: top 0.5s;
        background-size: 100% 100%;
        animation: Upward 0.5s linear 2s forwards;

        .win {
          display: block;
          margin: 2vw auto;
          width: 93%;
          height: 48vw;
        }
      }
    }
  }

  .reback {
    animation: reback 0.5s linear forwards;
  }
}

.close-icon {
  position: absolute;
  right: 37vw;
  // right: 0;
  // top: -10vw;
  top: 100vw;
  z-index: 10;
  width: 8vw;
  height: 8vw;
  background: url('../assets/images/close-white.png') center no-repeat;
  background-size: 100%;
  animation: fadein 0.5s 0.5s linear forwards;
  cursor: pointer;
}

@keyframes circle {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes reback {
  100% {
    transform: scale(1);
  }
}

@keyframes Upward {
  10% {
    height: 20vw;

    .win {
      height: 8vw;
    }
  }

  50% {
    top: 15vw;
    height: 53vw;
  }

  100% {
    top: 0vw;
  }
}
</style>