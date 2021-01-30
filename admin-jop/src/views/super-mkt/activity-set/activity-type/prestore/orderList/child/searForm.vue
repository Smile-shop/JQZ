<template>
  <el-form :model="form" ref="form" inline class="demo-form-inline" label-width="96px">
    <el-row :gutter="10">
      <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6">
        <el-form-item label="用户昵称" prop="nickname">
          <el-input size="small" clearable placeholder="请输入" v-model="form.nickname" type="text" />
        </el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6">
        <el-form-item label="支付状态" prop="payStatus">
          <el-select v-model="form.payStatus" clearable placeholder="全部状态" size="small">
            <el-option label="全部状态" value></el-option>
            <el-option label="未支付" :value="2"></el-option>
            <el-option label="已支付" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6">
        <el-form-item label="核销状态" prop="verifyStatus">
          <el-select v-model="form.verifyStatus" clearable placeholder="全部状态" size="small">
            <el-option label="全部状态" value></el-option>
            <el-option label="未核销" value="1"></el-option>
            <el-option label="已核销" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6">
        <el-form-item label="核销员" prop="verifier">
          <el-select v-model="form.verifier" clearable placeholder="全部核销员" size="small">
            <el-option label="全部核销员" value></el-option>
            <el-option v-for="item in verifierList" :key="item.id" :label="item.name || item.nickName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6">
        <el-form-item label="核销时间" prop="verifyTime">
          <el-date-picker
            v-model="form.verifyTime"
            style="width: 230px"
            type="daterange"
            size="small"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6">
        <el-form-item label="兑换门店" prop="shopName">
          <el-select v-model="form.shopName" clearable placeholder="全部门店" size="small">
            <el-option label="全部门店" value></el-option>
            <el-option
              v-for="item in shopList"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6">
        <el-form-item label="核销方式" prop="verifyType">
          <el-select v-model="form.verifyType" clearable placeholder="所有方式" size="small">
            <el-option label="所有方式" value></el-option>
            <el-option label="手机核销" value="2"></el-option>
            <el-option label="后台核销" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6">
        <el-form-item label="支付时间" prop="payTime">
          <el-date-picker
            v-model="form.payTime"
            style="width: 230px"
            type="daterange"
            size="small"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6">
        <el-form-item label="充值单号" prop="directSuperiorName">
          <el-input
            size="small"
            clearable
            placeholder="请输入"
            v-model="form.directSuperiorName"
            type="text"
          />
        </el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6">
        <el-form-item label="会员卡号" prop="directSuperiorName">
          <el-input
            size="small"
            clearable
            placeholder="请输入"
            v-model="form.directSuperiorName"
            type="text"
          />
        </el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6">
        <el-form-item label="礼品名称" prop="indirectSuperiorName">
          <el-input
            size="small"
            clearable
            placeholder="请输入"
            v-model="form.indirectSuperiorName"
            type="text"
          />
        </el-form-item>
      </el-col>

      <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6">
        <el-form-item label="购买渠道" prop="channelId">
          <el-select v-model="form.channelId" clearable placeholder="全部渠道" size="small">
            <el-option label="全部渠道" value></el-option>
            <el-option
              v-for="item in channelList"
              :key="item.id"
              :label="item.channelName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6">
        <el-form-item label=" ">
          <el-button size="small" type="primary" @click="sendData">搜索</el-button>
          <el-button size="small" @click="reset">重置</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { getVerifierForOrder } from '@/api/super-mkt/activity-set/fission_retail';
import { getCustomerShopSetting } from '@/api/system-set';
import moment from 'moment';
interface Form {
  beginPayTime: string;
  beginVerifyTime: string;
  channelId: string;
  companyKey: string;
  directSuperiorName: string;
  endPayTime: string;
  endVerifyTime: string;
  indirectSuperiorName: string;
  nickname: string;
  payStatus: string;
  shopName: string;
  verifier: string;
  verifyStatus: string;
  verifyType: string;
  verifyTime?: any;
  payTime?: any;
}
@Component({})
export default class SearchForm extends Vue {
  @Prop({
    default: () => [],
  })
  channelList!: any;
 @Prop({
    default: () => [],
  })
  verifierList!: any
  form: Form = {
    beginPayTime: '',
    beginVerifyTime: '',
    channelId: '',
    companyKey: '',
    directSuperiorName: '',
    endPayTime: '',
    endVerifyTime: '',
    indirectSuperiorName: '',
    nickname: '',
    payStatus: '',
    shopName: '',
    verifier: '',
    verifyStatus: '',
    verifyType: '',
    verifyTime: [],
    payTime: [],
  };
  shopList: any[] = [];
  created() {
    this.getCustomerShopSetting();
  }
  async getCustomerShopSetting() {
    const res: any = await getCustomerShopSetting({});
    const { code, data } = res;
    if (!code) {
      this.shopList = data.shopPermissionList.filter(
        (item: any) => item.isSelect
      );
    }
  }
  reset() {
    (this.$refs.form as any).resetFields();
    this.setDate();
    console.log(this.form.payTime);
    this.$emit('getFormData', this.form);
  }
  sendData() {
    this.setDate();
    this.$emit('getFormData', this.form);
  }
  setDate() {
    this.form.beginPayTime =
      this.form.payTime.length > 0
        ? `${moment(this.form.payTime[0]).format('YYYY-MM-DD')} 00:00:00`
        : '';
    this.form.endPayTime =
      this.form.payTime.length > 0
        ? `${moment(this.form.payTime[1]).format('YYYY-MM-DD')} 23:59:59`
        : '';
    this.form.endVerifyTime =
      this.form.verifyTime.length > 0
        ? `${moment(this.form.verifyTime[1]).format('YYYY-MM-DD')} 23:59:59`
        : '';
    this.form.beginVerifyTime =
      this.form.verifyTime.length > 0
        ? `${moment(this.form.verifyTime[0]).format('YYYY-MM-DD')} 00:00:00`
        : '';
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-input__inner {
  width: 230px;
}
/deep/ .el-range-separator {
  width: 15px;
}
/deep/ .el-select {
  .el-input__icon {
    line-height: 40px;
  }
}
</style>


