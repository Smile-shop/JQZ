<template>
  <div class="function-focus-item">
    <el-form :inline="true" :model="selectItem" class="demo-form-inline">
      <el-form-item label="时间：">
        <el-date-picker
          v-model="selectItem.time"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="-" 
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="选择页面：">
        <el-select v-model="selectItem.apiId" placeholder="请选择" @change="getStatisticsByApi">
          <el-option :label="item.name" :value="item.api" v-for="item in activeApiList" :key="item.api"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getStatisticsByApi">查询</el-button>
      </el-form-item>
      <!-- <el-button type="primary" class="export-btn" plain>导出查询结果</el-button> -->
    </el-form>
    <div class="info-total">
      {{pageTitle}}访问统计<span>时间：{{selectItem.time[0]}}至{{selectItem.time[1]}}</span>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%;margin-top:18px">
      <el-table-column
        prop="member_card"
        label="会员卡号"
        align="center">
      </el-table-column>
      <el-table-column
        prop="memberName"
        label="姓名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机"
        align="center">
      </el-table-column>
      <el-table-column
        prop="shopName"
        label="门店"
        align="center">
      </el-table-column>
      <el-table-column
        prop="count"
        label="访问次数"
        align="center">
      </el-table-column>
    </el-table>
    <el-pagination
      class="table-page"
      background
      layout="total, prev, pager, next, sizes, jumper"
      :page-sizes="[10, 20, 50, 100, 200, 500]"
      :page-size.sync="pageSize"
      @size-change="getStatisticsByApi"
      @current-change="getStatisticsByApi"
      :current-page.sync="currentPage"
      :total="tableTotal"
    ></el-pagination>
  </div>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import { getApiList, getStatisticsByApi } from '@/api/super-crm/wx-data';
import moment from 'moment';

@Component({
})
export default class FunctionFocusItem extends Vue {
  get pageTitle() {
    const data = this.activeApiList.find((p: any) => {
      return p.api == this.selectItem.apiId;
    })
    if (data) {
      return (data as any).name;
    } else {
      return ''
    }
  }
  private selectItem = {
    apiId: '',
    time: []
  };
  private tableData = [];
  private pageSize: number = 10;
  private currentPage: number = 1;
  private tableTotal: number = 0;
  private activeApiList = [];

  private mounted() {
    (this.selectItem.time as any) = [moment().subtract(30, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];
    (this.selectItem.apiId as any) = this.$route.query.api;
    getApiList().then((res: any) => {
      this.activeApiList = res.data || [];
      this.getStatisticsByApi();
    });
  }

  private getStatisticsByApi() {
    const data = this.activeApiList.find((p: any) => {
      return p.api == this.selectItem.apiId;
    });
    const params = {
      apiId: (data as any).id,
      startTime: this.selectItem.time ? moment(new Date(this.selectItem.time[0])).format('YYYY-MM-DD 00:00:00') : '',
      endTime: this.selectItem.time ? moment(new Date(this.selectItem.time[1])).format('YYYY-MM-DD 23:59:59') : '',
      pageNum: this.currentPage,
      pageSize: this.pageSize
    }
    getStatisticsByApi(params).then((res: any) => {
      if (res.data && res.data.list) {
        this.tableTotal = res.data.total;
        this.tableData = res.data.list;
      } else {
        this.tableTotal = 0;
        this.tableData = [];
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.function-focus-item {
  .table-page {
    // position: fixed;
    // bottom: 15px;
    // right: 20px;
    text-align: right;
    margin-top: 15px;
  }
  .demo-form-inline {
    height: 80px;
    border-radius: 5px;
    background-color: #f5f5f5;
    padding: 20px;
    position: relative;
    .export-btn {
      position: absolute;
      top: 20px;
      right: 20px;
    }
  }
  .info-total {
    font-size: 16px;
    color: #333333;
    font-weight: bold;
    margin-top: 14px;
    > span {
      font-weight: normal;
      display: inline-block;
      font-size: 12px;
      padding-left: 8px;
      color: #606266;
    }
  }
}
</style>
