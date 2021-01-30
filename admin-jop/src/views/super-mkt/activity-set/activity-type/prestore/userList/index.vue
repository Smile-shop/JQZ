<template>
  <div class="UserList">
    <el-form class="demo-form-inline">
      <el-form-item>
        <switch-activity :activityName="activityName" @click="dialogTableVisible=true" />
        <el-button size="small" style="float: right" type="primary" @click="exportData">导出数据</el-button>
      </el-form-item>
    </el-form>
    <sum-card :cardList="cardList" />
    <sear-form @getFormData="getFormData" ref="searForm" />
    <table-data :dataList="dataList" />
    <div style="text-align: right; margin-top: 20px">
      <el-pagination
        v-show="total > 0"
        background
        layout="total, prev, pager, next, sizes, jumper"
        :page-sizes="[10, 20, 50, 100]"
        :page-size.sync="page.pageSize"
        @size-change="pageQueryUser"
        @current-change="pageQueryUser"
        :current-page.sync="page.pageNum"
        :total="total"
      ></el-pagination>
    </div>
    <activity :dialogTableVisible.sync="dialogTableVisible" @switch="handleSwitch" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import sumCard from '../component/sumCard.vue';
import tableData from './child/tableData.vue';
import searForm from './child/searForm.vue';
import activity from '../component/activity.vue';
import {
  pageQueryUser,
  userStatistics,
  queryDistributionPage,
  userExport,
} from '@/api/super-mkt/activity-set/fission_retail';
import { exportUserList } from '@/utils/buttonPermission';
import { downLoad } from '@/utils/exportFission';
import switchActivity from '../component/switch-activity.vue';
interface Page {
  pageNum: number;
  pageSize: number;
}
interface Form {
  nickname: string;
  shopName: string;
  distributionId: string;
}
@Component({
  components: { sumCard, tableData, searForm, activity, switchActivity },
})
export default class UserList extends Vue {
  activetityId: string | number = '';
  showAdd: boolean = false;
  visible: boolean = false;
  form: Form = {
    nickname: '',
    shopName: '',
    distributionId: '',
  };
  name: string = '';
  dataList: object[] = [];
  total: number = 0;
  page: Page = { pageNum: 1, pageSize: 10 };
  cardList: object[] = [
    { name: '参与总人数', tool: '活动参与总人数', num: 0, unit: '人' },
    {
      name: '受邀总人数',
      tool: '当前活动所有参与者累计邀请总人数',
      num: 0,
      unit: '人',
    },
    {
      name: '成功分销人数',
      tool: '该活动中至少收到一笔返现的总人数',
      num: 0,
      unit: '人',
    },
    {
      name: '分销总笔数',
      tool: '当前活动用户累计所有用户分销的订单总数',
      num: 0,
      unit: '笔',
    },
  ];
  activityName: string = '';
  dialogTableVisible: boolean = false;

  created() {
    const { activityName, distributionId } = this.$route.query;
    this.form.distributionId = distributionId as string;
    this.activityName = activityName as string;
    if (activityName && distributionId) {
      this.pageQueryUser();
      this.userStatistics();
    } else {
      this.queryDistributionPage();
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
      this.pageQueryUser();
      this.userStatistics();
    }
  }
  async userStatistics() {
    const { distributionId } = this.form;
    const res = await userStatistics({ distributionId });
    const {
      distributionOrderNum: num3,
      distributionUserNum: num2,
      invitedUserNum: num1,
      totalUserNum: num0,
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
    // this.pageQueryUser();
    this.userStatistics();
  }
  getFormData(val: any) {
    this.page.pageNum = 1;
    this.form = Object.assign({}, this.form, val);
    this.pageQueryUser();
  }
  async exportData() {
    if (!(await exportUserList())) {
      return;
    }
    const res = await userExport({
      ...this.form,
      pageNum: 1,
      pageSize: 100000,
    });
    downLoad(String(res.data));
    // window.open(res.data);
  }
  async pageQueryUser() {
    const res = await pageQueryUser({
      ...this.page,
      ...this.form,
    });
    this.total = res.data.total || 0;
    this.dataList = res.data.list;
  }
}
</script>
<style lang="scss" scoped>
</style>


