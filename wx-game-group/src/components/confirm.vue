<template>
  <div class="confirmLayer" v-show="confirmStatus" ref="confirmLayer">
    <div class="confirm-box">
      <div class="comfirm-icon">
        <img src="../assets/images/nine-grid/weidl.png" />
      </div>
      <div class="text">
        <p>本活动仅限会员参与</p>
        <p>请先登录后再参加活动</p>
        <span @click="register">还不是会员，点此注册</span>
      </div>
      <div class="btn">
        <button @click="goLogin">去登录</button>
      </div>
      <div class="close">
        <span class="close-icon" @click="Close"></span>
      </div>
    </div>
  </div>
</template>

<script>
import baseUrl from '@/config/config.js'
import { toLogin } from '@/utils/login-handle'
import { mapMutations, mapState } from 'vuex'
export default {
  name: '',
  props: [''],
  data() {
    return {}
  },

  components: {},

  computed: {
    ...mapState({
      confirmStatus: state => state.game.confirmStatus
    })
  },

  methods: {
    ...mapMutations(['setconfirmStatus']),

    Close() {
      this.setconfirmStatus(false)
    },
    goLogin() {
      this.setconfirmStatus(false)
      toLogin()
    },
    register() {
      window.location.href = `${baseUrl}/login_register/#/?game=1`
    }
  },
  mounted() {
    this.$refs.confirmLayer.addEventListener(
      'touchmove',
      function(e) {
        e.stopPropagation()
        e.preventDefault()
        return false
      },
      false
    )
  }
}
</script>
<style lang='stylus' scoped>
.confirmLayer {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  width: 100vw;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.85);

  .confirm-box {
    width: 81.3vw;
    height: 55.5vw;
    background: #fff;
    box-sizing: border-box;
    border-radius: 2.7vw;
    position: relative;
    transform: scale(0.3);
    opacity: 0.1;
    animation: tran 0.7s ease 0.3s forwards;

    .comfirm-icon {
      position: relative;
      text-align: center;

      & > img {
        width: 26.7vw;
        height: 26.7vw;
        margin-top: -12vw;
      }
    }

    .text {
      text-align: center;

      & > p {
        line-height: 6.5vw;
        font-size: 4.3vw;
        color: #666666;
      }

      & > span {
        font-size: 3.2vw;
        color: #fe5362;
      }
    }

    .btn {
      text-align: center;
      margin-top: 3.3vw;

      & > button {
        width: 68vw;
        height: 10.7vw;
        background: #fe5362;
        border-radius: 5.3vw;
        color: #fff;
        border: none;
      }
    }

    .close {
      text-align: center;

      & > span {
        display: inline-block;
        width: 8vw;
        height: 8vw;
        background: url('../assets/images/nine-grid/close-white.png') center no-repeat;
        background-size: 100%;
        margin-top: 15vw;
      }
    }
  }
}

@keyframes tran {
  0% {
    transform: scale(0.5);
    opacity: 0.1;
  }

  70% {
    transform: scale(1.1);
    opacity: 0.5;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>