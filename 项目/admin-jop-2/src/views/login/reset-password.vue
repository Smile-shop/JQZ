<template>
  <layout-login>
    <div class="login-form">
      <header>
        重置密码
      </header>
      <form
        ref="form"
      >
        <div class="form-item">
          <label for="enterprise-number">
            企业编号
          </label>
          <input
            placeholder="请输入企业编号"
            id="enterprise-number"
            type="text"
            required
          >
        </div>
        <div class="form-item">
          <label for="graph-validate-code">
            图形验证
          </label>
          <input
            placeholder="请输入图形验证"
            id="graph-validate-code"
            type="text"
            required
          >
          <div class="operation">
            <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1114443007,4076857238&fm=26&gp=0.jpg" alt="验证码">
          </div>
        </div>
        <div class="form-item">
          <label for="phone-number">
            手机号
          </label>
          <input
            placeholder="请输入手机号"
            id="phone-number"
            type="number"
            required
          >
        </div>
        <div class="form-item">
          <label for="message-code">
            短信验证
          </label>
          <input
            placeholder="请输入短信验证"
            id="message-code"
            type="number"
            required
          >
          <div class="operation">
            <a-button type="link">
              获取验证码
            </a-button>
          </div>
        </div>
        <div class="form-item">
          <label for="new-password">
            新密码
          </label>
          <input
            placeholder="请输入新密码"
            id="new-password"
            type="password"
            required
          >
        </div>
        <div class="form-item">
          <label for="confirm-password">
            确认密码
          </label>
          <input
            placeholder="请再次输入新密码"
            id="confirm-password"
            type="password"
            required
          >
        </div>
      </form>
      <footer>
        <router-link tag="button" to="/">
          返回登录
        </router-link>
        <button class="primary" @click="submit">
          重置密码
        </button>
      </footer>
    </div>
  </layout-login>
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
import LayoutLogin from './components/layout-login.vue';

export default defineComponent({
  components: {
    LayoutLogin
  },
  setup() {
    const form = ref<HTMLFormElement>();
    const data = reactive({
      isRememberPassword: false,
      form: {
        account: '',
        pwd: '',
      },
    });

    onMounted(() => {
    });

    return {
      data,
      form,
    };
  },
});
</script>

<style lang="scss" scoped>
.login {
}
</style>
