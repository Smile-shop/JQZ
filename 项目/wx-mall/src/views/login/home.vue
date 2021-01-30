<template>
  <article id="login-home">
    <header>
      <div
        class="head-portrait"
        :style="{
          'background-image': `url()`
        }"
      >
      </div>
      <div class="company-name">
        广东深圳金千枝珠宝
      </div>
    </header>
    <section
      class="content"
    >
      <nav>
        <div
          v-if="loginTypeUsable == '2' || loginTypeUsable === '3'"
          :class="{
            active: loginType === 'normal'
          }"
          @click="loginTypeSwtich('normal')"
        >
          普通登录
        </div>
        <div
          v-if="loginTypeUsable == '1' || loginTypeUsable === '3'"
          :class="{
            active: loginType === 'message'
          }"
          @click="loginTypeSwtich('message')"
        >
          动态密码登录
        </div>
      </nav>
      <form>
        <base-input
          v-model="mobileNumber"
          type="text"
          icon="icon-shouji"
          class="mobileNumber"
          :placeholder="loginType === 'normal' ? '卡号/手机号码' : '手机号码'"
        >
        </base-input>
        <base-input
          v-model="password"
          v-show="loginType === 'normal'"
          placeholder="密码"
          :type="passwordInputType"
          icon="icon-mima1"
          class="password"
        >
          <i
            :class="{
              'switch-show-button': true,
              'iconfont': true,
              'icon-yanjing': this.passwordInputType === 'password',
              'icon-biyan': this.passwordInputType === 'text',
            }"
            @click="passwordTypeSwitch"
          >
          </i>
        </base-input>
        <base-input
          v-model="pictureCode"
          placeholder="图形验证码"
          type="text"
          icon="icon-yanzhengma"
          class="picture-code"
        >
          <img
            style="-webkit-user-select: none;"
            :src="picVerificationCodeUrl"
            @click="randomNumber = Math.random()"
          >
        </base-input>
        <base-input
          v-model="messageCode"
          v-show="loginType === 'message'"
          placeholder="短信验证码"
          type="number"
          icon="icon-mima1"
          class="message-code"
        >
          <span
            v-if="canSendMessage"
            class="get-code"
            @click="verificationCodePhoneHandle"
          >
            获取验证码
          </span>
          <span
            v-else
            class="count-down"
          >
            {{phoneMessageInterval}}
          </span>
        </base-input>
        <div
          class="rememb-password"
        >
          <label
            class="left"
          >
            <Checkbox
              v-model="isRememberPassword"
            >
              记住密码
            </Checkbox>
          </label>
          <router-link
            to="/login/password-forget"
          >
            忘记密码？
          </router-link>
        </div>
        <button
          class="enter-button"
          @click.prevent="loginHandle"
        >
          登录
        </button>
        <div
          class="register"
        >
          还没注册？
          <router-link
            to="/login/register"
          >
            立即注册
          </router-link>
        </div>
      </form>
    </section>
  </article>
</template>

<script lang="ts">
import {Vue, Component, Model, Watch} from 'vue-property-decorator';
import {Checkbox} from 'vant';
import BaseInput from '@/components/base-input.vue';
import {PasswordInputType, LoginType} from './typings';
import {
  loginTypeUsableReq,
  loginReq,
  verificationCodeReqUrlPic,
  verificationCodePhoneReq,
} from '@/serves/login';
import {
  userInfoReq,
} from '@/serves/user';
import {httpReq} from '@/utils/http-req';
import {Toast} from 'vant';
import {State, Getter, Action, Mutation, namespace} from 'vuex-class';
import {getLocalStorage} from '@/utils/local-storage';

@Component({
  components: {
    BaseInput,
    Checkbox,
  },
})
export default class LoginHome extends Vue {
  // 电话号码
  private mobileNumber: string = '';
  // 密码
  private password: string = '';
  // 密码输入框类型
  private passwordInputType: PasswordInputType = 'password';
  // 图形验证码
  private pictureCode: string = '';
  // 短信验证码
  private messageCode: string = '';
  // 是否记住密码
  private isRememberPassword: boolean = false;
  // 可用登录类型
  private loginTypeUsable: '1' | '2' | '3' = '3';
  // 登录类型
  private loginType: LoginType = 'normal';
  // 随机数
  private randomNumber: number = Math.random();
  // 短信间隔时间
  private phoneMessageInterval: number = 10;
  // 是否发送短信
  private canSendMessage: boolean = true;
  // 短信间隔时间定时器
  private phoneMessageIntervalTimer!: null | number;

  // 图形验证码地址
  get picVerificationCodeUrl(): string {
    const url: URL = new URL(verificationCodeReqUrlPic);
    const {wxUserInfo} = getLocalStorage();
    url.searchParams.append('openid', wxUserInfo!.openid as string);

    return url.toString().concat('?', String(this.randomNumber));
  }

  // 监听可用登录类型后修改默认登录类型
  @Watch('loginTypeUsable', {
    immediate: true,
  })
  private loginTypeUsableWatch(value: '1' | '2' | '3') {
    switch (value) {
      case '1':
        this.loginType = 'message';
        break;
      case '2':
        this.loginType = 'normal';
        break;
      default:
        this.loginType = 'normal';
        break;
    }
  }

  @Watch('isRememberPassword')
  private isRememberPasswordWatch(value: boolean) {
    if (!value) {
      localStorage.clear();
    }
  }

  private mounted() {
    this.selectLoginTypeUsable();
    this.localPasswordUse();
  }

  // 检测输入是否正确
  private inputPattern(loginType: 'normal' | 'message' | 'verificationCode') {
    const mobileNumberRegExp = /^1[34578]\d{9}$/;

    const mobileNumber = {
      isTrue: mobileNumberRegExp.test(this.mobileNumber),
      errorMessage: '请输入正确得手机号码',
    };

    const cardNumber = {
      isTrue: this.mobileNumber !== '',
      errorMessage: '请输入卡号',
    };

    const password = {
      isTrue: this.mobileNumber !== '',
      errorMessage: '请输入密码',
    };

    const pictureCode = {
      isTrue: this.pictureCode !== '',
      errorMessage: '请输入图形验证码',
    };

    const messageCode = {
      isTrue: this.messageCode !== '',
      errorMessage: '请输入短信验证码',
    };

    switch (loginType) {
      case 'normal':
        return {
          cardNumber,
          password,
          pictureCode,
        };
      case 'message':
        return {
          mobileNumber,
          pictureCode,
          messageCode,
        };
      case 'verificationCode':
        return {
          mobileNumber,
          pictureCode,
        };
    }
  }

  // 当切换登录类型时
  private loginTypeSwtich(type: LoginType) {
    this.loginType = type;
  }

  // 保存密码
  private passwordSave() {
    if (this.loginType === 'normal' && this.isRememberPassword) {
      const loginInfo = {
        mobileNumber: this.mobileNumber,
        password: this.password,
      };
      localStorage.setItem('loginInfo', JSON.stringify(loginInfo));
    }
  }

  // 如果本地有密码则将账号密码填入到输入框中
  private localPasswordUse() {
    const {loginInfo} = getLocalStorage();
    if (loginInfo) {
      this.mobileNumber = loginInfo.mobileNumber;
      this.password = loginInfo.password;
      this.isRememberPassword = true;
    }
  }

  // 发送手机验证码
  private verificationCodePhoneHandle() {
    return new Promise((resolve, reject) => {
      const {wxUserInfo} = getLocalStorage();

      if (this.canSendMessage) {
        const {companyKey, openid} = wxUserInfo!;
        const {requestInit} = verificationCodePhoneReq;

        requestInit.body = JSON.stringify({
          companyKey,
          openid,
          phone: this.mobileNumber,
          validateCode: this.pictureCode,
          type: '1',
        });

        const inputPattern = this.inputPattern('verificationCode');
        let isInputPatternSuccess = true;

        for (const [key, value] of Object.entries(inputPattern)) {
          if (!value!.isTrue) {
            isInputPatternSuccess = false;
            Toast(value!.errorMessage);
            reject(value!.errorMessage);
            break;
          }
        }

        if (isInputPatternSuccess) {
          this.canSendMessage = false;
          this.phoneMessageIntervalTimer = setInterval(() => {
            if (this.phoneMessageInterval > 0) {
              this.phoneMessageInterval--;
            } else {
              this.canSendMessage = true;
              this.phoneMessageInterval = 10;
              clearInterval(this.phoneMessageIntervalTimer as number);
            }
          }, 1000);

          const httpRes = httpReq(verificationCodePhoneReq);
          httpRes.then(data => {
            Toast('发送成功,请注意查收');
            resolve(data);
          }).catch(reason => {
            Toast(reason);
            reject(reason);
          });
        }
      }
    });
  }

  // 查询用户信息
  private userInfoSelect() {
    return new Promise((resolve, reject) => {
      const {wxUserInfo} = getLocalStorage();
      const body = {
        companyKey: wxUserInfo!.companyKey,
        openid: wxUserInfo!.openid,
      };

      userInfoReq.requestInit.body = JSON.stringify(body);
      const httpRes = httpReq(userInfoReq);
      Toast.loading('查询用户信息...');
      httpRes.then(data => {
        Toast.clear();
        const {cardNum} = data.wxMemberInfo;
        window.localStorage.setItem('memberCard', cardNum);
        resolve(data);
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }

  // 登录处理
  private loginHandle() {
    return new Promise((resolve, reject) => {
      let isInputPatternSuccess = true;

      if (this.loginType === 'normal') {
        const inputPattern = this.inputPattern('normal');

        for (const [key, value] of Object.entries(inputPattern)) {
          if (!value!.isTrue) {
            isInputPatternSuccess = false;
            Toast(value!.errorMessage);
            reject(value!.errorMessage);
            break;
          }
        }
      } else if (this.loginType === 'message') {
        const inputPattern = this.inputPattern('message');

        for (const [key, value] of Object.entries(inputPattern)) {
          if (!value!.isTrue) {
            isInputPatternSuccess = false;
            Toast(value!.errorMessage);
            reject(value!.errorMessage);
            break;
          }
        }
      }

      // 输入正确时
      if (isInputPatternSuccess) {
        const {wxUserInfo} = getLocalStorage();
        const {companyKey, openid} = wxUserInfo!;
        const {requestInit} = loginReq;
        const body = {
          companyKey,
          openid,
          menuType: this.loginType === 'normal' ? '2' : '1',
          phone: this.mobileNumber,
          validateCode: this.pictureCode,
          cardPwd: this.password,
          messageCode: this.messageCode,
        };

        requestInit.body = JSON.stringify(body);
        const httpRes = httpReq(loginReq);
        Toast.loading('登录中...');
        httpRes.then(data => {
          Toast.success('登录成功!');
          this.passwordSave();
          window.localStorage.setItem(`ticket_${companyKey}`, data.ticket);
          this.userInfoSelect().then((value) => {
            this.$router.push('/');
            resolve(data);
          });
        }).catch(reason => {
          Toast(reason);
          reject(reason);
        });
      }

    });
  }

  // 密码类型切换
  private passwordTypeSwitch() {
    this.passwordInputType = this.passwordInputType === 'password' ? 'text' : 'password';
  }

  // 查询可用登录方式
  private selectLoginTypeUsable(): Promise<any> {
    return new Promise((resolve, reject) => {
      const {wxUserInfo} = getLocalStorage();
      const {companyKey, openid} = wxUserInfo!;
      const {requestInit} = loginTypeUsableReq;
      requestInit.body = JSON.stringify({
        companyKey,
        openid,
      });
      const httpRes = httpReq(loginTypeUsableReq);
      httpRes.then(data => {
        const {menuType} = data;
        this.loginTypeUsable = menuType;
        resolve(data);
      }).catch(reason => {
        reject(reason);
      });
    });
  }
}
</script>

<style lang="scss" scoped>
#login-home {
  display: grid;
  grid-template-rows: 25rem auto;
  height: 100vh;
  width: 100vw;
  overflow-x: hidden;
  overflow-y: scroll;

  // 头部
  & > header {
    display: grid;
    justify-items: center;
    align-content: center;
    grid-row-gap: 1.3rem;
    background-image: url(~@/assets/images/bg.jpg);
    background-size: cover;

    & > .head-portrait {
      border-radius: 4.4rem;
      height: 8.8rem;
      width: 8.8rem;
      background-size: cover;
      background-position: center center;
    }

    & > .company-name {
      font-size: 1.8rem;
      color: #ffffff;
    }
  }

  // 内容
  & > .content {
    display: grid;
    grid-template-rows: 5.5rem auto;
    background-color: #f5f5f5;

    // 导航
    & > nav {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      justify-items: center;
      background-color: #fff;

      & > div {
        display: grid;
        align-items: center;
        padding: 0 3.3rem;
        font-size: 1.8rem;

        &.active {
          border-bottom: .3rem solid var(--color-theme);
          color: var(--color-theme);
        }
      }
    }

    & > form {
      display: grid;
      grid-row-gap: 1.3rem;
      grid-auto-rows: 5.5rem;
      padding: 2.6rem 3.8rem;

      & > .password {
        & .switch-show-button {
          font-size: 2.5rem;
          color: #999999;
        }
      }

      & > .picture-code {
        & img {
          max-width: 11rem;
          height: auto;
        }
      }

      & > .message-code {
        & .get-code {
          color: var(--color-theme);
          font-size: 1.8rem;
        }

        & .count-down {
          color: #999999;
          font-size: 1.8rem;
        }
      }

      & > .rememb-password {
        display: grid;
        grid-auto-columns: auto;
        grid-auto-flow: column;
        justify-content: space-between;
        align-items: center;
        color: #666666;
        font-size: 1.5rem;

        & a {
          color: #666666;
        }
      }

      & > .enter-button {
        border: none;
        border-radius: .3rem;
        background-color: var(--color-theme);
        font-size: 2.3rem;
        color: #fff;
      }

      & > .register {
        text-align: center;
        font-size: 1.5rem;

        & > a {
          color: #dc4950;
        }
      }
    }
  }
}
</style>