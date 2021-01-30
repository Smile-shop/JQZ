<template>
  <article class="saleman-focus">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="门店：">
        <el-select v-model="formInline.shopName" @change="shopSelectChange" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="item in shopList"
            :key="item.shopId"
            :label="item.shopName"
            :value="item.shopName"> 
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="营业员：">
        <!-- <el-input v-model="formInline.saleman" placeholder="营业员"></el-input> -->
        <el-select v-model="formInline.saleman" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="item in salerList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        <!-- 马总  要求 -->
      </el-form-item>
      <el-form-item label="时间：">
        <el-date-picker
          v-model="formInline.time"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="init()">查询</el-button>
      </el-form-item>
      <el-button type="primary" :loading="downloadLoading" @click="handleDownload" class="export-btn" plain>导出查询结果</el-button>
    </el-form>
    <el-table
      :data="tableData"
      border
      style="width: 100%;margin-top:18px">
      <el-table-column
        prop="shopName"
        label="门店"
        align="center">
      </el-table-column>
      <el-table-column
        prop="saleName"
        label="营业员"
        align="center">
      </el-table-column>
      <el-table-column
        prop="followNum"
        label="关注数量"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="unfollowNum"
        label="取消关注"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        label="净增关注"
        :sortable="true"
        :sort-method="sortMethod"
        align="center">
        <template slot-scope="scope">
          <span>{{(scope.row.followNum - scope.row.unfollowNum)}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="table-page"
      background
      layout="total, prev, pager, next, sizes, jumper"
      :page-sizes="[10, 20, 50, 100, 200, 500]"
      :page-size.sync="pageSize"
      @size-change="init"
      @current-change="init"
      :current-page.sync="currentPage"
      :total="tableTotal"
    ></el-pagination>
  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import { getSelectShopList, getSelectSalerList, getSalemanFocusTotal } from '@/api/super-crm/wx-data';
import exportCsv from '@/utils/exportCsv';
import user from '@/utils/user';

@Component({
})
export default class SalemanFocus extends Vue {
  private shopList = [];
  private salerList = [];
  private formInline = {
    saleman: '',
    shopName: '',
    time: ''
  };
  private tableData = [];
  private pageSize: number = 10;
  private currentPage: number = 1;
  private tableTotal: number = 0;
  private downloadLoading: boolean = false;

  private mounted() {
    getSelectShopList({showStatus: '1'}).then((res: any) => {
      this.shopList = res.data.list || [];
    })
    this.init();
    this.shopSelectChange('');
  }

  private async init() {
    const res: any = await this.getSalemanFocusTotal();
    this.tableData = res.data.list || [];
    this.tableTotal = res.data.total || 0;
  }

  private shopSelectChange(value: string) {
    getSelectSalerList({branchShop: value, companyKey: user.serverUser.account.companyKey}).then((res: any) => {
      this.salerList = JSON.parse(res.data.sales).map((p: any) => p.saler);
    })
  }

  private getSalemanFocusTotal(pageSize?: number, currentPage?: number) {
    const params = {
      page: {
        pageSize: pageSize || this.pageSize,
        pageNum: currentPage || this.currentPage
      },
      params: {
        saleName: this.formInline.saleman,
        shopName: this.formInline.shopName,
        startTime: this.formInline.time ? this.formInline.time[0] : '',
        endTime: this.formInline.time ? this.formInline.time[1] : ''
      }
    }
    return new Promise((resolve: any) => {
      getSalemanFocusTotal(params).then((res: any) => {
        resolve(res);
      })
    })
  }

  private sortMethod(obj1: any, obj2: any) {
        return (obj1.followNum - obj1.unfollowNum) > (obj2.followNum - obj2.unfollowNum) ? -1 : 1;
  }

  private async handleDownload() {
    this.downloadLoading = true;
    const res: any = await this.getSalemanFocusTotal(100000, 1);
    const data = res.data.list || [];
    if (data.length > 0) {
      data.forEach((item: any) => {
        item.add = item.followNum - item.unfollowNum;
      });
      exportCsv({
        quoted: true,
        separator: ',',
        filename: '营业员关注统计',
        columns: [
          {
            title: '门店',
            key: 'shopName'
          },
          {
            title: '营业员',
            key: 'saleName'
          },
          {
            title: '关注数量',
            key: 'followNum'
          },
          {
            title: '取消关注',
            key: 'unfollowNum'
          },
          {
            title: '净增关注',
            key: 'add'
          }
        ],
        data
      });
      this.downloadLoading = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.saleman-focus {
  .demo-form-inline {
    border-radius: 5px;
    background-color: #f5f5f5;
    padding: 20px 20px 0 20px;
    position: relative;
    .export-btn {
      position: absolute;
      top: 20px;
      right: 20px;
    }
  }
  .table-page {
    // position: fixed;
    // bottom: 15px;
    // right: 20px;
    text-align: right;
    margin-top: 15px;
  }
}
</style>


