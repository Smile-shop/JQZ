<template>
  <el-dialog :title="title" :visible.sync="show" width="550px" :before-close="close">
    <el-dialog
      title="微信扫码"
      :visible.sync="showCode"
      width="250px"
      @close="showCode=false"
      append-to-body
    >
      <el-image :src="codeUrl" style="width: 100%; height: 100%">
        <div
          slot="error"
          class="image-slot"
          style="display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 100%;
                background: #f5f7fa;
                color: #909399;"
        >
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
    </el-dialog>
    <el-form :model="formData" ref="formData" label-width="80px">
      <el-form-item label="微信扫码" v-if="title==='添加核销员'">
        <el-button size="small" type="primary" @click="getCode">获取信息</el-button>
      </el-form-item>
      <el-form-item label="微信昵称" prop="nickName">
        <el-input size="small" disabled v-model="formData.nickName" type="text" />
      </el-form-item>
      <el-form-item label="openId" prop="openId">
        <el-input size="small" disabled v-model="formData.openId" type="text" />
      </el-form-item>
      <el-form-item
        label="所属门店"
        prop="shopName"
        :rules="{
          required: true, message: '请选择所属门店', trigger: 'blur'
        }"
      >
        <el-select v-model="formData.shopName" placeholder="请选择" size="small">
          <el-option
            v-for="item in shopList"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input
          size="small"
          v-model="formData.name"
          maxlength="20"
          type="text"
          show-word-limit
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input
          size="small"
          v-model="formData.phone"
          maxlength="11"
          type="text"
          placeholder="请输入"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="职位" prop="position">
        <el-input
          size="small"
          v-model="formData.position"
          maxlength="20"
          type="text"
          show-word-limit
          placeholder="请输入"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">取 消</el-button>
      <el-button size="small" type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import {
  updateVerifier,
  addVerifier,
  getQrcode,
  getUserInfo,
} from '@/api/super-mkt/activity-set/fission_retail';
@Component({})
export default class AddOrEditDialog extends Vue {
  @Prop({
    type: Boolean,
    required: true,
    default: false,
  })
  show!: boolean;
  @Prop({
    default: () => {
      return {};
    },
  })
  data!: any;
  @Prop({
    default: '添加核销员',
  })
  title!: string;
  @Prop({
    default: [],
  })
  shopList!: any;

  showCode: boolean = false;
  codeUrl: string = '';
  timer: any = null;
  formData: any = {
    nickName: '',
    openId: '',
    shopName: '',
    name: '',
    phone: '',
    position: '',
    id: '',
  };
  randomCode: string = '';
  @Watch('show')
  changShow(val: boolean) {
    if (val) {
      this.$nextTick(() => {
        this.formData = Object.assign({}, this.formData, this.data);
      });
    } else {
      this.formData = {};
    }
  }
  @Watch('showCode')
  changShowCode(val: boolean) {
    if (!val) {
      clearInterval(this.timer);
    }
  }
  beforeDestroy() {
    clearInterval(this.timer);
  }
  async getCode() {
    this.randomCode = (Math.random() * 10000000000000).toFixed(0);
    const res: any = await getQrcode({
      randomCode: this.randomCode,
    });
    const { code, data } = res;
    if (!code && data) {
      this.showCode = true;
      this.codeUrl = data;
      this.getUserInfo();
    }
  }
  getUserInfo() {
    this.timer = setInterval(async () => {
      const res: any = await getUserInfo({
        randomCode: this.randomCode,
      });
      const { code, data } = res;
      if (!code && data) {
        this.showCode = false;
        const { openid: openId, nickname: nickName, headimgUrl } = JSON.parse(
          data
        );
        const info = { openId, nickName, headimgUrl };
        this.formData = Object.assign({}, this.formData, info);
      }
    }, 1000);
  }
  save() {
    (this.$refs.formData as any).validate(async (valid: boolean) => {
      if (valid) {
        const reg = /^1[3456789]\d{9}$/;
        if (!this.formData.nickName || !this.formData.openId) {
          return this.$message.error('请扫码获取昵称和openId');
        } else if (this.formData.phone && !reg.test(this.formData.phone)) {
          return this.$message.error('请填写正确的手机号码');
        }
        delete this.formData.verifyNum;
        this.formData.id
          ? await updateVerifier(this.formData)
          : await addVerifier(this.formData);
        this.close();
        this.$emit('update');
        this.$message.success('保存成功');
      } else {
        console.log('error submit!!');
        return false;
      }
    });
  }
  close() {
    this.$emit('update:show', false);
  }
}
</script>
<style lang="scss" scoped>
  /deep/ .el-input .el-input__count .el-input__count-inner{
    background: transparent;
  }
</style>


