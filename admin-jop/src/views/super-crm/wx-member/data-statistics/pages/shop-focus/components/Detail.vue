<template>
  <article class="detail">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="门店：">
        <el-select v-model="formInline.shopName" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="item in shopList"
            :key="item.shopId"
            :label="item.shopName"
            :value="item.shopName">
          </el-option> 
        </el-select>
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
    <div class="info-total">
      合计：<span>关注<span>{{shopFocusCount.allAdd}}</span></span><span>取消关注<span>{{shopFocusCount.allReduce}}</span></span>
    </div>
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
        prop="status"
        label="状态"
        align="center">
        <template slot-scope="scope">
          <span>{{computedStatus(scope.row.status)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="modifyTime"
        label="时间"
        align="center">
        <template slot-scope="scope">
          <span>{{computedTime(scope.row.modifyTime)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="openid"
        label="OPENID"
        align="center">
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
import { getSelectShopList, getShopFocusDetail, getShopFocusCount } from '@/api/super-crm/wx-data';
import moment from 'moment';
import exportCsv from '@/utils/exportCsv';

@Component({
})
export default class ShopFocusDetail extends Vue {
  private shopList = [];
  private formInline = {
    shopName: '',
    time: ''
  };
  private tableData = [];
  private pageSize: number = 10;
  private currentPage: number = 1;
  private tableTotal: number = 0;

  private shopFocusCount = {
    newAdd: '',
    newReduce: '',
    allAdd: '',
    allReduce: '',
    timeStart: ''
  };
  private downloadLoading: boolean = false;

  private mounted() {
    getSelectShopList({showStatus: '1'}).then((res: any) => {
      this.shopList = res.data.list || [];
    });
    getShopFocusCount().then((res: any) => {
      this.shopFocusCount = res.data || {
        newAdd: '0',
        newReduce: '0',
        allAdd: '0',
        allReduce: '0',
        timeStart: ''
      };
    });
    this.init();
  }

  private async init() {
    const res: any = await this.getShopFocusDetail();
    this.tableData = res.data.list || [];
    this.tableTotal = res.data.total || 0;
  }

  private computedTime(item: any) {
    return moment(new Date(item)).format('YYYY-MM-DD HH:mm:ss');
  }

  private computedStatus(item: any) {
    return ['关注', '取消关注'][item];
  }

  private getShopFocusDetail(pageSize?: number, currentPage?: number) {
    const params = {
      page: {
        pageSize: pageSize || this.pageSize,
        pageNum: currentPage || this.currentPage
      },
      params: {
        shopName: this.formInline.shopName,
        startTime: this.formInline.time ? this.formInline.time[0] : '',
        endTime: this.formInline.time ? this.formInline.time[1] : ''
      }
    }
    return new Promise((resolve: any) => {
      getShopFocusDetail(params).then((res: any) => {
        resolve(res);
      })
    })
  }

  private async handleDownload() {
    this.downloadLoading = true;
    const res: any = await this.getShopFocusDetail(100000, 1);
    const data = res.data.list || [];
    if (data.length > 0) {
      data.forEach((item: any) => {
        item.status = this.computedStatus(item.status);
        item.modifyTime = this.computedTime(item.modifyTime);
      });
      exportCsv({
        quoted: true,
        separator: ',',
        filename: '门店关注明细',
        columns: [
          {
            title: '门店',
            key: 'shopName'
          },
          {
            title: '状态',
            key: 'status'
          },
          {
            title: '时间',
            key: 'modifyTime'
          },
          {
            title: 'OPENID',
            key: 'openid'
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
.detail {
  .table-page {
    // position: fixed;
    // bottom: 15px;
    // right: 20px;
    text-align: right;
    margin-top: 15px;
  }
  .member-info {
    height: 100px;
    border-radius: 5px;
    border: solid 1px #e4e7ed;
    display: flex;
    .info-left {
      flex-grow: 1;
      text-align: center;
      p:first-child {
        font-size: 16px;
        color: #606266;
        padding: 15px;
      }
      p:last-child {
        font-size: 30px;
        font-weight: bold;
        color: #e12f30;
      }
    }
    .info-body {
      flex-grow: 1;
      text-align: center;
      p:first-child {
        font-size: 16px;
        color: #606266;
        padding: 15px;
      }
      p:last-child {
        font-size: 30px;
        font-weight: bold;
        color: #e12f30;
      }
    }
    .info-right {
      width: 370px;
      text-align: right;
      font-size: 12px;
      color: #999999;
      padding: 72px 12px 12px 0;
      i {
        font-size: 16px;
      }
    }
  }
  .demo-form-inline {
    height: 80px;
    border-radius: 5px;
    background-color: #f5f5f5;
    padding: 20px;
    margin-top: 20px;
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
      padding-right: 12px;
      > span {
        color: #409eff;
        font-weight: bold;
      }
    }
  }
}
</style>


