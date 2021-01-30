<template>
  <section class="package-record">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="会员卡号：">
        <el-input style="width:140px" v-model="formInline.membership_number"></el-input>
      </el-form-item>
      <el-form-item label="会员卡状态">
        <el-select style="width:140px" v-model="formInline.statue" placeholder="活动区域">
          <el-option label="全部" value="-1"></el-option>
          <el-option label="领取" value="0"></el-option>
          <el-option label="激活" value="1"></el-option>
          <el-option label="转增" value="2"></el-option>
          <el-option label="删除" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="领卡时间：">
        <el-date-picker
          style="width:260px"
          v-model="formInline.createTime"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="激活时间：">
        <el-date-picker
          v-model="formInline.modifyTime"
          style="width:260px"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getMemberCardRecord">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      class="table-content"
      style="width: 100%;margin-top:18px;">
      <el-table-column
        prop="membership_number"
        label="会员卡号"
        align="center">
      </el-table-column>
      <el-table-column
        prop="date"
        label="会员卡状态"
        align="center">
        <template slot-scope="scope">
          <span>{{['领取', '激活', '转赠', '删除'][scope.row.statue * 1]}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="领卡时间"
        align="center">
        <template slot-scope="scope">
          <span>{{computedTime(scope.row.create_time)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="modify_time1"
        label="激活时间"
        align="center">
        <template slot-scope="scope">
          <span>{{computedTime(scope.row.modify_time1)}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="table-page"
      background
      layout="total, prev, pager, next, sizes, jumper"
      :page-sizes="[10, 20, 50, 100, 200, 500]"
      :page-size.sync="pageSize"
      @size-change="getMemberCardRecord"
      @current-change="getMemberCardRecord"
      :current-page.sync="currentPage"
      :total="tableTotal" 
    ></el-pagination>
  </section>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import { getMemberCardRecord } from '@/api/super-crm/wx-member-functions';
import moment from 'moment';

@Component({
})
export default class PackageRecord extends Vue {
  private tableData = [];
  private pageSize: number = 10;
  private currentPage: number = 1;
  private tableTotal: number = 0;
  private formInline = {
    membership_number: '',
    statue: '-1',
    createTime: '',
    modifyTime: ''
  };

  private mounted() {
    this.getMemberCardRecord();
  }

  private computedTime(item: any) {
    return moment(new Date(item)).format('YYYY-MM-DD HH:mm:ss');
  }

  private getMemberCardRecord() {
    const params = {
      page: {
        pageSize: this.pageSize,
        pageNum: this.currentPage
      },
      params: {
        membership_number: this.formInline.membership_number,
        statue: this.formInline.statue === '-1' ? '' : this.formInline.statue,
        create_start: this.formInline.createTime[0] || '',
        create_end: this.formInline.createTime[1] || '',
        modify_start1: this.formInline.modifyTime[0] || '',
        modify_end1: this.formInline.modifyTime[1] || ''
      }
    }
    getMemberCardRecord(params).then((res: any) => {
      this.tableData = res.data.list || [];
      this.tableTotal = res.data.total || 0;
    })
  }
}
</script>

<style lang="scss" scoped>
.package-record {
  .demo-form-inline {
    padding: 20px 20px 0px 20px;
    background-color: #f5f5f5;
    border-radius: 5px;
    margin-bottom: 20px;
  }
  .table-page {
    // position: fixed;
    // bottom: 15px;
    // right: 20px;
    text-align: right;
    margin: 12px 0;
  }
}
</style>