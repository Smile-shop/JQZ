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
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="提现方式">
            <el-radio-group v-model="resource">
              <el-radio label="1" value="1">微信零钱</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="微信扫码">
            <el-button
              disabled
              type="primary"
              size="mini"
              @click="handleOpenQrcode"
              style="background-color: #999; border: none;"
            >获取微信信息</el-button>
          </el-form-item>
          <el-form-item label="微信昵称">
            <el-input placeholder="扫码后自动获取" v-model="form.wxNickName" disabled></el-input>
          </el-form-item>
          <el-form-item label="openid">
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
      <!-- <div slot="footer" class="dialog-footer">
      <el-button @click="outerVisible = false">取 消</el-button>
      <el-button type="primary" @click="innerVisible = true">打开内层 Dialog</el-button>
      </div>-->
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import {
  getQrcode,
  queryWxAuth,
  modifyCardInfo,
} from '@/api/super-mkt/activity-set/fission';
@Component({
  components: {},
})
export default class EditCard extends Vue {
  @Prop() dialogCardVisible!: boolean;
  @Prop() title!: string;
  @Prop() form!: any;

  private outerVisible: boolean = false;
  private innerVisible: boolean = false;
  private resource = '1';

  private qrCode: string = '';

  private rules = {
    name: [
      {
        required: true,
        message: '请输入收款微信的真实姓名',
        trigger: 'change',
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
        message: '请输入收款微信的身份证号',
        trigger: 'change',
      },
      {
        min: 18,
        max: 18,
        message: '长度 18 个字符',
        trigger: 'blur',
      },
    ],
  };

  queryAuth() {
    queryWxAuth({}).then((res: any) => {
      const { nickName: name, openId: id } = res.data;
      const obj = {
        nickName: name,
        openId: id,
      };
      this.form = Object.assign(this.form, obj);
      this.innerVisible = false;
    });
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
        setTimeout(() => {
          this.queryAuth();
        }, 3000);
      });
  }

  sendCardInfo(params: any) {
    const obj = {
      id: params.id,
      name: params.name,
      identityCard: params.IdCard,
    };
    const options = Object.assign(params, obj);
    modifyCardInfo(options).then((res: any) => {
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
    const params = this.form;
    (this.$refs[formName] as any).validate((valid: any) => {
      if (valid) {
        this.sendCardInfo(params);
      } else {
        return false;
      }
    });
  }

  handleClose() {
    this.$emit('update:dialogCardVisible', false);
  }

  handleInnerClose() {
    this.innerVisible = false;
  }
}
</script>

<style lang="scss">
.add-card {
}
</style>