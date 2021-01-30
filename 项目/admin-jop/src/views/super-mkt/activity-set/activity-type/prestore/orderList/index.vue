<template>
  <div class="OrderList">
    <el-form class="demo-form-inline">
      <el-form-item>
        <switch-activity :activityName="activityName" @click="dialogTableVisible=true" />
        <el-button size="small" style="float: right" type="primary" @click="orderExport">导出数据</el-button>
      </el-form-item>
    </el-form>
    <sum-card :cardList="cardList" />
    <sear-form
      ref="searForm"
      @getFormData="getFormData"
      :channelList="channelList"
      :verifierList="verifierList"
    />
    <table-data :dataList="dataList" @sortData="sortData">
      <template slot-scope="scope" slot="action">
        <el-button type="text" @click="showOrderDetail(scope.row)">查看详情</el-button>
      </template>
    </table-data>
    <div style="text-align: right; margin-top: 20px">
      <el-pagination
        v-show="total > 0"
        background
        layout="total, prev, pager, next, sizes, jumper"
        :page-sizes="[10, 20, 50, 100]"
        :page-size.sync="page.pageSize"
        @size-change="pageQueryOrder"
        @current-change="pageQueryOrder"
        :current-page.sync="page.pageNum"
        :total="total"
      ></el-pagination>
    </div>
    <detail-dialog :show-detail.sync="showDetail" :detail-data.sync="detailData" />
    <activity :dialogTableVisible.sync="dialogTableVisible" @switch="handleSwitch" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import detailDialog from './child/detailDialog.vue';
import sumCard from '../component/sumCard.vue';
import searForm from './child/searForm.vue';
import tableData from './child/tableData.vue';
import activity from '../component/activity.vue';
import { exportOrderList } from '@/utils/buttonPermission';
import {
  pageQueryOrder,
  countOrderRecord,
  orderExport,
  queryDistributionPage,
  pageQueryChannel,
  getVerifierForOrder,
} from '@/api/super-mkt/activity-set/fission_retail';
import { downLoad } from '@/utils/exportFission';
import switchActivity from '../component/switch-activity.vue';
interface Page {
  pageNum: number;
  pageSize: number;
}
interface Form {
  beginPayTime: string;
  beginVerifyTime: string;
  channelId: string;
  companyKey: string;
  directSuperiorName: string;
  distributionId: string;
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
@Component({
  components: {
    detailDialog,
    sumCard,
    searForm,
    tableData,
    activity,
    switchActivity,
  },
})
export default class OrderList extends Vue {
  detailData: object = {};
  activetityId: string | number = '';
  showDetail: boolean = false;
  visible: boolean = false;
  form: Form = {
    beginPayTime: '',
    beginVerifyTime: '',
    channelId: '',
    companyKey: '',
    directSuperiorName: '',
    distributionId: '',
    endPayTime: '',
    endVerifyTime: '',
    indirectSuperiorName: '',
    nickname: '',
    payStatus: '',
    shopName: '',
    verifier: '',
    verifyStatus: '',
    verifyType: '',
    verifyTime: null,
    payTime: null,
  };
  name: string = '';
  dataList: object[] = [];
  total: number = 0;
  page: Page = { pageNum: 1, pageSize: 10 };
  cardList: object[] = [
    { name: '收款笔数', tool: '当前活动总收款笔数', num: 0, unit: '笔' },
    { name: '收款总额', tool: '当前活动总收款金额', num: 0, unit: '元' },
    { name: '兑换人数', tool: '当前活动完成奖礼品兑换的人数', num: 0, unit: '人' },
    {name: '领取人数', tool: '当前活动完成礼品领取的人数', num: 0, unit: '人' },
  ];
  activityName: string = '';
  dialogTableVisible: boolean = false;
  channelList: any[] = [];
  verifierList: any[] = [];
  created() {
    const { activityName, distributionId } = this.$route.query;
    this.form.distributionId = distributionId as string;
    this.activityName = activityName as string;
    if (activityName && distributionId) {
      this.pageQueryOrder();
      this.countOrderRecord();
      this.pageQueryChannel();
      this.getVerifierForOrder(distributionId);
    } else {
      this.queryDistributionPage();
    }
  }
  async getVerifierForOrder(distributionId: any) {
    const res: any = await getVerifierForOrder({ distributionId });
    const { code, data } = res;
    if (!code && data) {
      this.verifierList = data;
    }
  }
  async queryDistributionPage() {
    const body = {
      page: {
        pageNum: 1,
        pageSize: 10,
      },
      params: { status: 2 },
    };
    const res: any = await queryDistributionPage(body);
    const { code, data } = res;
    if (!code && data && data?.list.length > 0) {
      this.activityName = data.list[0].title;
      this.form.distributionId = data.list[0].id;
      this.pageQueryOrder();
      this.countOrderRecord();
      this.pageQueryChannel();
      this.getVerifierForOrder(this.form.distributionId);
    }
  }
  async pageQueryChannel() {
    const res: any = await pageQueryChannel({
      distributionId:
        (this.$route.query.distributionId as string) ||
        this.form.distributionId,
      pageNum: 1,
      pageSize: 10000,
    });
    const { code, data } = res;
    if (!code) {
      this.channelList = data.list;
    }
  }
  async countOrderRecord() {
    const { distributionId } = this.form;
    const res = await countOrderRecord({ distributionId });
    const {
      paidNum: num0,
      totalPayAmount: num1,
      totalCommission: num2,
      actualAmount: num3,
    } = res.data;
    this.cardList.forEach((item: any, i: number) => {
      this.$set(item, 'num', eval('num' + i));
    });
  }
  handleSwitch(val: any) {
    this.page.pageNum = 1;
    this.activityName = val.activityName;
    this.form.distributionId = val.activityId;
    (this.$refs.searForm as any).reset();
    // this.pageQueryOrder();
    this.countOrderRecord();
    this.pageQueryChannel();
    this.getVerifierForOrder(this.form.distributionId);
  }
  getFormData(val: any) {
    this.page.pageNum = 1;
    this.form = Object.assign({}, this.form, val);
    this.pageQueryOrder();
  }
  async showOrderDetail(item: any) {
    this.showDetail = true;
    item.productInfoArr = item.productInfo ? JSON.parse(item.productInfo) : [];
    this.detailData = item;
  }
  async orderExport() {
    if (!(await exportOrderList())) {
      return;
    }
    const res = await orderExport({
      ...this.form,
      pageNum: 1,
      pageSize: 100000,
    });
    downLoad(String(res.data));
    // window.open(res.data);
  }
  sortData(column: any) {
    console.log(column);
  }
  async pageQueryOrder() {
    delete this.form.verifyTime;
    delete this.form.payTime;
    const res = await pageQueryOrder({
      ...this.form,
      ...this.page,
    });
    this.total = res.data.total || 0;
    this.dataList = res.data.list;
  }
}
</script>
<style lang="scss" scoped>
</style>


