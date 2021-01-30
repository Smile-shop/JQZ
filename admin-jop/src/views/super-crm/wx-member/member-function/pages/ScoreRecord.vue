<template>
  <article class="infomation-manage">
    <el-form :inline="true" :model="scoreRecordForm" class="demo-form-inline">
      <el-form-item label="会员卡号：">
        <el-input v-model="scoreRecordForm.cardNum" placeholder="会员卡号"></el-input>
      </el-form-item>
      <el-form-item label="门店：">
        <el-select v-model="scoreRecordForm.shopName" placeholder="门店">
          <el-option value="" label="全部"></el-option>
          <el-option
            v-for="item in shopList"
            :key="item.shopId"
            :label="item.shopName" 
            :value="item.shopName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型：">
        <el-select v-model="scoreRecordForm.integralType" placeholder="类型">
          <el-option value="" label="全部"></el-option>
          <el-option
            v-for="item in typeList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="积分："> 
        <el-select v-model="scoreRecordForm.integral" placeholder="积分">
          <el-option value="" label="全部"></el-option>
          <el-option value="add" label="获得积分"></el-option>
          <el-option value="reduce" label="消耗积分"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间：">
        <el-date-picker
          v-model="scoreRecordForm.time"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getScoreRecordList">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="scoreRecordTableData"
      border
      class="table-content"
      style="width: 100%;margin-top:18px;">
      <el-table-column
        prop="cardNum"
        label="会员卡号"
        align="center">
      </el-table-column>
      <el-table-column
        prop="shopName"
        label="门店"
        align="center">
      </el-table-column>
      <el-table-column
        prop="integralType"
        label="类型"
        align="center">
      </el-table-column>
      <el-table-column
        prop="integralDetail"
        label="详情"
        align="center">
      </el-table-column>
      <el-table-column
        prop="integralTime"
        align="center"
        sortable
        label="时间">
        <template slot-scope="scope">
          <div>{{scope.row.integralTime | momentFilter}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="integral"
        label="积分"
        align="center">
        <template slot-scope="scope">
          <div style="font-weight:bold" :style="{'color': scope.row.integral >= 0 ? '#6699ff' : '#e12f30'}">{{scope.row.integral}}</div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="table-page"
      background
      layout="total, prev, pager, next, sizes, jumper"
      :page-sizes="[20, 50, 100, 200, 500]"
      :page-size.sync="pageSize"
      @size-change="getScoreRecordList"
      @current-change="getScoreRecordList"
      :current-page.sync="currentPage"
      :total="tableTotal"
    ></el-pagination>

  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import { getSelectedShopList, getScoreRecordList, getScoreTypeList } from '@/api/super-crm/wx-member-functions';

@Component({
})
export default class ScoreRecord extends Vue {
  private shopList = [];
  private typeList = [];
  private scoreRecordForm = {
    shopName: '',
    cardNum: '',
    time: '',
    integral: '',
    integralType: ''
  };
  private pageSize: number = 20;
  private currentPage: number = 1;
  private tableTotal: number = 0;
  private scoreRecordTableData = [];

  private mounted() {
    this.getShopList();
    this.getTypeList();
    this.getScoreRecordList();
  }

  private getShopList() {
    getSelectedShopList({showStatus: '1'}).then((res: any) => {
      this.shopList = res.data.list || [];
    })
  }

  private getTypeList() {
    getScoreTypeList().then((res: any) => {
      this.typeList = res.data || [];
    })
  }

  private getScoreRecordList() {
    const params = {
      params: {
        shopName: this.scoreRecordForm.shopName,
        cardNum: this.scoreRecordForm.cardNum,
        startTime: this.scoreRecordForm.time ? this.scoreRecordForm.time[0] : '',
        endTime: this.scoreRecordForm.time ? this.scoreRecordForm.time[1] : '',
        integral: this.scoreRecordForm.integral,
        integralType: this.scoreRecordForm.integralType
      },
      page: {
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
    }
    getScoreRecordList(params).then((res: any) => {
      this.scoreRecordTableData = res.data.list || [];
      this.tableTotal = res.data.total || 0;
    })
  }
}
</script>

<style lang="scss" scoped>
.infomation-manage {
  .demo-form-inline {
    padding: 20px 20px 0 20px;
    background-color: #f5f5f5;
    border-radius: 5px;
    margin-bottom: 20px;
  }
  .table-page {
    text-align: right;
    margin: 15px;
  }
  .evaluation-content {
    display: flex;
    flex-wrap: wrap;
    .evalution-item {
      flex-basis: 50%;
      text-align: left;
      flex-shrink: 0;
      .icon-select {
        color: #d41010;
      }
    }
  }
}
</style>

