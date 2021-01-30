<template>
  <div class="join">
    <div class="wrapper">
      <header>
        <img src="~@/assets/img/login/join.png" alt="登录">
        <div class="describe">
          <div class="enterprise">
            <img src="https://www.baidu.com/img/flexible/logo/pc/result.png" alt="logo">
            {{data.enterprise.epName}}邀请您加入
          </div>
          <p>
            请验证手机号码获取产品权限
          </p>
        </div>
      </header>
      <main>
        <form>
          <div class="form-item">
            <input
              v-model="data.form.phone"
              type="number"
              placeholder="手机号码"
            >
          </div>
          <div class="form-item">
            <input
              v-model="data.form.smscode"
              placeholder="验证码"
              type="text"
            >
            <div class="right">
              <button
                v-if="data.canGetVerificationCode"
                @click="getVerificationCode"
                id="verificationCodeButton"
              >
                获取验证码
              </button>
              <span
                v-else
                id="verificationCodeCountDown"
              >
                {{data.countDown}}
              </span>
            </div>
          </div>
        </form>
      </main>
      <footer>
        <button
          id="join"
          @click="join"
        >
          确认
        </button>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from '@vue/composition-api';
import router from '@/router';
import {
  queryConfirmInit,
  querySendSmsCode,
  saveConfirmOther
} from '@/api/join/index';
import { message } from 'ant-design-vue';

export default defineComponent({
  setup() {
    const data = reactive({
      form: {
        phone: '',
        smscode: '',
      },
      canGetVerificationCode: true,
      countDown: 60,
      enterprise: {
        epName: '',
      }
    });
    const epid = router.currentRoute.query.epid;

    // 获取企业信息
    async function getEnterprise() {
      const body = {
        channel: 'OTHER',
        epid,
      }

      const res = await queryConfirmInit(body);
      data.enterprise = res;
    }

    // 加入
    async function join() {
      function validateForm() {
        if (/^1[3456789]\d{9}$/.test(data.form.phone) === false) {
          message.warning('请输入正确的手机号');
          return false;
        }

        if (/^\d{6}$/.test(data.form.smscode) === false) {
          message.warning('请输入正确的验证码');
          return false;
        }

        return true;
      }

      if (validateForm()) {
        try {
          const body = {
            channel: 'OTHER',
            epid,
            ...data.form,
          }

          await saveConfirmOther(body);
          router.push('/join/success');
        } catch (error) {
          router.push('/join/fail');
        }
      }
    }

    // 开始倒计时
    function startCountDown() {
      let timer: number = 0;
      data.countDown = 60;
      data.canGetVerificationCode = false;

      timer = setInterval(function() {
        if (data.countDown > 0) {
          data.countDown--
        } else {
          data.canGetVerificationCode = true;
          clearInterval(timer);
        }
      }, 1000);
    }

    // 获取验证码
    async function getVerificationCode(event: MouseEvent) {
      event.stopPropagation();
      event.preventDefault();

      function validateForm() {
        if (data.canGetVerificationCode === false) {
          return false;
        }

        if (/^1[3456789]\d{9}$/.test(data.form.phone) === false) {
          message.warning('请输入正确的手机号');
          return false;
        }

        return true;
      }

      if (validateForm()) {
        startCountDown();
        const body = {
          channel: 'OTHER',
          epid,
          phone: data.form.phone
        }
        await querySendSmsCode(body);
      }
    }

    onMounted(() => {
      getEnterprise();
    })

    return {
      data,
      getVerificationCode,
      join,
    };
  },
});
</script>

<style lang="scss" scoped>
.join {
  display: flex;
  justify-content: center;
  padding: 50px 20px;

  .wrapper {
    flex-basis: 400px;
    max-width: 500px;

    > header {
      display: flex;
      flex-direction: column;
      align-items: center;

       > img {
        margin-bottom: 30px;
        width: 163px;
        height: auto;
      }

      > .describe {
        margin-bottom: 40px;

        > .enterprise {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          font-size: 20px;
          font-weight: bold;
          color: #000;

          > img {
            height: auto;
            width: 50px;
            margin-right: 15px;
          }
        }

        > p {
          text-align: center;
          color: #80869D;
          font-size: 14px;
        }
      }
    }

    > main {
      margin-bottom: 78px;

      > form {
        > .form-item {
          position: relative;
          display: flex;
        }

        > .form-item:not(:last-of-type) {
          margin-bottom: 30px;
        }

        .form-item {
          > input {
            outline: none;
            border-radius:2px;
            border: 2px solid rgba(214,221,236,1);
            padding: 10px 12px;
            flex-basis: 100%;
            color: #263446;
          }

          > .right {
            display: flex;
            align-items: center;
            position: absolute;
            right: 12px;
            height: 100%;
            color: #80869D;

            > button {
              cursor: pointer;
              border: none;
              outline: none;
              background: none;
              color: #0045FF;
              height: 100%;
            }
          }
        }
      }
    }

    footer {
      > button {
        cursor: pointer;
        outline: none;
        border: none;
        border-radius:2px;
        padding: 12px;
        width: 100%;
        background:rgba(0,69,255,1);
        color: #FFF;
      }
    }
  }
}
</style>
