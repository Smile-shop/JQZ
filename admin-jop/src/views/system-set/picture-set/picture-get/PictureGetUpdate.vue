<template>
  <article class="picture-get-update">
    <el-form autocomplete="off" ref="form" class="form" :model="ftpIpData" label-width="120px">
      <el-form-item label="图片服务器IP：">
        <el-input autocomplete="off" type="text" @change="ftpIpData.password = ''" v-model="ftpIpData.host" placeholder="输入ip，无需加ftp://"></el-input>
      </el-form-item>
      <el-form-item label="账号："> 
        <el-input autocomplete="off" @change="ftpIpData.password = ''" type="text" v-model="ftpIpData.username" placeholder="请输入短信账号"></el-input>
      </el-form-item>
      <el-form-item label="密码：">
        <el-input autocomplete="off" @focus="ftpIpData.password = ''" type="password" v-model="ftpIpData.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form> 
  </article>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { getPictureSet, setPictureSet } from '@/api/system-set';

@Component({})
export default class PictureGetUpdate extends Vue {
  private ftpIpData = {
    host: '',
    username: '',
    password: ''
  }

  private mounted() {
    this.getFtpIp();
  }

  private getFtpIp() {
    getPictureSet().then((res: any) => {
      this.ftpIpData.host = res.data.host || '';
      this.ftpIpData.username = res.data.username || '';
      this.ftpIpData.password = res.data.host && res.data.username && res.data.password === '-1' ? '!glbrzyg' : '';
    })
  }

  private onSubmit() {
    if (this.ftpIpData.host === '') {
      this.$message('请输入图片服务器IP');
      return
    }
    if (this.ftpIpData.username === '') {
      this.$message('请输入账号');
      return
    }
    if (this.ftpIpData.password === '') {
      this.$message('请输入密码');
      return
    }
    if (this.ftpIpData.password === '!glbrzyg') {
      this.$message('已保存');
      return
    }
    const params = {
      username: this.ftpIpData.username,
      password: this.ftpIpData.password,
      host: this.ftpIpData.host,
    };
    setPictureSet(params).then((res: any) => {
      this.$message({
        type: 'success',
        message: '提交成功！'
      });
    })
  }
}
</script>

<style lang="scss" scoped>
.picture-get-update {
  .form {
    width: 600px;
  }
}
</style>
