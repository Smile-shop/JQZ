<template>
  <article class="infomation-manage">
    <el-form :inline="true" :model="evalutionRecordForm" class="demo-form-inline">
      <el-form-item label="门店：">
        <el-select v-model="evalutionRecordForm.shopName" placeholder="门店">
          <el-option value="" label="全部"></el-option>
          <el-option
            v-for="item in shopList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="珠宝顾问：">
        <el-select v-model="evalutionRecordForm.salesConsultant" placeholder="珠宝顾问">
          <el-option value="" label="全部"></el-option>
          <el-option
            v-for="item in salerList"
            :key="item.id"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="评价时间：">
        <el-date-picker
          v-model="evalutionRecordForm.time"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getEvalutionRecordList">查询</el-button>
      </el-form-item>
      <el-button type="primary" :loading="downloadLoading" plain @click="handleDownload" class="export-btn">导出查询结果</el-button>
    </el-form>

    <el-table
      :data="evalutionRecordTableData"
      border
      class="table-content"
      style="width: 100%;margin-top:18px;">
      <el-table-column
        prop="memberCard"
        label="会员"
        align="center">
        <template slot-scope="scope">
          <div>{{memberComputed(scope.row)}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="shopName"
        label="门店"
        align="center">
      </el-table-column>
      <el-table-column
        prop="salesConsultant"
        label="珠宝顾问"
        align="center">
      </el-table-column>
      <el-table-column
        prop="shopName"
        label="满意度"
        align="center"
        width="400">
        <template slot-scope="scope">
          <div class="evaluation-content">
            <div class="evalution-item" v-for="item in scope.row.evaluate" :key="item.categoryId">
              {{item.category}}
              <i class="el-icon-star-on icon-select" v-for="(num, index) in item.score*1" :key="`${index}-${item.categoryId}`"></i>
              <i class="el-icon-star-on" v-for="(num1, index) in (5-item.score*1)" :key="index"></i>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="detail"
        label="评价详情"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createdTime"
        align="center"
        sortable
        label="评价时间">
        <template slot-scope="scope">
          <div>{{scope.row.createdTime | momentFilter}}</div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="table-page"
      background
      layout="total, prev, pager, next, sizes, jumper"
      :page-sizes="[20, 50, 100, 200, 500]"
      :page-size.sync="pageSize"
      @size-change="getEvalutionRecordList"
      @current-change="getEvalutionRecordList"
      :current-page.sync="currentPage"
      :total="tableTotal"
    ></el-pagination>

  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import { getSalerByShop, getEvalutionRecordList } from '@/api/super-crm/wx-member-functions';
import exportCsv from '@/utils/exportCsv';
import moment from 'moment';

@Component({
})
export default class InfomationManage extends Vue {
  @Prop()
  shopList!: [];

  private salerList = [];
  private evalutionRecordForm = {
    shopName: '',
    salesConsultant: '',
    time: ''
  };
  private pageSize: number = 20;
  private currentPage: number = 1;
  private tableTotal: number = 0;
  private evalutionRecordTableData = [];

  private downloadLoading: boolean = false;

  @Watch('evalutionRecordForm.shopName')
  onShopChange(val: string) {
    this.getSalerByShop(val);
  };

  private mounted() {
    this.getEvalutionRecordList();
  }

  private memberComputed(item: any) {
    const phone = item.memberMobile ? `${item.memberMobile}`.replace(/^(.{4})(?:\d+)(.{4})$/, '$1***$2') : '';
    const name = item.memberName ? `${item.memberName}`[0] : '';
    return `${phone}${name ? `(${name}*)` : ''}`;
  }

  private getSalerByShop(shopName: string) {
    getSalerByShop({shopName}).then((res: any) => {
      this.salerList = res.data || [];
    })
  }

  private getEvalutionRecordList() {
    const params = {
      shopName: this.evalutionRecordForm.shopName,
      salesConsultant: this.evalutionRecordForm.salesConsultant,
      startTime: this.evalutionRecordForm.time ? this.evalutionRecordForm.time[0] : '',
      endTime: this.evalutionRecordForm.time ? this.evalutionRecordForm.time[1] : '',
      pageNum: this.currentPage,
      pageSize: this.pageSize
    }
    getEvalutionRecordList(params).then((res: any) => {
      this.evalutionRecordTableData = res.data.list || [];
      this.tableTotal = res.data.total || 0;
    })
  }

  private getScoreInfo(data: any): string {
    return data.map((p: any) => `${p.category}: ${p.score}分`).join(' ');
  }

  private handleDownload() {
    this.downloadLoading = true;
    const params = {
      shopName: this.evalutionRecordForm.shopName,
      salesConsultant: this.evalutionRecordForm.salesConsultant,
      startTime: this.evalutionRecordForm.time ? this.evalutionRecordForm.time[0] : '',
      endTime: this.evalutionRecordForm.time ? this.evalutionRecordForm.time[1] : '',
      pageNum: 1,
      pageSize: 100000
    }
    getEvalutionRecordList(params).then((res: any) => {
      const data = res.data.list || [];
      if (data.length > 0) {
        const list = data.map((p: any) => {
          return {
            memberInfo: this.memberComputed(p),
            time: moment(p.createdTime).format('YYYY-MM-DD HH:mm:ss'),
            scoreInfo: this.getScoreInfo(p.evaluate),
            ...p
          }
        })
        exportCsv({
          quoted: true,
          separator: ',',
          filename: '客户评价记录',
          columns: [
            {
              title: '会员',
              key: 'memberInfo'
            },
            {
              title: '门店',
              key: 'shopName'
            },
            {
              title: '珠宝顾问',
              key: 'salesConsultant'
            },
            {
              title: '满意度',
              key: 'scoreInfo'
            },
            {
              title: '评价详情',
              key: 'detail'
            },
            {
              title: '评价时间',
              key: 'time'
            }
          ],
          data: list
        });
      }
      this.downloadLoading = false;
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
    position: relative;
    .export-btn {
      position: absolute;
      right: 20px;
    }
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

