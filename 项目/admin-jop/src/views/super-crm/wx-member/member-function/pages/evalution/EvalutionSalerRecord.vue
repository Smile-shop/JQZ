<template>
  <article class="infomation-manage">
    <el-form :inline="true" :model="evalutionTotalForm" class="demo-form-inline">
      <el-form-item label="门店：">
        <el-select v-model="evalutionTotalForm.shopName" placeholder="门店">
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
        <el-select v-model="evalutionTotalForm.salesConsultant" placeholder="珠宝顾问">
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
          v-model="evalutionTotalForm.time"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getEvalutionTotal">查询</el-button>
      </el-form-item>
      <el-button type="primary" :loading="downloadLoading" plain @click="handleDownload" class="export-btn">导出查询结果</el-button>
    </el-form>

    <div class="info">温馨提示：<span>仅统计已开启的维度</span></div>

    <el-table
      :data="evalutionTotalTableData"
      highlight-current-row
      border
      class="table-content"
      style="width: 100%;margin-top:18px;">
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
        align="center">
        <template>
          <div class="evaluation-content">
            <div v-for="item in 5" :key="item">
              <i class="el-icon-star-on icon-select" v-for="(num, index) in (6 - item)" :key="`${index}-${item}`"></i>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-for="item in tableColumn"
        :key="item"
        :prop="item"
        :label="item"
        align="center">
        <template slot-scope="scope">
          <div v-for="(p, i) in computedValue(scope.row.category[item])" :key="i">
            {{p}}人
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="table-page"
      background
      layout="total, prev, pager, next, sizes, jumper"
      :page-sizes="[20, 50, 100, 200, 500]"
      :page-size.sync="pageSize"
      @size-change="getEvalutionTotal"
      @current-change="getEvalutionTotal"
      :current-page.sync="currentPage"
      :total="tableTotal"
    ></el-pagination>

  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import { getSalerByShop, getEvalutionTotal } from '@/api/super-crm/wx-member-functions';
import exportCsv from '@/utils/exportCsv';

@Component({
})
export default class EvalutionSalerRcord extends Vue {
  @Prop()
  shopList!: [];
  @Prop()
  tableColumn!: [];

  private salerList = [];
  private evalutionTotalForm = {
    shopName: '',
    salesConsultant: '',
    time: ''
  };
  private pageSize: number = 20;
  private currentPage: number = 1;
  private tableTotal: number = 0;
  private evalutionTotalTableData = [];
  private evaluationNum = ['s5', 's4', 's3', 's2', 's1'];

  private downloadLoading: boolean = false;

  @Watch('evalutionTotalForm.shopName')
  onShopChange(val: string) {
    this.getSalerByShop(val);
  };

  private mounted() {
    this.getEvalutionTotal();
    console.log(this.tableColumn)
  }

  private computedValue(item: any) {
    const value = item[0];
    return this.evaluationNum.map((p: any) => value[p]);
  }

  private getSalerByShop(shopName: string) {
    getSalerByShop({shopName}).then((res: any) => {
      this.salerList = res.data || [];
    })
  }

  private getEvalutionTotal() {
    const params = {
      shopName: this.evalutionTotalForm.shopName,
      salesConsultant: this.evalutionTotalForm.salesConsultant,
      startTime: this.evalutionTotalForm.time ? this.evalutionTotalForm.time[0] : '',
      endTime: this.evalutionTotalForm.time ? this.evalutionTotalForm.time[1] : '',
      pageNum: this.currentPage,
      pageSize: this.pageSize
    }
    getEvalutionTotal(params).then((res: any) => {
      if (res.data.list && res.data.list.length > 0) {
        const resList = res.data.list || [];
        this.evalutionTotalTableData = resList;
        this.tableTotal = res.data.total || 0;
      } else {
        this.evalutionTotalTableData = [];
        this.tableTotal = 0;
      }
    })
  }

  private handleDownload() {
    this.downloadLoading = true;
    const params = {
      shopName: this.evalutionTotalForm.shopName,
      salesConsultant: this.evalutionTotalForm.salesConsultant,
      startTime: this.evalutionTotalForm.time ? this.evalutionTotalForm.time[0] : '',
      endTime: this.evalutionTotalForm.time ? this.evalutionTotalForm.time[1] : '',
      pageNum: 1,
      pageSize: 100000
    }
    getEvalutionTotal(params).then((res: any) => {
      const data = res.data.list || [];
      if (data.length > 0) {
        const columnsList = this.tableColumn.map((p: any) => {
          return {
            title: p,
            key: p
          }
        });
        const dataList = data.map((p: any) => {
          const resData = {};
          Object.keys(p.category).forEach((item: any) => {
            const score = p.category[item][0];
            (resData as any)[item] = `五星：${score.s5}人 四星：${score.s4}人 三星：${score.s3}人 二星：${score.s2}人 一星：${score.s1}人`;
          })
          return {
            ...resData,
            ...p
          }
        })
        exportCsv({
          quoted: true,
          separator: ',',
          filename: '珠宝顾问评价统计',
          columns: [
            {
              title: '门店',
              key: 'shopName'
            },
            {
              title: '珠宝顾问',
              key: 'salesConsultant'
            },
            ...columnsList
          ],
          data: dataList
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
    text-align: left;
    .icon-select {
      color: #d41010;
      font-size: 16px;
    }
  }
  .info {
    font-size: 12px;
    span {
      color: #6699ff;
    }
  }
}
</style>
