<template>
  <div class="mark" ref="mark" v-if="markStatus">
    <div class="flash-share" v-show="islogin && getJggShareInfo">
      <i />
      <p>分享给好友或朋友圈，增加{{shareAdd}}次游戏机会</p>
    </div>
    <div class="blin"></div>
    <div class="caidai"></div>
    <div class="container">
      <div class="winning reback">
        <div class="red-head"></div>
        <div class="red-body">
          <ul>
            <li>
              <p class="title" v-if="getLoginInfo">{{getLoginInfo}}</p>
              <p class="title" v-else>{{prize ? '恭喜您，中了'+ Pumping.text : '很遗憾，您与大奖擦肩而过'}}</p>
            </li>
            <li>
              <p v-show="getJggProductType === '2'" class="text">您可前往“会员中心-优惠券”中查看</p>
            </li>
            <li>
              <p class="text">
                <span>剩余 {{Pumping.remainNum}} 次机会</span>
                <span>(本次抽奖消耗{{consumeIntegral}}积分)</span>
              </p>
            </li>
            <li>
              <span
                v-if="getJggProductType === '1'"
                target="_self"
                class="btn"
                @click="markBtn"
                :style="btnStatus ? activebtn : disablebtn"
              >{{BtnText}}</span>
              <span
                v-else
                target="_self"
                class="btn"
                @click="markBtn"
                :style="btnStatus ? activebtn : disablebtn"
              >{{BtnText}}</span>
            </li>
            <li class="register">
              <span v-show="!isRegister" @click="_toRegister">{{getJggRegister}}</span>
            </li>
          </ul>
        </div>
        <div class="card">
          <span
            class="win"
            :style="{backgroundImage:'url('+Pumping.gifUrl+')',backgroundRepeat:'no-repeat',backgroundSize: '100% 100%'}"
          ></span>
        </div>
        <span id="close" @click="Close"></span>
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
    show: {
      type: String,
      default: () => '1'
    },
    share: {
      type: String,
      default: () => '1'
    }
  },
  data() {
    return {
      islogin: false, // 登录情况
      disablebtn: {
        background: '#eeeeee',
        color: '#999999'
      },
      ticket: '',
      activebtn: {
        background: '#ffef37',
        color: '#fd4859'
      },
      btnStatus: true,
      isRegister: ''
    }
  },

  created() {
    this.login()
  },

  components: {},

  computed: {
    ...mapState({
      markStatus: state => state.game.markStatus,
      Pumping: state => state.game.Pumping,
      markData: state => state.game.GameActiveData,
      BtnText: state => state.game.Marktext,
      MarkBtnstatus: state => state.game.MarkBtnstatus,
      MarkLinkstatus: state => state.game.MarkLinkstatus,
      ActiveData: state => state.game.GameActiveData
    }),
    ...mapGetters([
      'getJggProductType',
      'getJggRegister',
      'getJggCoupon',
      'getJggShareInfo',
      'getJggGiftInfo',
      'getLoginInfo'
    ]),
    consumeIntegral: function() {
      let result = 0
      const num = Number(this.Pumping.consumeIntegral)
      if (num > 0) {
        result = num
      }

      return result
    },
    prize: function() {
      let result = false
      const text = this.Pumping.text
      if (text) {
        result = true
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
    register: function() {
      let result = false
      const { ticket } = getLocalStorage()
      const toReg = this.getJggRegister
      if (!ticket && toReg) {
        result = true
      }

      return result
    }
  },
  mounted() {
    const localStorageData = getLocalStorage()
    let { ticket } = localStorageData
    if (ticket) {
      this.islogin = true
    }
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
    ...mapMutations(['setmarkStatus', 'setwinningIndex']),
    login() {
      const { ticket } = getLocalStorage()
      this.isRegister = ticket
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
      this.clearGiftInfo()
      this.setmarkStatus(false)
      this.setwinningIndex(null)
      setTimeout(() => {
        this.$emit('starturn')
      }, 300)
    },
    redeem() {
      const { orderId } = this.getJggGiftInfo
      if (orderId) {
        window.location.href = `${this.httpUrl}/wx_member/gift/index.html#/data?id=${orderId}`
        this.Close()
      }
    },
    markBtn() {
      this.setmarkStatus(false)
      this.setwinningIndex(null)

      if (this.MarkLinkstatus == 1) {
        const gift = this.Pumping
        this.saveGiftInfo(gift)
        toLogin()
      } else if (this.MarkLinkstatus == 2) {
        this.redeem()
      } else if (this.MarkLinkstatus == 0) {
        setTimeout(() => {
          this.$emit('starturn')
        }, 300)
        this.clearGiftInfo()
      } else if (this.MarkBtnstatus == 3) {
        this.redeem()
      }
    },
    _toRegister() {
      toRegister()
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
  z-index: 10;
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
      width: 84vw;
      height: 80vw;
      z-index: 1;
      transform: scale(0.1);

      .red-head {
        position: relative;
        top: -0.33333333rem;
        width: 100%;
        height: 58vw;
        background: url('../assets/images/components/bingo/top.png') no-repeat;
        background-size: 100%;
      }

      .red-body {
        position: relative;
        top: -33vw;
        z-index: 2;
        width: 100%;
        height: 62vw;
        background: url('../assets/images/components/bingo/bottom.png') no-repeat;
        background-size: 100% 100%;
        text-align: center;
        box-sizing: border-box;
        padding-top: 22vw;

        & > ul {
          height: 35vw;
        }

        & > ul>li:nth-child(2) {
          margin-top: 3.5vw;
          margin-bottom: 2vw;
        }

        .title {
          font-size: 5vw;
          color: #ffef37;
        }

        .text {
          color: #fff;
          font-size: 3vw;
          margin-bottom: 1vw;
        }

        .btn {
          z-index: 2;
          min-width: 48vw;
          height: 9vw;
          background-size: 100%;
          animation: shake 0.5s 2 linear alternate;
          background: #FFEF37;
          border-radius: 2rem;
          font-size: 4vw;
          text-align: center;
          line-height: 9vw;
          display: inline-block;
          margin: 0 auto;
          padding: 0 15px;
        }
      }

      .card {
        position: absolute;
        left: 5vw;
        top: 40vw;
        z-index: 1;
        width: 73vw;
        height: 42vw;
        background: url('../assets/images/components/bingo/middle.png') no-repeat;
        transition: top 0.5s;
        background-size: 100% 100%;
        animation: Upward 0.5s linear 1s forwards;

        .win {
          display: block;
          margin: 2vw auto;
          width: 90%;
          height: 90%;
        }
      }
    }

    .register {
      margin-top: 0.2rem;
      color: #ffffff;
      font-size: 4vw;
    }
  }

  .reback {
    animation: reback 0.5s linear forwards;
  }
}

#close {
  position: absolute;
  right: 39vw;
  top: 87vw;
  z-index: 10;
  width: 8vw;
  height: 8vw;
  background: url('../assets/images/components/bingo/close-red.png') center no-repeat;
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