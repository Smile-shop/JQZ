<template>
  <base-layout
    title="忘记密码"
    :isShowFooter="false"
  >
    <article id="password-forget">
      <form action="#">
        <!-- 手机号 -->
        <base-input
          v-model="mobileNumber"
          placeholder="手机号码"
          type="text"
          icon="icon-shouji"
          class="mobileNumber"
        >
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
        <base-input
          v-model="password"
          placeholder="输入新密码"
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
          v-model="passwordRepeat"
          placeholder="再次输入新密码"
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
      </form>
      <section class="bottom">
        <div
          class="submit-button"
          @click="passwordForgetSubmit"
        >
          提交
        </div>
      </section>
    </article>
  </base-layout>
</template>

<script lang="ts">
// vue
import {Vue, Component, Model, Watch} from 'vue-property-decorator';
import {State, Getter, Action, Mutation, namespace} from 'vuex-class';

// http
import {httpReq} from '@/utils/http-req';
import {
  verificationCodeReqUrlPic,
  verificationCodePhoneReq,
  passwordForgetReq,
} from '@/serves/login';

// 组件
import {Toast} from 'vant';
import BaseInput from '@/components/base-input.vue';
import BaseLayout from '@/layouts/base-layout.vue';

// 工具
import {getLocalStorage} from '@/utils/local-storage';
import {PasswordInputType, LoginType} from './typings';

@Component({
  components: {
    BaseLayout,
    BaseInput,
  },
})
export default class LoginHome extends Vue {
  // 电话号码
  private mobileNumber: string = '';
  // 密码
  private password: string = '';
  // 密码重复
  private passwordRepeat: string = '';
  // 密码输入框类型
  private passwordInputType: PasswordInputType = 'password';
  // 图形验证码
  private pictureCode: string = '';
  // 短信验证码
  private messageCode: string = '';
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

  // 密码类型切换
  private passwordTypeSwitch() {
    this.passwordInputType = this.passwordInputType === 'password' ? 'text' : 'password';
  }

  // 检测输入是否正确
  private inputPattern(loginType: 'normal' | 'message' | 'verificationCode' | 'passwordForget') {
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

    const passwordRepeat = {
      isTrue: this.mobileNumber !== '',
      errorMessage: '请输入确认密码',
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
      case 'passwordForget':
        return {
          mobileNumber,
          pictureCode,
          messageCode,
          password,
          passwordRepeat,
        };
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

  // 提交忘记密码
  private passwordForgetSubmit() {
    return new Promise((resolve, reject) => {
      const {wxUserInfo} = getLocalStorage();
      const {companyKey, openid} = wxUserInfo!;
      const body = {
        companyKey,
        openid,
        phone: this.mobileNumber,
        validateCode: this.pictureCode,
        messageCode: this.messageCode,
        cardPwd: this.password,
        cardPwd2: this.passwordRepeat,
      };

      const inputPattern = this.inputPattern('passwordForget');
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
        passwordForgetReq.requestInit.body = JSON.stringify(body);
        const httpRes = httpReq(passwordForgetReq);
        httpRes.then(data => {
          Toast('修改成功');
          resolve(data);
        }).catch(reason => {
          Toast(reason);
          reject(reason);
        });
      }

    });
  }
}
</script>

<style lang="scss" scoped>
#password-forget {
  & > form {
    padding: 2.6rem 3.7rem;

    & > .base-input {
      margin-bottom: 1.3rem;

      &:last-of-type {
        margin-bottom: 0;
      }
    }

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
  }

  & > .bottom {
    padding: 0 3.7rem;

    & > .submit-button {
      border: none;
      border-radius: .6rem;
      background-color: var(--color-theme);
      padding: 1.7rem;
      font-size: 2.3rem;
      text-align: center;
      color: #fff;
    }
  }

}
</style>