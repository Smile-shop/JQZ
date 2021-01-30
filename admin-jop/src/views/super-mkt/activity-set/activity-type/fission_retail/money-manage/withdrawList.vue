<template>
  <div class="withdrawList">
    <div class="total">
      <div class="total-item">
        <p class="item-title">实收总额</p>
        <p>
          <span class="unit-amount">{{actualTotalAmount}}</span>
          <span>元</span>
        </p>
        <span class="tip">
          <el-tooltip class="item" effect="dark" content="当前活动实收总款" placement="bottom">
            <i class="el-tooltip el-icon-warning-outline" />
          </el-tooltip>
        </span>
      </div>
      <div class="total-item">
        <p class="item-title">待结算总额</p>
        <p>
          <span class="unit-amount">{{pendingAmount}}</span>
          <span>元</span>
        </p>
        <span class="tip">
          <el-tooltip
            class="item"
            effect="dark"
            content="所有活动中，用户支付后尚未结算入账的金额，结算周期T+1天"
            placement="bottom"
          >
            <i class="el-tooltip el-icon-warning-outline" />
          </el-tooltip>
        </span>
      </div>
      <div class="total-item">
        <p class="item-title">可提现金额</p>
        <p>
          <span class="unit-amount">{{withdrawableAmount}}</span>
          <span>元</span>
        </p>
        <span class="tip">
          <el-tooltip class="item" effect="dark" content="已结算，但尚未提现的金额" placement="bottom">
            <i class="el-tooltip el-icon-warning-outline" />
          </el-tooltip>
        </span>
      </div>
      <div class="total-item">
        <p class="item-title">已提现金额</p>
        <p>
          <span class="unit-amount">{{withdrawabledAmount}}</span>
          <span>元</span>
        </p>
        <span class="tip">
          <el-tooltip class="item" effect="dark" content="历史提现总数" placement="bottom">
            <i class="el-tooltip el-icon-warning-outline" />
          </el-tooltip>
        </span>
      </div>
    </div>
    <div class="form">
      <div class="form-item">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
          <el-form-item label="申请时间">
            <el-date-picker
              v-model="formInline.timer"
              type="daterange"
              range-separator="-"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="申请状态">
            <el-select v-model="formInline.region" placeholder="全部状态">
              <el-option label="全部状态" value="0"></el-option>
              <el-option label="待审核" value="1"></el-option>
              <el-option label="付款成功" value="4"></el-option>
              <el-option label="已拒绝" value="6"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="submit">
        <el-button type="primary" size="mini" @click="onSubmit">提现申请</el-button>
      </div>
    </div>
    <div class="table">
      <el-table stripe :data="tableData" border style="width: 100%">
        <el-table-column prop="withdrawalNo" label="申请单号" align="center"></el-table-column>
        <el-table-column prop="withdrawType" label="提现方式" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 1">微信零钱</span>
            <span v-else-if="scope.row.type == 2">企业零钱</span>
            <span v-else>未知</span>
          </template>
        </el-table-column>
        <el-table-column prop="receivingAccount" align="center" label="收款账号">
          <template slot-scope="scope">
            <p>{{scope.row.nickname}}</p>
            <p>{{scope.row.openId}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="withdrawalAmt" align="center" label="提现金额"></el-table-column>
        <el-table-column prop="fee" align="center" label="手续费"></el-table-column>
        <el-table-column prop="occurAmount" align="center" label="扣款金额"></el-table-column>
        <el-table-column prop="applyStatus" align="center" label="申请状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">待审核</span>
            <span v-else-if="scope.row.status == 2">已审核</span>
            <span v-else-if="scope.row.status == 3">处理中</span>
            <span v-else-if="scope.row.status == 4">付款成功</span>
            <span v-else-if="scope.row.status == 5">付款失败</span>
            <span v-else-if="scope.row.status == 6">已拒绝</span>
            <span v-else>未知</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" align="center" label="申请时间"></el-table-column>
        <el-table-column prop="desc" align="center" label="备注信息">
          <template slot-scope="scope">
            <span>{{ scope.row.auditRemark ? scope.row.auditRemark : '——'}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template> 

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import {
  widthTotal,
  withdrawList,
  withdrawListSearch,
} from '@/api/super-mkt/activity-set/fission';
import { applyWithraw } from '@/utils/buttonPermission';

@Component({
  components: {},
})
export default class WithdrawList extends Vue {
  formInline = {
    timer: '',
    region: '0',
  };

  tableData = [];

  currentPage4 = 1;

  pageSize = 10;

  total = 0;

  actualTotalAmount = 0;

  pendingAmount = 0;

  withdrawableAmount = 0;

  withdrawabledAmount = 0;

  mounted() {
    this.getWithdrawTotal();
    this.getWithdrawList();
  }

  getWithdrawTotal() {
    const params = {};
    widthTotal(params).then((res: any) => {
      const {
        allReceiptsAmt,
        customerUsettledAmt,
        customerCanWithdrawalAmt,
        allWithdrawalAmt,
      } = res.data;
      this.actualTotalAmount = allReceiptsAmt;
      this.pendingAmount = customerUsettledAmt;
      this.withdrawableAmount = customerCanWithdrawalAmt;
      this.withdrawabledAmount = allWithdrawalAmt;
    });
  }

  getWithdrawList() {
    const params = {
      auditUser: '',
      companyKey: '',
      companyKeyList: [],
      customerName: '',
      customerNo: '',
      endAuditTime: '',
      endCreateTime: '',
      endWithdrawalAmt: '',
      id: '',
      kindList: [],
      startAuditTime: '',
      startCreateTime: '',
      startWithdrawalAmt: '',
      status: '',
      withdrawalNo: '',
      pageNum: this.currentPage4,
      pageSize: this.pageSize,
    };
    withdrawList(params).then((res: any) => {
      const { total, list } = res.data;
      this.tableData = list;
      this.total = total;
    });
  }

  endTimer(time: any) {
    const all = time.split(' ');
    const result = all[0] + ' 23:59:59';
    return result;
  }

  onSearch() {
    const params = {
      auditUser: '',
      companyKey: '',
      companyKeyList: [],
      customerName: '',
      customerNo: '',
      endAuditTime: '',
      endCreateTime: this.formInline.timer ? this.formInline.timer[1] : '',
      endWithdrawalAmt: '',
      id: '',
      kindList: [],
      startAuditTime: '',
      startCreateTime: this.formInline.timer ? this.formInline.timer[0] : '',
      startWithdrawalAmt: '',
      status:
        Number(this.formInline.region) === 0
          ? ''
          : Number(this.formInline.region),
      withdrawalNo: '',
      pageNum: this.currentPage4,
      pageSize: this.pageSize,
    };
    withdrawList(params).then((res: any) => {
      const { list, total } = res.data;
      this.tableData = list;
      this.total = total;
    });
  }

  async onSubmit() {
    if (!(await applyWithraw())) {
      return;
    }
    this.$router.push('/fission/withdraw-manage/withdrawList/withdrawApply');
  }

  handleSizeChange(val: any) {
    this.pageSize = val;
    this.onSearch();
  }

  handleCurrentChange(val: any) {
    this.currentPage4 = val;
    this.onSearch();
  }
}
</script>

<style lang="scss" scoped>
.withdrawList {
  .unit-amount {
    font-size: 28px;
    font-weight: 500;
    margin-right: 5px;
  }
  .total {
    display: flex;
    justify-content: space-between;
    .total-item {
      position: relative;
      width: 300px;
      height: 100px;
      border: 1px solid #eee;
      border-radius: 12px;
      overflow: hidden;
      padding-top: 20px;
      padding-left: 20px;
      .item-title {
        margin-bottom: 10px;
      }
      .tip {
        position: absolute;
        right: 5px;
        top: 5px;
      }
    }
  }
  .form {
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
    .submit {
      margin-right: 60px;
    }
  }
  .page {
    margin-top: 100px;
    text-align: right;
  }
}
</style>