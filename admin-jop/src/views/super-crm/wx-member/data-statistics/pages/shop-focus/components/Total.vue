<template>
  <article class="total">
    <div class="member-info">
      <p class="member-title">公众号粉丝数统计</p>
      <div class="info-left">
        <p style="padding-bottom: 0">当前粉丝总数</p>
        <span class="sub-name">（截止到昨日）</span>
        <p>{{qryFansInfo.wxFansCountCrmVO.allFans}}</p>
      </div>
      <div class="info-body">
        <p style="padding-bottom: 0">累计粉丝总数</p>
        <span class="sub-name">（截止到昨日）</span>
        <p>{{qryFansInfo.wxFansCountCrmVO.totalFans}}</p>
      </div>
      <div class="info-body">
        <p>昨日新增粉丝数</p>
        <p>{{qryFansInfo.wxFansCountCrmVO.beforeDayAdd}}</p>
      </div>
      <div class="info-body">
        <p>昨日取关粉丝数</p>
        <p>{{qryFansInfo.wxFansCountCrmVO.beforeDayPass}}</p>
      </div>
      <!-- <div class="info-body">
        <p>今日新增粉丝数</p>
        <p>{{qryFansInfo.wxFansCountCrmVO.addDay}}</p>
      </div>
      <div class="info-body">
        <p>今日取关粉丝数</p>
        <p>{{qryFansInfo.wxFansCountCrmVO.passDay}}</p>
      </div> -->
      <!-- <div class="info-right">
        <i class="el-icon-question"></i>
        总关注/总取消关注数据统计自：{{shopFocusCount.timeStart}}
      </div> -->
    </div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="门店：">
        <el-select v-model="formInline.shopName" placeholder="门店">
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
      <el-button :loading="downloadLoading" @click="handleDownload" type="primary" class="export-btn" plain>导出查询结果</el-button>
    </el-form>
    <el-table
      :data="tableData"
      border
      id='table'
      style="width: 100%;margin-top:18px">
      <el-table-column
        prop="shopName"
        label="门店"
        align="center">
      </el-table-column>
      <el-table-column
        prop="allAdd"
        label="已关注"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="allReduce"
        label="取消关注"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="address"
        sortable
        label="净增粉丝数"
        align="center">
        <template slot="header">
          <span>净增粉丝数</span>
          <el-tooltip placement="top">
            <div slot="content">净增粉丝数=已关注粉丝数-取消关注粉丝数</div>
            <i class="el-icon-question"></i>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <span>{{scope.row.allAdd - scope.row.allReduce}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="趋势"
        align="center">
        <template slot-scope="scope">
          <i style="font-size:24px;cursor:pointer" class="iconfont icon-qushi" @click="showEChart(scope.row)"></i>
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
    <PoupBox
      :title="`${showShopName}-会员注册趋势`"
      @cancel="show = false"
      v-model="show">
      <div slot="body">
        <ve-line
          :settings="chartSettings"
          :data="chartData"
          :extend="extend"
          width="1200px"
          height="500px"></ve-line>
      </div>
      <div slot="footer"></div>
    </PoupBox>
  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import { getSelectShopList, getShopFocusCount, getShopFocusTotal, getShopFocusByTime_Shop } from '@/api/super-crm/wx-data';
import {
  qryFansInfoInCrm,
} from '@/api/super-crm/home'
import PoupBox from '@/components/PoupBox.vue';
import moment from 'moment';
import exportCsv from '@/utils/exportCsv';

@Component({
  components: {
    PoupBox
  }
})
export default class ShopFocusTotal extends Vue {
  private showShopName: string = '';
  private show: boolean = false;
  private shopList = [];
  private formInline = {
    shopName: '',
    time: ''
  };
  private shopFocusCount = {
    newAdd: '',
    newReduce: '',
    allAdd: '',
    allReduce: '',
    timeStart: ''
  }

  private tableData = [];
  private pageSize: number = 10;
  private currentPage: number = 1;
  private tableTotal: number = 0;

  private downloadLoading: boolean = false;

  private extend = {
    'xAxis.0.axisLabel.rotate': 45
  }
  private chartSettings = {
    labelMap: {
      dateTime: '时间',
      followNum: '关注数',
      unfollowNum: '取消关注数'
    }
  }
  private chartData = {
    columns: ['dateTime', 'followNum', 'unfollowNum'],
    rows: []
  }
  // 粉丝数据统计
  private qryFansInfo = {
    wxFansCountCrmVO: {
      allFans: 0,
      beforeDayAdd: 0,
      beforeDayPass: 0,
      addDay: 0,
      passDay: 0,
      totalFans: 0
    }
  }

  private mounted() {
    this.qryFansInfoInCrm();
    getSelectShopList({showStatus: '1'}).then((res: any) => {
      this.shopList = res.data.list || [];
    })
    getShopFocusCount().then((res: any) => {
      this.shopFocusCount = res.data || {
        newAdd: '0',
        newReduce: '0',
        allAdd: '0',
        allReduce: '0',
        timeStart: ''
      };
    })
    this.init();
  }

  private async init() {
    const res: any = await this.getShopFocusTotal();
    this.tableData = res.data.list || [];
    this.tableTotal = res.data.total || 0;
  }
  // 获取粉丝数据统计
  private async qryFansInfoInCrm() {
    const res = await qryFansInfoInCrm();
    const { data } = res;
    this.qryFansInfo = data
  }

  private getShopFocusTotal(pageSize?: number, currentPage?: number) {
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
      getShopFocusTotal(params).then((res: any) => {
        resolve(res);
      })
    })
  }

  private showEChart(item: any) {
    let time;
    if (this.formInline.time) {
      time = this.formInline.time;
    } else {
      time = [moment().subtract(30, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];
    }
    const params = {
      shopName: item.shopName,
      startTime: time[0],
      endTime: time[1]
    }
    getShopFocusByTime_Shop(params).then((res: any) => {
      this.chartData.rows = res.data || [];
      this.showShopName = item.shopName;
      this.show = true;
    })
  }

  private async handleDownload() {
    this.downloadLoading = true;
    const res: any = await this.getShopFocusTotal(100000, 1);
    const data = res.data.list || [];
    if (data.length > 0) {
      exportCsv({
        quoted: true,
        separator: ',',
        filename: '门店关注统计',
        columns: [
          {
            title: '门店',
            key: 'shopName'
          },
          {
            title: '已关注',
            key: 'allAdd'
          },
          {
            title: '取消关注',
            key: 'allReduce'
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
.total {
  .table-page {
    text-align: right;
    margin-top: 15px;
  }
  .member-info {
    border-radius: 5px;
    border: solid 1px #e4e7ed;
    display: flex;
    position: relative;
    padding-top: 30px;
    .member-title {
      position: absolute;
      font-size: 16px;
      color: #606266;
      left: 20px;
      top: 12px;
    }
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
      .sub-name {
        font-size: 14px;
        color: #606266;
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
      .sub-name {
        font-size: 14px;
        color: #606266;
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
}
</style>


