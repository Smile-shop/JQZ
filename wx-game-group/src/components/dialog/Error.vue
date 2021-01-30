<template>
  <div class="error-dialog-root">
    <div v-show="show" class="warp">
      <self-mask :is-fixed="show">
        <div class="mask-content">
          <div class="content">
            <!-- <img :src="computedImg()" alt="icon" class="avatar" /> -->
            <img v-if="noMember" src="../layout/images/weidl.png" alt="icon" class="avatar" />
            <img v-else src="../layout/images/ycts.png" alt="icon" class="avatar" />
            <div class="notice">
              <p>
                <span v-if="msg">{{ msg }}</span>
                <span v-else>您当前的网络不太好哦，请稍后再试</span>
              </p>
            </div>
            <a
              v-show="!isRegister"
              href="javascript:void(0)"
              class="reg-notice"
              @click="go2Page('')"
            >还不是会员?点此注册</a>
            <button
              v-if="noMember"
              class="start-btn"
              @click="go2Page('/login_register/#/login?game=1')"
            >去登录</button>
            <button v-else class="start-btn" @click="_close">我知道了</button>
            <i class="iconfont icon-close close" @click="_close" />
          </div>
        </div>
      </self-mask>
    </div>
  </div>
</template>

<script>
import { getLocalStorage, setStorage, getInfoStorage } from '@/utils'
import { wxRegistType } from '@/axios/tiger'
import baseUrl from '@/config/config'
import SelfMask from '@/components/Mask'
export default {
  components: {
    SelfMask
  },
  props: {
    show: Boolean,
    noMember: Boolean,
    msg: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      isRegister: '',
      userInfo: getLocalStorage(),
      baseUrl
    }
  },
  created() {
    this.login()
  },
  methods: {
    computedImg() {
      if (this.type) {
        return `../layout/images/${this.type}.png`
      } else {
        return this.noMember
          ? '../layout/images/ycts.png'
          : '../layout/images/weidl.png'
      }
    },
    login() {
      const { ticket } = getLocalStorage()
      // console.log(ticket)
      this.isRegister = ticket
    },
    async go2Page(path) {
      this.$emit('update:show', false)
      if (!path) {
        const options = {
          openid: this.userInfo.openid,
          companyKey: this.userInfo.companyKey
        }
        const { data } = await wxRegistType(options)
        if (data.registType === 'wxCard') {
          // location.href = data.openCardUrl
          location.href = `${this.baseUrl}/login_register/#/?game=1`
        } else {
          const data = getInfoStorage.get()
          data.page = 'register'
          setStorage.save(JSON.stringify(data))
          location.href = `${this.baseUrl}/login_register/#/?game=1`
        }
      } else {
        location.href = `${this.baseUrl}${path}`
      }
    },
    _close() {
      console.log('关闭异常')
      this.$emit('update:show', false)
      if (navigator.onLine) {
        window.location.reload()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'assets/rem.scss';
.mask-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  .content {
    width: 86vw;
    height: 55vw;
    background: #fff;
    border-radius: 1rem;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    button.start-btn {
      position: absolute;
      bottom: 1.2rem;
      border: 0;
      font-size: px2rem(32);
      color: #fff;
      width: 75vw;
      height: 10vw;
      border-radius: 40px;
      background: #fe5362;
      text-align: center;
      font-size: 4vw;
    }
    img.avatar {
      width: 30vw;
      height: 30vw;
      border-radius: 50%;
      position: absolute;
      top: -3.77333rem;
    }
    .notice {
      text-align: center;
      font-size: 5vw;
      color: #666;
      p {
        width: 20rem;
      }
    }
    i.close {
      color: #fff;
      font-size: 8vw;
      position: absolute;
      bottom: -13vw;
    }
    a.reg-notice {
      font-size: 3.5vw;
      color: #fe5362;
      height: 2vw;
      margin-top: 3vw;
      text-decoration: none;
    }
  }
}
</style>
