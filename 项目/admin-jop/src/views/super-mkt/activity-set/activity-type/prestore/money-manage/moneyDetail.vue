<template>
  <div class="withdrawList">
    <el-form class="demo-form-inline">
      <el-form-item>
        <switch-activity :activityName="activityName" @click="dialogTableVisible = true" />
        <el-button type="primary" size="small" style="float: right" @click="exportData">导出数据</el-button>
      </el-form-item>
    </el-form>
    <sum-card :cardList="cardList" />
    <div class="form">
      <div class="form-item">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
          <el-form-item label="支付时间">
            <el-date-picker
              v-model="formInline.timer"
              type="daterange"
              range-separator="-"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="订单号">
            <el-input v-model="formInline.timer" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="微信支付单号">
            <el-input v-model="formInline.timer" placeholder="请输入"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="submit">
        <el-button type="primary" size="mini" @click="onSearch">搜索</el-button>
      </div>
    </div>
    <div class="table">
      <el-table stripe :data="tableData" border style="width: 100%">
        <el-table-column prop="order" label="订单号"></el-table-column>
        <el-table-column prop="nickName" label="微信支付单号"></el-table-column>
        <el-table-column prop="paymentAmount" label="用户昵称"></el-table-column>
        <el-table-column prop="sencondPay" label="openid"></el-table-column>
        <el-table-column prop="firstPay" label="支付金额">
          <template slot-scope="scope">
            <div>{{ scope.row.firstPay | money(2) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="actualAmount" label="支付时间"></el-table-column>
        <el-table-column prop="date" label="支付时间"></el-table-column>
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

    <Activity
      :dialogTableVisible.sync="dialogTableVisible"
      :swtichAll="swtichAll"
      @switch="handleSwitch"
      @switchAll="handleSwitchAll"
    />

    <OrderDtail :dialogOrderVisible.sync="dialogOrderVisible" :orderDetail="orderDetail" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Activity from '../component/activity.vue';
import OrderDtail from './component/orderDetail.vue';
import {
  moneyDetail,
  exportMoneyData,
  searchAcitveDetail,
  queryOrderDetails,
  fundsTotal,
} from '@/api/super-mkt/activity-set/fission';
import { downloadFissionTable, downLoad } from '@/utils/exportFission';
import switchActivity from '../component/switch-activity.vue';
import sumCard from '../component/sumCard.vue';

@Component({
  components: {
    Activity,
    OrderDtail,
    switchActivity,
    sumCard,
  },
})
export default class MoneyDetail extends Vue {
  activityName: string = '';

  activity = {
    activityName: '',
    activityNum: '',
    activityStatus: '',
    activityId: '',
  };

  formInline = {
    timer: '',
  };

  tableData = [];

  currentPage4 = 1;

  pageSize = 10;

  total = 0;

  dialogTableVisible: boolean = false;
  swtichAll: boolean = true;

  dialogOrderVisible: boolean = false;
  orderDetail: any = {};
  cardList: object[] = [
    { name: '今日收款金额', tool: '今日累计收款金额', num: 0, unit: '元' },
    { name: '今日收款笔数', tool: '今日累计收款笔数', num: 0, unit: '笔' },
    {
      name: '收款总笔数',
      tool: '当前活动总收款笔数',
      num: 0,
      unit: '笔',
    },
    {
      name: '收款总金额',
      tool: '当前活动总收款金额',
      num: 0,
      unit: '元',
    },
  ];

  mounted() {
    this.getTableAndTotal();
    this.getFundsCount();
  }

  getTableAndTotal() {
    const params = {
      companyKey: '',
      title: this.activity.activityNum,
      distributionId: this.activity.activityId,
      startSuccessTime: this.formInline.timer ? this.formInline.timer[0] : '',
      endSuccessTime: this.formInline.timer ? this.formInline.timer[1] : '',
      pageNum: this.currentPage4,
      pageSize: this.pageSize,
    };
    moneyDetail(params).then((res: any) => {
      const { list, total } = res.data;
      this.tableData = this.transformList(list);
      this.total = total;
    });
  }

  transformList(arr: any) {
    const l = arr;
    const result: any = [];
    l.map((item: any) => {
      const obj: any = {};
      obj.order = item.payNo;
      obj.nickName = item.nickname;
      obj.paymentAmount = item.payAmt;
      obj.firstPay = item.oneCommission;
      obj.sencondPay = item.twoCommission;
      obj.handleFee = item.fee;
      obj.actualAmount = item.receiptsAmt;
      obj.date = item.createTime;

      // 弹框显示
      obj.id = item.id;
      obj.payNo = item.payNo;
      obj.openid = item.openid;
      obj.payAmt = item.payAmt;
      obj.oneCommission = item.oneCommission;
      obj.twoCommission = item.twoCommission;
      obj.createTime = item.createTime;
      obj.successTime = item.successTime;
      obj.fee = item.fee;
      obj.status = item.status;
      obj.distributionId = item.distributionId;
      obj.companyKey = item.companyKey;
      obj.nickname = item.nickname;
      obj.receiptsAmt = item.receiptsAmt;
      obj.orderNo = item.orderNo;
      obj.oneCommissionNo = item.oneCommissionNo;
      obj.oneCommissionWxNo = item.oneCommissionWxNo;
      obj.twoCommissionNo = item.twoCommissionNo;
      obj.twoCommissionWxNo = item.twoCommissionWxNo;
      obj.headimgUrl = item.headimgUrl;
      obj.directSuperiorName = item.directSuperiorName;
      obj.indirectSuperiorName = item.indirectSuperiorName;
      result.push(obj);
    });

    return result;
  }

  async getFundsCount() {
    const params = {
      distributionId: this.activity.activityId,
    };
    const res: any = await fundsTotal(params);
    const {
      actualAmount: num3,
      paidNum: num2,
      totalCommission: num1,
      totalPayAmount: num0,
    } = res.data;
    this.cardList.forEach((item: any, i: number) => {
      this.$set(item, 'num', eval('num' + i));
    });
  }

  endTimer(time: any) {
    const all = time.split(' ');
    const result = all[0] + ' 23:59:59';
    return result;
  }

  onSearch() {
    const params = {
      companyKey: '',
      title: this.activity.activityNum,
      distributionId: this.activity.activityId,
      startSuccessTime: this.formInline.timer ? this.formInline.timer[0] : '',
      endSuccessTime: this.formInline.timer ? this.formInline.timer[1] : '',
      pageNum: this.currentPage4,
      pageSize: this.pageSize,
    };
    moneyDetail(params).then((res: any) => {
      const { list, total } = res.data;
      this.tableData = this.transformList(list);
      this.total = total;
    });
  }

  handleSizeChange(val: any) {
    this.pageSize = val;
    this.onSearch();
  }

  handleCurrentChange(val: any) {
    this.currentPage4 = val;
    this.onSearch();
  }

  tipDownTable() {
    this.$message({
      type: 'warning',
      message: '暂无数据下载',
    });
  }

  exportData() {
    const params = {
      companyKey: '',
      distributionId: this.activity.activityId,
      startSuccessTime: this.formInline.timer ? this.formInline.timer[0] : '',
      endSuccessTime: this.formInline.timer ? this.formInline.timer[1] : '',
      title: this.activityName,
    };
    if (this.tableData.length <= 0) {
      this.tipDownTable();
      return;
    }
    exportMoneyData(params)
      .then((res: any) => {
        const { data } = res;
        return data;
      })
      .then((data) => {
        downLoad(String(data));
      });
  }

  handleReset() {
    this.currentPage4 = 1;
    this.pageSize = 10;
    this.total = 0;
    (this.activityName = ''),
      (this.activity = {
        activityName: '',
        activityNum: '',
        activityStatus: '',
        activityId: '',
      });
    this.formInline = {
      timer: '',
    };
  }

  transformat(obj: any) {
    const result: any = {};
    result.activityName = obj.title;
    result.activityNum = obj.distributionNo;
    result.activityStatus = obj.status;
    result.activityId = obj.activityId;
    return result;
  }

  handleSwitch(val: any) {
    this.handleReset();
    const { activityName } = val;
    this.activityName = activityName;
    this.activity = this.transformat(val);
    this.getTableAndTotal();
    this.getFundsCount();
  }

  handleSwitchAll() {
    this.handleReset();
    this.getTableAndTotal();
    this.getFundsCount();
  }

  searchOrderDetail(order: string) {
    const params = {
      orderId: order,
    };
    queryOrderDetails(params).then((res: any) => {
      const { data } = res;
      this.orderDetail = data;
    });
  }

  handleDetail(val: any) {
    const { order } = val;
    this.orderDetail = val;
    this.dialogOrderVisible = true;
  }
}
</script>

<style lang="scss" scoped>
.withdrawList {
  .unit-count {
    font-size: 28px;
    font-weight: 500;
    margin-right: 5px;
  }
  .export-data {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
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
    margin-top: 20px;
    text-align: right;
  }
}
</style>
