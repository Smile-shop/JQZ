<template>
  <div class="msg-validate">
    <div class="msg-total">
      剩余短信<span>{{form.smsNum}}</span>条
    </div> 
    <el-form ref="form" class="form" :model="form" label-width="60px">
      <el-form-item label="账号：">
        <el-input autocomplete="off" :disabled="isSetting" type="text" v-model="form.username" placeholder="请输入短信账号"></el-input>
      </el-form-item>
      <el-form-item label="密码：">
        <el-input autocomplete="off" :disabled="isSetting" type="password" v-model="form.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="isSetting" type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template> 

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import { getSMSInfo, setSMSInfo } from '@/api/system-set';

@Component({
})
export default class MsgValidate extends Vue {
  private isSetting: boolean = false;
  private form = {
    username: '',
    password: '',
    smsNum: 0
  }

  private mounted() {
    this.getSMSInfo();
  }

  private getSMSInfo() {
    getSMSInfo().then((res: any) => {
      this.isSetting = true;
      this.form = {
        username: res.data.username,
        password: res.data.password,
        smsNum: (res.data.val / 10)
      }
    }).catch((err: any) => {
      this.isSetting = false;
      this.form = {
        username: '',
        password: '',
        smsNum: 0
      }
    })
  }

  private onSubmit() {
    const params = {
      username: this.form.username,
      password: this.form.password,
      type: 0,
      platform: '0'
    }
    setSMSInfo(params).then((res: any) => {
      this.getSMSInfo();
      this.$message({
        type: 'success',
        message: '修改成功！'
      });
    })
  }
}
</script>

<style lang="scss" scoped>
.msg-validate {
  .msg-total {
    width: 720px;
    height: 70px;
    background-color: #f5f5f5;
    border-radius: 5px;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    > span {
      font-size: 48px;
      font-weight: bold;
      color: #e12f30;
      padding: 0 8px;
    }
  }
  .form {
    width: 720px;
    margin-top: 20px;
  }
}
</style>
