<template>
  <article class="function-focus">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <el-checkbox-group v-model="checkedList" @change="handleCheckedListChange" style="margin-top: 20px">
        <div style="display:inline-block;margin-bottom:20px;width:160px" v-for="item in selectList" :key="item.api">
          <el-checkbox :label="item.id">{{item.name}}</el-checkbox>
        </div>
      </el-checkbox-group>
      <el-form-item label="时间：">
        <el-date-picker
          v-model="formInline.time"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getTableSumActivity">查询</el-button>
      </el-form-item>
      <el-button type="primary" class="export-btn" plain>导出查询结果</el-button>
    </el-form>
    <el-table
      :data="tableData"
      border
      size="mini"
      style="width: 100%;margin-top:18px">
      <el-table-column
        prop="companyKey"
        label="企业编号"
        align="center">
        <template>
          <span>{{companyKey}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="companyName"
        label="企业名称"
        align="center">
        <template>
          <span>{{companyName}}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-for="item in checkedList"
        :key="item"
        :prop="computedProp(item)"
        :label="computedLable(item)"
        align="center">
      </el-table-column>

      <el-table-column
        prop="count"
        label="总数"
        align="center">
      </el-table-column>
    </el-table>
    <ve-line
      style="margin-top:20px"
      :settings="chartSettings"
      :data="chartData"
      :extend="extend"
      width="1200px"
      height="500px"></ve-line>
  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import { getApiList, getTableSumActivity, getTimeActivityByGroup } from '@/api/super-crm/wx-data';
import moment from 'moment';
import user from '@/utils/user';

@Component({
})
export default class FunctionFocus extends Vue {
  private formInline = {
    time: ''
  };
  private tableData = [];

  private checkAll: boolean = true;
  private checkedList = [];
  private selectList = [];
  private isIndeterminate: boolean = false;
  private companyKey: string = '';
  private companyName: string = '';

  private extend = {
    'xAxis.0.axisLabel.rotate': 45
  }
  private chartSettings = {
    labelMap: {}
  }
  private chartData = {
    columns: [],
    rows: []
  }

  private mounted() {
    (this.formInline.time as any) = [moment().subtract(30, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];
    this.companyKey = user.serverUser.account.companyKey;
    this.companyName = user.serverUser.account.companyName;
    getApiList().then((res: any) => {
      this.selectList = res.data || [];
      (this.checkedList as any) = this.selectList.map((p: any) => p.id);
      this.chartSettings.labelMap = this.selectList.reduce((acc: any, cur: any) => {
        return Object.defineProperty(acc, cur.api, {
          enumerable: false,
          configurable: false,
          writable: false,
          value: cur.name
        })
      }, {})
      this.getTableSumActivity();
    });
  }

  private handleCheckAllChange(val: any) {
    (this.checkedList as any) = val ? this.selectList.map((p: any) => p.id) : [];
    this.isIndeterminate = false;
    this.getTableSumActivity();
  }
  private handleCheckedListChange(value: any) {
    const checkedCount = value.length;
    this.checkAll = checkedCount === this.selectList.length;
    this.isIndeterminate = checkedCount > 0 && checkedCount < this.selectList.length;
    this.getTableSumActivity();
  }

  private computedProp(id: any) {
    const item = this.selectList.find((p: any) => p.id === id);
    return item ? (item as any).api : '';
  }

  private computedLable(id: any) {
    const item = this.selectList.find((p: any) => p.id === id);
    return item ? (item as any).name : '';
  }

  private getTableSumActivity() {
    const params = {
      list: this.checkedList.length > 0 ? this.checkedList : null,
      startTime: this.formInline.time ? this.formInline.time[0] : '',
      endTime: this.formInline.time ? this.formInline.time[1] : '',
      pageSize: 10000
    }
    getTableSumActivity(params).then((res: any) => {
      const list = [];
      if (res.data) {
        list.push(res.data);
      }
      (this.tableData as any) = list;
    })
    getTimeActivityByGroup(params).then((res: any) => {
      (this.chartData.columns as any) = this.checkedList.map((p: any) => {
        return this.computedProp(p);
      })
      this.chartData.rows = res.data || [];
    })
  }
}
</script>

<style lang="scss" scoped>
.function-focus {
  .demo-form-inline {
    border-radius: 5px;
    background-color: #f5f5f5;
    padding: 20px 20px 0 20px;
    position: relative;
    .export-btn {
      position: absolute;
      bottom: 20px;
      right: 20px;
    }
  }
  .info-total {
    font-size: 16px;
    color: #606266;
    font-weight: bold;
    margin-top: 14px;
    >span {
      font-weight: normal;
      font-size: 12px;
      color: #606266;
      display: inline-block;
      margin-left: 16px;
    }
  }
}
</style>


