<template>
  <transition name="winning-dialog">
    <div
      v-show="visible"
      class="winning-dialog"
    >
      <transition name="shade">
        <div
          v-show="visible"
          class="shade">
        </div>
      </transition>
      <div v-show="visible && isShowShare" class="share">
        <img src="./assets/images/arrow.png" alt="箭头">
        <p>分享给好友或朋友圈，增加{{shareAddCount}}次游戏机会</p>
      </div>
      <transition name="main">
        <main
          v-show="visible"
          class="winning-dialog-container"
          ref="winningDialogContainer"
        >
          <div class="style-images">
            <img class="background" :src="styleImages.background" alt="光">
            <img class="wrapper" :src="styleImages.wrapper" alt="盒子">
          </div>
          <div class="content">
            <div class="title">
              <span
                v-if="lotteryInfo.comfortPrize == 1"
              >
                安慰奖
              </span>
              <span
                v-else-if="lotteryInfo.giftCode"
              >
                中奖啦
              </span>
              <span
                v-else
              >
                好遗憾
              </span>
            </div>
            <div class="prize-image">
              <img
                v-if="lotteryInfo.giftCode"
                :src="lotteryInfo.imgName"
                alt="图片"
              >
              <img
                v-else
                src="./assets/images/not-winning.png"
                alt="图片"
              >
            </div>
            <div class="prize-info">
              <!-- 中奖 -->
              <div
                v-if="lotteryInfo.giftCode"
                class="winning"
              >
                <p class="info">
                  恭喜您获得{{lotteryInfo.productName}}！
                </p>
                <p
                  class="tip"
                  v-if="lotteryInfo.productType == 2"
                >
                  您可前往“会员中心-优惠券”中查看
                </p>
              </div>
              <!-- 没中奖 -->
              <div
                v-else
                class="not-winning"
              >
                <p class="info">
                  哎呀~与奖品只有一步之遥了！
                </p>
              </div>
              <!-- 剩余次数与消耗积分 -->
              <p class="remain-count">
                <span>
                  剩余<mark>{{lotteryInfo.remainNum}}</mark>次机会
                </span>
                <span
                  v-if="lotteryInfo.consumeIntegral > 0"
                >
                （本次抽奖消耗{{lotteryInfo.consumeIntegral}}积分）
                </span>
              </p>
            </div>
            <div class="control">
              <div class="button-group">
                <button
                  v-if="lotteryInfo.remainNum == 0"
                  :disabled="lotteryInfo.remainNum == 0"
                >
                  可玩次数已用完
                </button>
                <button
                  v-if="lotteryInfo.remainNum > 0"
                  @click="again"
                >
                  再来一次
                </button>

                <button
                  v-if="isLogin && isMember && lotteryInfo.productType == 1"
                  @click="selectShop"
                >
                  选择领取门店
                </button>
                <button
                  v-else-if="isMember && lotteryInfo.productType == 1"
                  @click="login"
                >
                  请登录后领取
                </button>
              </div>
              <p
                v-if="!isMember"
                class="register"
              >
                <a
                  @click="register"
                >
                  还不是会员？点此注册
                </a>
              </p>
            </div>
          </div>
          <div
            @click="close"
            class="close"
          >
            <img :src="styleImages.close" alt="关闭">
          </div>
        </main>
      </transition>
    </div>
  </transition>
</template>

<script>
import { getLocalStorage } from '@/utils'
import { toLogin, toRegister } from '@/utils/login-handle'

export default {
  data() {
    return {
      isLogin: false,
    }
  },
  props: {
    // 是否是会员
    isMember: {
      type: Boolean,
      required: true,
      default: false,
    },
    // 是否显示, 使用.sync
    visible: {
      type: Boolean,
      required: true,
      default: false,
    },
    // 是否显示分享
    isShowShare: {
      type: Boolean,
      required: false,
      default: true,
    },
    // 分享添加抽奖次数
    shareAddCount: {
      type: Number,
      required: false,
      default: 1,
    },
    // 中奖信息
    lotteryInfo: {
      type: Object,
      required: true,
      default() {
        return {
          // 剩余次数
          remainNum: 0,
          // 使用积分
          consumeIntegral: 0,
          // 奖品code
          giftCode: '',
          // 奖品类型 1、实物 2、优惠券 3、积分
          productType: '',
          // 产品名称
          productName: '',
          // 奖品id
          giftId: 0,
          // 可用积分
          creditUsable: 0
        }
      }
    },
    // 样式图片
    styleImages: {
      type: Object,
      required: false,
      default() {
        return {
          // 保住内容的图片
          wrapper: './assets/images/cat-and-mouse/winning-dialog-container.png',
          // 旋转的背景
          background: './assets/images/cat-and-mouse/winning-dialog-background.png',
          // 按钮
          button: './assets/images/cat-and-mouse/winning-dialog-button.png',
          // 关闭的样式
          close: './assets/images/cat-and-mouse/winning-dialog-close.png',
        }
      }
    },
  },
  computed: {
  },
  mounted() {
    this.init();
  },
  methods: {
    // 再来一次
    again() {
      this.$emit('again');
    },
    // 关闭
    close() {
       this.$emit('update:visible', false);
    },
    // 初始化
    init() {
      // 设置按钮背景图
      const setButtonBackground = () => {
        const winningDialogContainer = this.$refs.winningDialogContainer;
        const buttons = winningDialogContainer.querySelectorAll('button:not(:disabled)');

        for (const button of buttons) {
          button.style.backgroundImage = `url(${this.styleImages.button})`
        }
      }

      // 判断是否登录
      const setIsLogin = () => {
        const localStorageData = getLocalStorage();
        let { ticket } = localStorageData;

        if (ticket) {
          this.isLogin = true;
        } else {
          this.isLogin = false;
        }
      }

      setButtonBackground();
      setIsLogin();
    },
    // 注册
    register() {
      toRegister();
    },
    // 登录
    login() {
      toLogin();
    },
    // 选择门店
    selectShop() {
      const url = `${this.httpUrl}/wx_member/gift/index.html#/data?id=${this.lotteryInfo.orderId}`;
      this.close();
      window.location.assign(url);
    }
  }
}
</script>
<style lang='scss' scoped>
  // 主题
  .winning-dialog-leave-active, .winning-dialog-enter-active {
    transition: all .5s;
  }

  // 遮罩
  .shade-leave-active, .shade-enter-active {
    transition: opacity .5s;
  }

  .shade-enter, .shade-leave-to {
    opacity: 0;
  }

  // 内容
  .main-leave-active, .main-enter-active {
    transition: transform .5s;
  }

  .main-enter, .main-leave-to {
    transform: scale(0) translateY(100vw);
  }

  .winning-dialog {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 6000;

    > .shade {
      position: absolute;
      height: 100%;
      width: 100%;
      background:rgba(0,0,0,.8);
    }

    > .share {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      position: absolute;
      right: 5.8vw;
      top: 6.5vw;

      > img {
        margin-bottom: 5vw;
        width: 9vw;
        height: auto;
      }

      > p {
        font-size:3.73vw;
        color:rgba(255,255,255,1);
      }
    }

    > .winning-dialog-container {
      position: relative;
      margin-top: 35vw;
      height: 100vw;

      > .style-images {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;

        @keyframes background-animation {
          0% {
            transform: rotate(0deg);
          }

          100% {
            transform: rotate(360deg);
          }
        }

        > .background {
          position: absolute;
          width: 100%;
          height: 100%;
          animation: background-animation 10s infinite linear;
        }

        > .wrapper {
          position: absolute;
          height: 80vw;
          width: auto;
        }
      }

      > .content {
        display: flex;
        flex-direction: column;
        // justify-content: space-between;
        position: relative;
        height: 100%;;
        padding: 5vw 20vw 13vw 22vw;

        > .title {
          margin-bottom: 13vw;
          background: linear-gradient(0deg,rgba(233,34,31,1) 0%, rgba(254,171,36,1) 100%);
          -webkit-text-stroke: 0.1vw #fff;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 6.4vw;
          font-weight: bold;
          text-align: center;
        }

        > .prize-image {
          margin-bottom: 3vw;
          display: flex;
          justify-content: center;
          height: 20vw;

          > img {
            height: 100%;
            width: auto;
          }
        }

        > .prize-info {
          flex-grow: 1;
          text-align: center;
          line-height: 2;

          > .winning, .not-winning {
            > .info {
              font-size: 4vw;
              color:rgba(255,239,55,1);
            }

            > .tip {
              font-size:3vw;
              color:rgba(255,255,255,1);
            }
          }

          > .remain-count {
            font-size:3vw;
            color:rgba(255,255,255,1);

            mark {
              color:rgba(255,239,55,1);
              background: none;
            }
          }
        }

        > .control {
          > .button-group {
            display: flex;
            justify-content: center;
            margin-bottom: 1.5vw;

            > button {
              justify-self: center;
              border-radius: 8vw;
              border: none;
              width: 27vw;
              height: 8vw;
              background-repeat: none;
              background-size: cover;
              background-position: center center;
              color: rgba(210, 73, 3, 1);
              font-size:3.5vw;

              &:not(:last-of-type) {
                margin-right: 3vw;
              }

              &:disabled {
                background-color: rgba(214, 196, 193, 1);
                color: #fff;
              }
            }
          }

          > .register {
            text-align: center;

            > a {
              font-size:2.4vw;
              color:rgba(255,255,255,1);
              text-decoration: unset;
            }
          }

        }
      }

      > .close {
        position: absolute;
        width: 8vw;
        height: 8vw;
        bottom: -3vw;
        left: calc(50% - 2.5vw);
      }
    }
  }
</style>