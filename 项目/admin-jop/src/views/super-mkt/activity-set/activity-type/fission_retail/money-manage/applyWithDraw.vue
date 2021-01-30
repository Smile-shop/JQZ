<template>
  <div class="applyWithDraw">
    <div class="card">
      <div class="card-item" v-for="item in cardList" :key="item.id" @click="handleApply(item)">
        <div :class="tag == item.id ? 'card-item c-border' : 'card-item n-border'">
          <div class="card-item-tag" v-show="tag == item.id">
            <img src="@/assets/images/super-mkt/tag.png" alt />
          </div>
          <div class="card-info-wrapper">
            <div class="card-img">
              <img :src="item.img" alt />
            </div>
            <div class="card-info">
              <p>微信昵称: {{item.wxNickName}}</p>
              <p>姓名: {{item.name}}</p>
              <p>身份证：{{hiddenCard(item.IdCard)}}</p>
            </div>
          </div>
          <div class="card-edit">
            <template v-if="(item.isCanDel==1)">
              <div class="edit-btn" @click.stop="handleDel(item)">删除</div>
            </template>
            <template v-else>
              <div class="card-del">删除</div>
            </template>
            <div class="card-line">|</div>
            <div class="edit-btn edit-text" @click.stop="handleEdit(item)">编辑</div>
          </div>
        </div>
      </div>
      <div class="card-add" @click="handleAdd" v-show="cardList.length < 10">
        <p>+ 新增提现账号</p>
      </div>
    </div>
    <div class="submit">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="140px"
        class="demo-ruleForm"
      >
        <el-form-item label="可提现金额：" prop="canAmount">
          <span class="mount">{{ ruleForm.canAmount}}元</span>
        </el-form-item>
        <el-form-item label="提现金额：" prop="amount">
          <el-input
            placeholder="提现金额不能少于2元"
            v-model="ruleForm.amount"
            oninput="value=value.replace(/[^0-9.]/g,'')"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="提现到微信零钱：" prop="age">
          <span>免手续费，审核后当天到账，每日限额5000元</span>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
    <add-card
      :title="cardTitle"
      :dialogCardVisible.sync="dialogCardVisible"
      @updateCardList="queryCardList"
    />
    <edit-card
      :title="editTitle"
      :form="cardInfo"
      :dialogCardVisible.sync="dialogEditVisible"
      @updateCardList="queryCardList"
    />
    <phone-code
      :dialogphoneVisible.sync="dialogphoneVisible"
      :amount="ruleForm.amount"
      :phoneNum="phone"
      @updatePhoneCode="handleApplyCode"
      @sendApplay="handleSend"
    />
    <no-phone :dialognophoneVisible.sync="dialognophoneVisible" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import AddCard from './component/addCard.vue';
import EditCard from './component/editCard.vue';
import PhoneCode from './component/phoneAndCode.vue';
import NoPhone from './component/noPhone.vue';
import {
  searchWidthdrawCard,
  applayWithDrawAmount,
  queryMerchantSettings,
  getPhone,
  widthTotal,
  deleteCard,
} from '@/api/super-mkt/activity-set/fission';
import user from '@/utils/user';
import {
  addWithdrawAccount,
  withdrawOperation,
} from '@/utils/buttonPermission';

@Component({
  components: {
    AddCard,
    EditCard,
    PhoneCode,
    NoPhone,
  },
})
export default class ApplyWithDraw extends Vue {
  tag = '';
  info: any = {};
  cardList = [];
  ruleForm = {
    canAmount: 0,
    amount: '',
  };
  rules = {
    amount: [{ required: true, validator: this.handleMsg, trigger: 'blur' }],
  };

  dialogphoneVisible: boolean = false;
  dialognophoneVisible: boolean = false;

  cardInfo = {};

  cardTitle: string = '新增提现账号';
  editTitle: string = '编辑提现账号';

  dialogCardVisible: boolean = false;
  dialogEditVisible: boolean = false;
  phone: string = '';

  mounted() {
    this.searchWidthdrawCard();
    this.queryPhone();
    this.queryWithAmount();
  }

  handleMsg(rule: any, value: any, callback: any) {
    if (value) {
      if (value.includes('.') && value.split('.')[1].length > 2) {
        const sta = value.split('.')[0];
        const end = value.split('.')[1].slice(0, 2);
        this.ruleForm.amount = sta + '.' + end;
      } else if (Number(this.ruleForm.amount) > 5000) {
        callback(new Error('最大提现金额5000元'));
      } else if (Number(this.ruleForm.amount) < 2) {
        callback(new Error('最小提现金额2元'));
      } else if (
        Number(this.ruleForm.amount) > Number(this.ruleForm.canAmount)
      ) {
        callback(new Error('提现金额必须小于可提现金额'));
      } else {
        callback();
      }
    } else {
      callback(new Error('提现金额不能为空'));
    }
  }

  transFormat(arr: any) {
    const l = arr;
    const result: any = [];
    l.map((item: any) => {
      const obj: any = {};
      obj.id = item.id;
      (obj.wxNickName = item.nickName),
        (obj.name = item.userName),
        (obj.IdCard = item.identityCard),
        (obj.img = item.headimgUrl),
        (obj.id = item.id),
        (obj.isCanDel = item.isCanDel),
        result.push(obj);
    });

    return result;
  }

  queryPhone() {
    const params = {};
    getPhone(params).then((res) => {
      const { mobileCheck } = res.data;
      this.phone = mobileCheck;
    });
  }

  queryWithAmount() {
    const params = {};
    widthTotal(params).then((res: any) => {
      const { customerCanWithdrawalAmt } = res.data;
      this.ruleForm.canAmount = customerCanWithdrawalAmt;
    });
  }

  handleSend(IdCard: string) {
    const params = {
      accountId: this.info.id,
      phone: this.phone,
      userId: user.serverUser.account.accountName,
      verifyCode: IdCard,
      withdrawAmount: Number(this.ruleForm.amount),
      IdCard: this.tag,
    };
    this.applyWithDraw(params);
  }

  searchWidthdrawCard() {
    const params = {};
    searchWidthdrawCard(params).then((res: any) => {
      const { data } = res;
      this.cardList = data ? this.transFormat(data) : [];
    });
  }

  hiddenCard(IdCard: string) {
    const str = String(IdCard);
    const start = str.slice(0, 4);
    const end = str.slice(str.length - 4, str.length);
    return start + '******' + end;
  }

  handleApplyCode() {
    console.log('huer');
  }

  resetSelected() {
    this.ruleForm.amount = '';
    this.tag = '';
    this.queryWithAmount();
  }

  applyWithDraw(params: any) {
    const { IdCard } = params;
    if (IdCard) {
      applayWithDrawAmount(params).then((res: any) => {
        const { code, msg } = res;
        if (code == 0) {
          this.$message({
            message: msg,
            type: 'success',
          });
          this.resetSelected();
          this.searchWidthdrawCard();
        }
      });
    } else {
      this.$message({
        message: '请选提现账号或添加新账号',
        type: 'warning',
      });
    }
  }

  validatePhoneAndCode(phone: string) {
    if (phone) {
      this.dialogphoneVisible = true;
    } else {
      this.dialognophoneVisible = true;
    }
  }

  async submitForm(formName: any) {
    if (!(await withdrawOperation())) {
      return;
    }
    const params = {
      IdCard: this.tag,
      amount: this.ruleForm.amount,
    };
    (this.$refs[formName] as any).validate((valid: any): void => {
      if (valid && this.tag) {
        const phone = this.phone;
        this.validatePhoneAndCode(phone);
      } else if (!this.tag) {
        this.tipMSG('请选提现账号或添加新账号');
      }
    });
  }
  tipMSG(msg: string) {
    this.$message({
      type: 'warning',
      message: msg,
    });
  }
  backPre() {
    this.$router.back();
  }
  resetForm(formName: any) {
    (this.$refs[formName] as any).resetFields();
    this.ruleForm.amount = '';
    this.tag = '';
    this.backPre();
  }
  async handleAdd() {
    if (!(await addWithdrawAccount())) {
      return false;
    }
    this.dialogCardVisible = true;
  }
  queryCardList() {
    this.searchWidthdrawCard();
  }

  openEditDialog() {
    this.dialogEditVisible = true;
  }

  handleEdit(val: any) {
    this.openEditDialog();
    this.cardInfo = JSON.parse(JSON.stringify(val));
  }

  async handleDel(val: any) {
    if (val) {
      await deleteCard({ id: val.id });
      this.$message({
        type: 'success',
        message: '删除成功！',
      });
      this.searchWidthdrawCard();
    }
  }

  handleApply(val: any) {
    const { IdCard, id } = val;
    this.info = val;
    this.tag = id;
    this.cardInfo = JSON.parse(JSON.stringify(val));
  }
}
</script>

<style lang="scss" scoped>
.applyWithDraw {
  .card-item {
    position: relative;
    display: inline-block;
    width: 400px;
    height: 200px;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    margin-right: 20px;
    .card-item-tag {
      position: absolute;
      right: 12px;
      top: 12px;
      width: 24px;
      height: 24px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .card-info-wrapper {
      height: 160px;
      display: flex;
      align-items: center;
      .card-img {
        display: inline-block;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: #eee;
        margin-left: 30px;
        margin-right: 20px;
        overflow: hidden;
      }
      .card-info {
        display: inline-block;
      }
    }
    .c-border {
      border: 1px solid #5482ff;
    }
    .n-border {
      border: 1px solid #eeeeee;
    }
    .card-edit {
      position: absolute;
      bottom: 0;
      width: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 40px;
      line-height: 40px;
      border-top: 1px solid #eee;
      .edit-btn {
        width: 50%;
        text-align: center;
      }
      .edit-text {
        color: #5482ff;
      }
      .card-line {
        color: #eee;
        width: 1px;
      }
      .card-del {
        color: #eee;
        width: 50%;
        text-align: center;
      }
    }
  }
  .card-add {
    display: inline-block;
    width: 400px;
    height: 200px;
    line-height: 200px;
    border-radius: 12px;
    overflow: hidden;
    text-align: center;
    border: 1px dotted #999;
    cursor: pointer;
    background-color: #f7f8fa;
  }
  .mount {
    font-size: 22px;
    color: #5482ff;
  }
  .submit {
    width: 500px;
    margin-top: 50px;
  }
}
</style>
