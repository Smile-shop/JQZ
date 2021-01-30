<template>
  <div class="super-mkt-home">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="品牌名：" prop="brandName">
        <el-input
          type="text"
          placeholder="活动举办方,品牌名或公司名,最多12个字"
          v-model="ruleForm.brandName"
          maxlength="12"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="品牌logo：" prop="logo">
        <el-upload
          :headers="opt()"
          class="avatar-uploader"
          :action="baseURL+'\/jop-marketing-web\/market\/upload'"
          :show-file-list="false"
          :on-success="handlelogoAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="logoImageUrl" :src="logoImageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span style="font-size: 12px; color: #999;">建议尺寸120*120px,JPG、PNG格式，图片小于100KB</span>
      </el-form-item>
      <el-form-item label="品牌简介：" prop="brandDes">
        <el-input
          type="text"
          placeholder="活动举办方,品牌名或公司名,最多12个字"
          v-model="ruleForm.brandDes"
          maxlength="12"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="交易须知：" prop="transactionnotice">
        <el-input
          type="textarea"
          :autosize="{ minRows: 5}"
          v-model="ruleForm.transactionnotice"
          maxlength="1000"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="姓名：" prop="name">
        <el-input
          type="text"
          placeholder="请输入客服姓名"
          v-model="ruleForm.name"
          maxlength="10"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号/座机：" prop="phone">
        <el-input
          type="text"
          placeholder="请输入客服手机号/座机"
          v-model="ruleForm.phone"
          maxlength="12"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="客服二维码：（默认客服）" prop="qrCode">
        <el-upload
          class="avatar-uploader"
          :headers="opt()"
          :action="baseURL+'\/jop-marketing-web\/market\/upload'"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="qrImageUrl" :src="qrImageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span style="font-size: 12px; color: #999;">建议尺寸120*120px,JPG、PNG格式，图片小于100KB</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')" size="mini">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template> 

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import {
  merchantSettings,
  queryMerchantSettings,
} from '@/api/super-mkt/activity-set/fission';
import user from '@/utils/user';
import { merchantSave } from '@/utils/buttonPermission';

@Component({
  components: {},
})
export default class MerchantInstall extends Vue {
  baseURL = VUE_APP_BASE_API;
  qrImageUrl = '';
  logoImageUrl = '';
  ruleForm = {
    id: '',
    brandName: '',
    logo: '',
    brandDes: '',
    transactionnotice: '',
    name: '',
    phone: '',
    qrCode: '',
    companyKey: '',
    createTime: '',
  };

  rules = {
    brandName: [
      { required: true, message: '请输入品牌名', trigger: 'blur' },
      { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' },
    ],
    logo: [{ required: true, message: '请上传品牌logo', trigger: 'change' }],
    brandDes: [
      { required: true, message: '请输入品牌简介', trigger: 'change' },
    ],
    name: [{ required: true, message: '请输入客服姓名', trigger: 'blur' }],
    phone: [
      { required: true, message: '请输入客服手机号/座机', trigger: 'blur' },
    ],
    qrCode: [
      { required: true, message: '请上传客服二维码', trigger: 'change' },
    ],
  };

  mounted() {
    this.querySetting();
  }

  opt() {
    const opt = {
      ticket: user.serverUser.ticket,
      companyKey: user.serverUser.account.companyKey,
    };
    return opt;
  }

  // 查询设置
  querySetting() {
    const params = {};
    queryMerchantSettings(params).then((res: any) => {
      const {
        id,
        brandName,
        brandLogo,
        brandIntro,
        tradeNotice,
        kfName,
        kfPhone,
        kfQrcode,
        companyKey,
        createTime,
      } = res.data;
      this.ruleForm.brandDes = brandIntro;
      this.ruleForm.logo = brandLogo;
      this.ruleForm.brandName = brandName;
      this.ruleForm.companyKey = companyKey;
      this.ruleForm.createTime = createTime;
      this.ruleForm.id = id;
      this.ruleForm.name = kfName;
      this.ruleForm.phone = kfPhone;
      this.ruleForm.qrCode = kfQrcode;
      this.ruleForm.transactionnotice = tradeNotice;
      this.logoImageUrl = brandLogo;
      this.qrImageUrl = kfQrcode;
    });
  }

  async submitForm(formName: any) {
    if (!(await merchantSave())) {
      return;
    }
    (this.$refs[formName] as any).validate((valid: any) => {
      if (valid) {
        const params = {
          brandIntro: this.ruleForm.brandDes,
          brandLogo: this.ruleForm.logo,
          brandName: this.ruleForm.brandName,
          companyKey: this.ruleForm.companyKey,
          createTime: this.ruleForm.createTime,
          id: this.ruleForm.id,
          kfName: this.ruleForm.name,
          kfPhone: this.ruleForm.phone,
          kfQrcode: this.ruleForm.qrCode,
          tradeNotice: this.ruleForm.transactionnotice,
        };
        merchantSettings(params).then((res: any) => {
          const { code, msg } = res;
          this.$message({
            message: msg,
            type: 'success',
          });
        });
      } else {
        return false;
      }
    });
  }

  resetForm(formName: any) {
    (this.$refs[formName] as any).resetFields();
  }

  handlelogoAvatarSuccess(res: any, file: any) {
    const url = file.response.data[0];
    this.logoImageUrl = URL.createObjectURL(file.raw);
    this.ruleForm.logo = url;
  }
  handleAvatarSuccess(res: any, file: any) {
    const url = file.response.data[0];
    this.qrImageUrl = URL.createObjectURL(file.raw);
    this.ruleForm.qrCode = url;
  }

  beforeAvatarUpload(file: any) {
    const isJPG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';
    const isLt1K = file.size / 1024 < 100;
    if (!isLt1K) {
      this.$message.error('上传头像图片大小不能超过 100KB!');
    }
  }
}
</script>

<style lang="scss" scoped>
.super-mkt-home {
  width: 600px;
  /deep/ .el-input .el-input__count .el-input__count-inner {
    background-color: transparent;
  }
  /deep/ .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>