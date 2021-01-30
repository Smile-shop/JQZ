<template>
  <article class="member-register">
    <div class="member-info">
      <div class="info-left">
        <p style="padding-bottom: 0">微会员总数</p>
        <span class="sub-name">（截止到当前）</span>
        <p>{{memberInfo.memberCountAll}}</p>
      </div>
      <div class="info-left">
        <p>昨日新增微会员</p>
        <p>{{memberInfo.memberCountBeforeDay}}</p>
      </div>
      <div class="info-left">
        <p>今日新增微会员</p>
        <p>{{memberInfo.memberCountDay}}</p>
      </div>
      <!-- <div class="info-body">
        <p>会员注册总数</p>
        <p>{{memberInfo.memberCountAll}}</p>
      </div> -->
      <!-- <div class="info-right">注册总数数据统计自：{{memberInfo.memberTimeStart}}</div> -->
    </div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="门店：">
        <el-select v-model="formInline.shopName" placeholder="门店">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in shopList" :key="item.shopId" :label="item.shopName" :value="item.shopName"></el-option>
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
        <el-button type="primary" @click="getMemberGroupShop">查询</el-button>
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
        prop="memberCountDay"
        label="微会员注册数量"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="address"
        label="趋势"
        align="center">
        <template slot-scope="scope">
          <i style="font-size:24px;cursor:pointer" class="iconfont icon-qushi" @click="showEChart(scope.row)"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="明细"
        align="center">
        <template slot-scope="scope">
          <el-button size="small" @click="getDetail(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="table-page"
      background
      layout="total, prev, pager, next, sizes, jumper"
      :page-sizes="[10, 20, 50, 100, 200, 500]"
      :page-size.sync="pageSize"
      @size-change="getMemberGroupShop"
      @current-change="getMemberGroupShop"
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
import { getMemberRegisterCount, getMemberGroupShop, queryMemberGroupShopWithOffLine, getSelectShopList, getMemberGroupByTime_Shop, getMemberGroupShop1 } from '@/api/super-crm/wx-data';
import PoupBox from '@/components/PoupBox.vue';
import moment from 'moment';
import exportCsv from '@/utils/exportCsv';

@Component({
  components: {
    PoupBox
  }
})
export default class MemberRegisterItemHome extends Vue {
  private show: boolean = false;
  private showShopName: string = '';
  private shopList = [];
  private formInline = {
    shopName: '',
    time: ''
  };
  private memberInfo = {
    memberCountDay: '',
    memberCountAll: '',
    memberTimeStart: ''
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
      timeDay: '时间',
      memberCountDay: '注册数量'
    }
  }
  private chartData = {
    columns: ['timeDay', 'memberCountDay'],
    rows: []
  }

  private mounted() {
    getSelectShopList({showStatus: '1'}).then((res: any) => {
      this.shopList = res.data.list || [];
    })
    this.getMemberRegisterCount();
    this.getMemberGroupShop();
  }

  private getMemberGroupShop() {
    const params = {
      page: {
        pageSize: this.pageSize,
        pageNum: this.currentPage
      },
      params: {
        shopName: this.formInline.shopName,
        startTime: this.formInline.time ? this.formInline.time[0] : '',
        endTime: this.formInline.time ? this.formInline.time[1] : ''
      }
    }
    queryMemberGroupShopWithOffLine(params).then((res: any) => {
      this.tableData = res.data.list || [];
      this.tableTotal = res.data.total || 0;
    })
  }

  private getMemberRegisterCount() {
    getMemberRegisterCount().then((res: any) => {
      this.memberInfo = res.data;
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
    getMemberGroupByTime_Shop(params).then((res: any) => {
      this.chartData.rows = res.data || [];
      this.show = true;
      this.showShopName = item.shopName;
    })
  }

  private getDetail(item: any) {
    this.$router.push({
      path: '/super-crm/wx-member/data-statistics/member-register/detail',
      query: {
        shop: item.shopName,
        startTime: this.formInline.time ? this.formInline.time[0] : '',
        endTime: this.formInline.time ? this.formInline.time[1] : ''
      }
    })
  }

  private handleDownload() {
    this.downloadLoading = true;
    const params = {
      page: {
        pageSize: 100000,
        pageNum: 1
      },
      params: {
        shopName: this.formInline.shopName,
        startTime: this.formInline.time ? this.formInline.time[0] : '',
        endTime: this.formInline.time ? this.formInline.time[1] : ''
      }
    }
    queryMemberGroupShopWithOffLine(params).then((res: any) => {
      const data = res.data.list || [];
      if (data.length > 0) {
        exportCsv({
          quoted: true,
          separator: ',',
          filename: '会员注册统计',
          columns: [
            {
              title: '门店',
              key: 'shopName'
            },
            {
              title: '注册数量',
              key: 'memberCountDay'
            }
          ],
          data
        });
      }
      this.downloadLoading = false;
    })
  }
}
</script>

<style lang="scss" scoped>
.member-register {
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
    margin-bottom: 22px;
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
    }
    .info-right {
      width: 280px;
      text-align: right;
      font-size: 12px;
      color: #999999;
      padding: 72px 12px 12px 0;
    }
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
}
</style>


