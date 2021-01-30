<template>
  <div>
    <div class="login-list">

      <div class="login-list-item">
        <div class="input">
          <input v-model="resetPwdModal.phone" disabled type="text" placeholder="手机号">
        </div>
      </div>

      <div class="login-list-item">
        <div class="validate-input">
          <div class="input-input">
            <input v-model="resetPwdModal.validateCode" maxlength="4" type="text" placeholder="图形验证码">
          </div>
          <div class="input-click">
            <div>
              <!-- 点击刷新 -->
              <img @click="imgClick" :src="imgSrc" alt="点击刷新">
            </div>
          </div>
        </div>
      </div>

      <div class="login-list-item">
        <div class="validate-input">
          <div class="input-input">
            <input v-model="resetPwdModal.messageCode" maxlength="8" type="text" placeholder="请输入短信验证码">
          </div>
          <div class="input-click">
            <div :style="{ 'color': themeColor }">
              <span v-if="sendForTimeout.show">{{ sendForTimeout.time }}s...</span>
              <span v-else @click="sendMsg">发送验证码</span>
            </div>
          </div>
        </div>
      </div>

      <div class="login-list-item">
        <div class="input">
          <input v-model="resetPwdModal.cardPwd" maxlength="14" type="password" placeholder="设置密码">
        </div>
      </div>

      <div class="login-list-item">
        <div class="input">
          <input v-model="resetPwdModal.cardPwd2" maxlength="14" type="password" placeholder="重复密码">
        </div>
      </div>

      <div class="login-list-item">
        <div class="login-btn" v-if="submitBtnDisabled" :style="{ 'background-color': themeColor }" @click="resetPassword">提交</div>
        <div class="login-btn" v-else>提交中...</div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  components: {
  },
  data() {
    return {
      imgSrc: '',
      resetPwdModal: {
        phone: '',
        validateCode: '',
        cardPwd: '',
        cardPwd2: '',
        messageCode: ''
      },
      timer: null,
      sendForTimeout: {
        show: false,
        time: 60
      },
      submitBtnDisabled: true
    }
  },
  computed: {
    ...mapState({
      themeColor: state => state.themeColor,
      urlData: state => state.urlData,
      homeMemberData: state => state.homeMemberData
    })
  },
  mounted() {
    this.imgSrc = `${this.httpUrl}/jop-web/wxCode/randanCode?openid=${this.urlData.openid}?${Math.random()}`;
    this.resetPwdModal.phone = this.homeMemberData.phone;
  },
  methods: {
    goRegister() {
      this.$router.push({path: '/register'})
    },
    pickLoginWay(val) {
      this.loginWay = val;
    },
    imgClick() {
      this.imgSrc = `${this.httpUrl}/jop-web/wxCode/randanCode?openid=${this.urlData.openid}?${Math.random()}`;
    },
    sendMsg: async function() {
      if (this.resetPwdModal.validateCode === '') {
        this.$toast({
          message: '请输入图形验证码！',
          duration: 1000
        })
        return
      };

      let codeReg = /^[0-9]\d*$/; 
      if (!codeReg.test(this.resetPwdModal.validateCode)) {
        this.$toast({
          message: '图形验证码输入有误！',
          duration: 1000
        })
        return
      };
      this.timerMethods();
      let res = await this.$store.dispatch('sendSmsValidate', {
        openid: this.urlData.openid,
        companyKey: this.urlData.companyKey,
        phone: this.resetPwdModal.phone,
        validateCode: this.resetPwdModal.validateCode,
        type: '1'
      });
      if(res.data.code !== 0) {
        this.clearTimerMethods();
        this.$toast({
          message: res.data.msg,
          duration: 1000
        })
      }
    },
    timerMethods() {
      this.sendForTimeout.show = true;
      this.timer = window.setInterval(() => {
        if(this.sendForTimeout.time > 0) {
          this.sendForTimeout.time -= 1;
        } else {
          this.clearTimerMethods();
        }
      }, 1000)
    },
    clearTimerMethods() {
      window.clearInterval(this.timer);
      this.timer = null;
      this.sendForTimeout.time = 60;
      this.sendForTimeout.show = false;
    },
    resetPassword() {
      if(this.resetPwdModal.messageCode === '') {
        this.$toast({
          message: '请输入短信验证码！',
          duration: 1000
        })
        return
      };
      if (this.resetPwdModal.cardPwd === '') {
        this.$toast({
          message: '请输入修改密码！',
          duration: 1000
        })
        return
      };
      if (this.resetPwdModal.cardPwd2 === '') {
        this.$toast({
          message: '请输入确认修改密码！',
          duration: 1000
        })
        return
      };
      if (this.resetPwdModal.cardPwd.length < 6) {
        this.$toast({
          message: '密码输入最少6位！',
          duration: 1000
        })
        return
      };
      if (this.resetPwdModal.cardPwd2 != this.resetPwdModal.cardPwd) {
        this.$toast({
          message: '两次输入密码不一致！',
          duration: 1000
        })
        return
      };
      let params = {
        openid: this.urlData.openid,
        companyKey: this.urlData.companyKey,
        phone: this.resetPwdModal.phone,
        validateCode: this.resetPwdModal.validateCode,
        cardPwd: this.resetPwdModal.cardPwd,
        cardPwd2: this.resetPwdModal.cardPwd2,
        messageCode: this.resetPwdModal.messageCode
      }
      this.submitBtnDisabled = false;
      this._http({url: '/jop-web/wxMemberInfo/wxPwdUpdate'}, params).then(res => {
        this.submitBtnDisabled = true;
        if(res.data.code === 0) {
          this.$toast({
            message: '密码重置成功！',
            duration: 1000
          })
          window.setTimeout(() => {
            this.$router.replace({
              path: '/home'
            });
          }, 1000)
        } else {
          this.$toast({
            message: res.data.msg,
            duration: 1000
          })
        }
      })
    }
  },
  destroyed() {
    this.clearTimerMethods();
  }
}
</script>

<style lang="less" scoped>
.login-list {
  .login-list-item {
    width: 100%;
    .input {
      width: calc(100% - 20px);
      border-radius: 5px;
      height: 38px;
      line-height: 38px;
      margin: 10px auto 0px auto;
      background-color: white;
      input {
        width: calc(100% - 20px);
        font-size: 14px;
        padding: 0 10px;
        border: none;
        outline: none;
        background-color: white;
      }
    }
    .login-btn {
      width: calc(100% - 20px);
      margin: 20px auto;
      height: 38px;
      line-height: 38px;
      text-align: center;
      color: white;
      font-size: 16px;
      border-radius: 5px;
      background-color: gray;
    }
    .validate-input {
      display: flex;
      width: calc(100% - 20px);
      margin: 10px auto 0 auto;
      div {
        height: 38px;
        line-height: 38px;
      }
      .input-input {
        width: 205px;
        background-color: white;
        border-radius: 5px;
        // border: 1px solid #CCCCCC;
        padding-left: 1px;
        input {
          width: 184px;
          padding: 0 10px;
          font-size: 14px;
          border: none;
          outline: none;
        }
      }
      .input-click {
        flex-basis: 20%;
        flex-grow: 1;
        padding-left: 20px;
        div {
          background-color: white;
          border-radius: 5px;
          text-align: center;
          font-size: 16px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>


