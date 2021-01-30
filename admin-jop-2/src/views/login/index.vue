<template>
  <layout-login>
    <div class="login-form">
      <header>
        用户登录
      </header>
      <form
        ref="form"
      >
        <div class="form-item">
          <label for="number">
            企业编号
          </label>
          <input
            v-model="data.form.number"
            placeholder="请输入企业编号"
            id="number"
            type="text"
            required
          >
        </div>
        <div class="form-item">
          <label for="user-name">
            用户名
          </label>
          <input
            v-model="data.form.phone"
            placeholder="可使用工号、手机号码"
            id="user-name"
            type="text"
            required
          >
        </div>
        <div class="form-item">
          <label for="password">
            密码
          </label>
          <input
            v-model="data.form.pwd"
            placeholder="请输入密码"
            id="password"
            :type="data.isShowPassword ? 'text' : 'password'"
            required
            @keydown.enter="submit"
          >
          <span class="icon">
            <i v-if="data.isShowPassword" @click="data.isShowPassword = false" class="iconfont icon-eye"></i>
            <i v-else @click="data.isShowPassword = true" class="iconfont icon-eye-close"></i>
          </span>
        </div>
      </form>
      <section class="control">
        <div class="left">
          <a-checkbox
            @change="rememberPasswordChange"
            v-model="data.isRememberPassword"
          >
            记住密码
          </a-checkbox>
        </div>
        <div class="right">
          <!-- <a-button type="link">
            <router-link to="/login/reset-password">
              重置密码
            </router-link>
          </a-button> -->
        </div>
      </section>
      <footer>
        <button class="primary" @click="submit">
          登录
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
import { queryCurUserPrivilegeMenu } from '@/api/modules/enterprise/role/menu';
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
        number: '',
        phone: '',
        pwd: '',
      },
      isShowPassword: false,
    });

    // 检查输入
    function checkValidity() {
      const formValue = form.value;
      if (formValue) {
        const access = formValue.reportValidity();

        if (access) {
          return true;
        }
      }
      return false;
    }

    function rememberPasswordChange() {
      if (data.isRememberPassword === false) {
        localStorage.removeItem('login');
        data.form.number = '';
        data.form.phone = '';
        data.form.pwd = '';
      }
    }

    // 登录
    async function loginHandle() {
      const body = {
        ...data.form,
      };

      const res = await login(body);
      localStorage.setItem('token', res.token);
      store.commit('setUser', res);
      store.commit('initState');
      message.success('登录成功');
    }

    // 获取权限
    async function getPermissions() {
      const body = '';

      const res = await queryCurUserPrivilegeMenu(body);
      store.commit('setMenus', res);
      setPathInfo(res);
    }

    // 提交
    async function submit() {
      if (checkValidity()) {
        await loginHandle();

        if (data.isRememberPassword) {
          localStorage.setItem('login', JSON.stringify(data.form));
        } else {
          localStorage.removeItem('login');
        }
        await getPermissions();
        router.push('/home');
      }
    }

    function init() {
      // 获取登录信息
      function getLogin() {
        const login = localStorage.getItem('login');

        if (login) {
          const { phone, pwd, number } = JSON.parse(login);
          data.isRememberPassword = true;
          data.form.phone = phone;
          data.form.pwd = pwd;
          data.form.number = number;
        }
      }

      getLogin();
    }

    onMounted(() => {
      init();
    });

    return {
      data,
      form,
      submit,
      rememberPasswordChange,
    };
  },
});
</script>

<style lang="scss" scoped>
</style>
