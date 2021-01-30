<template>
  <div class="mark" ref="mark" v-show="cutover">
    <div class="flash-share" v-show="getflopShareInfo && isRegister">
      <i />
      <p>分享给好友或朋友圈，增加{{shareAdd}}次游戏机会</p>
    </div>
    <div class="blin"></div>
    <div class="caidai"></div>
    <div class="container">
      <div class="winning reback">
        <div :class="prize ? 'winningImg' : 'red-head'"></div>
        <div class="red-body">
          <ul>
            <li v-if="prize">
              <img :src="Pumping.gifUrl" class="giftImg" />
            </li>
            <li v-else>
              <img src="../assets/images/wzj.png" class="giftImg" />
            </li>
            <li>
              <p class="title">{{prize ? '恭喜您，中了'+Pumping.text: '很遗憾，您与大奖擦肩而过'}}</p>
            </li>
            <li>
              <p class="text" v-show="productType  === '2' ">您可前往"会员中心-优惠券"中查看</p>
            </li>
            <li>
              <p class="text">
                <span v-show="parseInt(Pumping.remainNum)>=0?true:false">
                  剩余
                  <i style="color:#e5b293;font-style: normal;">{{Pumping.remainNum}}</i> 次机会
                </span>
                <span>(本次抽奖消耗{{consumeIntegral}}积分)</span>
              </p>
            </li>
            <li>
              <span
                target="_self"
                class="btn"
                @click="markBtn"
                :style="btnStatus?activebtn:disablebtn"
              >{{BtnText}}</span>
            </li>
            <li class="register" @click="_toRegister" v-show="!isRegister">还不是会员, 点此注册</li>
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
        background: '#e5b293',
        color: '#8719b8'
      },
      btnStatus: true,
      isRegister: ''
    }
  },

  computed: {
    ...mapGetters(['getflopGiftInfo', 'getflopRegister', 'getflopShareInfo']),
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
    cliam: function() {
      let result = true
      const { ticket } = getLocalStorage()
      const type = Number(this.Pumping.productType)
      if (ticket && type === 2) {
        result = false
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
    showMark() {
      this.cutover = true
    },
    _toRegister() {
      toRegister()
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
      this.cutover = false
      this.clearGiftInfo()
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
        const gift = this.Pumping
        this.saveGiftInfo(gift)
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
    background: url('../assets/images/components/bingo/dianzhui.png') center no-repeat;
    background-size: 100%;
    transform: scale(1.2);
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

    .winning {
      position: relative;
      width: 84vw;
      height: 80vw;
      z-index: 1;
      transform: scale(0.1);

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
        top: -26.5vw;
        z-index: 2;
        width: 100%;
        background-size: 80% 100%;
        text-align: center;
        box-sizing: border-box;
        padding-top: 15vw;

        & > ul {
          width: 68vw;
          margin: 0 auto;
          border: 1vw solid #e5b293;
          border-radius: 4vw;
          background: #8719b8;
          padding-top: 13vw;

          & > li:first-child {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 35vw;
          }

          & > li {
            text-align: center;
          }

          .register {
            cursor: pointer;
            margin-top: -2vw;
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
        }

        .title {
          font-size: 4vw;
          color: #ffef37;
        }

        .text {
          color: #fff;
          font-size: 3vw;

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
          margin-top: 4vw;
          background-image: linear-gradient(to bottom, #6313D4, #CE08FF 94%);
          margin-bottom: 5vw;
          box-sizing: border-box;
          letter-spacing: 1px;
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
  right: 39vw;
  top: 100vw;
  z-index: 10;
  width: 8vw;
  height: 8vw;
  background: url('../assets/images/close-white.png') center no-repeat;
  background-size: 100%;
  animation: fadein 0.5s 0.5s linear forwards;
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