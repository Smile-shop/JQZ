<template>
  <div class="login">
    <form class="login-content" v-on:keyup.enter="toLogin">
      <img src="~@/assets/images/super-crm/wx-member/index-banner.jpg" alt="index-banner" draggable="false">
      <div class="login-form" v-if="isLogin">
        <nav>登录</nav>
        <label class="input-item">
          <i class="icon-qiye iconfont"></i>
          <input v-model="loginForm.companyKey" maxlength="18" type="text" placeholder="请输入企业编号">
        </label>
        <label class="input-item">
          <i class="icon-yonghuicon iconfont"></i>
          <input v-model="loginForm.loginName" maxlength="18" type="text" placeholder="请输入用户名">
        </label>
        <label class="input-item">
          <i class="icon-mima1 iconfont"></i>
          <input v-model="loginForm.password" maxlength="20" type="password" autocomplete="off" placeholder="请输入密码">
        </label>
        <div class="remember-psd">
          <el-checkbox style="margin-top:10px" v-model="isRemberPwd">记住密码</el-checkbox>
          <el-button type="text" @click="isLogin = false">主账号密码重置</el-button>
        </div>
        <button class="login-btn" type="button" @click="toLogin">登录</button>
      </div>
      <div class="reset-form" v-else>
        <nav>主账号密码重置</nav>
        <label class="input-item">
          <i class="icon-qiye iconfont"></i>
          <input v-model="resetForm.companyKey" @blur="validateCompanyKey" maxlength="18" type="text" placeholder="请输入企业编号">
        </label>
        <label class="input-item">
          <i class="icon-tuxingyanzhengma--moren iconfont"></i>
          <input v-model="resetForm.validateCode" maxlength="4" type="text" placeholder="请输入图形验证码">
          <img v-if="validateImg" :src="validateImg" @click="imgSrcClick" alt="validate-img">
        </label>
        <label class="input-item">
          <i class="icon-xiaoxi iconfont"></i>
          <input v-model="resetForm.messageCode" maxlength="8" type="text" autocomplete="off" placeholder="请输入短信验证码">
          <el-button size="small" v-if="getCodeBtnDisabled" plain @click="getMessageCode">获取验证码</el-button>
          <div style="width:60px;color:#2b85e4" v-else>{{number}}</div>
        </label>
        <div class="info">
          <i class="icon-wenhao iconfont"></i>
          短信验证码将发送至签约时预留的手机号
        </div>
        <label class="input-item">
          <i class="icon-mima1 iconfont"></i>
          <input v-model="resetForm.password" maxlength="20" type="password" autocomplete="off" placeholder="请输入新密码">
        </label>
        <label class="input-item">
          <i class="icon-mima1 iconfont"></i>
          <input v-model="resetForm.conformPsd" maxlength="20" type="password" autocomplete="off" placeholder="请再次输入新密码">
        </label>
        <div class="remember-psd">
          <el-button plain @click="isLogin = true">返回登录</el-button>
          <el-button type="primary" :disabled="btnDisabled" @click="updatePsd">重置密码</el-button>
        </div>
      </div>
    </form>
    <footer class="footer-info">
      <div></div>
      <section>技术支持：金千枝（深圳）软件技术有限公司</section>
      <div>版本号：V3.0</div>
    </footer>
  </div>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import {loginMethod, validateCompanyKey, resetPsd, sendPhoneMsg} from '@/api/menu-controller';
import user from '@/utils/user';

@Component({
})
export default class Login extends Vue {
  private isRemberPwd: boolean = true;
  private loginForm = {
    companyKey: '',
    loginName: '',
    password: ''
  };
  private isLogin: boolean = true;
  private resetForm = {
    companyKey: '',
    validateCode: '',
    messageCode: '',
    password: '',
    conformPsd: ''
  };
  private validateImg: string = '';
  private phone: any = '';
  private getCodeBtnDisabled: boolean = true;
  private timer: any = null;
  private number = 59;
  private btnDisabled: boolean = false;

  private mounted() {
    this.init();
  }

  // 初始化
  private init() {
    const {companyKey, account, password} = this.$route.query;

    console.log(this.$route)
    if (companyKey) {
      this.loginForm = {
        companyKey,
        loginName: account,
        password,
      } as any;

      this.toLogin();
    } else if (user.loginUser) {
      this.loginForm = user.loginUser;
    }
  }

  private toLogin() {
    if (this.loginForm.companyKey === '') {
      this.$message({
        message: '请输入客户号！',
        type: 'warning'
      });
      return;
    };
    if (this.loginForm.loginName === '') {
      this.$message({
        message: '请输入用户名！',
        type: 'warning'
      });
      return;
    };
    if (this.loginForm.password === '') {
      this.$message({
        message: '请输入密码！',
        type: 'warning'
      });
      return;
    };
    loginMethod(this.loginForm).then((res: any) => {
      user.serverUser = res.data;
      user.loginUser = this.isRemberPwd ? this.loginForm : null;
      this.$router.push({
        path: '/home'
      })
    })
  }

  private validateCompanyKey() {
    if (!this.resetForm.companyKey) {
      this.$message({
        message: '请输入客户号！',
        type: 'warning'
      });
      return;
    }
    validateCompanyKey({companyKey: this.resetForm.companyKey}).then((res: any) => {
      this.phone = res.data || '';
      this.validateImg = `${VUE_APP_BASE_API}/jop-web/wxCode/randanCode?openid=${this.phone}?${Math.random()}`;
    })
  }

  private imgSrcClick() {
    this.validateImg = `${VUE_APP_BASE_API}/jop-web/wxCode/randanCode?openid=${this.phone}?${Math.random()}`;
  }

  private getMessageCode() {
    if (this.resetForm.validateCode === '') {
      this.$message('请填写图形验证码！');
      return
    };
    if (this.phone === '') {
      this.$message('主账号未绑定手机号！');
      return
    };
    this.getCodeBtnDisabled = false;
    this.timer = window.setInterval(() => {
      --this.number;
      if (this.number < 1) {
        window.clearInterval(this.timer);
        this.timer = null;
        this.number = 59;
        this.getCodeBtnDisabled = true;
      }
    }, 1000);
    const params = {
      phone: this.phone,
      validateCode: this.resetForm.validateCode
    };
    const header = {
      companyKey: this.resetForm.companyKey
    }
    sendPhoneMsg(params, header).then((res: any) => {
      this.$message({
        type: 'success',
        message: '短信验证码发送成功，请注意查收！'
      });
    }).catch(err => {
      window.clearInterval(this.timer);
      this.timer = null;
      this.number = 59;
      this.getCodeBtnDisabled = true;
    })
  }

  private updatePsd(name: any) {
    if (!this.resetForm.messageCode) {
      this.$message('请输入短信验证码！');
      return
    }
    if (!this.resetForm.password) {
      this.$message('请输入新密码！');
      return
    }
    if (!this.resetForm.conformPsd) {
      this.$message('请输入确认密码！');
      return
    }
    if (this.resetForm.password !== this.resetForm.conformPsd) {
      this.$message('新密码和确认密码不一致！');
      return
    }
    const params = {
      newPassword: this.resetForm.password,
      validateCode: this.resetForm.validateCode,
      messageCode: this.resetForm.messageCode,
      phone: this.phone,
      companyKey: this.resetForm.companyKey
    };
    this.btnDisabled = true;
    resetPsd(params).then((res: any) => {
      this.btnDisabled = false;
      this.$message({
        type: 'success',
        message: '修改成功！'
      });
      this.resetForm = {
        companyKey: '',
        validateCode: '',
        messageCode: '',
        password: '',
        conformPsd: ''
      };
      this.isLogin = true;
    }).catch((err: any) => {
      this.btnDisabled = false;
    })
  }

  private destroyed() {
    window.clearInterval((this.timer as any));
    this.timer = null;
    this.number = 60;
    this.getCodeBtnDisabled = true;
  }
}
</script>

<style lang="scss" scoped>
.login {
  width: 100vw;
  height: 100vh;
  background-color: #ecf5ff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .login-content {
    width: 770px;
    height: 450px;
    box-shadow: 0px 0px 10px 0px rgba(3, 3, 3, 0.05);
    background-color: #ffffff;
    display: flex;
    img {
      width: 410px;
      height: 100%;
    }
    .login-form {
      flex-grow: 1;
      padding: 36px 30px 18px 30px;
      nav {
        font-family: MicrosoftYaHei-Bold;
        font-size: 24px;
        font-weight: bold;
        color: #409eff;
      }
      .input-item {
        height: 72px;
        border-bottom: 1px solid #cccccc;
        font-family: MicrosoftYaHei;
        font-size: 14px;
        color: #cccccc;
        display: flex;
        padding-top: 38px;
        i {
          font-size: 24px;
          margin: 0 15px 0 5px;
        }
        input {
          width: 100%;
          height: 24px;
          border: none;
          outline: none;
          padding-top: 10px;
          font-family: MicrosoftYaHei;
          font-size: 14px;
        }
        input::-webkit-input-placeholder {
          color: #cccccc;
        }
      }
      .remember-psd {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
      }
      .login-btn {
        width: 100%;
        height: 40px;
        line-height: 30px;
        text-align: center;
        background-color: #409eff;
        border-radius: 4px;
        float: left;
        margin-top: 60px;
        font-family: MicrosoftYaHei;
        font-size: 16px;
        color: #ffffff;
        cursor: pointer;
        outline: none;
        border: none;
      }
    }
    .reset-form {
      flex-grow: 1;
      padding: 16px 30px 18px 30px;
      nav {
        font-family: MicrosoftYaHei-Bold;
        font-size: 24px;
        font-weight: bold;
        color: #409eff;
      }
      .input-item {
        height: 62px;
        border-bottom: 1px solid #cccccc;
        font-family: MicrosoftYaHei;
        font-size: 14px;
        color: #cccccc;
        display: flex;
        align-items: center;
        padding-top: 18px;
        i {
          font-size: 24px;
          margin: 0 15px 0 5px;
        }
        img {
          width: 80px;
          height: 38px;
        }
        input {
          width: 100%;
          height: 24px;
          border: none;
          outline: none;
          padding-top: 5px;
          font-family: MicrosoftYaHei;
          font-size: 14px;
        }
        input::-webkit-input-placeholder {
          color: #cccccc;
        }
      }
      .info {
        font-size: 12px;
        height: 28px;
        line-height: 30px;
        i {
          color: red;
          font-size: 16px;
          font-weight: bold;
          padding-right: 8px;
        }
      }
      .remember-psd {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-top: 15px;
      }
    }
  }
  .footer-info {
    display: flex;
    width: 770px;
    margin-top: 20px;
    div {
      flex-basis: 12%;
      text-align: right;
      font-family: MicrosoftYaHei;
      font-size: 12px;
      color: #666666;
    }
    section {
      flex-grow: 1;
      font-family: MicrosoftYaHei;
      font-size: 14px;
      color: #409eff;
      text-align: center;
    }
  }
}
</style>
