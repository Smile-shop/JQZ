<template>
  <div class="add-card">
    <el-dialog
      :title="title"
      width="600px"
      :visible.sync="dialogCardVisible"
      :before-close="handleClose"
    >
      <el-dialog
        width="300px"
        title="微信扫码"
        :visible.sync="innerVisible"
        :before-close="handleInnerClose"
        append-to-body
      >
        <img :src="qrCode" alt />
      </el-dialog>
      <div>
        <el-form ref="form" :rules="rules" :model="form" label-width="80px">
          <el-form-item label="提现方式">
            <el-radio-group v-model="form.resource" prop="resource">
              <el-radio label="1" value="1">微信零钱</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="微信扫码">
            <el-button type="primary" size="mini" @click="handleOpenQrcode">获取微信信息</el-button>
          </el-form-item>
          <el-form-item label="微信昵称" prop="nickName">
            <el-input placeholder="扫码后自动获取" v-model="form.nickName" disabled></el-input>
          </el-form-item>
          <el-form-item label="openid" prop="openId">
            <el-input placeholder="扫码后自动获取" v-model="form.openId" disabled></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input placeholder="请输入收款微信的真实姓名" v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="IdCard">
            <el-input placeholder="请输入收款微信的身份证号" v-model="form.IdCard"></el-input>
            <span style="font-size: 12px; color: #999;">提现到微信零钱，免手续费，审核后当天到账，每日限额5000元</span>
          </el-form-item>
          <el-form-item style="text-align: right;">
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="onSubmit('form')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import {
  getQrcode,
  queryWxAuth,
  submitCardInfo,
} from '@/api/super-mkt/activity-set/fission';
@Component({
  components: {},
})
export default class AddCard extends Vue {
  @Prop() dialogCardVisible!: boolean;
  @Prop() title!: string;

  private outerVisible: boolean = false;
  private innerVisible: boolean = false;
  private timer: any = false;

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
    headimgUrl: '',
  };

  private qrCode: string = '';
  private randomCode: string = '';

  private rules = {
    nickName: [
      {
        required: true,
        message: '请获取微信昵称',
        trigger: 'blur',
      },
    ],
    openId: [
      {
        required: true,
        message: '请获取openid',
        trigger: 'blur',
      },
    ],
    name: [
      {
        required: true,
        message: '请输入姓名',
        trigger: 'blur',
      },
      {
        min: 2,
        max: 10,
        message: '长度在 2 到 10 个字符',
        trigger: 'blur',
      },
    ],
    IdCard: [
      {
        required: true,
        message: '请输入身份证号',
        trigger: 'blur',
      },
      {
        min: 18,
        max: 18,
        message: '长度 18 个字符',
        trigger: 'blur',
      },
    ],
  };

  createRandomStr() {
    const str = String(Math.random());
    this.randomCode = str;
  }

  filterFormat(data: any) {
    const result = typeof data === 'string' ? JSON.parse(data) : data;
    return result;
  }

  queryAuth() {
    const params = {
      randomCode: this.randomCode,
    };
    queryWxAuth(params).then((res: any) => {
      if (!res.data) {
        return;
      }
      const { nickname: name, openid: id, headimgUrl } = this.filterFormat(
        res.data
      );
      if (name && id) {
        this.clearTimer();
      }
      const obj = {
        nickName: name,
        openId: id,
        headimgUrl,
      };
      this.form = Object.assign(this.form, obj);
      this.innerVisible = false;
    });
  }

  queryAddCardAuth() {
    this.timer = setInterval(() => {
      this.queryAuth();
    }, 1000 / 1);
  }

  clearTimer() {
    clearInterval(this.timer);
  }

  handleOpenQrcode() {
    this.createRandomStr();
    const params = {
      randomCode: this.randomCode,
    };
    getQrcode(params)
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

  sendCardInfo(params: any) {
    submitCardInfo(params).then((res: any) => {
      const { code, msg } = res;
      if (code == 0) {
        this.$message({
          message: msg,
          type: 'success',
        });
        this.handleClose();
        this.$emit('updateCardList');
      }
    });
  }

  onSubmit(formName: any) {
    const params = {
      identityCard: this.form.IdCard,
      nickName: this.form.nickName,
      openId: this.form.openId,
      userName: this.form.name,
      withdrawType: this.form.resource,
      headimgUrl: this.form.headimgUrl,
    };
    (this.$refs[formName] as any).validate((valid: any) => {
      if (valid) {
        this.sendCardInfo(params);
      } else {
        return false;
      }
    });
  }

  clearForm() {
    this.form = {
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
      headimgUrl: '',
    };
  }

  handleClose() {
    this.clearForm();
    this.$emit('update:dialogCardVisible', false);
    this.clearTimer();
  }

  handleInnerClose() {
    this.innerVisible = false;
    this.clearTimer();
  }
  destroyed() {
    this.clearTimer();
  }
}
</script>

<style lang="scss">
.add-card {
}
</style>