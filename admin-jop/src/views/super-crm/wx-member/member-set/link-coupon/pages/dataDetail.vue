<template>
  <div>
    <h5>{{$route.query.couponName || '-'}}</h5>
    <form-bar style="margin-top: 20px">
      <el-form size="small" :inline="true">
        <el-form-item label="订单编号：">
          <el-input v-model="formData.salesNumber" clearable placeholder="订单编号"></el-input>
        </el-form-item>
        <el-form-item label="会员名称：">
          <el-input v-model="formData.memberName" clearable placeholder="会员名称"></el-input>
        </el-form-item>
        <!-- <el-form-item label="兑换码：">
          <el-select v-model="formData.code" placeholder="请选择">
            <el-option v-for="item of 2" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="领取时间：">
          <el-date-picker
            style="width: 300px"
            v-model="formData.time"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </form-bar>
    <el-table class="table-content" :data="data" border style="width: 100%;margin-top: 20px">
      <el-table-column prop="salesNumber" label="订单编号" min-width="160"></el-table-column>
      <el-table-column prop="memberName" label="会员名称" min-width="160"></el-table-column>
      <el-table-column prop="couponCode" label="兑换码" min-width="160"></el-table-column>
      <el-table-column prop="state" label="状态" min-width="180"></el-table-column>
      <el-table-column prop="endTime" label="领取时间" min-width="160">
        <template slot-scope="scope">
          <div>{{ scope.row.getTime | momentFilter('YYYY-MM-DD')  }}</div>
        </template>
      </el-table-column>
      <el-table-column label="领取链接" prop="url" min-width="180"></el-table-column>
    </el-table>
    <div style="text-align: right; margin-top: 20px">
      <el-pagination
        v-show="total > 0"
        background
        layout="total, prev, pager, next, sizes, jumper"
        :page-sizes="[10, 20, 50, 100]"
        :page-size.sync="page.pageSize"
        @size-change="getList"
        @current-change="getList"
        :current-page.sync="page.pageNum"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template> 

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import FormBar from '@/components/FormBar.vue';
import { lookDetail } from '@/api/super-crm/wx-member';
import moment from 'moment';

@Component({
  components: { FormBar },
})
export default class PositionManage extends Vue {
  private formData = { salesNumber: '', memberName: '', code: '', time: [] };
  private data = [];
  private total = 1;
  private page = { pageNum: 1, pageSize: 10 };
  private created() {
    this.getList();
  }
  private async reSent(item: any) {
    console.log(item.id);
  }
  private search() {
    this.page.pageNum = 1;
    const { salesNumber, memberName, time } = this.formData;
    const body = {
      startTime:
        time && time.length ? moment(time[0]).format('YYYY-MM-DD') : '',
      endTime: time && time.length ? moment(time[1]).format('YYYY-MM-DD') : '',
      salesNumber,
      memberName,
    };
    this.getList(body);
  }
  private async getList(data?: any) {
    const { activityId, ticketId } = this.$route.query;
    const body = { page: this.page, params: { activityId, ticketId, ...data } };
    const res: any = await lookDetail(body);
    if (!res.code) {
      this.total = res.data.total || 0;
      this.data = res.data.list;
    }
  }
}
</script>