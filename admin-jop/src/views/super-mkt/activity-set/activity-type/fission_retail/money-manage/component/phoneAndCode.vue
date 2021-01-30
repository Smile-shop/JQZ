<template>
  <div class="add-card">
    <el-dialog
      :title="title"
      width="460px"
      :visible.sync="dialogphoneVisible"
      :before-close="handleClose"
    >
      <div>
        <p class="title">短信校验</p>
        <p class="tip">提现金额: {{amount}}元</p>
        <p class="tip">手续费: 0元</p>
        <p class="tip">扣款金额: {{amount}}元</p>
        <p class="tip tip-text">*提现申请后暂不支持撤销操作</p>
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item>
            <el-input
              :class="tipInput"
              placeholder="请输入验证码"
              v-model="form.IdCard"
              size="small"
              style="width: 60%; margin-right: 10px;"
            ></el-input>
            <el-button
              @click.prevent="getCode"
              :type="typeC"
              size="small"
              :disabled="showCode"
              style="width: 120px; height: 32px;"
            >
              <span v-if="code == 1">重新获取验证码</span>
              <span v-else-if="code == 0">{{thirty}}'后获取</span>
              <span v-else>获取验证码</span>
            </el-button>
            <p style="font-size: 12px; color: #999;">将向预留手机号：{{formatPh(phoneNum)}} 发送短信</p>
          </el-form-item>
          <el-form-item style="text-align: center;">
            <el-button @click="handleClose" style="margin-right: 20px">取消</el-button>
            <el-button type="primary" @click="onSubmit">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import {
  getQrcode,
  queryWxAuth,
  submitCardInfo,
  sendVliCode,
} from '@/api/super-mkt/activity-set/fission';
@Component({
  components: {},
})
export default class PhoneCode extends Vue {
  @Prop() dialogphoneVisible!: boolean;
  @Prop() title!: string;
  @Prop() amount!: number;
  @Prop() phoneNum!: string;

  private outerVisible: boolean = false;
  private innerVisible: boolean = false;
  private timer: any = false;
  private code: number = 2;
  private typeC: string = 'primary';
  private tipInput: string = '';
  private showCode: boolean = false;
  private thirty: number = 30;
  private countdownTime: any = '';

  private form: any = {
    name: '',
    region: '',
    date1: '',
    date2: '',
    delivery: false,
    type: [],
    resource: '1',
    desc: '',
    nickName: '',
    openId: '',
    IdCard: '',
  };

  private qrCode: string = '';

  @Watch('dialogphoneVisible')
  openDialog() {
    this.form.IdCard = '';
  }

  @Watch('form.IdCard')
  changeAttr() {
    this.tipInput = '';
  }

  changeCodeText() {
    this.typeC = 'info';
    this.showCode = true;
    this.code = 0;
    this.countdown();
  }

  countdown() {
    this.countdownTime = setInterval(() => {
      this.thirty--;
      if (this.thirty <= 0) {
        clearInterval(this.countdownTime);
        this.typeC = 'primary';
        this.showCode = false;
        this.thirty = 30;
        this.code = 1;
        return;
      }
    }, 1000);
  }

  getCode() {
    const params = {};
    sendVliCode(params).then((res: any) => {
      const { code } = res;
      if (code == 0) {
        this.changeCodeText();
      }
    });
  }

  formatPh(phone: string) {
    const p = String(phone);
    const start = p.slice(0, 3);
    const end = p.slice(p.length - 4, p.length);
    return start + '****' + end;
  }

  queryAuth() {
    queryWxAuth({}).then((res: any) => {
      const { nickName: name, openId: id } = res.data;
      if (name && id) {
        clearInterval(this.timer);
      }
      const obj = {
        nickName: name,
        openId: id,
      };
      this.form = Object.assign(this.form, obj);
      this.innerVisible = false;
    });
  }

  queryAddCardAuth() {
    this.timer = setInterval(() => {
      this.queryAuth();
    }, 1000 / 30);
  }

  handleOpenQrcode() {
    getQrcode({})
      .then((res: any) => {
        const { data } = res;
        this.qrCode = data;
      })
      .then(() => {
        this.innerVisible = true;
      })
      .then(() => {
        this.queryAddCardAuth();
      });
  }

  // 申请提现
  applyWithdraw(vliCode: any) {
    this.handleClose();
    this.$emit('updatePhoneCode');
    this.$emit('sendApplay', vliCode);
  }

  onSubmit() {
    const params = this.form;
    const { IdCard: vliCode } = this.form;
    if (!this.form.IdCard) {
      this.$message({
        type: 'warning',
        message: '请输入验证码',
      });
      this.tipInput = 'tipInput';
      return;
    }
    this.tipInput = '';
    this.applyWithdraw(vliCode);
  }

  handleClose() {
    this.$emit('update:dialogphoneVisible', false);
  }

  handleInnerClose() {
    this.innerVisible = false;
  }
  destroyed() {
    clearInterval(this.countdownTime);
  }
}
</script>

<style lang="scss">
.add-card {
  .title {
    text-align: center;
    height: 30px;
    line-height: 30px;
  }
  .tip {
    margin-left: 80px;
  }
  .tip-text {
    color: #f00;
    margin-bottom: 10px;
    margin-top: 5px;
  }
  .tipInput {
    .el-input__inner {
      border: 1px solid #f00;
    }
  }
}
</style>