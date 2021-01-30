<template>
  <article class="admin-password">
    <el-form autocomplete="off" :rules="ruleValidate" ref="updatePsdData" class="form" :model="updatePsdData" label-width="120px">
      <el-form-item label="原密码：" prop="oldPassword">
        <el-input autocomplete="off" :maxlength="20" type="password" v-model="updatePsdData.oldPassword" placeholder="请输入原密码"></el-input>
      </el-form-item> 
      <el-form-item label="新密码：" prop="newPassword">
        <el-input autocomplete="off" :maxlength="20" type="password" v-model="updatePsdData.newPassword" placeholder="请输入新密码"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码：" prop="confrimPassword">
        <el-input autocomplete="off" :maxlength="20" type="password" v-model="updatePsdData.confrimPassword" placeholder="请再次输入新密码"></el-input>
      </el-form-item>
      <el-form-item label="图形验证码：" prop="validateCode">
        <el-input autocomplete="off" type="text" :maxlength="4" v-model="updatePsdData.validateCode" placeholder="请输入图形验证码">
          <div slot="append" style="width:70px;height: 20px;">
            <img :src="imgSrc" alt="图形验证码" @click="imgSrcClick">
          </div> 
        </el-input>
      </el-form-item>
      <el-form-item label="验证手机：">
        {{computedPhone(this.userData.phone)}}
        <span style="color: red">(注：签约预留验证手机号，如需修改请联系金千枝客服)</span>
      </el-form-item>
      <el-form-item label="短信验证码：" prop="messageCode">
        <el-input autocomplete="off" :maxlength="8" type="text" v-model="updatePsdData.messageCode" placeholder="请输入短信验证码">
          <a slot="append" v-if="getCodeBtnDisabled" @click="getMessageCode">获取验证码</a>
          <div slot="append" style="width:60px;color:#2b85e4" v-else>{{number}}</div>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="btnDisabled" @click="updatePsd('updatePsdData')">确认修改</el-button>
      </el-form-item>
    </el-form>
  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import user from '@/utils/user';
import { getCompanyInfo, sendPhoneMsg, updatePsd } from '@/api/system-set'

@Component({
})
export default class AdminPassword extends Vue {
  private imgSrc = '';
  private updatePsdData = {
    oldPassword: '',
    newPassword: '',
    confrimPassword: '',
    validateCode: '',
    messageCode: ''
  };
  private userData = {
    accountId: '',
    phone: '',
    companyKey: ''
  };
  private ruleValidate = {
    oldPassword: [
      { required: true, message: '原始密码不能为空', trigger: 'blur' }
    ],
    newPassword: [
      { required: true, message: '新密码不能为空', trigger: 'blur' }
    ],
    confrimPassword: [
      { required: true, message: '确认新密码不能为空', trigger: 'blur' }
    ],
    validateCode: [
      { required: true, message: '图形验证码不能为空', trigger: 'blur' }
    ],
    messageCode: [
      { required: true, message: '短信验证码不能为空', trigger: 'blur' }
    ]
  };
  private btnDisabled = true;
  private timer: any = null;
  private number = 59;
  private getCodeBtnDisabled = true;

  private mounted() {
    this.userData.accountId = user.serverUser.account.accountId;
    this.userData.companyKey = user.serverUser.account.companyKey;
    this.getCompanyInfo();
  }

  private computedPhone(value: any) {
    if (value) {
      return `${value}`.replace(/^(.{3})(?:\d+)(.{4})$/, '$1****$2');
    }
    return '您未预留手机号，请联系客服！';
  }

  private imgSrcClick() {
    this.imgSrc = `${VUE_APP_BASE_API}/jop-web/wxCode/randanCode?openid=${this.userData.phone}?${Math.random()}`;
  }

  private getCompanyInfo() {
    getCompanyInfo({}).then((res: any) => {
      this.userData.phone = res.data.companyInfo.mobile || '';
      this.imgSrcClick();
      this.btnDisabled = false;
    })
  }

  private getMessageCode() {
    if (this.updatePsdData.validateCode === '') {
      this.$message('请填写图形验证码！');
      return
    };
    if (this.userData.phone === '') {
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
      phone: this.userData.phone,
      validateCode: this.updatePsdData.validateCode
    };
    sendPhoneMsg(params).then((res: any) => {
      this.$message({
        type: 'success',
        message: '短信验证码发送成功，请注意查收！'
      });
    }).catch((err: any) => {
      window.clearInterval(this.timer);
      this.timer = null;
      this.number = 59;
      this.getCodeBtnDisabled = true;
    })
  }

  private updatePsd(name: any) {
    (this.$refs[name] as any).validate((valid: any) => {
      if (valid) {
        if (this.updatePsdData.newPassword !== this.updatePsdData.confrimPassword) {
          this.$message('新密码和确认密码不一致！');
          return
        }
        const params = {
          accountId: this.userData.accountId,
          password: this.updatePsdData.oldPassword,
          newPassword: this.updatePsdData.newPassword,
          validateCode: this.updatePsdData.validateCode,
          messageCode: this.updatePsdData.messageCode,
          phone: this.userData.phone
        };
        updatePsd(params).then((res: any) => {
          this.$message({
            type: 'success',
            message: '修改成功！'
          });
        })
      }
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
.admin-password {
  .form {
    width: 800px;
    p {
      color: #51adec;
      font-size: 12px;
    }
  }
}
</style>
