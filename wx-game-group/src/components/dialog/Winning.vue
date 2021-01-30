<template>
  <div class="winning-dialog">
    <div v-show="show" class="warp">
      <self-mask :is-fixed="show">
        <div class="mask-content">
          <img src="../layout/images/gold.png" alt="gold" class="gold" />
          <div class="content" :class="{'success-bg' : gift.jmpGiftCode}">
            <template v-if="showShareInfo && userInfo.ticket">
              <div v-show="share" class="arrow-wrap">
                <i />
                <p>分享给好友或朋友圈，增加{{ shareNum }}次游戏机会</p>
              </div>
            </template>
            <img v-if="gift.imgName" :src="gift.imgName" class="icon" />
            <img v-else src="../layout/images/cry.png" class="icon" />
            <section class="notice">
              <p v-if="gift.productName">恭喜您获得{{ gift.productName }}！</p>
              <p v-else>很遗憾，您与大奖擦肩而过！</p>
              <p
                v-if="  gift.productType && gift.productType === '2' && userInfo.ticket"
              >你可前往"会员中心-优惠券"中查看</p>
              <p>
                剩余
                <span>{{ gift.remainNum }}</span>&nbsp;次机会
                <span>（本次消耗{{ detail.consumeIntegral }}积分）</span>
              </p>
            </section>
            <button
              v-if="gift.remainNum === 0 && gift.productType === '2'"
              @click="$emit('update:show', false)"
              class="start-btn"
              disabled
            >今日次数已用完，请明天再来</button>
            <button v-else class="start-btn default">
              <span
                v-if="userInfo.ticket && gift.jmpGiftCode && gift.productType === '1'"
                @click="selectStore"
              >选择领取门店</span>
              <span v-else-if="!userInfo.ticket && gift.jmpGiftCode" @click="_toLogin">您还未登录，请登录后领取</span>
              <span v-else @click="$emit('update:show', false)">再来一次</span>
            </button>
            <a v-show="!isRegister" @click="_toRegister" class="reg-notice">还不是会员，点此注册</a>
            <i class="iconfont icon-close close" @click="$emit('update:show', false)" />
          </div>
        </div>
      </self-mask>
    </div>
  </div>
</template>

<script>
import baseUrl from '@/config/config'
import { getLocalStorage } from '@/utils/local-storage'
import { toRegister, toLogin } from '@/utils/login-handle'
import { EventBus } from '@/utils/event-bus'
import SelfMask from '@/components/Mask'
export default {
  components: {
    SelfMask
  },
  props: {
    userMember: {
      type: Boolean,
      default: () => false
    },
    gift: {
      type: Object,
      default: () => {}
    },
    detail: {
      type: Object,
      default: () => {}
    },
    share: {
      type: Boolean,
      default: () => true
    },
    shareNum: {
      type: Number,
      default: () => true
    },
    show: Boolean
  },
  data() {
    return {
      baseUrl,
      showShareInfo: false, // 是否显示分享信息
      userInfo: getLocalStorage(),
      shareInfo: {},
      isRegister: ''
    }
  },
  created() {
    this.login()
  },
  computed: {
    initGift() {
      return this.gift
    }
  },
  mounted() {
    EventBus.$on('getShareInfo', data => {
      this.shareInfo = data
    })
    EventBus.$on('closeShareInfo', flag => {
      this.showShareInfo = flag
    })
  },
  methods: {
    _close() {
      this.$emit('update:show', false)
    },
    go2Page(path) {
      location.href = `${this.baseUrl}${path}`
    },
    selectStore() {
      const { orderId } = this.gift
      if (orderId) {
        window.location.href = `${this.httpUrl}/wx_member/gift/index.html#/data?id=${orderId}`
        this.$emit('close')
      }
    },
    _toRegister() {
      toRegister()
    },
    _toLogin() {
      toLogin()
    },
    login() {
      const { ticket } = getLocalStorage()
      console.log(ticket)
      this.isRegister = ticket
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'assets/rem.scss';
@keyframes slide {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.winning-dialog {
  img.gold {
    position: absolute;
    width: 100vw;
    height: 100vw;
    top: 15%;
    animation: slide 10s linear infinite;
  }
  .arrow-wrap {
    position: fixed;
    top: 1.5vw;
    right: 4vw;
    font-size: 3.7vw;
    color: #fff;
    overflow: hidden;
    width: 70%;
    p,
    i {
      float: right;
    }
    p {
      height: 10vw;
      line-height: 11vw;
      padding: 0 px2rem(10);
      border-radius: px2rem(5);
    }
    i {
      width: 9.3vw;
      height: 9.3vw;
      background: url('../layout/images/arrow.png') no-repeat center/100%;
    }
  }
  .mask-content {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .success-bg {
      background: url('../layout/images/winning-bg.png') no-repeat center/100% !important;
    }
    .content {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 77.5vw;
      height: 108vw;
      background: url('../layout/images/no-winning-bg.png') no-repeat
        center/100%;
      .icon {
        width: 27vw;
        height: 7vw;
        height: 27vw;
        margin-top: 29vw;
      }
      .notice {
        text-align: center;
        font-size: 4.3vw;
        padding: 2.5vw 0;
        color: #fade7a;
        & p:nth-of-type(2) {
          font-size: 3vw;
          color: #fff;
        }
        & p:nth-of-type(3) {
          font-size: 3vw;
          color: #fff;
        }
        p {
          padding: px2rem(5) 0;
        }
      }
      button.start-btn {
        border: 0;
        font-size: 4.3vw;
        color: #999;
        width: 68vw;
        height: 9.5vw;
        border-radius: 40px;
        background: #eee;
        text-align: center;
        span {
          display: inline-block;
          width: 100%;
        }
      }
      button.start-btn.default {
        color: #fd4859;
        background: #ffef37;
      }
      a.reg-notice {
        font-size: 3vw;
        color: #fff;
        line-height: 2.1vw;
        margin-top: 4vw;
        text-decoration: none;
      }
      i.close {
        color: #fff;
        font-size: 9.1vw;
        position: absolute;
        bottom: -10vw;
      }
    }
  }
}
</style>
