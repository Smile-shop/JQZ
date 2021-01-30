<template>
  <div class="home">
    <form-bar>
      <el-form size="mini" v-model="form" :inline="true">
        <el-form-item label="时间段筛选：">
          <el-date-picker
            v-model="form.time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="getStatistics"
          >
            查询
          </el-button>
        </el-form-item>
      </el-form>
    </form-bar>
    <app-gutter/>
    <el-table
      :data="table"
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="saleName"
        label="导购名称"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="amountSum"
        label="累计销售"
        width="180"
      >
      </el-table-column>
      <!-- <el-table-column
        prop="commissionSum"
        label="累计提成"
        width="180"
      >
      </el-table-column> -->
      <el-table-column
        prop="buyPeople"
        label="购买人数"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop=""
        label="操作"
      >
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="toDetail(scope.row)">
            销售明细
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <app-gutter/>
    <el-pagination
      class="pagination"
      @current-change="pageTurning"
      :current-page.sync="form.pageNum"
      :page-size="form.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="form.total"
      background
    >
    </el-pagination>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import { getStatistics } from '@/api/super-crm/wx-mall';
import FormBar from '@/components/FormBar.vue';
import AppGutter from '@/components/AppGutter.vue';
import moment from 'moment'

@Component({
  components: {
    FormBar,
    AppGutter
  }
})
export default class SalesmanSalesDataHome extends Vue {
  form = {
    startTime: '',
    endTime: '',
    time: [moment().subtract(3, 'month').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
    pageNum: 1,
    pageSize: 20,
    total: 0,
  };

  table: any[] = [];

  pickerOptions = {
    disabledDate(time: Date) {
      return time.getTime() < moment().subtract(1, 'year').valueOf() || time.getTime() > moment().valueOf();
    }
  }

  // 翻页
  pageTurning(pageNum: number) {
    this.getStatistics();
  }

  mounted() {
    this.getStatistics();
  }

  async getStatistics() {
    const body = {
      ...this.form,
      startTime: this.form.time && this.form.time[0] || '',
      endTime: this.form.time && this.form.time[1] || '',
    };
    const { data } = await getStatistics(body);
    const { list, pageNum, pageSize, total } = data;
    this.table = list;
    this.form.pageNum = pageNum;
    this.form.pageSize = pageSize;
    this.form.total = total;
  }

  toDetail(row: any) {
    this.$router.push({
      path: '/super-crm/wx-mall/salesman-sales-data/detail',
      query: {
        saleId: row.saleId,
        memberCard: row.memberCard,
        saleName: row.saleName,
        startTime: this.form.time && this.form.time[0] || '',
        endTime: this.form.time && this.form.time[1] || '',
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.home {
}
</style>
