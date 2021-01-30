<template>
  <article class="member-activity">
    <div class="member-info">
      <div class="info-left">
        <p>微会员日活跃</p>
        <p>{{dayNum}}</p>
      </div>
      <div class="info-body">
        <p>微会员周活跃</p>
        <p>{{weekNum}}</p>
      </div>
      <div class="info-body">
        <p>微会员月活跃</p>
        <p>{{monthNum}}</p>
      </div>
      <div class="info-right">
        <el-tooltip placement="top">
          <div slot="content">活跃的定义是打开微会员首页，及微会员的任何公众号应用页面</div>
          <i class="el-icon-question"></i>
        </el-tooltip>
      </div>
    </div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="会员卡号：">
        <el-input v-model="formInline.memberCard" placeholder="会员卡号"></el-input>
        <!-- <el-select v-model="formInline.shopName" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="item in shopList"
            :key="item.shopId"
            :label="item.shopName"
            :value="item.shopName">
          </el-option>
        </el-select> -->
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
        prop="member_card"
        label="会员卡号"
        align="center">
      </el-table-column>
      <el-table-column
        prop="today"
        label="日活跃"
        align="center">
      </el-table-column>
      <el-table-column
        prop="week"
        label="周活跃"
        align="center">
      </el-table-column>
      <el-table-column
        prop="month"
        label="月活跃"
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
import { getTimeActivity, getSelectShopList, getMemberActivity } from '@/api/super-crm/wx-data';
import moment from 'moment';
import exportCsv from '@/utils/exportCsv';

@Component({
})
export default class MemberActivity extends Vue {
  private dayNum: number = 0;
  private weekNum: number = 0;
  private monthNum: number = 0;
  private shopList = [];

  private formInline = {
    memberCard: '',
    time: []
  };
  private tableData = [];
  private pageSize: number = 10;
  private currentPage: number = 1;
  private tableTotal: number = 0;

  private downloadLoading: boolean = false;

  private mounted() {
    (this.formInline.time as any) = [moment().subtract(30, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];
    getTimeActivity({startTime: moment().format('YYYY-MM-DD'), endTime: moment().format('YYYY-MM-DD')}).then((res: any) => {
      this.dayNum = res.data.total || 0;
    })
    getTimeActivity({startTime: moment().subtract(6, 'days').format('YYYY-MM-DD'), endTime: moment().format('YYYY-MM-DD')}).then((res: any) => {
      this.weekNum = res.data.total || 0;
    })
    getTimeActivity({startTime: moment().subtract(30, 'days').format('YYYY-MM-DD'), endTime: moment().format('YYYY-MM-DD')}).then((res: any) => {
      this.monthNum = res.data.total || 0;
    })
    // getSelectShopList({showStatus: '1'}).then((res: any) => {
    //   this.shopList = res.data.list || [];
    // })
    this.init();
  }

  private async init() {
    const res: any = await this.getMemberActivity();
    console.log(res)
    this.tableData = res.data.list || [];
    this.tableTotal = res.data.total || 0;
  }

  private getMemberActivity(pageSize?: number, currentPage?: number) {
    const params = {
      pageSize: pageSize || this.pageSize,
      pageNum: currentPage || this.currentPage,
      memberCard: this.formInline.memberCard,
      startTime: this.formInline.time ? this.formInline.time[0] : '',
      endTime: this.formInline.time ? this.formInline.time[1] : ''
    };
    return new Promise((resolve: any) => {
      getMemberActivity(params).then((res: any) => {
        resolve(res);
      })
    })
  }

  private async handleDownload() {
    this.downloadLoading = true;
    const res: any = await this.getMemberActivity(100000, 1);
    const data = res.data.list || [];
    if (data.length > 0) {
      exportCsv({
        quoted: true,
        separator: ',',
        filename: '会员活跃度统计',
        columns: [
          {
            title: '会员卡号',
            key: 'member_card'
          },
          {
            title: '日活跃',
            key: 'today'
          },
          {
            title: '周活跃',
            key: 'week'
          },
          {
            title: '月活跃',
            key: 'month'
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
.member-activity {
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
      width: 50px;
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


