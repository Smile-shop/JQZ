<template>
  <div class="login">
    <div class="left">
      <img src="~@/assets/img/logo/logo.png" alt="logo">
      <h2>用科技助力珠宝企业</h2>
    </div>
    <div class="right">
      <slot class="login-form"/>
      <p class="copyright">
        技术支持：金千枝（深圳）软件技术有限公司 版本号：V4.0
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, watch } from '@vue/composition-api';
import store from '@/store/index';
import {
  login,
} from '@/api/user/index';
import { message } from 'ant-design-vue';
import { setPathInfo } from '@/utils/path-info';
import router from '@/router';

export default defineComponent({
  setup() {
    return {
    };
  },
});
</script>

<style lang="scss" scoped>
.login {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  height: 100vh;
  background-color: #eee;
  background: url(~@/assets/img/login/background-element.png) no-repeat 10% 80%/auto 60%, linear-gradient(-15deg,#FFF 50%, #0045FF 50%);

  > .left {
    padding: 50px;

    > img {
      margin-bottom: 20px;
      height: 60px;
      width: auto;
    }

    > h2 {
      font-size: 32px;
      color: #FFF;
    }
  }

  > .right {
    align-self: center;
    justify-self: center;
    display: grid;
    grid-auto-flow: row;
    justify-items: center;
    gap: 40px;

    > .login-form {
      border-radius:5px;
      padding: 30px;
      background-color: #FFF;
      box-shadow:0px 15px 12px 0px rgba(0,69,255,0.06);

      > header {
        text-align: center;
        margin-bottom: 40px;
        font-size:26px;
        font-weight: bold;
        color: rgba(38,52,70,1);
      }

      > form {
        display: grid;
        grid-auto-flow: row;
        gap: 30px;
        margin-bottom: 30px;
        width: 500px;

        > .form-item {
          display: grid;
          align-items: center;
          grid-template-columns: 70px auto 100px;
          gap: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid #E9E9E9;

          > label {
            font-size:16px;
            color:rgba(55,62,79,1);
            font-weight: bold;
          }

          > input {
            border: none;
            outline: none;
            font-size:16px;

            &::placeholder {
              color:rgba(192,198,209,1);
            }
          }

          > .icon {
            .iconfont {
              cursor: pointer;
              display: grid;
              place-items: center;
              font-size: 20px;
            }
          }

          > .operation {
            justify-self: end;

            > img {
              width: 100%;
              height: auto;
            }
          }
        }
      }

      > .control {
        display: grid;
        grid-auto-flow: column;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 80px;
      }

      > footer {
        display: grid;
        grid-auto-flow: column;
        gap: 20px;

        > button {
          cursor: pointer;
          outline: none;
          border: none;
          padding: 12px;
          width: 100%;
          color: #80869D;
          background-color: #FFF;
          border: 1px solid #DCDFE6;
          border-radius:4px;

          &.primary {
            color: #FFF;
            background-color: #0045FF;
            border: none;
          }
        }
      }
    }

    > .copyright {
      color: #80869D;
    }
  }

}
</style>
